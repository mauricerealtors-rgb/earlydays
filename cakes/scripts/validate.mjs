// Data integrity check for the cake directory.
//
// Catches what TypeScript cannot: an area slug that does not exist, a
// deliversTo pointing nowhere, a duplicate slug, a published price with no
// source, a vendor with no sourceUrls, an own-work photo with no attribution.
// Run with `npm run validate` from the cakes/ directory.
import { readFileSync } from "node:fs";

// Resolved against this file so the script works from any cwd.
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

// Pull slugs out of the source rather than importing TS.
const areasSrc = read("data/areas.ts");
const areaBlock = areasSrc.slice(
  areasSrc.indexOf("export const AREAS"),
  areasSrc.indexOf("export interface Region"),
);
const areaSlugs = new Set([...areaBlock.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));
const regionBlock = areasSrc.slice(areasSrc.indexOf("export const REGIONS"));
const regionSlugs = new Set([...regionBlock.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));

const catSrc = read("data/categories.ts");
const occasionValues = new Set(
  [...catSrc.matchAll(/^\s{4}occasion: "([^"]+)"/gm)].map((m) => m[1]),
);
const kindValues = new Set([...catSrc.matchAll(/^\s{4}kind: "([^"]+)"/gm)].map((m) => m[1]));

const typesSrc = read("lib/types.ts");
const unionOf = (name) => {
  const start = typesSrc.indexOf(`export type ${name} =`);
  const end = typesSrc.indexOf(";", start);
  return new Set(
    [...typesSrc.slice(start, end).matchAll(/"([^"]+)"/g)].map((m) => m[1]),
  );
};
const occasionType = unionOf("Occasion");
const kindType = unionOf("CakeKind");
const styleType = unionOf("Style");
const flavourType = unionOf("Flavour");
const dietaryType = unionOf("Dietary");

const vendorSrc =
  read("data/vendors.ts") + "\n" + read("data/vendors-accra.ts");

const errors = [];
const warnings = [];

// Split into vendor objects on the id field.
const chunks = vendorSrc.split(/\n  \{\n    id: "/).slice(1);
const ids = new Map();
const slugs = new Map();

for (const raw of chunks) {
  const id = raw.slice(0, raw.indexOf('"'));
  const slug = (raw.match(/slug: "([^"]+)"/) || [])[1];
  const name = (raw.match(/name: "((?:[^"\\]|\\.)*)"/) || [])[1];
  if (!slug) {
    errors.push(`${id}: no slug`);
    continue;
  }
  if (ids.has(id)) errors.push(`duplicate id ${id} (${name} / ${ids.get(id)})`);
  ids.set(id, name);
  if (slugs.has(slug)) errors.push(`duplicate slug ${slug} (${name} / ${slugs.get(slug)})`);
  slugs.set(slug, name);

  const area = (raw.match(/\n    area: "([^"]+)"/) || [])[1];
  if (!area) errors.push(`${slug}: no area`);
  else if (!areaSlugs.has(area)) errors.push(`${slug}: unknown area "${area}"`);

  const delivers = (raw.match(/deliversTo: \[([^\]]*)\]/) || [])[1];
  if (delivers) {
    for (const m of delivers.matchAll(/"([^"]+)"/g)) {
      if (!areaSlugs.has(m[1])) errors.push(`${slug}: deliversTo unknown area "${m[1]}"`);
    }
  }

  const checkUnion = (field, allowed) => {
    const block = (raw.match(new RegExp(`\\n    ${field}: \\[([^\\]]*)\\]`)) || [])[1];
    if (block === undefined) return;
    for (const m of block.matchAll(/"([^"]+)"/g)) {
      if (!allowed.has(m[1])) errors.push(`${slug}: ${field} has invalid "${m[1]}"`);
    }
  };
  checkUnion("occasions", occasionType);
  checkUnion("kinds", kindType);
  checkUnion("styles", styleType);
  checkUnion("flavours", flavourType);
  checkUnion("dietary", dietaryType);

  // A published price must say where it came from and when we read it.
  if (/priceList: \[/.test(raw)) {
    if (!/priceListSourceUrl:/.test(raw)) errors.push(`${slug}: priceList without priceListSourceUrl`);
    if (!/priceListSeenAt:/.test(raw)) errors.push(`${slug}: priceList without priceListSeenAt`);
  }
  // Every vendor must be traceable.
  if (!/sourceUrls: \[/.test(raw)) errors.push(`${slug}: no sourceUrls`);
  // ownWork images must carry attribution.
  for (const img of raw.matchAll(/\{ url: "[^"]+",[^}]*\}/g)) {
    if (/ownWork: true/.test(img[0]) && !/credit:/.test(img[0])) {
      errors.push(`${slug}: ownWork image without credit`);
    }
  }
  // Contactability — not an error, but worth knowing.
  if (!/\n    phone:/.test(raw) && !/\n    whatsapp:/.test(raw) &&
      !/\n    instagram:/.test(raw) && !/\n    facebook:/.test(raw) &&
      !/\n    email:/.test(raw)) {
    warnings.push(`${slug}: no contact channel at all`);
  }
}

// Categories must map onto real union members.
for (const o of occasionValues) if (!occasionType.has(o)) errors.push(`category occasion "${o}" not in Occasion`);
for (const k of kindValues) if (!kindType.has(k)) errors.push(`category kind "${k}" not in CakeKind`);

// Every area must sit in a declared region.
for (const m of areaBlock.matchAll(/slug: "([^"]+)",\n    name: "[^"]+",\n    region: "([^"]+)"/g)) {
  if (!regionSlugs.has(m[2])) errors.push(`area ${m[1]}: unknown region "${m[2]}"`);
}

// Which areas and occasions actually have stock.
const used = new Set([...vendorSrc.matchAll(/\n    area: "([^"]+)"/g)].map((m) => m[1]));
const empty = [...areaSlugs].filter((a) => !used.has(a));

console.log(`vendors:   ${slugs.size}`);
console.log(`areas:     ${areaSlugs.size} declared, ${used.size} with a baker based there`);
console.log(`occasions: ${occasionValues.size}   kinds: ${kindValues.size}`);
console.log(`priced:    ${(vendorSrc.match(/priceList: \[/g) || []).length}`);
console.log(`photos:    ${(vendorSrc.match(/ownWork: true/g) || []).length} own-work images`);
if (empty.length) console.log(`\nareas with no baker based there (no page): ${empty.join(", ")}`);
if (warnings.length) console.log(`\nwarnings:\n  ${warnings.join("\n  ")}`);
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("\nno errors");

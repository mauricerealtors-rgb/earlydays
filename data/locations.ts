import type { Location } from "@/lib/types";

// Neutral, factual blurbs. Facts kept generic to avoid fabrication.
export const LOCATIONS: Location[] = [
  {
    slug: "east-legon",
    name: "East Legon",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "A large residential area in the east of Accra with a wide range of early years and primary options.",
  },
  {
    slug: "east-legon-hills",
    name: "East Legon Hills",
    region: "accra",
    regionName: "Greater Accra",
    parent: "east-legon",
    blurb:
      "A newer residential area extending east of East Legon, with a growing base of early years and international schools.",
  },
  {
    slug: "adjiringanor",
    name: "Adjiringanor",
    region: "accra",
    regionName: "Greater Accra",
    parent: "east-legon",
    blurb:
      "A residential neighbourhood adjacent to East Legon, home to a number of newer early years schools.",
  },
  {
    slug: "spintex",
    name: "Spintex",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "A busy stretch of Accra along the Spintex Road with schools serving nearby residential enclaves.",
  },
  {
    slug: "airport",
    name: "Airport Residential",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "Established residential area around Airport Residential, with international and local schools nearby.",
  },
  {
    slug: "east-airport",
    name: "East Airport",
    region: "accra",
    regionName: "Greater Accra",
    parent: "airport",
    blurb:
      "Neighbourhood off Spintex Road near the Airport, with a mix of early years and primary schools.",
  },
  {
    slug: "cantonments",
    name: "Cantonments",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central Accra neighbourhood with a mix of long-standing and newer schools.",
  },
  {
    slug: "labone",
    name: "Labone",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential area in central Accra with early years options within short driving distance.",
  },
  {
    slug: "osu",
    name: "Osu",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Dense central Accra neighbourhood with a range of daycare and preschool options.",
  },
  {
    slug: "dzorwulu",
    name: "Dzorwulu",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central Accra residential area with schools serving nearby neighbourhoods.",
  },
  {
    slug: "madina",
    name: "Madina",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Northern Accra suburb with a growing number of early years and primary schools.",
  },
  {
    slug: "adenta",
    name: "Adenta",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Fast-growing residential area on the northeast edge of Accra.",
  },
  {
    slug: "teshie",
    name: "Teshie",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Coastal community in eastern Accra with a range of local schools.",
  },
  {
    slug: "tema",
    name: "Tema",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Port city adjacent to Accra with an established base of schools and learning centres.",
  },
  {
    slug: "dansoman",
    name: "Dansoman",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Large residential district in western Accra.",
  },
  {
    slug: "weija",
    name: "Weija",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Growing residential area on the western edge of Accra.",
  },
  {
    slug: "taifa",
    name: "Taifa",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "Residential area in the Ga East area of north-west Accra, near Atomic and Dome-Kwabenya.",
  },
  {
    slug: "sakumono",
    name: "Sakumono",
    region: "accra",
    regionName: "Greater Accra",
    parent: "tema",
    blurb:
      "Residential area between Tema and Accra, along the coast.",
  },
  {
    slug: "accra-central",
    name: "Central Accra",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "Central Accra — Ridge, Cantonments and the wider inner-city area.",
  },
  {
    slug: "kumasi",
    name: "Kumasi",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Ghana's second largest city and the commercial hub of the Ashanti Region.",
  },
  {
    slug: "takoradi",
    name: "Takoradi",
    region: "western",
    regionName: "Western",
    blurb: "Coastal city and capital of the Western Region.",
  },
];

export const REGIONS = [
  { slug: "accra", name: "Greater Accra" },
  { slug: "ashanti", name: "Ashanti" },
  { slug: "western", name: "Western" },
];

export function findLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function findRegion(slug: string) {
  return REGIONS.find((r) => r.slug === slug);
}

export function locationsInRegion(regionSlug: string) {
  return LOCATIONS.filter((l) => l.region === regionSlug);
}

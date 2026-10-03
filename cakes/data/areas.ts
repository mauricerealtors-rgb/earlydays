import type { Area } from "@/lib/types";

/**
 * Browse geography.
 *
 * For cakes, an area means two different things: where the baker works from,
 * and where they will deliver. Those rarely match, so a vendor carries both
 * `area` (one) and `deliversTo` (many), and an area page lists bakers who are
 * based there *or* deliver there. That is the right behaviour for a buyer, who
 * cares about getting the cake, not about where the oven is.
 *
 * Starter set, weighted to where cake makers actually cluster. Extended as the
 * directory fills; an area with nothing in it gets no page.
 */
export const AREAS: Area[] = [
  {
    slug: "east-legon",
    name: "East Legon",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Accra's densest cluster of home bakers and studio cake makers.",
  },
  {
    slug: "spintex",
    name: "Spintex",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "A long commercial corridor with many home-based bakers and easy delivery along the road.",
  },
  {
    slug: "osu",
    name: "Osu",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central, walkable, and well served by pastry shops as well as cake studios.",
  },
  {
    slug: "labone",
    name: "Labone",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential and close to the city centre, with several established bakers.",
  },
  {
    slug: "cantonments",
    name: "Cantonments",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Quiet and central, with a handful of higher-end cake studios.",
  },
  {
    slug: "airport-residential",
    name: "Airport Residential",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central and convenient for collection, with premium bakers and hotel pastry kitchens.",
  },
  {
    slug: "dzorwulu",
    name: "Dzorwulu",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central-north Accra, handy for deliveries across the Ring Road.",
  },
  {
    slug: "achimota",
    name: "Achimota",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "A busy northern hub with plenty of home bakers serving the surrounding suburbs.",
  },
  {
    slug: "lapaz",
    name: "Lapaz",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Dense and well connected, with affordable bakers along the main road.",
  },
  {
    slug: "dansoman",
    name: "Dansoman",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "A large western residential area with many long-established home bakeries.",
  },
  {
    slug: "madina",
    name: "Madina",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Busy and densely populated, strong on everyday and birthday cakes.",
  },
  {
    slug: "adenta",
    name: "Adenta",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Fast-growing north-east suburb with a steady supply of home bakers.",
  },
  {
    slug: "haatso",
    name: "Haatso",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Near the university belt, with bakers used to graduation season.",
  },
  {
    slug: "tema",
    name: "Tema",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "A city of its own east of Accra, with bakers who deliver within Tema rather than across it.",
  },
  {
    slug: "teshie-nungua",
    name: "Teshie-Nungua",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Coastal eastern Accra, between the city and Tema.",
  },
  {
    slug: "kasoa",
    name: "Kasoa",
    region: "central",
    regionName: "Central Region",
    blurb: "On the western edge of Accra, with bakers serving both sides of the border.",
  },
  {
    slug: "accra-central",
    name: "Accra Central",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "The commercial core, better for collection than delivery.",
  },
  {
    slug: "tesano",
    name: "Tesano",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central-north residential area with good road access.",
  },
  {
    slug: "ahodwo",
    name: "Ahodwo",
    region: "ashanti",
    regionName: "Ashanti Region",
    blurb: "Kumasi's upmarket south-west, home to the city's best-known cake studios.",
  },
  {
    slug: "nhyiaeso",
    name: "Nhyiaeso",
    region: "ashanti",
    regionName: "Ashanti Region",
    blurb: "Central Kumasi, close to Ahodwo and well placed for city-wide delivery.",
  },
  {
    slug: "asokwa",
    name: "Asokwa",
    region: "ashanti",
    regionName: "Ashanti Region",
    blurb: "Commercial Kumasi, with bakeries alongside the retail strip.",
  },
  {
    slug: "kumasi-central",
    name: "Kumasi Central",
    region: "ashanti",
    regionName: "Ashanti Region",
    blurb: "Adum and the city core, busiest for walk-in and collection orders.",
  },
  {
    slug: "takoradi",
    name: "Takoradi",
    region: "western",
    regionName: "Western Region",
    blurb: "The Western Region's main city, with bakers serving the twin-city area.",
  },
  {
    slug: "cape-coast",
    name: "Cape Coast",
    region: "central",
    regionName: "Central Region",
    blurb: "A university and tourism city, busy with graduation cakes.",
  },
  {
    slug: "tamale",
    name: "Tamale",
    region: "northern",
    regionName: "Northern Region",
    blurb: "The north's main city, with a small but growing set of cake makers.",
  },
  {
    slug: "ho",
    name: "Ho",
    region: "volta",
    regionName: "Volta Region",
    blurb: "The Volta regional capital, served mostly by home bakers.",
  },
  {
    slug: "koforidua",
    name: "Koforidua",
    region: "eastern",
    regionName: "Eastern Region",
    blurb: "The Eastern regional capital, within delivery reach of parts of Accra.",
  },
  {
    slug: "sunyani",
    name: "Sunyani",
    region: "bono",
    regionName: "Bono Region",
    blurb: "A regional capital with a handful of established bakers.",
  },
];

export interface Region {
  slug: string;
  name: string;
  blurb: string;
}

export const REGIONS: Region[] = [
  { slug: "accra", name: "Greater Accra", blurb: "The largest and most competitive cake market in Ghana." },
  { slug: "ashanti", name: "Ashanti Region", blurb: "Kumasi and its suburbs, the country's second cake market." },
  { slug: "western", name: "Western Region", blurb: "Takoradi, Sekondi and the surrounding towns." },
  { slug: "central", name: "Central Region", blurb: "Cape Coast, Kasoa and the coastal towns west of Accra." },
  { slug: "eastern", name: "Eastern Region", blurb: "Koforidua and the towns along the Accra road." },
  { slug: "northern", name: "Northern Region", blurb: "Tamale and the surrounding districts." },
  { slug: "volta", name: "Volta Region", blurb: "Ho and the towns along the lake." },
  { slug: "bono", name: "Bono Region", blurb: "Sunyani and the surrounding towns." },
];

export function findArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function findRegion(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function areasInRegion(region: string): Area[] {
  return AREAS.filter((a) => a.region === region);
}

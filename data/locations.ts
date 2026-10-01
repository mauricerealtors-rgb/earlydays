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
    intro:
      "East Legon is one of the most established residential areas in Accra for families, and one of the deepest concentrations of early years schools in the country. Options here span from small home-based creches through internationally-accredited primaries following EYFS, Cambridge and IB pathways. Traffic on Boundary Road and Lagos Avenue is the main practical consideration: most parents look for a school within a 10–15 minute pick-up window, which is why we let you filter by inner East Legon vs the Hills and Adjiringanor extensions.",
  },
  {
    slug: "east-legon-hills",
    name: "East Legon Hills",
    region: "accra",
    regionName: "Greater Accra",
    parent: "east-legon",
    blurb:
      "A newer residential area extending east of East Legon, with a growing base of early years and international schools.",
    intro:
      "East Legon Hills has grown quickly from a fringe development into one of Accra's most active new-build residential belts. Most schools here are under ten years old, purpose-built with outdoor play space, and cater to the young professional families moving out from inner Accra. The trade-off is distance: expect a longer commute if you work in Airport City or Ridge. Curriculum is a mix. Montessori and EYFS dominate the early years. Newer primaries lean towards Cambridge or the Ghana Education Service syllabus.",
  },
  {
    slug: "adjiringanor",
    name: "Adjiringanor",
    region: "accra",
    regionName: "Greater Accra",
    parent: "east-legon",
    blurb:
      "A residential neighbourhood adjacent to East Legon, home to a number of newer early years schools.",
    intro:
      "Adjiringanor sits directly behind East Legon and has become a quieter alternative for families who want early years schooling without the Boundary Road congestion. Most schools in Adjiringanor are small and family-run, and you'll often meet the head at the gate. Age ranges typically start from 3 months at the creche end and continue through nursery and kindergarten, with a smaller number of primaries following EYFS or the UK National Curriculum. If you don't find what you need here, East Legon and East Legon Hills are both within a 10-minute drive.",
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
    intro:
      "East Airport is one of the busiest school catchments in Accra. Sitting between Airport Residential, Spintex and Cantonments, it's within reach of a large working-parent population. Schools here trend older and more established than the East Legon Hills belt, and admissions windows often close earlier in the year. Expect a broader mix of pathways (Ghana Education Service, Montessori, Cambridge) and a wider fee range than the newer developments. Meals and school transport are more commonly offered here than in outlying areas.",
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
    intro:
      "Adenta has grown into one of the fastest-expanding residential belts on the northeast edge of Accra, with a corresponding explosion of new early years schools along the Adenta–Aburi and Ashaley Botwe roads. Fees here are generally lower than in East Legon proper, and most schools cover the full early years band from creche through kindergarten. Because catchment is growing faster than school capacity in some pockets, parents often start looking a full year before they need a place.",
  },
  {
    slug: "teshie",
    name: "Teshie",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Coastal community in eastern Accra with a range of local schools.",
    intro:
      "Teshie is one of the older coastal communities in eastern Accra with a long-established network of local and mission-run schools. Fees here tend to be more accessible than in the Airport and East Legon belts, and the Ghana Education Service curriculum dominates. Newer private early years centres have been opening along the Teshie-Nungua Estates road, offering EYFS-style play-based programmes for families who want a shorter commute than Cantonments or Airport Residential.",
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
    intro:
      "Taifa is a large, mixed-income residential area in north-west Accra, close to Atomic Junction and Dome-Kwabenya. Most schools are locally-run and follow the Ghana Education Service syllabus, with fees noticeably lower than in Cantonments or East Legon. Early years provision has grown quickly here in the last decade as young families have priced out of central Accra, and small nursery schools operate on almost every side road off the main Ofankor–Nsawam route.",
  },
  {
    slug: "sakumono",
    name: "Sakumono",
    region: "accra",
    regionName: "Greater Accra",
    parent: "tema",
    blurb:
      "Residential area between Tema and Accra, along the coast.",
    intro:
      "Sakumono sits along the coast between Tema and Accra, catering to families working in Tema Port, the Motorway industrial belt, and Airport City. Schools here range from very affordable community-run creches to established international-track primaries. The Sakumono Estates catchment in particular has a good density of purpose-built early years centres and a rising number of Cambridge-track primaries. It's a viable option for families who want space and coast without moving fully into Tema.",
  },
  {
    slug: "accra-central",
    name: "Central Accra",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "Central Accra. Ridge, Cantonments and the wider inner-city area.",
    intro:
      "Central Accra covers Ridge, Cantonments, Osu and the surrounding inner-city grid. historically the deepest catchment for long-established British-track and international schools in Ghana. Fees at the top of this market are the highest in the country, but there are also excellent mid-market Montessori and EYFS options that have been operating for decades. Traffic makes drop-off tight. most parents look for a school within a 15-minute radius of home or work.",
  },
  {
    slug: "abelemkpe",
    name: "Abelemkpe",
    region: "accra",
    regionName: "Greater Accra",
    blurb:
      "Quiet residential area west of central Accra, home to Lincoln Community School and other long-established institutions.",
  },
  {
    slug: "mataheko",
    name: "Matahekó",
    region: "accra",
    regionName: "Greater Accra",
    parent: "dansoman",
    blurb:
      "Residential neighbourhood off the Dansoman-Kaneshie road with a mix of preschools and primaries.",
  },
  {
    slug: "east-cantonments",
    name: "East Cantonments",
    region: "accra",
    regionName: "Greater Accra",
    parent: "cantonments",
    blurb:
      "Central Accra residential pocket adjacent to Cantonments and Labone, with a mix of long-standing and newer schools.",
  },
  {
    slug: "westlands",
    name: "Westlands",
    region: "accra",
    regionName: "Greater Accra",
    parent: "east-legon",
    blurb:
      "Newer residential development east of East Legon with early years schools purpose-built for young families.",
  },
  {
    slug: "anaji",
    name: "Anaji",
    region: "western",
    regionName: "Western",
    parent: "takoradi",
    blurb:
      "Residential neighbourhood in Takoradi, Western Region, with a growing base of early years centres.",
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
  {
    slug: "kasoa",
    name: "Kasoa",
    region: "central",
    regionName: "Central",
    blurb:
      "Fast-growing town on the western edge of the Accra–Cape Coast road, straddling the Greater Accra and Central Region border.",
    intro:
      "Kasoa has grown rapidly over the last decade from a market town into a large residential belt for families priced out of Weija, Kaneshie and Dansoman. Early years and primary schools have multiplied along the Kingston, Ngleshie and Millennium City stretches. Fees are generally lower than in central Accra, and most schools follow the Ghana Education Service curriculum with a growing Montessori and Christian ethos overlay.",
  },
  {
    slug: "gbawe",
    name: "Gbawe",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential district in Ga South, west of Accra, between McCarthy Hill and Weija.",
    intro:
      "Gbawe sits in Ga South between McCarthy Hill and Weija, and has grown quickly as families have moved west along the Mallam–Kasoa road. It is one of the denser clusters of private early-years provision on this side of Accra, with a strong showing of Montessori settings alongside schools running Cambridge and Ghanaian programmes. Most schools here draw from Gbawe itself, New Gbawe and the surrounding estates, so the commute is usually short — worth checking against the Mallam junction traffic at your own travelling times.",
  },
  {
    slug: "mccarthy-hill",
    name: "McCarthy Hill",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Hillside residential area off the Mallam–Kasoa road in Ga South.",
    intro:
      "McCarthy Hill is a hillside residential area off the Mallam–Kasoa road, close enough to Weija and Gbawe that families often look across all three. Schools here range from long-established basic schools to Montessori settings, and several draw pupils from Tetegu and Mallam as well. The area sits just south of Awoshie, so it is worth being precise about which side of the hill a school is on when you plan the journey.",
  },
  {
    slug: "mallam",
    name: "Mallam",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Junction town on the Accra–Kasoa road, at the western edge of the city.",
    intro:
      "Mallam is the junction town where the Accra–Kasoa road meets the western edge of the city, and it functions as the gateway to Weija, Gbawe and Bortianor. Schools in and around the junction tend to serve families spread along that corridor rather than one neighbourhood. Traffic through Mallam is the single biggest practical factor for parents here, so test the run at your real drop-off and pick-up times before committing.",
  },
  {
    slug: "kokrobite",
    name: "Kokrobite",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Coastal community west of Accra, past Bortianor on the Ga South shoreline.",
    intro:
      "Kokrobite is a coastal community west of Accra, past Bortianor along the Ga South shoreline. Provision here is thin compared with the city, and the schools that do operate often serve the surrounding villages as much as Kokrobite itself. Families in the area sometimes look inland towards Weija and Gbawe for a wider choice, so it is worth weighing the journey against what is available locally.",
  },
  {
    slug: "pokuase",
    name: "Pokuase",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Fast-growing town on the Accra–Nsawam road in Ga North, near the ACP interchange.",
    intro:
      "Pokuase has grown rapidly since the ACP interchange opened, and school provision has followed the new estates along the Accra–Nsawam road. It is one of the few areas on this side of Accra where you will find a school publishing its fees openly. Families here are often weighing Pokuase against Ofankor and Amasaman, so check which campus a school means when a name appears in more than one place.",
  },
  {
    slug: "kwashieman",
    name: "Kwashieman",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Dense residential suburb on the Lapaz–Odorkor stretch of north-west Accra.",
    intro:
      "Kwashieman sits on the busy stretch between Lapaz and Odorkor in north-west Accra, and is densely residential. Schools here are typically long-established basic schools serving families within walking or short trotro distance, and several have been operating for thirty years or more. The Lapaz–Kwashieman motorway is the main artery, so position relative to it matters more than raw distance.",
  },
  {
    slug: "ablekuma",
    name: "Ablekuma",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Large residential area in Ga Central, west of Lapaz.",
    intro:
      "Ablekuma is a large residential area in Ga Central, west of Lapaz, taking in Anyaa, Nsunfa and Official Town. Provision ranges from small neighbourhood basic schools to Montessori settings running from creche through junior high. Because the area is broad and the sub-names overlap, it is worth confirming the exact landmark a school gives before setting out to visit.",
  },
  {
    slug: "sowutuom",
    name: "Sowutuom",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential suburb in Ga Central, north-west of Accra near Ofankor.",
    intro:
      "Sowutuom is a residential suburb in Ga Central, north-west of Accra towards Ofankor. Schools here serve families across Sowutuom, Tabora and the surrounding neighbourhoods, with a mix of Montessori and Ghanaian-curriculum provision. The area is well connected to the Lapaz and Achimota corridors, which widens the realistic choice if you are willing to travel.",
  },
  {
    slug: "santa-maria",
    name: "Santa Maria",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential neighbourhood on the Odorkor–Kwashiebu stretch of west Accra.",
    intro:
      "Santa Maria is a residential neighbourhood on the Odorkor–Kwashiebu stretch of west Accra. Schools here tend to be long-standing basic schools drawing from Santa Maria, Kwashiebu and Odorkor, several with strong local reputations built over decades. It is a compact area, so most families are choosing between options within a few minutes of each other.",
  },
  {
    slug: "achimota",
    name: "Achimota",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Established residential and school district in north-west Accra, around Achimota Forest and the Mile 7 corridor.",
    intro:
      "Achimota is one of the most established school districts in Accra, and New Achimota in particular has an unusually dense cluster of private early-years settings — several on the same few streets around Kingsby Roundabout and 16th Street. Montessori is strongly represented here, alongside EYFS, Cambridge and bilingual French–English provision. The concentration means you can realistically visit three or four schools in a morning, which is rare elsewhere in the city.",
  },
  {
    slug: "abeka",
    name: "Abeka",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Busy residential suburb north-west of central Accra, bordering Lapaz and Tesano.",
    intro:
      "Abeka is a busy residential suburb north-west of central Accra, bordering Lapaz and Tesano. Schools here serve a wide catchment along the George Bush Highway and the Abeka–Lapaz stretch, with provision spanning Montessori, British and Islamic education. Note that \"Abeka\" also appears in the name of an American homeschool curriculum, so a school described as using \"Abeka\" is not necessarily located here.",
  },
  {
    slug: "tantra-hills",
    name: "Tantra Hills",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Hillside residential development in Ga West, north of Achimota.",
    intro:
      "Tantra Hills is a hillside residential development in Ga West, north of Achimota and reached through Taifa or Achimota Mile 7. It is newer than the surrounding areas and school provision has grown alongside the estates. Families here often consider Achimota and Taifa as well, so it is worth comparing across all three before deciding.",
  },
];

export const REGIONS = [
  { slug: "accra", name: "Greater Accra" },
  { slug: "ashanti", name: "Ashanti" },
  { slug: "western", name: "Western" },
  { slug: "central", name: "Central" },
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

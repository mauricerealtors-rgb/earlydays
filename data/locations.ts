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
  {
    slug: "kwabenya",
    name: "Kwabenya",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential suburb in Ga East, north of Achimota towards Atomic.",
    intro:
      "Kwabenya has expanded quickly along the Dome–Kwabenya road and the estates around it, and school provision has followed. It is one of the few areas in north Accra where a school publishes its fees openly. Families here often weigh Kwabenya against Dome, Taifa and Haatso, which are all within a short run outside peak hours.",
  },
  {
    slug: "ashongman",
    name: "Ashongman",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Hillside residential area in Ga East, above Dome and Taifa.",
    intro:
      "Ashongman and Ashongman Estate sit above Dome on the northern edge of Accra, and the estate in particular has a cluster of Montessori settings serving the families who have moved there. Provision runs from creche through junior high. The climb up from the Dome road is the practical consideration — check the journey at school-run times rather than at the weekend.",
  },
  {
    slug: "haatso",
    name: "Haatso",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential suburb between Legon and Atomic Junction in north Accra.",
    intro:
      "Haatso sits between Legon and Atomic Junction and serves a mix of university families and private-sector households. Provision is mostly small neighbourhood creches and preparatory schools rather than large campuses, several of them long established. The Haatso–Atomic road is the spine of the area, so where a school sits relative to it matters more than raw distance.",
  },
  {
    slug: "legon",
    name: "Legon",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "University district in north-east Accra, around the University of Ghana campus.",
    intro:
      "Legon is built around the University of Ghana, and its schools reflect that — including the university's own basic school, which has served staff families for decades. The area draws from East Legon, Haatso and Madina as well. Traffic around the campus gates at opening and closing time is the main thing to test before committing.",
  },
  {
    slug: "west-legon",
    name: "West Legon",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential area west of the University of Ghana, towards Westlands.",
    intro:
      "West Legon sits between the university and the Westlands area, and is largely residential with a handful of well-established private schools. Provision here tends toward the international end, with Cambridge programmes represented. Families typically also look at Legon, Haatso and East Legon, all within a few minutes outside peak hours.",
  },
  {
    slug: "agbogba",
    name: "Agbogba",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential neighbourhood in Ga East, between Ashongman and North Legon.",
    intro:
      "Agbogba lies between Ashongman and North Legon along the Agbogba–Ashongman road, and has grown with the estates around it. School provision is modest but includes settings running from creche through primary. Because Agbogba, Old Ashongman and North Legon adjoin and their names are used loosely, it is worth confirming exactly where a school sits before setting out.",
  },
  {
    slug: "oyarifa",
    name: "Oyarifa",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Town on the Adenta–Aburi road at the northern edge of Greater Accra.",
    intro:
      "Oyarifa sits where Accra gives way to the Aburi hills, and has grown steadily as families have moved out along the Adenta–Aburi road. It has fewer schools than the suburbs closer in, but includes one of the few in Greater Accra that publishes a full fee schedule. Most families here are choosing between Oyarifa and Adenta, so the run down the Aburi road is worth timing.",
  },
  {
    slug: "dome",
    name: "Dome",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Busy residential and market area in Ga East, on the Dome–Kwabenya road.",
    intro:
      "Dome is one of the denser parts of north Accra, built around its market and the Dome–Kwabenya road. Provision is mostly neighbourhood basic schools serving families within walking or short trotro distance. Dome, Taifa and Kwabenya run into each other here, so a school described as being in one is often on the boundary of another.",
  },
  {
    slug: "nhyiaeso",
    name: "Nhyiaeso",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Affluent residential district south-west of Kumasi city centre.",
    intro:
      "Nhyiaeso is one of Kumasi's established residential districts, running along the Victoria Opoku-Ware Road strip towards Danyame and Ridge. It has fewer schools than the denser suburbs but a markedly stronger showing of international and Cambridge provision, and the schools here tend to publish more about themselves than elsewhere in the city. Most families choosing here are also looking at Danyame and Ridge, which adjoin.",
  },
  {
    slug: "danyame",
    name: "Danyame",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Residential area adjoining Nhyiaeso and Ridge in south Kumasi.",
    intro:
      "Danyame sits between Nhyiaeso and Ridge in the older, leafier part of Kumasi. Provision here is limited in number but long established, including schools that have been running since the 1960s. Because Danyame, Ridge and Nhyiaeso run together and directories file schools under all three, it is worth checking the street rather than the suburb when planning a visit.",
  },
  {
    slug: "kwadaso",
    name: "Kwadaso",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Large residential district west of Kumasi centre, towards Sofoline.",
    intro:
      "Kwadaso and the Kwadaso Estate area form one of Kumasi's denser pockets of private schooling, including several that have been operating since the 1970s and 80s. The Sofoline–Patase road is the spine, and Kwadaso runs into Patasi, so schools often give an address that spans both. Montessori and Ghana Education Service provision are both well represented.",
  },
  {
    slug: "patasi",
    name: "Patasi",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Residential suburb west of Kumasi, adjoining Kwadaso.",
    intro:
      "Patasi adjoins Kwadaso on the western side of Kumasi and shares much of the same catchment. Provision runs from creche through junior high, with schools here more often following the Ghanaian curriculum than an international one. South Patasi and Patasi proper are used loosely in addresses, so confirm the landmark before travelling.",
  },
  {
    slug: "santasi",
    name: "Santasi",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Busy residential and junction area in south-west Kumasi.",
    intro:
      "Santasi is the densest cluster of private early-years provision found anywhere in Kumasi, spread along the Santasi roundabout and the Santasi–Kotwi and Bekwai road corridors. Schools here range from long-established complexes with over a thousand pupils to small Montessori settings. The spread means you can realistically shortlist several within a short drive of each other.",
  },
  {
    slug: "asokwa",
    name: "Asokwa",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Commercial and residential district south-east of Kumasi centre.",
    intro:
      "Asokwa sits between Kumasi centre and the Lake Road, taking in the residential area around Kumasi Mall and the Baba Yara stadium. It has real depth of provision, including schools founded in the 1930s and 60s, though few of them maintain a website. Asokwa runs into Ahinsan and Atonsu, so addresses often reference neighbouring areas.",
  },
  {
    slug: "atonsu",
    name: "Atonsu",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Residential area south of Kumasi, adjoining Ahinsan.",
    intro:
      "Atonsu and neighbouring Ahinsan form a large residential catchment south of Kumasi centre. Provision includes some of the biggest private school groups in the city by enrolment, alongside long-standing mission schools. Most schools here draw from Atonsu, Ahinsan and Chirapatre rather than across the city.",
  },
  {
    slug: "daban",
    name: "Daban",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Residential area south-west of Kumasi, on the Lake Road side.",
    intro:
      "Daban has grown quickly on the south-western side of Kumasi and punches above its size for schools, including one of the few in the city publishing a clear fees policy. Provision spans the Ghanaian curriculum and British pathways. Daban runs towards Ahodwo and the Lake Road, so journeys are usually judged against that corridor.",
  },
  {
    slug: "kronum",
    name: "Kronum",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Residential town on the northern edge of Kumasi, near Suame.",
    intro:
      "Kronum sits on the northern edge of Kumasi beyond Suame, and has grown with the estates around it. Provision is modest in number but includes settings taking children from a few months old. Families here often also look towards Suame and Bantama, which are closer to the city centre.",
  },
  {
    slug: "abuakwa",
    name: "Abuakwa",
    region: "ashanti",
    regionName: "Ashanti",
    blurb: "Town on the Sunyani road, north-west of Kumasi.",
    intro:
      "Abuakwa lies on the Sunyani road about fifteen kilometres from the centre of Kumasi, and functions as its own town rather than a city suburb. Online provision is thin, but it includes one of the better-documented schools on this side of the city. Families here are generally choosing locally rather than commuting into Kumasi.",
  },
  {
    slug: "lashibi",
    name: "Lashibi",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential area between Tema and Sakumono, around the Regimanuel estates.",
    intro:
      "Lashibi sits between Tema and Sakumono and is dominated by the Regimanuel Gray and Emefs estates, which is where most of its schools are. Provision leans international, with British and Cambridge programmes well represented. The Lashibi–Community 18 road is the main artery, so position relative to it is the practical question.",
  },
  {
    slug: "baatsona",
    name: "Baatsona",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential area on the Spintex road corridor, east of Accra.",
    intro:
      "Baatsona sits on the Spintex corridor between Accra and Tema, and shares a catchment with Spintex itself. Schools here serve families across the estates on both sides of the Spintex road. Traffic along that road at school-run times is the single biggest practical factor, so test the journey before committing.",
  },
  {
    slug: "nungua",
    name: "Nungua",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Coastal town east of Accra, running into Teshie and the Nungua estates.",
    intro:
      "Nungua and the Teshie-Nungua Estates form a long-established residential belt along the coast road east of Accra. Provision includes Montessori settings that have been running since the 1990s and early 2000s, several taking children from under two. Schools here draw from Teshie, Nungua and Sakumono, all within a short run outside peak hours.",
  },
  {
    slug: "ashaiman",
    name: "Ashaiman",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Dense township north of Tema.",
    intro:
      "Ashaiman is a large, densely populated township just north of Tema with a young population and a correspondingly high number of private basic schools. Provision is mostly neighbourhood nursery and primary schools serving families within walking distance. Online presence is thin here relative to the number of schools actually operating, so a phone call is usually the quickest way to check details.",
  },
  {
    slug: "kpone",
    name: "Kpone",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Town east of Tema, in the Kpone-Katamanso municipality.",
    intro:
      "Kpone sits east of Tema along the Akosombo road and has grown with the estates and industry around it. Provision is limited in number but includes schools running the full span from preschool to junior high. Most families here are choosing between Kpone and Tema's eastern communities.",
  },
  {
    slug: "michel-camp",
    name: "Michel Camp",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Military and residential area between Tema and Prampram.",
    intro:
      "Michel Camp sits east of Tema towards Prampram and takes in both the military establishment and the Gbetsile residential area that has grown beside it. School provision is modest and relatively new. Families here often look towards Tema and Kpone as well.",
  },
  {
    slug: "ridge",
    name: "Ridge",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Administrative and diplomatic district in central Accra.",
    intro:
      "Ridge is one of central Accra's oldest planned districts, home to embassies, hospitals and some of the city's longest-established schools. Provision here is limited in number but strong in reputation, including one of the very few Accra schools that publishes its fees openly. Most families choosing Ridge are also considering Cantonments, Labone and Airport Residential.",
  },
  {
    slug: "asylum-down",
    name: "Asylum Down",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Central Accra neighbourhood between Adabraka and Kokomlemle.",
    intro:
      "Asylum Down is a central Accra neighbourhood close to Adabraka and Kokomlemle, mixing residential streets with offices and guesthouses. School provision is limited but includes settings taking children from a few months old. Its central position means families often weigh it against Adabraka, Ridge and Kaneshie.",
  },
  {
    slug: "adabraka",
    name: "Adabraka",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Older central Accra neighbourhood north of the business district.",
    intro:
      "Adabraka is one of Accra's older central neighbourhoods and its schools reflect that, including institutions whose history reaches back to the mid-twentieth century. Provision is mostly Ghanaian-curriculum basic schools serving families living centrally. Being central, journeys are short but parking and through-traffic are the practical constraints.",
  },
  {
    slug: "kaneshie",
    name: "Kaneshie",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Busy market and residential district in west-central Accra.",
    intro:
      "Kaneshie is built around its market and the Winneba road, and is one of the denser parts of west-central Accra. Provision is mostly neighbourhood creches and basic schools, including Catholic mission schools that have served the area for decades. Kaneshie runs into Awudome, Abossey Okai and Dansoman, so addresses often reference neighbouring areas.",
  },
  {
    slug: "mamprobi",
    name: "Mamprobi",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Established residential district in south-west Accra.",
    intro:
      "Mamprobi is a long-established residential district in south-west Accra, close to Korle Bu and Dansoman. Provision is dominated by mission and public basic schools rather than private international ones, several with long histories in the area. Online presence is thin, so phone contact is usually the fastest route.",
  },
  {
    slug: "korle-bu",
    name: "Korle Bu",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "District around the Korle Bu Teaching Hospital in south-west Accra.",
    intro:
      "Korle Bu is best known for its teaching hospital, and the residential area around it houses many hospital and university families. School provision is modest and leans towards mission schools. Korle Bu runs into Mamprobi and Lartebiokorshie, and some schools span more than one of them.",
  },
  {
    slug: "abossey-okai",
    name: "Abossey Okai",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Commercial and residential district in central-west Accra.",
    intro:
      "Abossey Okai is best known for its spare-parts trade, and is densely residential behind the main commercial strips. Provision is mostly public and mission basic schools with little web presence, so the schools listed here are fewer than those actually operating. Families often also look at Kaneshie and Mamprobi.",
  },
  {
    slug: "nima",
    name: "Nima",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Dense inner-city neighbourhood in north-central Accra.",
    intro:
      "Nima is one of Accra's most densely populated inner-city neighbourhoods, with a young population and heavy demand for basic schooling. Provision is predominantly public and mission schools, which rarely publish contact details online. The schools listed here are a fraction of those operating locally.",
  },
  {
    slug: "kotobabi",
    name: "Kotobabi",
    region: "accra",
    regionName: "Greater Accra",
    blurb: "Residential neighbourhood in north-central Accra, near Nima and Alajo.",
    intro:
      "Kotobabi sits between Nima, Alajo and Accra New Town in north-central Accra. Like its neighbours, provision is mostly public and mission basic schools serving families within walking distance. Web presence is minimal, so expect to phone rather than browse.",
  },
  {
    slug: "cape-coast",
    name: "Cape Coast",
    region: "central",
    regionName: "Central",
    blurb: "Historic coastal city and regional capital of the Central Region.",
    intro:
      "Cape Coast is the Central Region's capital and one of Ghana's oldest education centres, with a metropolitan register listing close to two hundred basic schools. Private provision is spread across Pedu, Abura, Akotokyir, Adisadel and the UCC campus area. Relatively few schools maintain websites, so phone contact is usually the quickest route to admissions.",
  },
  {
    slug: "elmina",
    name: "Elmina",
    region: "central",
    regionName: "Central",
    blurb: "Historic fishing town west of Cape Coast in the KEEA municipality.",
    intro:
      "Elmina is a historic fishing town west of Cape Coast, and the municipality around it runs a large number of kindergartens and primaries relative to its size. Private provision with an online presence is thin, though several schools are long established, including Catholic schools dating to the nineteenth century. Families often also look towards Cape Coast, which is a short drive east.",
  },
  {
    slug: "winneba",
    name: "Winneba",
    region: "central",
    regionName: "Central",
    blurb: "Coastal town in the Central Region, home to the University of Education.",
    intro:
      "Winneba is built around the University of Education, and its best-documented school provision belongs to the university itself. Beyond that, most basic schools in the town have little or no web presence, so the listings here represent a fraction of what operates locally. Families here are generally choosing within Winneba rather than commuting.",
  },
  {
    slug: "airport-ridge",
    name: "Airport Ridge",
    region: "western",
    regionName: "Western",
    blurb: "Residential area near Takoradi airport in the Western Region.",
    intro:
      "Airport Ridge is one of Takoradi's established residential areas, and has a small cluster of preparatory and preschool provision. It sits close to Anaji and the town centre, so families here typically consider all three. Provision is modest in number but the area is a recognised, searchable Takoradi address.",
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

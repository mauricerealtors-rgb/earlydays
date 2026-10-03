import type { Occasion, CakeKind, Style, Dietary } from "@/lib/types";

/**
 * Browse taxonomy.
 *
 * Three axes, because people search along all three: the occasion ("wedding
 * cake"), the product ("cupcakes", "bento cake") and the finish ("fondant").
 * Occasions and kinds each get their own indexable page; styles and dietary
 * claims are filters only, because a page per finish per area would repeat the
 * thin-page mistake the EarlyDays comparison grid made.
 */

export interface OccasionCategory {
  slug: string;
  occasion: Occasion;
  singular: string;
  plural: string;
  short: string;          // card copy
  blurb: string;          // category page intro
  accent: "rose" | "cocoa" | "cream" | "berry" | "gold";
  /** Typical notice vendors ask for. Honest guidance, never a promise. */
  typicalLeadTimeNote: string;
}

export const OCCASIONS: OccasionCategory[] = [
  {
    slug: "wedding-cakes",
    occasion: "wedding",
    singular: "Wedding cake",
    plural: "Wedding cakes",
    short: "Tiered cakes for the white wedding and reception",
    blurb:
      "Wedding cakes are priced on tiers, servings and design. Some bakers publish a full tier-by-tier price list and some quote on request — where a baker publishes, you will see the figures here rather than a button asking you to enquire. Ask whether setup at the venue is included, because that varies more than the cake price does.",
    accent: "cream",
    typicalLeadTimeNote:
      "Ghanaian wedding checklists put booking the baker around nine months out and finalising the design about four months before. Bakers themselves often work to far shorter notice, so ask rather than assume you are too late.",
  },
  {
    slug: "engagement-cakes",
    occasion: "engagement",
    singular: "Engagement cake",
    plural: "Engagement cakes",
    short: "Cakes for the traditional marriage ceremony",
    blurb:
      "The traditional engagement often needs its own cake, in kente or in the ceremony colours, and sometimes on a different day from the white wedding. Many couples order both from the same baker, which is worth asking about because it usually changes the price.",
    accent: "gold",
    typicalLeadTimeNote:
      "Three to six weeks is common, longer if the design has to match specific cloth.",
  },
  {
    slug: "birthday-cakes",
    occasion: "birthday",
    singular: "Birthday cake",
    plural: "Birthday cakes",
    short: "From a small bento cake to a full tiered centrepiece",
    blurb:
      "The widest range on the site, from single-serve bento cakes to tiered centrepieces. Sort by how many people the cake actually serves, not by how big it looks in the photo — that gap is the most common complaint in this category.",
    accent: "rose",
    typicalLeadTimeNote:
      "Most Accra bakers ask for 24 to 48 hours. A few take same-day orders at a higher price, and elaborate designs are quoted separately and need longer.",
  },
  {
    slug: "kids-birthday-cakes",
    occasion: "kids-birthday",
    singular: "Kids birthday cake",
    plural: "Kids birthday cakes",
    short: "Character, sculpted and themed cakes for children",
    blurb:
      "Sculpted and character cakes are the most skill-dependent cakes a baker makes, so the portfolio matters more here than anywhere else. Every photo marked as a baker's own work has been traced back to their site or account, rather than taken from a gallery of someone else's cakes.",
    accent: "berry",
    typicalLeadTimeNote:
      "Longer than a plain cake. Bakers quote sculpted work separately, so give as much notice as you can.",
  },
  {
    slug: "baby-shower-cakes",
    occasion: "baby-shower",
    singular: "Baby shower cake",
    plural: "Baby shower cakes",
    short: "Cakes and dessert tables for baby showers",
    blurb:
      "Baby shower orders often bundle a cake with cupcakes or a small dessert table, so compare bakers on what they will supply together rather than on the cake alone.",
    accent: "cream",
    typicalLeadTimeNote: "One to three weeks.",
  },
  {
    slug: "naming-ceremony-cakes",
    occasion: "naming-ceremony",
    singular: "Naming ceremony cake",
    plural: "Naming ceremony cakes",
    short: "Outdooring and naming ceremony cakes",
    blurb:
      "Naming ceremonies are usually arranged on short notice, since the date follows the birth. Filter by lead time first here. It matters more than design.",
    accent: "cream",
    typicalLeadTimeNote: "Often under a week, so ask about rush orders.",
  },
  {
    slug: "graduation-cakes",
    occasion: "graduation",
    singular: "Graduation cake",
    plural: "Graduation cakes",
    short: "Cakes for school and university graduations",
    blurb:
      "Graduation season clusters tightly, so good bakers fill up weeks ahead. If your ceremony falls in a known graduation month, order earlier than you think you need to.",
    accent: "gold",
    typicalLeadTimeNote:
      "One to three weeks, but book earlier in graduation season.",
  },
  {
    slug: "anniversary-cakes",
    occasion: "anniversary",
    singular: "Anniversary cake",
    plural: "Anniversary cakes",
    short: "Wedding anniversary and milestone cakes",
    blurb:
      "Anniversary cakes are often a smaller echo of the original wedding cake. If you have a photo of that cake, send it with your quote request. It is the clearest brief a baker can get.",
    accent: "rose",
    typicalLeadTimeNote: "One to two weeks.",
  },
  {
    slug: "corporate-cakes",
    occasion: "corporate",
    singular: "Corporate cake",
    plural: "Corporate cakes",
    short: "Branded and logo cakes for company events",
    blurb:
      "Corporate orders need a baker who can reproduce a logo accurately and invoice properly. Edible-print and hand-painted finishes both work, and the results differ noticeably, so ask which the baker uses.",
    accent: "cocoa",
    typicalLeadTimeNote:
      "One to three weeks. Ask about invoicing if you need formal receipts.",
  },
  {
    slug: "bridal-shower-cakes",
    occasion: "bridal-shower",
    singular: "Bridal shower cake",
    plural: "Bridal shower cakes",
    short: "Cakes and treats for bridal showers",
    blurb:
      "Bridal shower orders usually mean a small cake plus cupcakes or cake pops. Bakers who do dessert tables will quote the whole spread in one go.",
    accent: "berry",
    typicalLeadTimeNote: "One to two weeks.",
  },
];

export interface KindCategory {
  slug: string;
  kind: CakeKind;
  singular: string;
  plural: string;
  short: string;
  blurb: string;
}

export const KINDS: KindCategory[] = [
  {
    slug: "tiered-cakes",
    kind: "tiered-cake",
    singular: "Tiered cake",
    plural: "Tiered cakes",
    short: "Two tiers and up, for weddings and large events",
    blurb:
      "Tiers are the main driver of what a cake costs, because each one adds structure, baking time and decoration. Knowing how many people you need to serve is more useful to a baker than knowing how many tiers you want.",
  },
  {
    slug: "bento-cakes",
    kind: "bento-cake",
    singular: "Bento cake",
    plural: "Bento cakes",
    short: "Small single-serve cakes, often same-day",
    blurb:
      "A bento cake is a four-inch cake in a takeaway box, usually serving one or two people. They are the cheapest and fastest thing on this site, and the easiest gift to arrange at short notice.",
  },
  {
    slug: "number-cakes",
    kind: "number-cake",
    singular: "Number cake",
    plural: "Number cakes",
    short: "Cakes cut into an age or a date",
    blurb:
      "Number cakes are cut to shape rather than baked in a tin, so serving counts are harder to judge than they look. Ask the baker how many portions a given number actually gives.",
  },
  {
    slug: "sculpted-cakes",
    kind: "sculpted-cake",
    singular: "Sculpted cake",
    plural: "Sculpted cakes",
    short: "Three-dimensional and character cakes",
    blurb:
      "Sculpted cakes are carved and structured rather than stacked, which makes them the most skill-dependent cakes here. Judge these on portfolio photos you can verify, not on price.",
  },
  {
    slug: "cupcakes",
    kind: "cupcakes",
    singular: "Cupcakes",
    plural: "Cupcakes",
    short: "Boxed by the dozen, for parties and gifting",
    blurb:
      "Cupcakes are usually sold by the dozen and are the one product where bakers will often quote a real price up front. Useful for large guest counts where a single cake would not go round.",
  },
  {
    slug: "cake-pops",
    kind: "cake-pops",
    singular: "Cake pops",
    plural: "Cake pops",
    short: "Individual treats for party favours",
    blurb:
      "Cake pops travel and hand out well, so they suit children's parties and favours. Most bakers sell them alongside cupcakes rather than on their own.",
  },
  {
    slug: "dessert-tables",
    kind: "dessert-table",
    singular: "Dessert table",
    plural: "Dessert tables",
    short: "A full spread, styled and set up on site",
    blurb:
      "A dessert table is a cake plus an arrangement of smaller sweets, usually styled and set up at the venue. Confirm whether setup, stands and collection afterwards are included, because that is where quotes differ most.",
  },
  {
    slug: "sheet-cakes",
    kind: "sheet-cake",
    singular: "Sheet cake",
    plural: "Sheet cakes",
    short: "Flat rectangular cakes that serve a crowd cheaply",
    blurb:
      "A sheet cake gives the most servings per cedi, and is what offices and schools usually want. Less of a centrepiece, far easier on a budget.",
  },
  {
    slug: "pastries",
    kind: "pastries",
    singular: "Pastries",
    plural: "Pastries",
    short: "Meat pies, doughnuts and small chops",
    blurb:
      "Many cake makers also supply pastries and small chops for the same event. Ordering both from one vendor usually saves on delivery.",
  },
];

/** Filters only, with no dedicated page, to avoid thin duplicates. */
export const STYLE_LABELS: Record<Style, string> = {
  fondant: "Fondant",
  buttercream: "Buttercream",
  naked: "Naked cake",
  drip: "Drip cake",
  "sugar-flowers": "Sugar flowers",
  airbrush: "Airbrushed",
  "edible-print": "Edible photo print",
  "hand-painted": "Hand-painted",
};

export const DIETARY_LABELS: Record<Dietary, string> = {
  eggless: "Eggless",
  vegan: "Vegan",
  halal: "Halal",
  "sugar-free": "Sugar-free",
  "gluten-free": "Gluten-free",
  "nut-free": "Nut-free",
};

export function findOccasion(slug: string): OccasionCategory | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function findKind(slug: string): KindCategory | undefined {
  return KINDS.find((k) => k.slug === slug);
}

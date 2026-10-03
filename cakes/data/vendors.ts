import type { Vendor, Occasion, CakeKind } from "@/lib/types";
import { ACCRA_VENDORS } from "@/data/vendors-accra";

/**
 * The directory.
 *
 * Every entry is traced to a real source and carries its sourceUrls. Nothing
 * here is invented: no guessed phone numbers, no stock photos passed off as a
 * baker's own work, no price we were not told. An empty field is honest; a
 * wrong one costs us the vendor.
 *
 * Sources deliberately NOT used, having been caught fabricating or recycling:
 *   celebrations.tortoisepath.com  AI-generated. Invented a website for one
 *                                 vendor (kemllys.com, does not resolve) and
 *                                 stamps its own numbers 0260978043 /
 *                                 0385114162 on every listing as if they were
 *                                 the business's own.
 *   wirecake.com                  Auto-generated. Lists the same business twice
 *                                 at different addresses with one number, and
 *                                 gives "open 24 hours" for home bakeries.
 *   thebranchlocator.com, mrpocu.com, rentechdigital.com   Same class of scrape.
 *
 * Two live sites (baycakesgh.online, henrimacakes.com) turned out to share one
 * Lovable builder account and one Cloudflare R2 bucket, so a polished site is
 * not corroboration on its own here.
 *
 * `verification: "info-confirmed"` means we traced the details to the vendor's
 * own site or account. It does NOT mean we have spoken to them — that is
 * `contactVerifiedAt`, and nothing here has it yet.
 */
/** Everywhere outside Greater Accra. Accra lives in its own file. */
const REGIONAL_VENDORS: Vendor[] = [
  // ---------------------------------------------------------------- Kumasi
  {
    id: "ck-001",
    slug: "zakes-cake-knust-kumasi",
    name: "Zakes Cake KNUST Kumasi",
    shortDescription:
      "KNUST bakery publishing a full price ladder from mini cakes to fondant wedding cakes.",
    description:
      "A pre-order bakery on Ayeduase Road by the KNUST campus, covering birthday and graduation cakes through to traditional and fondant wedding cakes. One of the few bakers in Ghana to publish complete prices on its own site, which is why it sits near the top of these listings. Premium cakes are made to order only.",
    occasions: ["birthday", "graduation", "wedding", "engagement", "anniversary"],
    kinds: ["tiered-cake", "cupcakes", "dessert-table"],
    styles: ["fondant", "buttercream"],
    flavours: [],
    dietary: [],
    services: ["Delivery", "Tasting session"],
    address: "Ayeduase Rd, Kumasi",
    area: "knust",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    deliversTo: ["knust", "bomso", "kumasi-central", "asokwa", "nhyiaeso", "ahodwo"],
    deliveryNote: "Delivers within Kumasi for a fee.",
    phone: "+233 20 946 2400",
    whatsapp: "+233 20 946 2400",
    email: "zakescakeknust@gmail.com",
    website: "https://www.zakescakeknustkumasi.com/",
    instagram: "zakes_cake_knust_kumasi",
    facebook: "https://www.facebook.com/zakescakeknustkumasi",
    tiktok: "zakes_cake_knust_kumasi",
    priceFrom: 499,
    priceList: [
      { label: "Mini cake with cupcakes", cedis: 499 },
      { label: "Whipped cream cake", cedis: 550 },
      { label: "Birthday or graduation cake", cedis: 550 },
      { label: "Christmas cake", cedis: 850 },
      { label: "Traditional wedding cake", cedis: 2450 },
      { label: "Buttercream wedding cake", cedis: 2450 },
      { label: "Fondant wedding cake", cedis: 3950 },
      { label: "Dessert table", cedis: 2999 },
    ],
    priceListSourceUrl: "https://www.zakescakeknustkumasi.com/",
    priceListSeenAt: "2026-10-03",
    leadTimeNote: "Premium cakes are made on a pre-order basis only.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.zakescakeknustkumasi.com/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-002",
    slug: "shalom-bakery-and-catering-kumasi",
    name: "Shalom Bakery and Catering Service",
    shortDescription:
      "KNUST bakery with a published catalogue, 48-hour pre-orders and flat GH₵25 delivery in Kumasi.",
    description:
      "A Kumasi bakery covering birthday, wedding, anniversary, baby shower and themed cakes alongside cupcakes and cake jars. Prices and the delivery fee are published, pre-orders run 48 hours ahead, and they notify you by call or WhatsApp when an order is ready.",
    occasions: ["birthday", "wedding", "anniversary", "baby-shower", "bridal-shower", "corporate"],
    kinds: ["tiered-cake", "cupcakes", "bento-cake"],
    styles: ["buttercream"],
    flavours: ["chocolate", "red-velvet", "vanilla"],
    dietary: [],
    services: ["Delivery"],
    address: "KNUST, Kumasi",
    area: "knust",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    deliversTo: ["knust", "bomso", "kumasi-central", "asokwa", "nhyiaeso", "ahodwo", "santasi"],
    deliveryNote: "Delivery within Kumasi at GH₵25.",
    phone: "+233 20 435 2500",
    whatsapp: "+233 20 435 2500",
    website: "https://shalombakerygh.wixsite.com/shalombakerygh",
    instagram: "shalom_bakery_gh",
    facebook: "https://web.facebook.com/shalombakerygh/",
    tiktok: "shalom_bakery_gh",
    hours: "Open 24 hours, including Sundays and public holidays",
    priceFrom: 59,
    priceList: [
      { label: "Cake jar", cedis: 59 },
      { label: "Custom cupcakes", cedis: 199 },
      { label: "Cupcake assortment box", cedis: 249 },
      { label: "Birthday, custom, chocolate or red velvet cake", cedis: 349 },
      { label: "Theme cake", cedis: 499 },
    ],
    priceListSourceUrl: "https://shalombakerygh.wixsite.com/shalombakerygh",
    priceListSeenAt: "2026-10-03",
    leadTimeDays: 2,
    leadTimeNote: "48 hours pre-order.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://shalombakerygh.wixsite.com/shalombakerygh"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    images: [
      {
        url: "https://static.wixstatic.com/media/2bda8f_330a293809474a069026e2c977b67e3c~mv2.jpeg",
        alt: "A decorated cake by Shalom Bakery, KNUST, Kumasi",
        credit: "Photo: Shalom Bakery and Catering Service (official site)",
        sourceUrl: "https://shalombakerygh.wixsite.com/shalombakerygh",
        ownWork: true,
      },
      {
        url: "https://static.wixstatic.com/media/2bda8f_4721eee0f7e347caa4fc42d97b8924ef~mv2.jpeg",
        alt: "Cupcakes by Shalom Bakery, Kumasi",
        credit: "Photo: Shalom Bakery and Catering Service (official site)",
        sourceUrl: "https://shalombakerygh.wixsite.com/shalombakerygh",
        ownWork: true,
      },
    ],
  },
  {
    id: "ck-003",
    slug: "edana-bakes-kumasi",
    name: "Edana Bakes",
    shortDescription:
      "Bomso baker with published sizes from cake-in-a-cup up to two tiers, three days' notice.",
    description:
      "A Bomso bakery working across cake-in-a-cup, small and medium cakes, two-tier cakes, cupcakes and cookies, with customised gift boxes and hampers alongside. Prices are published by size and they ask for at least three days' notice. They also run an apprenticeship programme.",
    occasions: ["birthday", "anniversary", "baby-shower", "corporate", "bridal-shower"],
    kinds: ["tiered-cake", "bento-cake", "cupcakes"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: ["Delivery"],
    address: "Nyamaa Poku Avenue MF4, Bomso, Kumasi",
    area: "bomso",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    deliversTo: ["bomso", "knust", "kumasi-central", "asokwa"],
    phone: "+233 50 130 7506",
    whatsapp: "+233 50 130 7506",
    website: "https://edanacakes.wixsite.com/edanabakes",
    facebook: "https://www.facebook.com/edana.rolls",
    priceFrom: 30,
    priceList: [
      { label: "Cake in a cup", cedis: 30 },
      { label: "Cookies", cedis: 30 },
      { label: "Cupcakes, 6 pieces", cedis: 70 },
      { label: "Small cake", cedis: 180 },
      { label: "Gift box", cedis: 200 },
      { label: "Regular cake", cedis: 250 },
      { label: "Medium cake", cedis: 400 },
      { label: "Two-tier cake", cedis: 600, tiers: 2 },
    ],
    priceListSourceUrl: "https://edanacakes.wixsite.com/edanabakes",
    priceListSeenAt: "2026-10-03",
    leadTimeDays: 3,
    leadTimeNote: "At least three days in advance.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    // Instagram handle omitted on purpose: the vendor's own site and a
    // third-party listing give different handles, so neither is published.
    sourceUrls: ["https://edanacakes.wixsite.com/edanabakes"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    images: [
      {
        url: "https://static.wixstatic.com/media/59f4dc_0d81855d6a3f4ba8a689747272d678c8~mv2.jpg",
        alt: "A decorated cake by Edana Bakes, Bomso, Kumasi",
        credit: "Photo: Edana Bakes (official site)",
        sourceUrl: "https://edanacakes.wixsite.com/edanabakes",
        ownWork: true,
      },
      {
        url: "https://static.wixstatic.com/media/59f4dc_2ba84a7e9c204d8a9636ac1d660d75dd~mv2.jpg",
        alt: "Cupcakes by Edana Bakes, Kumasi",
        credit: "Photo: Edana Bakes (official site)",
        sourceUrl: "https://edanacakes.wixsite.com/edanabakes",
        ownWork: true,
      },
    ],
  },
  {
    id: "ck-004",
    slug: "khadys-kitchen-kumasi",
    name: "Khady's Kitchen",
    shortDescription: "Kumasi novelty cake maker with a large following and a separate wedding line.",
    description:
      "A Kumasi baker known for novelty cakes, with ready-to-go cakes and solo-bite cakes alongside custom work. Weddings run through a sister account. They also train students.",
    occasions: ["birthday", "kids-birthday", "wedding", "anniversary"],
    kinds: ["sculpted-cake", "tiered-cake", "bento-cake"],
    styles: ["fondant", "buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    whatsapp: "+233 50 218 7856",
    instagram: "khadys_kitchen",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/khadys_kitchen/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-005",
    slug: "a-blaq-kitchen-santasi",
    name: "A. Blaq Kitchen",
    shortDescription: "Santasi baker specialising in luxury wedding cakes, with hampers alongside.",
    description:
      "A Santasi kitchen covering luxury wedding cakes and celebration cakes, plus cupcakes, pastries and parfait. They also put together surprise packages and breakfast, food, fruit and beverage hampers, and run an events arm.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "bridal-shower"],
    kinds: ["tiered-cake", "cupcakes", "pastries"],
    styles: ["fondant", "buttercream", "sugar-flowers"],
    flavours: [],
    dietary: [],
    services: ["Delivery"],
    area: "santasi",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    phone: "0244 526 841",
    phones: ["0244 526 841", "0208 848 510"],
    whatsapp: "0208 848 510",
    instagram: "ablaqkitchen",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/ablaqkitchen/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-006",
    slug: "jolly-cakes-by-oparebea",
    name: "Jolly Cakes by Oparebea",
    shortDescription: "Kumasi baker doing bespoke wedding and celebration cakes.",
    description:
      "A Kumasi baker working on bespoke wedding, birthday and celebration cakes, with floral cupcakes alongside. Also offers training.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "bridal-shower"],
    kinds: ["tiered-cake", "cupcakes"],
    styles: ["buttercream", "sugar-flowers"],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    whatsapp: "+233 24 456 5833",
    instagram: "jolly_cakes_by_oparebea",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/jolly_cakes_by_oparebea/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-007",
    slug: "delicakes-by-nayak",
    name: "Delicakes by Nayak",
    shortDescription: "Kumasi baker doing tiered cakes, with grazing boxes and small chops alongside.",
    description:
      "A Kumasi kitchen covering tiered and wedding cakes, cupcakes and desserts, alongside food baskets, grazing boxes, small chops and breads.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "corporate"],
    kinds: ["tiered-cake", "cupcakes", "dessert-table", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    phone: "0592 329 981",
    phones: ["0592 329 981", "0546 040 927"],
    whatsapp: "+233 592 329 981",
    instagram: "delicakesbynayak",
    hours: "08:00 – 17:00",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/delicakesbynayak/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-008",
    slug: "porsh-golden-cakes-n-more",
    name: "Porsh Golden Cakes n More",
    shortDescription: "Kumasi baker doing wedding and birthday cakes, with balloon decoration.",
    description:
      "A Kumasi baker covering wedding and birthday cakes and pastries, with balloon decoration alongside. We have not been able to confirm a phone number for them yet.",
    occasions: ["wedding", "birthday", "anniversary"],
    kinds: ["tiered-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    instagram: "porsh_golden_cakes_n_more",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/porsh_golden_cakes_n_more/"],
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-009",
    slug: "de-bakers-shop-kumasi",
    name: "De Bakers Shop",
    shortDescription: "Kumasi baker doing luxury bespoke cakes and food baskets.",
    description:
      "A Kumasi baker working on luxury bespoke cakes, with breakfast and food baskets alongside. We have not been able to confirm a phone number for them yet.",
    occasions: ["wedding", "birthday", "anniversary"],
    kinds: ["tiered-cake"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    instagram: "debakers_shop",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/debakers_shop/"],
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-010",
    slug: "sharifa-cooks-and-bakes",
    name: "Sharifa Cooks and Bakes",
    shortDescription: "Kumasi cake shop run by a food content creator.",
    description:
      "A Kumasi cake shop whose owner also works as a food content creator. We have not been able to confirm a phone number for them yet.",
    occasions: ["birthday", "anniversary"],
    kinds: ["tiered-cake"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "kumasi-central",
    city: "Kumasi",
    region: "Ashanti Region",
    country: "Ghana",
    instagram: "sharifacooksandbakes",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/sharifacooksandbakes/"],
    updatedAt: "2026-10-03",
  },

  // ------------------------------------------------------- Takoradi / Sekondi
  {
    id: "ck-011",
    slug: "cake-is-art-bakery",
    name: "Cake Is Art Bakery",
    shortDescription: "Anaji bakery with a second branch in Tarkwa and a WhatsApp catalogue.",
    description:
      "Takoradi's best-known cake shop, based at Anaji opposite Queen of Peace School, with a second branch in Tarkwa on its own line. Custom celebration cakes and cupcakes, alongside breads, milky doughnuts, boba and brunch boxes. They work with customers on bespoke designs and keep a catalogue on WhatsApp.",
    occasions: ["birthday", "kids-birthday", "wedding", "engagement", "anniversary", "graduation", "baby-shower"],
    kinds: ["tiered-cake", "sculpted-cake", "cupcakes", "pastries"],
    styles: ["fondant", "buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    address: "Anaji, Takoradi (opposite Queen of Peace School)",
    area: "anaji",
    city: "Takoradi",
    region: "Western Region",
    country: "Ghana",
    deliversTo: ["anaji", "takoradi"],
    phone: "0267 721 359",
    phones: ["0267 721 359", "0542 585 602"],
    whatsapp: "+233 267 721 359",
    instagram: "cake_is_art_bakery",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: [
      "https://www.instagram.com/cake_is_art_bakery/",
      "https://www.threads.com/@cake_is_art_bakery",
    ],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-012",
    slug: "glorious-cakes-gh",
    name: "Glorious Cakes GH",
    shortDescription: "Takoradi baker doing wedding and celebration cakes, plus pastry training.",
    description:
      "A Takoradi baker covering wedding, birthday and celebration cakes and pastries, with breakfast and lunch baskets alongside. The owner also teaches pastry.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "graduation"],
    kinds: ["tiered-cake", "cupcakes", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "takoradi",
    city: "Takoradi",
    region: "Western Region",
    country: "Ghana",
    phone: "0246 097 566",
    whatsapp: "+233 246 097 566",
    instagram: "glorious_cakesgh",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/glorious_cakesgh/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-013",
    slug: "cakes-by-genia",
    name: "Cakes by Genia",
    shortDescription: "Small, active Takoradi baker with a WhatsApp catalogue.",
    description:
      "A Takoradi baker covering wedding cakes, cupcakes, wafer cakes and decorated celebration cakes, with pastries alongside. A small operation, but consistently posting new work.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "baby-shower"],
    kinds: ["tiered-cake", "cupcakes", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "takoradi",
    city: "Takoradi",
    region: "Western Region",
    country: "Ghana",
    phone: "0242 201 711",
    whatsapp: "+233 242 201 711",
    instagram: "cakes_by_genia",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/cakes_by_genia/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-014",
    slug: "queens-cakes-and-more-takoradi",
    name: "Queen's Cakes and More",
    shortDescription: "Takoradi cake and pastry shop on Liberation Road.",
    description:
      "A cake and pastry shop on Liberation Road in Takoradi, opposite FBN Bank. We have confirmed the business and its Facebook page, but have not yet verified a phone number from the business itself, so none is published here.",
    occasions: ["birthday", "wedding", "anniversary"],
    kinds: ["tiered-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    address: "Liberation Road, Takoradi (opposite FBN Bank)",
    area: "takoradi",
    city: "Takoradi",
    region: "Western Region",
    country: "Ghana",
    facebook: "https://www.facebook.com/Queenscakesandmore/",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.facebook.com/Queenscakesandmore/"],
    updatedAt: "2026-10-03",
  },

  // ---------------------------------------------------------------- Tamale
  {
    id: "ck-015",
    slug: "mystery-bakebite-tamale",
    name: "Mystery Bakebite",
    shortDescription:
      "Tamale bakery publishing prices across cupcakes, slices, loaves and parfait, with custom cakes to order.",
    description:
      "A Tamale bakery founded by Emmanuella N. Awini, publishing prices across cupcakes, cake slices, cake loaves, cake parfait and cookies, with birthday and themed cakes made to order on three to five days' notice. Pickup and delivery both available. They also run hands-on bread and pastry classes.",
    occasions: ["birthday", "kids-birthday", "graduation", "corporate", "baby-shower"],
    kinds: ["cupcakes", "sheet-cake", "bento-cake", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: ["Delivery", "Pickup only"],
    area: "tamale",
    city: "Tamale",
    region: "Northern Region",
    country: "Ghana",
    deliversTo: ["tamale"],
    phone: "+233 55 452 0532",
    whatsapp: "+233 55 452 0532",
    email: "mysterybakebite@gmail.com",
    website: "https://mysterybakebites.github.io/",
    instagram: "mysterybakebites",
    facebook: "https://www.facebook.com/mysterybakebites",
    tiktok: "mysterybakebites",
    hours: "08:00 – 19:00",
    priceFrom: 30,
    priceList: [
      { label: "Cookies", cedis: 30, note: "from" },
      { label: "Milky or mini doughnuts", cedis: 30, note: "from" },
      { label: "Cake slices", cedis: 35, note: "from" },
      { label: "Cake loaves", cedis: 35, note: "from" },
      { label: "Cake parfait", cedis: 35, note: "from" },
      { label: "Cupcakes", cedis: 75, note: "from" },
    ],
    priceListSourceUrl: "https://mysterybakebites.github.io/",
    priceListSeenAt: "2026-10-03",
    leadTimeDays: 3,
    leadTimeNote: "Three to five days ahead for custom cakes.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://mysterybakebites.github.io/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    images: [
      {
        url: "https://mysterybakebites.github.io/assets/lux-custom.webp",
        alt: "A custom cake by Mystery Bakebite, Tamale",
        credit: "Photo: Mystery Bakebite (official site)",
        sourceUrl: "https://mysterybakebites.github.io/",
        ownWork: true,
      },
      {
        url: "https://mysterybakebites.github.io/assets/cupcakes.webp",
        alt: "Cupcakes by Mystery Bakebite, Tamale",
        credit: "Photo: Mystery Bakebite (official site)",
        sourceUrl: "https://mysterybakebites.github.io/",
        ownWork: true,
      },
      {
        url: "https://mysterybakebites.github.io/assets/slices.webp",
        alt: "Cake slices by Mystery Bakebite, Tamale",
        credit: "Photo: Mystery Bakebite (official site)",
        sourceUrl: "https://mysterybakebites.github.io/",
        ownWork: true,
      },
    ],
  },
  {
    id: "ck-016",
    slug: "cakes-n-cuppies-gh",
    name: "Cakes n Cuppies GH",
    shortDescription: "Tamale baker on the TTH road, also operating in Accra.",
    description:
      "A Tamale baker along the Tamale Teaching Hospital road, also operating in Accra. Wedding cakes, cupcakes and whipped-cream cakes, with brownies, pastries and hand pies alongside, plus small chops and event catering.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "corporate"],
    kinds: ["tiered-cake", "cupcakes", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    address: "Along the TTH road, Tamale",
    area: "tamale",
    city: "Tamale",
    region: "Northern Region",
    country: "Ghana",
    phone: "+233 24 884 1866",
    whatsapp: "+233 24 884 1866",
    instagram: "cakesncuppiesgh",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/cakesncuppiesgh/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-017",
    slug: "mandys-munchies-tamale",
    name: "Mandy's Munchies",
    shortDescription: "Tamale baker doing buttercream and whipped-cream work, with training.",
    description:
      "A Tamale baker run by Mandy Juks, covering birthday, wedding and children's cakes plus cupcakes, with a focus on buttercream and whipped-cream work. Also offers training.",
    occasions: ["birthday", "kids-birthday", "wedding", "engagement", "anniversary"],
    kinds: ["tiered-cake", "sculpted-cake", "cupcakes"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "tamale",
    city: "Tamale",
    region: "Northern Region",
    country: "Ghana",
    phone: "0203 903 072",
    phones: ["0203 903 072", "0544 886 657"],
    whatsapp: "+233 203 903 072",
    instagram: "mandys.munchies__",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/mandys.munchies__/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-018",
    slug: "anns-bakery-tamale",
    name: "Ann's Bakery",
    shortDescription: "Tamale bakery doing wedding, birthday and fancy cakes on two days' notice.",
    description:
      "A Tamale bakery covering wedding, birthday and fancy cakes, working to a two-day pre-order. We have confirmed the business and its Facebook page, but have not yet verified a phone number from the business itself, so none is published here.",
    occasions: ["wedding", "engagement", "birthday", "anniversary"],
    kinds: ["tiered-cake"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "tamale",
    city: "Tamale",
    region: "Northern Region",
    country: "Ghana",
    facebook: "https://www.facebook.com/annsbakery18/",
    leadTimeDays: 2,
    leadTimeNote: "Two-day pre-order.",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.facebook.com/annsbakery18/"],
    updatedAt: "2026-10-03",
  },

  // ------------------------------------------------------------- Cape Coast
  {
    id: "ck-019",
    slug: "cups-n-crunches-cape-coast",
    name: "Cups 'N' Crunches",
    shortDescription:
      "Amamoma cake shop by UCC, with party accessories alongside and a WhatsApp-only ordering policy.",
    description:
      "A Cape Coast cake shop on Ayensu Road by the University of Cape Coast, with locations in Accra and Takoradi too. Wedding cakes, cupcakes, cake-in-a-cup and dessert lines, alongside balloons, flowers and party accessories. They take orders on WhatsApp only, and state plainly that they do not answer Instagram DMs. Delivery and pickup both available.",
    occasions: ["wedding", "engagement", "birthday", "kids-birthday", "graduation", "baby-shower", "bridal-shower"],
    kinds: ["tiered-cake", "cupcakes", "bento-cake", "dessert-table"],
    styles: ["buttercream", "fondant"],
    flavours: [],
    dietary: [],
    services: ["Delivery", "Pickup only"],
    address: "Ayensu Rd, University Avenue, Amamoma, Cape Coast (opposite Ayensu Plaza Hostel)",
    area: "cape-coast",
    city: "Cape Coast",
    region: "Central Region",
    country: "Ghana",
    deliversTo: ["cape-coast"],
    phone: "0271 821 705",
    phones: ["0271 821 705", "0559 082 130"],
    whatsapp: "+233 271 821 705",
    email: "cnccakesandmore@gmail.com",
    instagram: "cupsncrunches",
    facebook: "https://www.facebook.com/cupsncrunches/",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: [
      "https://www.instagram.com/cupsncrunches/",
      "https://www.facebook.com/cupsncrunches/",
    ],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-020",
    slug: "doughcastle-cape-coast",
    name: "DoughCastle",
    shortDescription: "Cape Coast bake and catering house doing birthday cakes among other lines.",
    description:
      "A Cape Coast bake and catering house. Birthday cakes are one line among several, alongside buns, cinnamon rolls and other baked goods, and they run baking training programmes.",
    occasions: ["birthday", "kids-birthday", "graduation", "corporate"],
    kinds: ["tiered-cake", "pastries"],
    styles: ["buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "cape-coast",
    city: "Cape Coast",
    region: "Central Region",
    country: "Ghana",
    phone: "0248 971 993",
    whatsapp: "+233 248 971 993",
    instagram: "doughcastle",
    facebook: "https://www.facebook.com/doughcastle01/",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/doughcastle/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-021",
    slug: "perfect-cakes-gh",
    name: "Perfect Cakes GH",
    shortDescription:
      "Cape Coast baker doing anniversary and ceremonial cakes. Quiet online since early 2025.",
    description:
      "A Cape Coast baker covering anniversary and ceremonial cakes, with snacks, parfaits and pastries alongside, and a stated policy that payment validates an order. Their last posts were in January 2025, so check they are still taking orders before relying on them.",
    occasions: ["anniversary", "birthday", "wedding", "engagement", "graduation"],
    kinds: ["tiered-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: ["Delivery"],
    area: "cape-coast",
    city: "Cape Coast",
    region: "Central Region",
    country: "Ghana",
    phone: "+233 54 502 0701",
    phones: ["+233 54 502 0701", "0254 555 333"],
    whatsapp: "+233 54 502 0701",
    website: "https://linktr.ee/perfectcakesgh",
    instagram: "perfectcakesgh",
    depositNote: "Payment validates the order.",
    orderStatus: "unknown",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: [
      "https://www.instagram.com/perfectcakesgh/",
      "https://linktr.ee/perfectcakesgh",
    ],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-022",
    slug: "cakes-lounge-gh",
    name: "Cakes Lounge GH",
    shortDescription: "Small Cape Coast baker delivering to UCC.",
    description:
      "A small Cape Coast baker covering wedding, birthday and celebration cakes along with slices, loaves, pastries and desserts. They deliver, including to the University of Cape Coast.",
    occasions: ["wedding", "birthday", "graduation", "anniversary"],
    kinds: ["tiered-cake", "sheet-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: ["Delivery"],
    area: "cape-coast",
    city: "Cape Coast",
    region: "Central Region",
    country: "Ghana",
    deliversTo: ["cape-coast"],
    phone: "0546 545 585",
    whatsapp: "+233 546 545 585",
    instagram: "cakeslounge_gh",
    orderStatus: "taking-orders",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/cakeslounge_gh/"],
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-023",
    slug: "cake-fairy-ghana",
    name: "Cake Fairy Ghana",
    shortDescription: "Cape Coast home baker specialising in low-sugar cakes.",
    description:
      "A Cape Coast home baker whose stated speciality is soft, moist, low-sugar cakes, which is unusual enough in Ghana to be worth asking about. We have confirmed the business and its Facebook page, but have not yet verified a phone number, so none is published here.",
    occasions: ["birthday", "anniversary"],
    kinds: ["tiered-cake", "sheet-cake"],
    styles: [],
    flavours: [],
    dietary: ["sugar-free"],
    services: [],
    area: "cape-coast",
    city: "Cape Coast",
    region: "Central Region",
    country: "Ghana",
    facebook: "https://www.facebook.com/cakefairygh",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.facebook.com/cakefairygh"],
    updatedAt: "2026-10-03",
  },

  // ------------------------------------------------------------------ Tema
  {
    id: "ck-024",
    slug: "creme-russian-bakery",
    name: "Creme Russian Bakery",
    shortDescription:
      "Tema Community 25 and Spintex bakery offering same-day cakes and delivery.",
    description:
      "A bakery with branches in Tema Community 25 and Spintex, each on its own line. Birthday, wedding, anniversary and tiered cakes, plus mini cakes and cupcakes. Same-day orders, delivery and pickup are all available.",
    occasions: ["birthday", "kids-birthday", "wedding", "engagement", "anniversary", "baby-shower", "corporate"],
    kinds: ["tiered-cake", "bento-cake", "cupcakes"],
    styles: ["buttercream", "fondant"],
    flavours: ["chocolate"],
    dietary: [],
    services: ["Delivery", "Same-day orders"],
    area: "tema",
    city: "Tema",
    region: "Greater Accra",
    country: "Ghana",
    deliversTo: ["tema", "spintex", "teshie-nungua"],
    phone: "0202 579 092",
    phones: ["0202 579 092", "0503 365 147"],
    whatsapp: "+233 202 579 092",
    instagram: "creme_russian_bakery",
    leadTimeDays: 0,
    leadTimeNote: "Same-day orders available.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    // A "from GH₵65" figure circulates in search results for this bakery. It is
    // not on their own profile, so it is not published here.
    sourceUrls: ["https://www.instagram.com/creme_russian_bakery/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-025",
    slug: "creamy-bytes-tema",
    name: "Creamy Bytes",
    shortDescription: "Tema baker with an express line for fast turnaround.",
    description:
      "A Tema baker covering wedding cakes, round and plain cakes, cakes for all occasions, cake slices and pastries, with an express option for fast turnaround. They also run trainings.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "baby-shower", "graduation"],
    kinds: ["tiered-cake", "sheet-cake", "pastries"],
    styles: ["buttercream", "fondant"],
    flavours: [],
    dietary: [],
    services: ["Same-day orders"],
    area: "tema",
    city: "Tema",
    region: "Greater Accra",
    country: "Ghana",
    phone: "+233 26 970 5441",
    whatsapp: "+233 26 970 5441",
    instagram: "creamy_bytes",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/creamy_bytes/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },
  {
    id: "ck-026",
    slug: "cake-els-tema",
    name: "Cake Els",
    shortDescription: "Small Tema baker also serving Ashaiman.",
    description:
      "A small Tema baker doing freshly baked cakes and snacks, also serving Ashaiman.",
    occasions: ["birthday", "anniversary"],
    kinds: ["tiered-cake", "sheet-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "tema",
    city: "Tema",
    region: "Greater Accra",
    country: "Ghana",
    deliversTo: ["tema"],
    phone: "0543 382 225",
    whatsapp: "+233 543 382 225",
    instagram: "cake_els21",
    orderStatus: "taking-orders",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/cake_els21/"],
    updatedAt: "2026-10-03",
  },

  // -------------------------------------------------------------- Koforidua
  {
    id: "ck-027",
    slug: "henrima-catering-koforidua",
    name: "Henrima Catering Services and Training Center",
    shortDescription:
      "Bohye bakery and culinary academy, baking for weddings across the Eastern Region.",
    description:
      "A Koforidua bakery and culinary academy at Bohye, covering wedding, birthday, anniversary and baby shower cakes plus cupcakes and pastries, on 48 hours' notice for custom work. They bake for weddings across the Eastern Region and have trained over 300 students in twelve years.",
    occasions: ["wedding", "engagement", "birthday", "anniversary", "baby-shower", "naming-ceremony"],
    kinds: ["tiered-cake", "cupcakes", "pastries"],
    styles: ["buttercream", "fondant"],
    flavours: ["vanilla", "red-velvet", "chocolate"],
    dietary: [],
    services: ["Delivery"],
    address: "Bohye, Koforidua",
    area: "koforidua",
    city: "Koforidua",
    region: "Eastern Region",
    country: "Ghana",
    deliversTo: ["koforidua"],
    phone: "024 342 6423",
    whatsapp: "+233 24 342 6423",
    website: "https://henrimacakes.com/",
    facebook: "https://www.facebook.com/henrimacakes/",
    leadTimeDays: 2,
    leadTimeNote: "48 hours for custom cakes.",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: [
      "https://henrimacakes.com/",
      "https://www.facebook.com/henrimacakes/",
    ],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
    images: [
      {
        url: "https://henrimacakes.com/__l5e/assets-v1/908a0817-5ef5-45e2-b431-7e20e3fcc847/hero-wedding.jpeg",
        alt: "A wedding cake by Henrima Catering Services, Koforidua",
        credit: "Photo: Henrima Catering Services (official site)",
        sourceUrl: "https://henrimacakes.com/",
        ownWork: true,
      },
      {
        url: "https://henrimacakes.com/__l5e/assets-v1/c8fd7c44-77e2-4b42-bfc8-576a711fd3d8/cake-redvelvet-new.jpeg",
        alt: "A red velvet cake by Henrima Catering Services, Koforidua",
        credit: "Photo: Henrima Catering Services (official site)",
        sourceUrl: "https://henrimacakes.com/",
        ownWork: true,
      },
    ],
  },
  {
    id: "ck-028",
    slug: "priser-cakes",
    name: "Priser Cakes",
    shortDescription:
      "Koforidua baker doing fondant and sugarcraft work, also operating in Accra.",
    description:
      "A Koforidua baker, also operating in Accra, covering wedding, anniversary and bridal shower cakes along with pastries and bread. Strong on fondant work, sugarcraft and whipped-cream designs, with training offered online and on site. They publish no plain phone number; WhatsApp is the only channel.",
    occasions: ["wedding", "engagement", "anniversary", "bridal-shower", "birthday", "baby-shower"],
    kinds: ["tiered-cake", "sculpted-cake", "pastries"],
    styles: ["fondant", "sugar-flowers", "buttercream"],
    flavours: [],
    dietary: [],
    services: [],
    area: "koforidua",
    city: "Koforidua",
    region: "Eastern Region",
    country: "Ghana",
    whatsapp: "https://wa.me/message/4NMXEM4L54IWA1",
    instagram: "priser_cakes",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/priser_cakes/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  // ---------------------------------------------------------------------- Ho
  {
    id: "ck-029",
    slug: "riya-cakes-gh",
    name: "Riya Cakes GH",
    shortDescription: "The best-documented cake maker in Ho, covering six cake categories.",
    description:
      "A Ho baker covering birthday, wedding and children's cakes, cupcakes, loaf cakes, cake-in-a-cup and custom work, with pastries and desserts alongside. Training is offered on site, online and one to one.",
    occasions: ["birthday", "kids-birthday", "wedding", "engagement", "anniversary", "baby-shower", "graduation"],
    kinds: ["tiered-cake", "sculpted-cake", "bento-cake", "cupcakes", "sheet-cake"],
    styles: ["buttercream", "fondant"],
    flavours: [],
    dietary: [],
    services: [],
    area: "ho",
    city: "Ho",
    region: "Volta Region",
    country: "Ghana",
    whatsapp: "+233 24 990 7877",
    instagram: "riyacakesgh",
    orderStatus: "taking-orders",
    verification: "info-confirmed",
    claimed: false,
    sourceUrls: ["https://www.instagram.com/riyacakesgh/"],
    lastVerifiedAt: "2026-10-03",
    updatedAt: "2026-10-03",
  },

  // ----------------------------------------------------------------- Sunyani
  {
    id: "ck-030",
    slug: "vees-bakeshop-sunyani",
    name: "Vee's Bakeshop",
    shortDescription: "Sunyani cake and pastry shop.",
    description:
      "A Sunyani cake and pastry shop. We have confirmed the business and its Facebook page, but have not yet verified a phone number from the business itself, so none is published here. Sunyani is the thinnest city in this directory so far.",
    occasions: ["birthday", "anniversary"],
    kinds: ["tiered-cake", "pastries"],
    styles: [],
    flavours: [],
    dietary: [],
    services: [],
    area: "sunyani",
    city: "Sunyani",
    region: "Bono Region",
    country: "Ghana",
    facebook: "https://www.facebook.com/veesbakeshopsunyani/",
    orderStatus: "unknown",
    verification: "unverified",
    claimed: false,
    sourceUrls: ["https://www.facebook.com/veesbakeshopsunyani/"],
    updatedAt: "2026-10-03",
  },
];

export const VENDORS: Vendor[] = [...ACCRA_VENDORS, ...REGIONAL_VENDORS];

export function findVendor(slug: string): Vendor | undefined {
  return VENDORS.find((v) => v.slug === slug);
}

/**
 * Bakers relevant to an area: those based there, plus those who deliver there.
 *
 * A buyer wants the cake delivered, not a tour of the kitchen, so delivery
 * reach counts as presence. Based-here bakers sort first, because collection is
 * cheaper and because a local baker is easier to chase if something goes wrong.
 */
export function vendorsInArea(areaSlug: string): Vendor[] {
  const based = VENDORS.filter((v) => v.area === areaSlug);
  const delivers = VENDORS.filter(
    (v) => v.area !== areaSlug && v.deliversTo?.includes(areaSlug),
  );
  return [...sortForDisplay(based), ...sortForDisplay(delivers)];
}

/**
 * Areas that should get a page.
 *
 * An area with nothing to show gets no page — a directory of empty pages is
 * exactly the "crawled, not indexed" mistake we already paid for on EarlyDays.
 * Delivery counts, so an area with no baker based there but several delivering
 * into it still earns one.
 */
export function areasWithVendors(areaSlugs: string[]): string[] {
  return areaSlugs.filter((slug) => vendorsInArea(slug).length > 0);
}

export function vendorsForOccasion(occasion: Occasion): Vendor[] {
  return sortForDisplay(VENDORS.filter((v) => v.occasions.includes(occasion)));
}

export function vendorsForKind(kind: CakeKind): Vendor[] {
  return sortForDisplay(VENDORS.filter((v) => v.kinds.includes(kind)));
}

/**
 * Display order.
 *
 * Featured first, then verified, then by how complete and checkable the profile
 * is. Note what this deliberately does *not* do: rotate randomly the way
 * Hitched does. Rotation exists to make a paid position worth buying, which
 * means showing a worse baker above a better one. We sell position only once we
 * have enough traffic that the top slot is genuinely scarce, and even then the
 * ordering stays explainable to a buyer.
 */
export function sortForDisplay(list: Vendor[]): Vendor[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const av = a.verification === "verified" ? 1 : 0;
    const bv = b.verification === "verified" ? 1 : 0;
    if (av !== bv) return bv - av;
    return completeness(b) - completeness(a);
  });
}

/**
 * Cheap proxy for how useful a profile is to a buyer right now.
 *
 * A published price grid with servings outranks everything except a verified
 * contact, because those two are the things no competing Ghanaian directory
 * carries at all, and the two the documented complaints turn on: prepaying a
 * number that turns out not to be the baker, and a cake that serves a quarter
 * of what was expected.
 */
function completeness(v: Vendor): number {
  let n = 0;
  if (v.contactVerifiedAt) n += 5;
  if (v.priceList?.some((r) => r.servesFrom)) n += 5;
  else if (v.priceList?.length) n += 3;
  else if (v.priceFrom) n += 2;
  if (v.images?.some((i) => i.ownWork)) n += 4;
  else if (v.images?.length) n += 2;
  if (v.leadTimeDays !== undefined) n += 2;
  if (v.whatsapp) n += 2;
  if (v.deliversTo?.length) n += 2;
  if (v.depositNote) n += 1;
  if (v.website) n += 1;
  if (v.instagram) n += 1;
  return n;
}

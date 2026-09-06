import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    slug: "creches",
    singular: "Creche & Daycare",
    plural: "Creches & Daycare",
    listingType: "creche",
    short: "For babies and toddlers, all day.",
    blurb:
      "Creches and daycares in Ghana that care for babies and young toddlers during the working day.",
    accent: "coral",
  },
  {
    slug: "preschools",
    singular: "Preschool",
    plural: "Preschools",
    listingType: "preschool",
    short: "Early learning for 2 to 5 year olds.",
    blurb:
      "Preschools and nurseries preparing young children for the transition into KG and primary school.",
    accent: "sky",
  },
  {
    slug: "kindergartens",
    singular: "Kindergarten",
    plural: "Kindergartens",
    listingType: "kindergarten",
    short: "Structured KG for the year before primary.",
    blurb:
      "Kindergartens in Ghana serving children in the year or two before primary school.",
    accent: "sun",
  },
  {
    slug: "primary-schools",
    singular: "Primary School",
    plural: "Primary Schools",
    listingType: "primary",
    short: "Primary school from Class 1 upwards.",
    blurb:
      "Primary schools across Ghana following GES, British, EYFS, Montessori or international pathways.",
    accent: "leaf",
  },
  {
    slug: "montessori-schools",
    singular: "Montessori School",
    plural: "Montessori Schools",
    listingType: "montessori",
    short: "Montessori-led early years and primary.",
    blurb:
      "Montessori schools and Montessori-influenced programmes that follow child-led, prepared-environment principles.",
    accent: "blossom",
  },
  {
    slug: "learning-centres",
    singular: "Learning Centre",
    plural: "Learning Centres",
    listingType: "learning-centre",
    short: "After-school and enrichment learning.",
    blurb:
      "Children's learning centres offering after-school tutoring, enrichment, and holiday programmes.",
    accent: "sky",
  },
  {
    slug: "french-classes-for-kids",
    singular: "French Class",
    plural: "French Classes for Kids",
    listingType: "language-centre",
    short: "French language for children.",
    blurb:
      "Places where children in Ghana can learn French through structured classes and immersion programmes.",
    accent: "coral",
  },
  {
    slug: "stem-and-coding",
    singular: "STEM & Coding",
    plural: "STEM & Coding for Kids",
    listingType: "stem",
    short: "Robotics, coding, science and maths clubs.",
    blurb:
      "STEM, coding, robotics and maths programmes for children — after school, weekends and holidays.",
    accent: "leaf",
  },
  {
    slug: "activity-centres",
    singular: "Activity Centre",
    plural: "Activity Centres",
    listingType: "activity-centre",
    short: "Music, art, dance and sport for kids.",
    blurb:
      "Children's activity centres for music, art, dance and sport across Ghana.",
    accent: "sun",
  },
];

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findCategoryByType(type: string) {
  return CATEGORIES.find((c) => c.listingType === type);
}

export interface Guide {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  updatedAt: string;
  readingMinutes: number;
  body: { heading?: string; paragraphs: string[] }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-choose-a-creche-in-accra",
    title: "How to choose a creche in Accra",
    dek: "A calm, practical checklist for parents visiting daycares for the first time.",
    tag: "Starting out",
    updatedAt: "2026-09-01",
    readingMinutes: 6,
    body: [
      {
        paragraphs: [
          "Choosing a creche in Accra can feel overwhelming. Every parent wants the same thing — a place where their child is safe, cared for, and gently stretched — but the difference between two centres on the same road can be enormous.",
          "This guide is a short, calm checklist you can take with you on visits. It won't tell you which creche is best. It will help you notice the things that matter and ask the questions that get straight answers.",
        ],
      },
      {
        heading: "Before you visit",
        paragraphs: [
          "Make a shortlist of two or three places. Look at the location, the age range they serve, and the hours they offer. If the school hasn't published fees, plan to ask on the visit rather than guessing from another school's rates.",
        ],
      },
      {
        heading: "On the visit — what to look for",
        paragraphs: [
          "Watch the caregivers. Are they down at the children's eye level? Are they warm and attentive, or distracted?",
          "Notice the space. Is there room for both quiet play and movement? Are the toys age-appropriate? Is there safe outdoor space?",
          "Check the staff-to-child ratio. Small creches sometimes stretch thin at drop-off and pick-up times.",
          "Ask about routines — meals, naps, nappy changes, health emergencies — and how they communicate with parents through the day.",
        ],
      },
      {
        heading: "Questions to ask",
        paragraphs: [
          "What is the daily rhythm for a child my age?",
          "How do you settle a new child into the group?",
          "What happens if my child is unwell?",
          "How do you handle food, allergies and rest?",
          "Can I speak to a current parent?",
        ],
      },
      {
        heading: "After the visit",
        paragraphs: [
          "Give yourself 24 hours before deciding. If the school's response to your enquiry was warm, prompt and honest — that's a strong signal in itself.",
        ],
      },
    ],
  },
  {
    slug: "montessori-vs-eyfs",
    title: "Montessori vs EYFS — what's the difference?",
    dek: "A plain-English comparison of two of the most common early years approaches you'll find in Ghana.",
    tag: "Curriculum",
    updatedAt: "2026-08-20",
    readingMinutes: 5,
    body: [
      {
        paragraphs: [
          "Two of the most common early years approaches you'll see on Ghanaian school profiles are Montessori and EYFS. Both are respected. They just come from different traditions and value different things.",
        ],
      },
      {
        heading: "Montessori in a nutshell",
        paragraphs: [
          "Montessori is a child-led approach developed by Maria Montessori. Classrooms are 'prepared environments' with specific hands-on materials. Children choose their own work from what's on offer, and teachers observe and guide rather than instruct from the front.",
          "Look for: mixed-age groups, wooden materials, long uninterrupted work periods, emphasis on independence.",
        ],
      },
      {
        heading: "EYFS in a nutshell",
        paragraphs: [
          "EYFS — the Early Years Foundation Stage — is a framework used in the UK for children from birth to five, structured around seven areas of learning. Play is central, but there's more explicit adult-led planning than in Montessori.",
          "Look for: play-based learning tied to specific outcomes, regular assessment against 'early learning goals', a balance of adult-led and child-led activities.",
        ],
      },
      {
        heading: "Which is 'better'?",
        paragraphs: [
          "Neither. The right answer is usually about the individual school — the leadership, the teachers, the space, the culture — more than the label. Many Ghanaian schools blend both approaches, so ask what they actually do in a typical week rather than which label they use.",
        ],
      },
    ],
  },
  {
    slug: "questions-to-ask-before-enrolling",
    title: "Questions to ask before enrolling your child",
    dek: "A pocket checklist for parents visiting schools — creche, preschool, or primary.",
    tag: "Visits",
    updatedAt: "2026-08-14",
    readingMinutes: 4,
    body: [
      {
        paragraphs: [
          "Print or screenshot this list before your next school visit. The best schools will welcome every one of these questions.",
        ],
      },
      {
        heading: "About the school",
        paragraphs: [
          "How long has the school been operating?",
          "How many children are in each class or group?",
          "What is your staff turnover like?",
          "Are you registered with the Ghana Education Service or another authority?",
        ],
      },
      {
        heading: "About the day",
        paragraphs: [
          "Can you walk me through a typical day?",
          "How do you handle mealtimes and rest?",
          "How much outdoor time do children get?",
          "What does 'settling in' look like for a new child?",
        ],
      },
      {
        heading: "About learning",
        paragraphs: [
          "What approach or curriculum do you follow — and what does that look like in practice?",
          "How do you know each child is progressing?",
          "How do you communicate with parents?",
        ],
      },
      {
        heading: "About the practicalities",
        paragraphs: [
          "What are the fees, and what do they include?",
          "What is the admissions process and timeline?",
          "Is there transport? Meals? After-care?",
        ],
      },
    ],
  },
  {
    slug: "preschool-vs-kg-when-to-start",
    title: "Preschool vs KG — when should my child start?",
    dek: "A short parent guide to the difference between preschool and KG in the Ghanaian context.",
    tag: "Starting out",
    updatedAt: "2026-08-08",
    readingMinutes: 4,
    body: [
      {
        paragraphs: [
          "In Ghana, 'preschool' typically covers the years before KG (kindergarten). It's a broad term — some schools use nursery, some use preschool, some use both. KG usually refers to the year or two immediately before Class 1.",
        ],
      },
      {
        heading: "What preschool looks like",
        paragraphs: [
          "Preschool is play-based. The focus is on social skills, language, motor development, and getting used to being in a group. Structured 'lessons' are usually short and hands-on.",
        ],
      },
      {
        heading: "What KG looks like",
        paragraphs: [
          "KG introduces more structure. Children start to work with letters and numbers, follow a timetable, and prepare for the transition into primary school. It's still play-rich in good settings — but the day looks more like school.",
        ],
      },
      {
        heading: "When to start",
        paragraphs: [
          "There's no single right age. Readiness is a mix of your child's personality, your family's routine, and the setting on offer. If a school pressures you to enrol before you're ready, that's worth noticing.",
        ],
      },
    ],
  },
];

export function findGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

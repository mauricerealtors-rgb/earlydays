# EarlyDays — content brief for ChatGPT

Give ChatGPT this brief plus one article slug from the backlog and it will produce a publishable guide ready for `data/guides.ts`.

---

## 1. Who we are (paste this at the top of every prompt)

EarlyDays (**earlydays.cc**) is Ghana's honest school directory for parents finding creches, preschools, kindergartens, primaries, Montessori schools, learning centres, French classes, STEM/coding programmes and children's activity centres. We focus on Accra first, then Kumasi and Takoradi.

Our whole positioning is **calm, honest, parent-first**. We never invent fees, phone numbers, curricula or admissions windows. If a school hasn't published something, we say so. Parents come to us because directories are usually pay-to-play — we aren't.

We're one week old, ranking on page 1 for `preschool accra adjiringanor`, and pushing to overtake individual school homepages via depth and honesty rather than link-building tricks.

---

## 2. Voice and style rules

- **British–Ghanaian English.** Not American. "Programme" not "program". "Enrol" not "enroll". "Neighbourhood" not "neighborhood". "Nappy" not "diaper". Ghana Cedi symbol: GH₵.
- **Tone: calm, warm, parent-to-parent.** Like the friend who's been through it. Never salesy, never breathless, never "top 10!!!" — that language kills our brand.
- **Short sentences. Zero fluff.** No "In today's fast-paced world" openers. Start with the parent's question, then answer it.
- **Honest by default.** If we don't know, say we don't know. "Fees vary. Ask on your visit." beats a fake number.
- **No emojis in body copy.** Chip labels and small UI accents may use them; article prose does not.
- **Never fabricate school-specific facts.** You may name schools already in our directory (list below) and describe categories/curricula generally, but do not attribute specific fees, ratios or policies to a named school unless the brief says "verified".

---

## 3. Article structure

Every article follows this shape (matches `data/guides.ts` schema — see §7):

1. **Dek** — one sentence, 12–18 words, tells the parent what they'll get out of it.
2. **Opening block** — 2–3 short paragraphs, no heading. Names the problem, promises the answer, sets a calm tone.
3. **3–6 body sections**, each with an H2-style heading and 1–4 short paragraphs. Use bulleted lists sparingly (only if it genuinely reads as a list).
4. **"On EarlyDays" section** — one short section near the end that surfaces 3–5 internal links (see §5) using natural sentences, not a raw list.
5. **Closing block** — 1 paragraph. What to do next. Prompt to visit a school in person, browse a category page, or read a related guide.

**Length by article type:**
- Comparison / explainer guides: 700–1,100 words
- Cost / fees / practical guides: 900–1,400 words (higher intent → more depth wins)
- "Best of" / listicle-style: 800–1,200 words, but each entry must include something honest and useful
- Timeline / checklist guides: 600–900 words

Reading time (`readingMinutes` field): calculate as `Math.max(3, Math.round(wordCount / 220))`.

---

## 4. SEO rules

- **Primary keyword** appears in the H1 (title), first paragraph, one H2, and the last paragraph. Don't force it more than that.
- **Secondary keywords** (2–3 per article, listed per backlog item below) sprinkled naturally across H2s.
- **First 100 words must answer the query.** Google's featured snippets are pulled from the top of the page.
- **One numeric or list-based fact in the first 200 words** — e.g., "Preschool fees in Accra typically span GH₵1,500 to GH₵15,000 per term." Featured-snippet bait.
- **No keyword stuffing.** If it reads unnaturally to a parent, remove it.
- **Meta description** (dek field): 140–160 chars, promises the answer, contains the primary keyword.
- **No "As of 2026" or "In 2026"** unless the article is genuinely time-bound (e.g., fees, admissions). Evergreen articles should read timeless.

---

## 5. Internal linking — the whole point

Every article MUST include **3–6 internal links** pointing back into the EarlyDays site. Links keep users on the platform (Google interprets long dwell time + multi-page sessions as topical authority).

**Link map — use these URLs in the "On EarlyDays" section and inline where natural:**

| Anchor phrase | URL |
|---|---|
| Preschools in East Legon | `/preschools/accra/east-legon` |
| Preschools in Adjiringanor | `/preschools/accra/adjiringanor` |
| Creches in East Legon Hills | `/creches/accra/east-legon-hills` |
| Montessori schools in East Legon | `/montessori-schools/accra/east-legon` |
| Primary schools in East Airport | `/primary-schools/accra/east-airport` |
| Preschools in Adenta | `/preschools/accra/adenta` |
| French classes in Central Accra | `/french-classes-for-kids/accra/accra-central` |
| All preschools in Ghana | `/preschools` |
| All creches in Ghana | `/creches` |
| All Montessori schools | `/montessori-schools` |
| All kindergartens | `/kindergartens` |
| All primary schools | `/primary-schools` |
| Schools in Greater Accra | `/schools/accra` |
| How to choose a creche in Accra | `/guides/how-to-choose-a-creche-in-accra` |
| Montessori vs EYFS | `/guides/montessori-vs-eyfs` |
| Questions to ask before enrolling | `/guides/questions-to-ask-before-enrolling` |
| Preschool vs KG — when to start | `/guides/preschool-vs-kg-when-to-start` |

**Rule of thumb per article:**
- 1 link to a **category-only page** (e.g., `/preschools`)
- 2 links to **combo pages** (category + area) that match the article's angle
- 1–2 links to **other guides** in a "you might also like" tone

Never link with generic anchors like "click here" or "learn more" — always use a descriptive phrase that matches the destination page's H1.

---

## 6. Do's and Don'ts

**Do:**
- Name real Ghanaian curricula: **Ghana Education Service (GES)**, **Cambridge**, **British / UK National Curriculum**, **International Baccalaureate (IB)**, **Montessori**, **EYFS**, **Reggio Emilia**, **Bilingual (French–English)**, **Play-based**.
- Reference real practicalities: three-term Ghanaian academic year (Jan / May / Sep starts), traffic on Spintex or Boundary Road, safety at pick-up, staff-to-child ratio, meal setup, nap rhythm.
- Use approximate ranges where useful ("typically GH₵1,500 to GH₵15,000 per term") but always flag them as approximate.
- Assume the reader is a working parent in Accra — smart, time-poor, deciding.

**Don't:**
- Invent school-specific facts. No "Bright Kids Academy charges GH₵4,500" unless we've verified it.
- Cite statistics without a source we can point to.
- Write for the algorithm. Write for a parent who's opening 6 tabs at midnight.
- Use "!" in headings. Use "!" at most once in the body, ever.
- Compare schools by name in a way that ranks one above another — we're a directory, not a reviewer.
- Recommend a specific school. Recommend categories and areas.

---

## 7. Output format

Return the article as a **single JSON object** matching the `Guide` type below, so it drops straight into `data/guides.ts`:

```typescript
{
  slug: "kebab-case-slug",
  title: "The article title",
  dek: "One-sentence promise, 140–160 chars, contains primary keyword.",
  tag: "Cost" | "Curriculum" | "Starting out" | "Visits" | "Admissions" | "Areas",
  updatedAt: "YYYY-MM-DD",
  readingMinutes: number,
  body: [
    { paragraphs: ["Opening para 1", "Opening para 2"] },
    { heading: "First H2", paragraphs: ["…", "…"] },
    { heading: "Second H2", paragraphs: ["…"] },
    // … 3–6 sections total …
    { heading: "On EarlyDays", paragraphs: ["Include 3–5 internal links written into natural prose. Wrap link text in [square brackets](/the/url) format so we can convert it easily."] },
    { paragraphs: ["Closing paragraph — what to do next."] }
  ]
}
```

Return **only** the JSON object. No preamble. No "Here's the article:". No trailing commentary.

---

## 8. The backlog — 20 articles, ranked by ROI

Each row is one prompt to ChatGPT. Format:  
`# — TITLE — primary keyword — secondary keywords — target combo/category to link — angle`

**Tier 1 — highest-intent commercial queries (do first):**

1. **How much does preschool cost in Accra? A 2026 parent guide** — `preschool fees accra` — `preschool cost ghana, how much is preschool in accra, private preschool fees` — link `/preschools/accra/east-legon`, `/preschools/accra/adjiringanor`, `/preschools` — Range-based cost breakdown by tier (community, mid-market, international), what fees include/exclude, questions to ask about hidden fees.

2. **When to enrol your child in preschool in Accra — the admissions timeline** — `preschool admissions accra` — `when to apply preschool ghana, preschool intake ghana, preschool waitlist` — link `/preschools`, `/preschools/accra/east-legon`, `/guides/questions-to-ask-before-enrolling` — Month-by-month timeline for Jan/May/Sep starts.

3. **The best neighbourhoods in Accra for young families (and their schools)** — `best areas accra young families` — `where to live accra with kids, family neighbourhoods accra, accra school catchments` — link `/schools/accra`, `/preschools/accra/east-legon`, `/preschools/accra/adjiringanor` — Compare 6–8 areas on schools, traffic, safety, cost.

4. **Preschools that offer school transport in East Legon and around** — `preschool transport east legon` — `school bus east legon, preschool pickup accra` — link `/preschools/accra/east-legon`, `/preschools/accra/east-legon-hills`, `/preschools/accra/adjiringanor` — Explains how transport works, questions to ask, why some don't offer it.

5. **Full-day vs half-day preschool — which works for a working parent in Accra** — `full day preschool accra` — `half day preschool ghana, working parent childcare accra` — link `/creches`, `/preschools`, `/guides/how-to-choose-a-creche-in-accra` — Trade-offs, ages this matters most for.

**Tier 2 — comparison / evaluation queries (build authority):**

6. **Ghana Education Service vs Cambridge vs EYFS — which is right for my child?** — `ges vs cambridge` — `cambridge curriculum ghana, eyfs ghana, ghana education service explained` — link `/preschools`, `/primary-schools`, `/guides/montessori-vs-eyfs` — Plain-English breakdown of each, what to notice on a visit.

7. **Public vs private preschool in Ghana — cost, quality, and the honest trade-offs** — `public vs private preschool ghana` — `government preschool ghana, private nursery accra` — link `/preschools`, `/primary-schools/accra/east-airport` — Not black and white, when public works, when private is worth it.

8. **Home-based creche vs large daycare centre — pros and cons** — `home creche accra` — `small daycare vs big daycare, family daycare ghana` — link `/creches`, `/creches/accra/east-legon-hills` — Who each suits, what to check.

9. **Montessori in Ghana — what it really looks like on a visit** — `montessori school accra` — `montessori ghana, montessori vs traditional preschool` — link `/montessori-schools`, `/montessori-schools/accra/east-legon`, `/guides/montessori-vs-eyfs` — Real materials, mixed-age classrooms, teacher role.

10. **Bilingual (French–English) schools in Accra — options and what to expect** — `french schools accra` — `bilingual preschool ghana, french classes for kids accra` — link `/french-classes-for-kids`, `/french-classes-for-kids/accra/accra-central` — Immersion vs classes, who benefits.

**Tier 3 — starting-out / evergreen queries (steady traffic):**

11. **The best age to start creche in Ghana — a calm parent guide** — `when to start creche ghana` — `best age for daycare, when to send baby to daycare accra` — link `/creches`, `/creches/accra/east-legon-hills`, `/guides/preschool-vs-kg-when-to-start` — Developmental readiness, not a magic number.

12. **Signs of a quality daycare in Accra — the 12 things good ones get right** — `quality daycare accra` — `good creche ghana, safe daycare accra` — link `/creches`, `/guides/how-to-choose-a-creche-in-accra` — Check-off list you can take on visits.

13. **Red flags on a school visit — what to walk away from** — `school visit red flags` — `bad daycare signs, school warning signs ghana` — link `/guides/questions-to-ask-before-enrolling`, `/preschools`, `/creches` — Honest and specific.

14. **A typical day at a Ghanaian preschool — hour by hour** — `preschool daily routine ghana` — `preschool schedule accra, day in the life preschool` — link `/preschools`, `/guides/how-to-choose-a-creche-in-accra` — Sets expectations for first-time parents.

15. **What is Ghana's KG system? Explained for parents** — `ghana kg system` — `kindergarten ghana, kg ghana education service` — link `/kindergartens`, `/primary-schools`, `/guides/preschool-vs-kg-when-to-start` — What KG1/KG2 are, how they feed into Class 1.

**Tier 4 — long-tail location + intent (win specific niches):**

16. **STEM and coding classes for kids in Accra — what's available** — `coding classes kids accra` — `stem ghana kids, robotics for children accra` — link `/stem-and-coding`, `/learning-centres` — Overview of after-school and weekend options.

17. **Holiday programmes for kids in Accra — planning ahead** — `holiday programmes kids accra` — `school holiday activities ghana, kids camp accra` — link `/activity-centres`, `/learning-centres`, `/stem-and-coding` — By interest (sports, art, coding, French).

18. **Moving to Accra with young children — the schools-first checklist** — `moving to accra with kids` — `expat schools accra, relocating to ghana schools` — link `/schools/accra`, `/preschools`, `/primary-schools` — For families relocating internally or internationally.

19. **Preschool vs nursery in Ghana — is there a real difference?** — `preschool vs nursery ghana` — `nursery school accra, difference nursery preschool` — link `/preschools`, `/creches`, `/guides/preschool-vs-kg-when-to-start` — Terminology clarified.

20. **The Ghanaian school year explained — terms, holidays, key dates** — `ghana school year` — `ghana academic calendar, school term dates ghana` — link `/schools/accra`, `/preschools`, `/kindergartens` — Three-term system, roughly when each starts and ends.

---

## 9. Workflow

For each article:
1. Copy §1–§7 of this brief into a fresh ChatGPT chat.
2. Paste the single article row from §8.
3. ChatGPT returns one JSON object.
4. Send it back to Claude in this repo; Claude will drop it into `data/guides.ts`, verify the internal links resolve, and adjust `readingMinutes`.

---

## 10. Quality bar — Claude will reject an article if any of the following fails

- Under 600 words for a Tier 1 or 2 article.
- No internal links, or fewer than 3.
- Any invented school-specific fact.
- Reads like a listicle or SEO farm.
- Uses American English.
- Missing the JSON structure in §7.
- Meta dek not between 140–160 chars OR doesn't contain primary keyword.

---

_Last updated: 11 September 2026._

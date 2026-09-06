# EarlyDays

Parent-first discovery platform for children's schools, learning centres and
activities in Ghana — creches, preschools, KG, primary, Montessori,
language centres, STEM and more.

Built to feel like _"a search engine for finding the right place for my
child"_, with SEO / AEO / GEO baked in from day one.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4**
- **Firebase** (Auth, Firestore, Storage — client SDK wired via env vars)
- **Vercel** for hosting

> Build uses webpack (`next build --webpack`) because Tailwind v4's oxide
> scanner currently mismatches the Turbopack-bundled version in Next 16.3.x.

## Getting started

```bash
npm install
cp .env.example .env.local  # then paste your Firebase config
npm run dev
```

Open http://localhost:3000

## Environment variables

Copy `.env.example` → `.env.local` and fill in. The Firebase config is
public (safe to expose in the browser bundle) — security is enforced by
Firebase Security Rules.

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL — used for sitemap, JSON-LD, OG tags |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `project-id.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `project-id.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Numeric sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app ID |

## Project structure

```
app/                    # Next.js App Router routes
  page.tsx              # Homepage
  schools/              # /schools, /schools/[slug], /schools/[slug]/[area]
  [category]/           # /preschools, /preschools/accra/east-legon, etc.
  guides/               # Editorial content
  sitemap.ts            # Dynamic XML sitemap
  robots.ts             # AI-crawler-friendly robots policy
  manifest.ts           # PWA manifest
components/             # Design-system components
data/                   # Seed data (categories, locations, listings, guides)
lib/
  types.ts              # Shared TS types (Listing, Location, Category…)
  query.ts              # In-memory query helpers
  firebase.ts           # Firebase client factories (app, firestore, auth, storage)
  site.ts               # Site-wide constants
```

## Data honesty

Per the product contract, EarlyDays never fabricates:
- fees
- phone numbers
- curriculum
- opening hours
- accreditation
- reviews

Every listing carries a verification state
(`unverified` → `info-confirmed` → `claimed` → `verified`) and a
`Last updated` date. Where information is unknown we show
**"Not published"** — never a guess.

## Deploying to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add the env vars from `.env.example` in the Vercel dashboard.
5. Deploy.

`vercel.json` pins the build command to `next build --webpack`.

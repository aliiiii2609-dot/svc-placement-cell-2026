# The Placement Cell, Sri Venkateswara College, University of Delhi

A real, deployable, multi-file web project for the SVC Placement Cell.

This is the production codebase. It is a Vite + React 18 + TypeScript SPA, deployable to Vercel in one click. Every animation, form, route, and data view is wired with real working code. The data files are populated from the cell's own brochure and 2026-27 team roster. The TypeScript type system enforces the cell's confidentiality rules so a future content editor cannot break them by accident.



## Performance

The home page ships **131 kB gzipped of JavaScript**, down from 754 kB.
Everything below the hero is both code-split and mount-deferred until the
visitor scrolls near it. See `docs/restructure.md` for the measurements
and the reasoning behind each change.

Two rules for keeping it that way:

1. **Never add a static import to `HomePage.tsx`** for a section below the
   fold. Use `lazyWithRetry` + `<DeferLazy>` like every other section there.
2. **Run `npm run build` and read the chunk table before merging.** If the
   eager `index-*.js` chunk grew, something below the fold leaked onto the
   critical path.

## What's new in this version

- **Light editorial theme**, warm cream/ivory palette throughout (no dark mode)
- **Council & Coordinators** rendered as small circular avatars orbiting the SVC crest, with hover-pause and name tooltip
- **Parents** page and audience card removed (now 3 audience cards: recruiters, students, alumni)
- **No exaggerated counts** anywhere ("58 volunteers", "39 coordinators", "8 steps" framing all dropped)
- **More world-class animations**: scroll-linked parallax in the hero, 3D letter cascade on titles, scroll-driven SVG path drawing on the process roadmap, ambient gold cursor aura, orbital council ring with counter-rotated avatars, 3D-perspective flip cards on team, refined entrance choreography across every section
- **All placeholder SVGs regenerated** for the light theme

## What ships out of the box

- **All component code working end to end**, no stubs, no TODOs in component logic
- **All data files populated** with verified content (team, council, coordinators, FAQ, partners, sectors, stats, testimonials, notable alumni, events, news, resources, rankings, process)
- **The real SVC crest** at `public/logos/svc-crest.png`
- **Every recruiter, business school, and ranking authority logo** as a clearly labelled placeholder ready to be replaced
- **Cinematic loader, 2D-canvas particle fields, Framer Motion page transitions, split-flap counters, custom cursor, smooth scrolling via Lenis, sound design layer behind a footer toggle**, all functional
- **Three forms** (recruiter interest, alumni registration, student feedback) with react-hook-form, zod validation, localStorage draft persistence, and mailto payload generation
- **20 routes**, all code-split, including admin console scaffold, recruiter dashboard, CV review queue, mock-interview booking, events calendar, news feed, resources, alumni directory and detail, FAQ, partnerships, rankings & press, privacy, terms, 404
- **Reduced-motion fallback** that respects `prefers-reduced-motion` and an in-app toggle
- **Confidentiality rules baked into the type system** so a Recruiter literally cannot hold a CTC field, a PlacementStats is aggregate-only, and a NotableAlumnus cannot hold an SVC-era placement record
- **Vercel config** for one-click deploy

## Quick start

```bash
# Node 18+ required. Verify:
node --version

# Install
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Type-check
npm run typecheck
```

## Deploy to Vercel

Option A. **GitHub link.** Push this repo to GitHub. In Vercel, "Add New… → Project", import the repo. The included `vercel.json` handles the build command, the SPA rewrite, and headers.

Option B. **CLI.** Run `npm run build`, then `npx vercel --prod`.

DNS, SSL, and global edge caching are handled by Vercel. `vercel.json` declares immutable cache headers for `/assets`, daily caching for `/logos` and `/images`, SPA rewrites so deep links work, and baseline security headers. (`netlify.toml` is retained only as a fallback host config; Vercel ignores it.)

## Asset sourcing: what the cell must do before public launch

The site is functional and beautiful with placeholders. As the cell sources real assets, the project upgrades automatically without any code changes. See `docs/asset-checklist.md` for the full checklist.

### Real recruiter logos

Each recruiter's logo lives at `public/logos/recruiters/{slug}.svg`. The slug matches `src/lib/data/partners.ts`. Today each file is a clearly-labelled gray-and-color placeholder. Replace each one with the official press-kit asset.

**Sourcing path:**
1. PR & Outreach visits the recruiter's official press kit, brand guidelines, or media resources page, typically at `[company-domain]/about/press`, `[company-domain]/brand`, or `[company-domain]/media`.
2. If the press kit is not public, email the recruiter's marketing or campus relations contact and request the official logo for inclusion on the placement cell website.
3. Save the downloaded file at `public/logos/recruiters/{slug}.svg` (or .png if SVG is unavailable). The file name must match the slug exactly.
4. Record the source in `docs/logo-sourcing-log.md` (company name, date sourced, source URL, license terms, contact who approved).
5. Never use search-result logos, third-party aggregators, or social-media profiles. The downloaded file must come from the brand's own controlled channel.

### Ranking authority badges

Badges live at `public/logos/rankings/{nirf,naac,outlook,india-today}.svg`. Today these are labelled placeholders. The cell can freely state "Ranked 11 by NIRF, 2024" as factual text, but displaying the official badge or seal is permission-gated.

**Sourcing path:**
- Write to NIRF (Ministry of Education, GoI), NAAC (UGC), Outlook Group, and India Today Group. Request permission to display the official mark in the context of the institutional ranking achievement. These bodies routinely grant it to ranked institutions. Replace each placeholder once written permission and the asset are received.

### Business school logos for alumni qualifications

Slots live at `public/logos/schools/{slug}.svg`. The slugs match `src/lib/data/notable-alumni.ts`. Each business school maintains a press kit and brand guidelines page. Editorial sources the official logo from each school's brand resources when an alumnus from that school is added to the directory. The qualifications timeline renders the school name in serif italic until then.

### Team and convener portraits

Slots live at `public/images/team/{firstname-lastname}.svg` and `public/images/convener/abhishek-malhotra.svg`. The Documentation department drops the real portrait (consented, 4:5 crop, 800px wide JPEG, quality 82) at the same path with a `.jpg` extension and the components pick it up if you update the `photoPath` in `src/lib/data/team.ts`.

### Campus, event, and gallery photographs

Slots live at `public/images/campus/`, `public/images/events/`, `public/images/gallery/`. Documentation replaces each placeholder with a real archive image (date, event, photographer credit).

### Alumni portraits via the consent pipeline

Self-published alumni are added through the registration form, verified by Documentation, and only then published. Real portraits are uploaded to `public/images/alumni/{slug}.jpg`. The qualifications timeline picks up the institution logo automatically.

### Sound design assets

Audio files live at `public/audio/`. The path and ids are documented in `public/audio/README.md`. Source royalty-cleared assets and drop them in. The site runs silently until then.

## How to add a recruiter, an event, a news post

Open the relevant data file:

- **Recruiter:** `src/lib/data/partners.ts`. Add an entry with `slug`, `name`, `sector`. Drop the logo at `public/logos/recruiters/{slug}.svg`. Done.
- **Event:** `src/lib/data/events.ts`. Add an entry with `id`, `title`, `date`, `category`, `description`, `rsvpOpen`.
- **News:** `src/lib/data/news.ts`.
- **Resource:** `src/lib/data/resources.ts`.
- **Notable alumnus:** `src/lib/data/notable-alumni.ts`. Confidentiality fields (svcPlacementCompany, svcPlacementCtc) do not exist on the type, by design.

## Confidentiality

The cell's three rules:
1. No student name is paired with a recruiting company on this site.
2. No CTC value is paired with a named recruiter.
3. No SVC-era placement record is paired with a named alumnus.

These rules are enforced in the TypeScript type system at `src/types/index.ts`. A `Recruiter` cannot hold a `ctc` field. A `PlacementStats` is aggregate-only and cannot hold per-firm breakdowns. A `NotableAlumnus` cannot hold an `svcPlacementCompany` field. If a future content editor attempts to add these, the build fails.

`StudentTestimonial` is the newest and highest-risk of these, because the
natural thing a contributor writes is "Priya Sharma, placed at Deloitte",
which breaks rules 1 and 2 in a single line. It therefore carries explicit
`never` fields for `company`, `employer`, `ctc`, `studentName` and
`displayName`. This is stronger than relying on TypeScript's excess-property
check, which only fires on object literals and silently passes anything built
through a variable or a spread. Verified: adding `company` to an entry in
`src/lib/data/student-testimonials.ts` fails `npm run typecheck`.

### A note on published quotes

Every quote on this site must be traceable to a real person who said it and
consented to its publication. `src/lib/data/student-testimonials.ts` gates
this with a `consented` flag, and only `publishableStudentTestimonials` is
ever rendered. Do not seed that file with sample copy: an unconsented quote
that ships is worse than an empty section, and the section has a designed
empty state precisely so that shipping nothing is a real option.

## Reduced motion

Press the "Reduced motion" button in the footer or set `prefers-reduced-motion: reduce` at OS level. The site disables the particle field, the cinematic loader's choreography, GSAP timelines, Lenis smooth scrolling, the magnetic cursor, and Framer Motion entrance animations. Layout, content, and forms all remain fully functional. The reduced-motion variant is tested as a first-class state, not a fallback.

## Admin console

`/admin` is gated behind an access-code prompt (any 4+ character code unlocks in MVP). The console scaffolds: alumni verification queue, active drive count, CV review queue link, and an integration scope note. Production wires real coordinator auth via magic-link or SSO before this page becomes operational.

## Tech stack

- **Build:** Vite 5
- **Framework:** React 18 + TypeScript 5.6 (strict mode)
- **Routing:** React Router 6
- **Styling:** Tailwind CSS 3.4 with a custom token system mirrored in `src/styles/tokens.css`
- **Animation:** Framer Motion 11, Lenis 1.1
  - GSAP was removed. It was imported by exactly one component (the intro
    loader) and its choreography now runs on Framer Motion, which was already
    in the bundle for every page transition.
  - Three.js, @react-three/fiber and @react-three/drei were removed. They were
    imported by one component to draw ~60 soft dots on one section, at a cost
    of ~160 kB gzipped. That component now uses the 2D canvas API and looks
    identical.
- **Forms:** react-hook-form 7.53 + zod 3.23
- **UI primitives:** Radix UI (accordion, dialog, dropdown, tabs, toast)
- **Audio:** Howler 2.2
- **Icons:** lucide-react

## Project structure

```
svc-placement-cell/
├── public/
│   ├── logos/
│   │   ├── svc-crest.png            # REAL SVC crest (sourced)
│   │   ├── recruiters/              # 66 placeholder SVGs, one per recruiter slug
│   │   ├── schools/                 # 38 placeholder SVGs for institution logos
│   │   └── rankings/                # 4 placeholder ranking badges
│   ├── images/
│   │   ├── team/                    # team portrait placeholders
│   │   ├── convener/                # Dr Abhishek Malhotra portrait placeholder
│   │   ├── campus/                  # campus photo placeholders
│   │   ├── gallery/                 # event photo placeholders
│   │   ├── events/                  # event banner placeholders
│   │   ├── alumni/                  # alumni portrait placeholders
│   │   └── infographics/
│   │       └── placement-summary-2024-25.jpg   # REAL infographic (sourced)
│   ├── audio/                       # sound design assets, see README.md inside
│   ├── fonts/
│   └── SVC_Brochure_2025-26.pdf     # REAL brochure (sourced)
├── src/
│   ├── App.tsx                      # router shell
│   ├── main.tsx                     # entry
│   ├── components/                  # all UI components
│   ├── lib/
│   │   ├── data/                    # typed data files (single source of truth)
│   │   ├── animations/              # Lenis smooth scroll
│   │   ├── audio/                   # Howler-based sound controller
│   │   ├── hooks/                   # useReducedMotion, useLocalStorage, useMagnetic
│   │   └── utils/                   # cn (clsx + tailwind-merge)
│   ├── pages/                       # 20 route components
│   ├── styles/                      # globals.css + tokens.css
│   └── types/                       # full type system with confidentiality enforced
├── docs/
│   ├── asset-checklist.md
│   └── logo-sourcing-log.md
├── scripts/
│   └── build-and-deploy.sh
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── netlify.toml
└── README.md
```

## License

Code is the cell's. Brand marks belong to their respective owners. Real photographs are released to the cell with the consent pipeline documented in the codebase and the brochure.

> Live: https://svc-placement-cell.vercel.app

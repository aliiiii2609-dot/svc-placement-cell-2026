# Restructure and performance notes

Everything below was measured on this repo, not estimated. Re-run `npm run build`
and read the chunk table to check any of it.

---

## 1. The home page was carrying the whole site

**Before:** 22 sections, ~7,000 lines of rendered component code, all statically
imported so React mounted every one of them in a single commit.

**After:** 5 sections. Hero, one recruiter logo strip, the numbers, one student
voice, the routing cards, contact.

Nothing was thrown away. Sections moved to the page that owns the subject:

| Section | Was | Now |
|---|---|---|
| CoursesOffered, ExtracurricularExposure, InitiativesByCell, CampusBlock | Home | `/college` (new page) |
| UnifiedCouncil, CouncilOrbit, TeamPhotoShowcase | Home | `/team` (new page) |
| RecruiterGalaxy, HeadlineRecruitersReel | Home | `/recruiters` |
| HigherEducationSection | Home | `/alumni` |
| IFairSection, Gallery | Home | `/events` |
| ProcessRoadmap | Home **and** `/recruiters` | `/recruiters` only |
| FaqAccordion | Home **and** `/faq` | `/faq` only |

### Duplication that was removed outright

- **The recruiter list rendered three times on one page.** `partners.ts` was read
  by `RecruiterMarqueeBar`, `RecruiterGalaxy` and `HeadlineRecruitersReel`, all on
  the home page. Home now keeps one logo strip; the other two moved to `/recruiters`.
- **`ProcessRoadmap` (440 lines) rendered on the home page and on `/recruiters`.**
- **`FaqAccordion` rendered on the home page and on `/faq`.**
- **`ConvenerBlock` (254 lines), deleted.** `UnifiedCouncil` already renders the
  Faculty Convener from the same `team.ts` data and the same portrait. It was
  orphaned — no page imported it. Wiring it in would have shown Dr Malhotra twice.
- **`NotableAlumniGrid` (528 lines), deleted.** `/alumni` already renders
  `notableAlumni` as a searchable, filterable directory. The grid was the same
  people in a second layout.
- **`PartnersMarquee` (218 lines), deleted.** Imported by the old `HomePage.tsx`
  but never actually placed in its JSX. A fourth recruiter-logo component.
- **Two competing testimonial systems, collapsed to one.** See section 3.
- **13 other orphaned files** deleted (`CardGlow`, `FloatingPanel`,
  `SectionHeading`, `GradientRibbon`, `CompensationDistribution`,
  `TrendLineChart`, `StreamSplitDonut`, `AnnotatedStack`, `TeamGrid`,
  `SectionStamp`, `HeroParticleField`, `useMagnetic`, `useLocalStorage`,
  `useBrandBgColor`, `brand-tiles`, `motion-presets`).

All deleted files are recoverable from the original zip if any call was wrong.

---

## 2. Navigation

The site has 20 routes. The old flat header exposed **7**. `/partnerships`,
`/resources`, `/rankings-press`, `/students/cv-builder`, `/students/cv-review`
and `/students/mock-interviews` were reachable only by a stray inline link.

That is *why* the home page grew to 22 sections: it was compensating for pages
nobody could find. Fixing the nav is what makes the shorter home page viable.

Nav is now grouped by audience, with a dropdown on desktop (hover **and** focus,
so it works from a keyboard) and an expanded list on mobile:

- **Recruiters** → recruiter desk, partnerships, partner dashboard
- **Students** → portal, CV builder, CV review, mock interviews, resources
- **Alumni** → directory, register/update
- **The College** → about, the team, rankings and press
- **Happenings** → events, news
- **FAQ**

### The top slider

`components/nav/SectionSlider.tsx`. A horizontal strip of chapter pills that
pins under the header once the hero passes. It is a table of contents, a jump
control and a progress indicator at once, and on a narrow screen it scrolls
sideways with the active pill keeping itself in view.

Two implementation details worth keeping:
- Scroll-spy is `IntersectionObserver`, not a scroll handler. A scroll handler
  calling `getBoundingClientRect()` per section per frame is precisely the kind
  of thing this whole exercise is about removing.
- Jumping uses **Lenis's** `scrollTo`, not `scrollIntoView`. Lenis owns the
  scroll position; calling native scroll underneath it makes the two fight.

---

## 3. Testimonials: one system, consent-gated

There were **two** competing testimonial stores.

**`recruiter-testimonials.ts` — deleted.** Six quotes attributed by name to
Deloitte India, Accenture, Bain & Company, BCG India, EY and Grant Thornton
Bharat, each with a named role ("Campus Recruiting", "Talent Acquisition"), each
rendered beside that firm's trademark hotlinked live from a third-party CDN. Its
own header comment said the copy was "preserved exactly as supplied" — but no
source, date, contact or approval was recorded anywhere in the repo, and
`docs/logo-sourcing-log.md`, which exists precisely to record this, has no entry
for any of them.

Publishing an endorsement in a firm's name that the firm did not give is not a
code smell. **Please confirm with whoever wrote those quotes whether any firm
actually approved them.** If not, they were the most serious problem in this
codebase, and they are now gone rather than reworded.

**`testimonials` in `rankings.ts` — deleted.** Anonymised quotes rendered in
three places with a different filter each time, also with no provenance. Its two
genuine student/alumni quotes were moved, not rewritten.

**`student-testimonials.ts` — new, and the only one.** Every entry is
`consented: false` and therefore does not render; the section shows a designed
empty state that asks for real quotes instead. Flip the flag once Documentation
has written consent on file.

The `StudentTestimonial` type carries explicit `never` fields for `company`,
`employer`, `ctc`, `studentName` and `displayName`. This is stronger than the
existing types' reliance on TypeScript's excess-property check, which only fires
on object literals and silently passes anything built via a variable or spread.

Verified — adding `company: 'Deloitte India'` to an entry produces:

```
src/lib/data/student-testimonials.ts(74,5): error TS2322:
  Type 'string' is not assignable to type 'undefined'.
```

---

## 4. Performance

**Home page JS: 754 kB gzipped → 132 kB gzipped (-83%).**

Baseline was 10 chunks totalling 2,532 kB raw / ~754 kB gzipped, **all eager**,
because every one of the 20 routes was a static import.

| Change | Saving (gzip) |
|---|---|
| Route-level code splitting (`jspdf`, `html2canvas`, `docx`, `dompurify`, `file-saver` off the critical path) | ~239 kB |
| **three.js removed.** Used by one component to draw ~60 soft dots on one section. Now 2D canvas, visually identical | ~160 kB |
| **GSAP removed.** Imported by exactly one component (the intro loader). Now Framer Motion, already in the bundle | ~28 kB |
| **Howler dynamic-imported.** Was static, on every page load, for a feature that is off by default *and* has no audio files behind it (`public/audio` holds only a README) | ~10 kB |
| Home page section splitting + deferral | remainder |

### Why lazy routes work now when they didn't before

`App.tsx` said lazy loading "added flake (chunk-load failures on some deploys
showed an infinite spinner)". That diagnosis had the symptom right and the cause
wrong. The sequence was:

1. A visitor loads `index.html` referencing chunks hashed for deploy A.
2. You push deploy B. Netlify replaces the assets; deploy A's filenames vanish.
3. The visitor navigates. The old chunk 404s, the dynamic import rejects, and
   Suspense hangs forever with no error boundary beneath it. Infinite spinner.

`lib/utils/lazyWithRetry.ts` catches the rejection, forces one hard reload to
pick up fresh chunk names, and only surfaces a real error if that also fails. A
`sessionStorage` flag prevents a reload loop.

### Other fixes

- **Two smooth-scroll systems were fighting.** `html { scroll-behavior: smooth }`
  in `globals.css` ran alongside Lenis's rAF loop, so every anchor jump had two
  independent systems animating `scrollTop` against each other. The CSS rule is
  gone, restored only under `prefers-reduced-motion`.
- **Fonts: 4 families / 13 weights → 3 / 8.** "Inter Tight" was loaded at 4
  weights purely for `font-display` while Inter loaded at 5. They are near-identical
  faces, and `tracking-tightest` was re-creating the difference by hand anyway.
  The stylesheet is now non-render-blocking.
- **LCP image preloaded.** The hero photo now starts fetching during HTML parse
  instead of after React hydrates.
- **`manualChunks` removed.** It hand-listed three and gsap, which no longer
  exist. A "smarter" replacement I tried actively made things worse — it stranded
  Vite's preload helper in the docgen chunk and made the home page eagerly
  preload 291 kB of PDF tooling. Rollup's automatic splitting beat every
  hand-tuned variant once the routes were lazy.
- **`CinematicParticles` now pauses when off-screen.** The WebGL version ran its
  rAF loop regardless of scroll position.

---

## 5. Rules to keep it this way

1. **Never add a static import to `HomePage.tsx`** for anything below the fold.
   Use `lazyWithRetry` + `<DeferLazy>` like every other section.
2. **A section belongs on the home page only if it helps a first-time visitor
   decide to trust the cell.** Everything else goes on the page for its subject,
   with a card in `AudienceCards` pointing at it.
3. **Run `npm run build` and read the chunk table before merging.** If the eager
   `index-*.js` chunk grew, something leaked onto the critical path.
4. **Never publish a quote without recorded consent.** `consented: false` is the
   default for a reason.

---

## 6. Still outstanding — not addressed in this pass

- **Brandfetch.** `lib/data/brand.ts` fetches recruiter, school and icon logos
  live from `cdn.brandfetch.io` at runtime, using a client ID committed to the
  repo. Five components still do this. It leaks every visitor's IP and referrer
  to a third party you have no data agreement with, on a site for a public
  university, and it means the logo wall breaks if Brandfetch changes terms.
  You already have 66 local recruiter logos in `public/logos/recruiters/`. Those
  placeholders should be replaced with press-kit assets and served locally.
- **The search box in `App.tsx` is decorative.** It renders an input and does
  nothing. Either wire it or remove it.
- **`/admin` unlocks on any 4+ character code.** Fine for MVP, but it should not
  reach a public domain in that state.
- **Unverified content generally.** Beyond the testimonials, the stats, rankings
  and achievements in `stats.ts` / `rankings.ts` should be checked against the
  brochure before launch.

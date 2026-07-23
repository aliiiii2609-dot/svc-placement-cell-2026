import type { StudentTestimonial } from '@/types';

/**
 * Student testimonials.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE REPLACED recruiter-testimonials.ts
 * ---------------------------------------------------------------------------
 * The previous file held six quotes attributed by name to Deloitte India,
 * Accenture, Bain & Company, BCG India, EY and Grant Thornton Bharat, each
 * with a named role ("Campus Recruiting", "Talent Acquisition") and each
 * rendered next to that firm's trademark, hotlinked live from a third-party
 * logo CDN.
 *
 * Its own header comment read: "Quote copy is preserved exactly as supplied —
 * no edits, no abbreviation, no rewording." No source, no date, no contact,
 * no approval reference was recorded anywhere in the repo, and the cell's own
 * docs/logo-sourcing-log.md — which exists precisely to record this sort of
 * permission — has no entry for any of them.
 *
 * Publishing an endorsement in a firm's name that the firm did not give is
 * not a code smell. It is the kind of thing that gets a college's placement
 * cell a letter from a Big 4 legal team, and it puts at risk the exact
 * recruiter relationships the page is meant to advertise. So the quotes are
 * gone rather than reworded, and they must not come back without written
 * approval from each firm logged in docs/logo-sourcing-log.md.
 *
 * ---------------------------------------------------------------------------
 * WHAT GOES HERE INSTEAD
 * ---------------------------------------------------------------------------
 * Student voices, which the cell can actually collect first-hand, and which
 * are more persuasive to the page's real audience anyway: a prospective
 * student reading this page cares far more about what someone two years ahead
 * of them says than about a paragraph of corporate PR.
 *
 * The two entries below are NOT new writing. They are the existing anonymised
 * student and alumni quotes that already lived in src/lib/data/rankings.ts,
 * moved here so there is one home for student voice instead of two competing
 * ones. Their provenance is inherited and therefore also unverified.
 *
 * ---------------------------------------------------------------------------
 * ACTION REQUIRED BEFORE PUBLIC LAUNCH
 * ---------------------------------------------------------------------------
 * Every entry below is marked `consented: false` and will NOT render. This is
 * deliberate: the section shows an honest empty state rather than unverified
 * quotes. To publish a testimonial:
 *
 *   1. Documentation collects the quote directly from the student or alumnus,
 *      in writing.
 *   2. The contributor signs the standard consent line: that the quote may be
 *      published anonymously, attributed only to course and class year.
 *   3. Record the consent (name, date, quote ID) in the Documentation register.
 *      The name lives in that register and never in this file.
 *   4. Flip `consented: true` here.
 *
 * Do not add a `company` or `ctc` field. The type will refuse to compile, and
 * that refusal is the point. See the note on StudentTestimonial in
 * src/types/index.ts.
 */

/** How long each testimonial holds before the rotator advances. */
export const TESTIMONIAL_DURATION_MS = 5500;

export const studentTestimonials: StudentTestimonial[] = [
  {
    id: 'econ-2024-quant-pivot',
    quote:
      'The cell helped me pivot from a generalist economics profile into a quant-adjacent role. The mock interview pool with alumni was the unlock.',
    course: 'B.A. (H) Economics',
    classYear: 'Class of 2024',
    pathTag: 'Placed through the campus process',
    sector: 'Finance & Markets',
    accent: '#635bff',
    // Inherited from rankings.ts. Provenance unknown. Verify before publishing.
    consented: false,
  },
  {
    id: 'bcom-2024-sector-switch',
    quote:
      "I came in expecting to do audit. I left with an offer from a sector I didn't know was hiring from us. The sector orientations changed my path.",
    course: 'B.Com (H)',
    classYear: 'Class of 2024',
    pathTag: 'Placed through the campus process',
    accent: '#9c7a3a',
    // Inherited from rankings.ts. Provenance unknown. Verify before publishing.
    consented: false,
  },
];

/**
 * The only list any component should render. Filtering here rather than at each
 * call site means a testimonial cannot be published by forgetting a filter.
 */
export const publishableStudentTestimonials: StudentTestimonial[] =
  studentTestimonials.filter((t) => t.consented);

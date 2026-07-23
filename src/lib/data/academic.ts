/**
 * Academic catalog and student-life data for the home page.
 *
 * Source: SVC 2025-26 Recruitment Brochure pages "Courses Offered",
 * "Extracurricular Exposure", and "Initiatives by the Cell".
 *
 * No invented programs, no padded society lists. Anything not in the
 * brochure has been omitted rather than inferred.
 */

export type CourseStream = 'Commerce' | 'Arts' | 'Science';

export interface CourseProgram {
  name: string;
  stream: CourseStream;
  /** Optional clarifier for compound names */
  detail?: string;
}

// ---------------------------------------------------------------------------
// 20 undergraduate programs offered at SVC
// ---------------------------------------------------------------------------
export const courses: CourseProgram[] = [
  // Commerce stream (2)
  { name: 'B.Com (H)', stream: 'Commerce', detail: 'Honours' },
  { name: 'B.Com (P)', stream: 'Commerce', detail: 'Programme' },

  // Arts stream (8) — B.A. Hons across humanities
  { name: 'B.A. (P)',        stream: 'Arts', detail: 'Programme' },
  { name: 'Economics',       stream: 'Arts', detail: 'B.A. (H) Economics' },
  { name: 'English',         stream: 'Arts', detail: 'B.A. (H) English' },
  { name: 'Hindi',           stream: 'Arts', detail: 'B.A. (H) Hindi' },
  { name: 'History',         stream: 'Arts', detail: 'B.A. (H) History' },
  { name: 'Political Science',stream: 'Arts', detail: 'B.A. (H) Pol. Science' },
  { name: 'Sanskrit',        stream: 'Arts', detail: 'B.A. (H) Sanskrit' },
  { name: 'Sociology',       stream: 'Arts', detail: 'B.A. (H) Sociology' },

  // Science stream (10) — B.Sc. (H) and life-sciences programmes
  { name: 'Bio Chemistry',   stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Bio Sciences',    stream: 'Science', detail: 'B.Sc. Life Sciences track' },
  { name: 'Botany',          stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Chemistry',       stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Electronics',     stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Life Sciences',   stream: 'Science', detail: 'B.Sc. Programme' },
  { name: 'Mathematics',     stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Physics',         stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Statistics',      stream: 'Science', detail: 'B.Sc. (H)' },
  { name: 'Zoology',         stream: 'Science', detail: 'B.Sc. (H)' },
];

// ---------------------------------------------------------------------------
// Stream distribution share used by the placement cell to characterise its
// applicant pool. Matches the cycle 2025-26 stream split shown in the cell's
// dashboard (68 / 19 / 13 over 114 placement offers).
// ---------------------------------------------------------------------------
export const streamApplicantShare: Array<{ stream: CourseStream; sharePct: number; programCount: number; brandColor: string }> = [
  { stream: 'Commerce', sharePct: 68, programCount: 2,  brandColor: '#1e4e8c' },
  { stream: 'Arts',     sharePct: 19, programCount: 8,  brandColor: '#b8893b' },
  { stream: 'Science',  sharePct: 13, programCount: 10, brandColor: '#b8893b' },
];

// ---------------------------------------------------------------------------
// Student societies grouped by category. Names match the brochure's
// "Extracurricular Exposure" page. Logos are not separately distributed;
// each society is rendered as a clean editorial chip.
// ---------------------------------------------------------------------------
export type SocietyCategory = 'Academic' | 'Cultural' | 'Social Service & Entrepreneurship';

export interface SocietyEntry {
  name: string;
  shortName?: string;
  category: SocietyCategory;
  /** Domain for Brandfetch logo lookup. Most SVC societies are college
   *  groups without a public web presence; only the ones that exist as
   *  national orgs get a domain. */
  domain?: string;
}

export const studentSocieties: SocietyEntry[] = [
  // Academic
  { name: 'Commerce Association',    shortName: 'CA',    category: 'Academic' },
  { name: 'Economics & Debating Society', shortName: 'EDS', category: 'Academic' },
  { name: 'The IMPACT Project',      shortName: 'IMPACT',category: 'Academic' },
  { name: 'The Blue Chip',           shortName: 'TBC',   category: 'Academic' },
  { name: '180 Degrees Consulting',  shortName: '180DC', category: 'Academic', domain: '180dc.org' },
  { name: 'Indian Finance and Securities Association', shortName: 'IFSA', category: 'Academic' },

  // Cultural
  { name: 'Fine Arts Association',   shortName: 'FAA',   category: 'Cultural' },
  { name: 'Choreography Society',    shortName: 'CHOR',  category: 'Cultural' },
  { name: 'Anubhuti, the Hindi Dramatics Society', shortName: 'ANUBHUTI', category: 'Cultural' },
  { name: 'Dramatics & Photography Society', shortName: 'DPS', category: 'Cultural' },
  { name: 'Verbum, the English Dramatics Society', shortName: 'VERBUM', category: 'Cultural' },
  { name: 'Aroop, the Music Society',shortName: 'AROOP', category: 'Cultural' },

  // Social Service and Entrepreneurship
  { name: 'Enactus SVC',             shortName: 'ENACTUS', category: 'Social Service & Entrepreneurship', domain: 'enactus.org' },
  { name: 'Nation Building, Impact Chapter', shortName: 'NB', category: 'Social Service & Entrepreneurship' },
  { name: 'Connecting Dreams Foundation', shortName: 'CDF', category: 'Social Service & Entrepreneurship', domain: 'connectingdreamsfoundation.org' },
  { name: 'National Service Scheme', shortName: 'NSS',   category: 'Social Service & Entrepreneurship', domain: 'nss.gov.in' },
  { name: 'ASCEND',                  shortName: 'ASC',   category: 'Social Service & Entrepreneurship' },
  { name: 'Makes Sense',             shortName: 'MS',    category: 'Social Service & Entrepreneurship' },
];

// ---------------------------------------------------------------------------
// Initiatives run by the Placement Cell, as listed in the brochure.
// Each initiative has a title, a category, and a brief description.
// ---------------------------------------------------------------------------
export interface CellInitiative {
  id: string;
  title: string;
  kicker: string;
  description: string;
}

/**
 * The four pillars of the cell's CV vetting system.
 */
export const cvVettingPillars: CellInitiative[] = [
  {
    id: 'trustworthy',
    title: 'Trustworthy interaction processes',
    kicker: 'Pillar 01',
    description:
      'Every recruiter-student interaction is routed through a coordinator. No direct DMs, no leaked numbers, no off-channel asks. The cell is the channel.',
  },
  {
    id: 'verified',
    title: 'Verified curricula vitae',
    kicker: 'Pillar 02',
    description:
      'Every CV that reaches a recruiter has been vetted by the cell. Discrepancies flagged, claims sanity-checked. What a recruiter receives is what the student can defend.',
  },
  {
    id: 'optimised',
    title: 'Optimised recruiter–student relations',
    kicker: 'Pillar 03',
    description:
      'Recruiter feedback flows back to applicants the same week. Shortlists explained, rejections substantiated. The pipeline gets stronger every cycle.',
  },
  {
    id: 'structured',
    title: 'Structured vetting system',
    kicker: 'Pillar 04',
    description:
      'A documented, repeatable review checklist applied to every profile by trained reviewers. The same standard every time, regardless of who is reading the CV.',
  },
];

/**
 * Training, development, and partnership programmes run by the cell.
 * Zariya AI partnership intentionally omitted per the latest direction.
 */
export const trainingPrograms: CellInitiative[] = [
  {
    id: 'industry-sessions',
    title: 'Industry sessions',
    kicker: 'Programme',
    description:
      'Hosted sessions with practitioners across finance, consulting, and policy. Recent guests include CA and CFA charter-holders sharing how their work day actually looks, what to study, and what to skip.',
  },
  {
    id: 'mock-interviews',
    title: 'Mock interview drills',
    kicker: 'Programme',
    description:
      'Closed-room practice with structured feedback. The same questions a McKinsey, BCG, or Bain first round throws, run with a coordinator and recorded so the student can re-watch.',
  },
  {
    id: 'certification-webinars',
    title: 'Certification briefings',
    kicker: 'Programme',
    description:
      'Conducted in partnership with IMS on CFA and CFP certification: what each charter is, what the curriculum looks like, where it leads in financial planning and wealth management.',
  },
];

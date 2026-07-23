import type { RankingEntry } from '@/types';

export const rankings: RankingEntry[] = [
  {
    authority: 'NIRF',
    rank: '11',
    category: 'Colleges, India',
    year: '2025',
    badgeSlug: 'nirf',
    methodologyUrl: 'https://www.nirfindia.org/Home',
  },
  {
    authority: 'NAAC',
    rank: 'A+',
    category: 'Accreditation',
    year: '2023',
    badgeSlug: 'naac',
  },
  {
    authority: 'Outlook',
    rank: '6',
    category: 'Humanities Colleges',
    year: '2024',
    badgeSlug: 'outlook',
  },
  {
    authority: 'India Today',
    rank: '7',
    category: 'Best Colleges, Arts',
    year: '2025',
    badgeSlug: 'india-today',
  },
];

/**
 * The `testimonials` array that used to live here has been removed.
 *
 * It was a second testimonial system running alongside recruiter-testimonials.ts,
 * rendered in three places (home page, /recruiters, /rankings-press) with a
 * different filter each time and no provenance recorded for any entry. Its two
 * genuine student/alumni quotes moved to src/lib/data/student-testimonials.ts,
 * which is now the single source for published voices and is consent-gated.
 * The recruiter-attributed entries were dropped, not migrated.
 */

/** Student achievements published in the brochure. */
export const achievements = [
  {
    title: 'National Runners Up',
    detail: 'BrAINWARS 2024 hosted by Bain & Company',
    year: 2024,
  },
  {
    title: 'National 2nd Runners Up',
    detail: 'EY Cafta Case Championship 2024 hosted by EY',
    year: 2024,
  },
  {
    title: 'CA Intermediate AIR 47',
    detail: 'September 2025',
    year: 2025,
  },
  {
    title: 'CA Intermediate AIR 1',
    detail: 'September 2021',
    year: 2021,
  },
];

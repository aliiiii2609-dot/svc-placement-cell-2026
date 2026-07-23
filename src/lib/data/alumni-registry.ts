/**
 * Alumni directory registry.
 *
 * Profiles in this array were self-published by the alumnus via
 * the Alumni Registration form, verified by the Documentation
 * department, and consented to public listing.
 *
 * In production this data lives in a backend store, the admin
 * console manages the verification queue, and the file you are
 * looking at is the source for the MVP build. The shape
 * matches NotableAlumnus so the directory page can render both
 * the brochure-published profiles and self-published profiles
 * with the same components.
 */
import type { NotableAlumnus } from '@/types';

export const consentedAlumniRegistry: NotableAlumnus[] = [
  // No self-published profiles yet. The admin console
  // verification queue moves entries into this array once
  // approved. Until then, the directory page renders the
  // brochure-published notable alumni only.
];

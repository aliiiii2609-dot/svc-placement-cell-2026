/**
 * Shared easing curves and spring configurations.
 *
 * Single source of truth for motion. All components import from this file
 * rather than hard-coding cubic-beziers or springs. Keeps the choreography
 * consistent and tweakable.
 *
 * Reference benchmarks for the curves:
 *  - cubic-bezier(0.22, 1, 0.36, 1) — the default editorial ease, Linear / Vercel
 *  - cubic-bezier(0.65, 0, 0.35, 1) — symmetric ease-in-out for curtains and transitions
 *  - spring(260, 26) — Family.co warmth, Raycast layout shifts
 */

import type { Transition, Spring } from 'framer-motion';

// Cubic-bezier tuples for direct use in animations and CSS strings
export const easings = {
  /** Default editorial ease. Same value as Tailwind's `ease-ease` token. */
  ease: [0.22, 1, 0.36, 1] as const,
  /** Symmetric ease-in-out used for page-transition curtains. */
  easeInOut: [0.65, 0, 0.35, 1] as const,
  /** Soft overshoot (use sparingly). */
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

/** Standard spring used for hovers and layout morphs (Raycast / Linear style). */
export const springConfig: Spring = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 1,
};

/** Slower spring for entrance choreography. */
export const softSpringConfig: Spring = {
  type: 'spring',
  stiffness: 180,
  damping: 24,
  mass: 1,
};

/** Tween defaults. */
export const tween = {
  fast: { duration: 0.3, ease: easings.ease } satisfies Transition,
  medium: { duration: 0.5, ease: easings.ease } satisfies Transition,
  slow: { duration: 0.7, ease: easings.ease } satisfies Transition,
  cinematic: { duration: 0.9, ease: easings.ease } satisfies Transition,
} as const;

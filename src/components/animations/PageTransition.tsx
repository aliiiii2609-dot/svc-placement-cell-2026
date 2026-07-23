import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Route transition.
 *
 * Deliberately minimal. The previous version dropped a full-screen `bg-bg`
 * curtain (z-8000) with an animated crest over the whole viewport on every
 * navigation and used `AnimatePresence mode="wait"`, which unmounts the old
 * route before mounting the new one. Together those meant every route change
 * flashed an empty branded screen for up to ~0.7s — read by the owner as
 * "blank screens" and lag.
 *
 * Now: the incoming route simply fades and lifts in over ~0.2s. No curtain, no
 * mode="wait" gap, no long durations, and only transform/opacity animate (both
 * GPU-composited, no layout thrash). The outgoing route is replaced
 * immediately, so there is never a sustained blank screen.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: reduced ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

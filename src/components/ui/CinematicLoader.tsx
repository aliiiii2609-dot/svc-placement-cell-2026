import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { sound } from '@/lib/audio/sound-controller';

/**
 * Cinematic intro loader.
 *
 * Previously driven by GSAP (~70 kB raw / 28 kB gzipped) which was imported
 * for this component and nothing else in the entire codebase. Framer Motion is
 * already in the bundle for every page transition, so the same choreography is
 * expressed in it and GSAP drops out of package.json entirely.
 *
 * Behaviour: particles converge on the crest, the crest springs in, the title
 * cascades letter by letter, the tagline fades up, and the whole thing dismisses
 * on timer, click, Escape, or Space.
 *
 * Timing: a first visit gets the full ~1.6s cinematic play-through so every beat
 * is legible; repeat visits in the same session run the same choreography scaled
 * down to ~0.7s so it still reads as intentional rather than a flash. The `speed`
 * multiplier below keeps the two in proportion from a single set of numbers.
 */

const PARTICLE_COUNT = 32;
const TITLE = 'PLACEMENT CELL';

export function CinematicLoader() {
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    try {
      setVisited(sessionStorage.getItem('svc-visited') === '1');
      sessionStorage.setItem('svc-visited', '1');
    } catch {
      /* non-fatal */
    }
  }, []);

  // Particle start offsets are computed once, not per render.
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 320 + Math.random() * 280;
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
      }),
    [],
  );

  const dismiss = useCallback(() => setDismissed(true), []);

  // First paint is held just long enough for the intro to land: ~1.6s on a
  // first visit, ~0.7s on repeat within the session, and a quick fade for
  // reduced motion. `speed` scales the whole choreography so the repeat visit
  // plays the same beats, only faster, instead of getting chopped off.
  const totalDuration = reduced ? 0.3 : visited ? 0.7 : 1.6;
  const speed = reduced ? 1 : visited ? 0.45 : 1;

  useEffect(() => {
    if (dismissed) return;
    const timer = window.setTimeout(dismiss, totalDuration * 1000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [dismissed, dismiss, totalDuration]);

  return (
    <AnimatePresence onExitComplete={() => sound.play('load-complete')}>
      {!dismissed && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
          className="fixed inset-0 z-[10000] bg-bg flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          onClick={dismiss}
          style={{ cursor: 'pointer' }}
        >
          <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_center,rgba(156,122,58,0.15),transparent_55%)] animate-pulse-slow" />

          {!reduced &&
            particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent left-1/2 top-1/2"
                style={{ boxShadow: '0 0 6px rgba(156, 122, 58, 0.6)' }}
                initial={{ x: p.x, y: p.y, scale: 2, opacity: 1 }}
                animate={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.7 * speed,
                  delay: i * 0.012 * speed,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            ))}

          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            <motion.img
              src="/logos/svc-crest.png"
              alt=""
              width={160}
              height={160}
              fetchPriority="high"
              className="w-[160px] h-[160px] object-contain"
              style={{ filter: 'drop-shadow(0 0 24px rgba(156, 122, 58, 0.4))' }}
              initial={reduced ? { opacity: 1 } : { scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={
                reduced
                  ? { duration: 0.2 }
                  : { delay: 0.35 * speed, duration: 0.7 * speed, type: 'spring', bounce: 0.4 }
              }
              onAnimationStart={() => !reduced && sound.play('title-card')}
            />
          </div>

          <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 font-display text-[clamp(2rem,5.5vw,3.8rem)] tracking-tight whitespace-nowrap overflow-hidden">
            {TITLE.split('').map((ch, i) => (
              <motion.span
                key={i}
                className={`inline-block ${i >= 10 ? 'text-accent' : 'text-ink'}`}
                initial={reduced ? { opacity: 1 } : { y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : { delay: (0.6 + i * 0.035) * speed, duration: 0.45 * speed, ease: [0.33, 1, 0.68, 1] }
                }
                style={{ willChange: 'transform, opacity' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.4em] text-ink-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.05 * speed, duration: 0.4 * speed }}
          >
            Sri Venkateswara College · University of Delhi
          </motion.div>

          <motion.button
            type="button"
            onClick={dismiss}
            className="absolute bottom-6 right-6 font-mono text-[0.7rem] uppercase tracking-wider text-ink-3 hover:text-accent border border-line hover:border-accent rounded px-3 py-1.5 transition-colors"
            aria-label="Skip intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: reduced ? 0 : 0.5 * speed, duration: 0.3 * speed }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

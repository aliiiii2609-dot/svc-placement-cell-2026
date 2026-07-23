import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import {
  publishableStudentTestimonials,
  TESTIMONIAL_DURATION_MS,
} from '@/lib/data/student-testimonials';
import type { StudentTestimonial } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_GRACE_MS = 400;

/**
 * Student Voices.
 *
 * Replaces RecruiterTestimonials. The card treatment (glass surface, sweep
 * bar, 3D tilt, flash-card stack) is carried over deliberately — it was the
 * best-looking component on the page and there was no reason to lose it. What
 * changed underneath:
 *
 *   - Quotes come from students, not from invented corporate endorsements.
 *   - No brand logo, so no runtime call to the Brandfetch CDN. That request
 *     was a third-party dependency on the critical path of the home page's
 *     first visible section, and it leaked every visitor's IP and referrer to
 *     a company the cell has no data agreement with.
 *   - Accent colour comes from the institutional palette rather than a firm's
 *     trademark.
 *   - The section renders nothing but an honest recruitment prompt when no
 *     consented testimonials exist, instead of shipping placeholder quotes.
 */

function AmbientDots({ color }: { color: string }) {
  // Deterministic positions: Math.random() here would produce different values
  // on every re-render, retriggering all 22 animations mid-flight.
  const dots = Array.from({ length: 22 }).map((_, i) => ({
    left: (i * 71) % 100,
    top: (i * 53) % 100,
    size: 2 + (i % 4),
    delay: (i * 0.6) % 8,
    duration: 9 + (i % 4),
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: color,
          }}
          animate={{ opacity: [0.15, 0.45, 0.15], y: [0, -20, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** Attribution line. Course + class year + optional path tag. Never a name, never a firm. */
function Attribution({ t }: { t: StudentTestimonial }) {
  return (
    <>
      <span className="font-medium text-ink">{t.course}</span>
      <span className="text-ink-3 mx-1.5">·</span>
      <span className="text-ink-3">{t.classYear}</span>
      {t.pathTag && (
        <>
          <span className="text-ink-3 mx-1.5">·</span>
          <span className="text-ink-3">{t.pathTag}</span>
        </>
      )}
    </>
  );
}

function TestimonialCard({
  testimonial,
  nextTwo,
  onClick,
  onHoverEnter,
  onHoverLeave,
}: {
  testimonial: StudentTestimonial;
  nextTwo: StudentTestimonial[];
  onClick: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    setTilt({ rx: -((y - cy) / cy) * 6, ry: ((x - cx) / cx) * 6 });
    setCursor({ x, y });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setCursor(null);
    onHoverLeave();
  };

  const interactive = nextTwo.length > 0;

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onHoverEnter}
      onClick={interactive ? onClick : undefined}
      style={{
        transformStyle: 'preserve-3d',
        transform: reduced
          ? undefined
          : `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative max-w-3xl w-full mx-auto ${interactive ? 'cursor-pointer' : ''}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={interactive ? 'Show the next student testimonial' : undefined}
    >
      <motion.div
        key={`halo-${testimonial.id}`}
        className="absolute -inset-6 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${testimonial.accent}26, transparent 70%)`,
          filter: 'blur(28px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-hidden="true"
      />

      {nextTwo.map((t, i) => (
        <div
          key={`stack-${t.id}-${i}`}
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl bg-surface/95 border border-line shadow-soft pointer-events-none"
          style={{
            transform: `translateY(${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.04})`,
            opacity: 0.6 - i * 0.22,
            zIndex: -1 - i,
          }}
        />
      ))}

      <div
        className="relative bg-surface/85 backdrop-blur-xl border border-line rounded-3xl overflow-hidden shadow-soft-lg"
        style={{ transform: 'translateZ(0)' }}
      >
        <motion.div
          key={`sweep-${testimonial.id}`}
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${testimonial.accent}, transparent)`,
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2.2, ease: EASE, repeat: Infinity, repeatDelay: 0.6 }}
          aria-hidden="true"
        />

        {!reduced && cursor && (
          <div
            aria-hidden="true"
            className="absolute pointer-events-none rounded-full"
            style={{
              left: cursor.x - 120,
              top: cursor.y - 120,
              width: 240,
              height: 240,
              background: `radial-gradient(circle, ${testimonial.accent}1f, transparent 70%)`,
              filter: 'blur(20px)',
              zIndex: 0,
            }}
          />
        )}

        <div className="relative p-6 md:p-10 z-10">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex w-2 h-2">
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-70 motion-reduce:animate-none"
                  style={{ background: testimonial.accent }}
                />
                <span
                  className="relative w-2 h-2 rounded-full"
                  style={{ background: testimonial.accent }}
                />
              </span>
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-ink-3">
                In their own words
              </span>
            </div>
            {testimonial.sector && (
              <span
                className="font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${testimonial.accent}40`, color: testimonial.accent }}
              >
                {testimonial.sector}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={`quote-${testimonial.id}`}
              initial={{ opacity: 0, x: 30, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display font-semibold text-ink leading-[1.35] tracking-[-0.02em] text-base md:text-xl lg:text-2xl"
            >
              {testimonial.quote}
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <motion.span
                key={`line-${testimonial.id}`}
                className="inline-block h-px shrink-0"
                style={{ background: testimonial.accent, width: 36 }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                <motion.figcaption
                  key={`cap-${testimonial.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
                  className="text-sm"
                >
                  <Attribution t={testimonial} />
                </motion.figcaption>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Shown when no consented testimonials exist. This is the honest state of the
 * section today, and it does something useful: it asks for the thing that is
 * missing. Better than five paragraphs of invented praise.
 */
function AwaitingVoices() {
  return (
    <div className="max-w-3xl mx-auto text-center border border-dashed border-line-2 rounded-3xl p-10 md:p-14 bg-surface/60">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
        Collecting now
      </div>
      <h3 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-4">
        We would rather print nothing than print something we did not hear.
      </h3>
      <p className="text-ink-2 leading-relaxed max-w-xl mx-auto mb-8">
        The cell is gathering first-hand accounts from students and alumni about how the process
        actually went. Quotes appear here once the contributor has given written consent. They are
        published anonymously, attributed only to course and class year.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/students/portal"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-deep transition-colors text-sm"
        >
          Share your experience
        </Link>
        <a
          href="mailto:placement@svc.ac.in?subject=Student%20testimonial"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-ink hover:border-accent hover:text-accent transition-colors text-sm"
        >
          Write to the cell
        </a>
      </div>
    </div>
  );
}

export function StudentVoices() {
  const items = publishableStudentTestimonials;
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const graceRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const advance = useCallback(() => {
    if (total > 1) setIndex((i) => (i + 1) % total);
  }, [total]);

  const onHoverEnter = useCallback(() => {
    if (graceRef.current) window.clearTimeout(graceRef.current);
    setPaused(true);
  }, []);

  const onHoverLeave = useCallback(() => {
    if (graceRef.current) window.clearTimeout(graceRef.current);
    graceRef.current = window.setTimeout(() => setPaused(false), HOVER_GRACE_MS);
  }, []);

  useEffect(() => {
    // Auto-rotation is an unrequested moving element, so reduced-motion users
    // get a static card and manual control only.
    if (paused || reduced || total < 2) return;
    const timer = window.setTimeout(advance, TESTIMONIAL_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduced, total, advance]);

  useEffect(() => () => {
    if (graceRef.current) window.clearTimeout(graceRef.current);
  }, []);

  const current = items[index];

  return (
    <section
      className="relative section-spacing bg-bg border-t border-line overflow-hidden"
      aria-label="Student voices"
    >
      {current && !reduced && <AmbientDots color={current.accent} />}

      <div className="container-svc relative">
        <div className="text-center mb-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent mb-3">
            Student voices
          </div>
          <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-[-0.02em] text-ink">
            What it was actually like.
          </h2>
        </div>

        {current ? (
          <>
            <TestimonialCard
              testimonial={current}
              nextTwo={
                total > 2
                  ? [items[(index + 1) % total], items[(index + 2) % total]]
                  : total > 1
                    ? [items[(index + 1) % total]]
                    : []
              }
              onClick={advance}
              onHoverEnter={onHoverEnter}
              onHoverLeave={onHoverLeave}
            />
            <div className="sr-only" aria-live="polite">
              Testimonial {index + 1} of {total}
            </div>
          </>
        ) : (
          <AwaitingVoices />
        )}
      </div>
    </section>
  );
}

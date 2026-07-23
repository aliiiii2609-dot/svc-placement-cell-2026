import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { courses, streamApplicantShare, type CourseStream } from '@/lib/data/academic';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Courses Offered section.
 *
 * Composition:
 *   Left column:
 *     - Kicker + heading
 *     - Donut chart of stream distribution (Commerce 68%, Arts 19%, Science 13%)
 *       built as animated SVG with three colored arc segments
 *     - Stream legend with counts of programmes per stream
 *
 *   Right column:
 *     - "All 20 programmes" header
 *     - Three column-stacks (Commerce, Arts, Science), each listing the
 *       individual programmes in that stream
 *
 * Donut chart: pure SVG arcs animated via stroke-dasharray. No chart
 * library. Hover-by-segment to brighten and dim the surrounding wedges.
 *
 * Reduced motion: donut renders in final state, no draw-in.
 */

// ---------------------------------------------------------------------------
// Word-by-word reveal
// ---------------------------------------------------------------------------
function WordReveal({
  text,
  active,
  delay = 0,
  stagger = 0.035,
  className,
}: {
  text: string;
  active: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={active ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Donut chart
// ---------------------------------------------------------------------------

const RADIUS = 110;
const STROKE = 28;
const SIZE = RADIUS * 2 + STROKE + 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutChart({ active, hovered, setHovered }: { active: boolean; hovered: CourseStream | null; setHovered: (s: CourseStream | null) => void }) {
  const total = streamApplicantShare.reduce((s, x) => s + x.sharePct, 0);
  let cumulative = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Stream distribution donut chart">
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(10, 37, 64, 0.06)"
          strokeWidth={STROKE}
        />
        {streamApplicantShare.map((seg) => {
          const fraction = seg.sharePct / total;
          const offset = -cumulative * CIRCUMFERENCE;
          const length = fraction * CIRCUMFERENCE;
          cumulative += fraction;
          const isHovered = hovered === seg.stream;
          const isDimmed = hovered !== null && !isHovered;
          return (
            <motion.circle
              key={seg.stream}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={seg.brandColor}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{
                opacity: isDimmed ? 0.35 : 1,
                cursor: 'pointer',
                transition: 'opacity 240ms ease',
              }}
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              animate={active ? { strokeDasharray: `${length} ${CIRCUMFERENCE - length}` } : { strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 + (cumulative - fraction) * 0.6 }}
              onMouseEnter={() => setHovered(seg.stream)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-1">
          {hovered ?? 'Stream split'}
        </div>
        <div className="font-display font-bold text-4xl text-ink tabular-nums leading-none">
          {hovered ? `${streamApplicantShare.find((s) => s.stream === hovered)?.sharePct}%` : '20'}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-3 mt-1">
          {hovered ? 'this cycle' : 'programmes'}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export function CoursesOffered() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [hoveredStream, setHoveredStream] = useState<CourseStream | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.2) {
            setEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: [0.2] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const streamGroups: Array<{ stream: CourseStream; programs: typeof courses }> = [
    { stream: 'Commerce', programs: courses.filter((c) => c.stream === 'Commerce') },
    { stream: 'Arts',     programs: courses.filter((c) => c.stream === 'Arts') },
    { stream: 'Science',  programs: courses.filter((c) => c.stream === 'Science') },
  ];

  return (
    <section
      ref={ref}
      className="relative section-spacing bg-bg border-t border-line overflow-hidden"
      aria-label="Programmes offered at SVC"
    >
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 25%, rgba(99, 91, 255, 0.10), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(255, 107, 157, 0.08), transparent 55%)',
        }}
      />

      <div className="container-svc relative">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            Courses offered
          </motion.div>
          <h2
            className="font-display font-bold text-ink leading-[1.04] tracking-[-0.028em] mb-3"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
          >
            <WordReveal text="Twenty programmes, three streams." active={entered} delay={0.18} stagger={0.04} />
          </h2>
          <motion.p
            className="text-ink-3 text-base md:text-lg leading-relaxed max-w-2xl mt-3"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
          >
            Two in Commerce. Eight in Arts. Ten in Science. Where the offers
            landed this cycle is shown on the right.
          </motion.p>
        </div>

        {/* Composition: donut + catalogue */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-12 lg:gap-20 items-start">
          {/* Donut + legend */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
          >
            <div className="flex justify-center mb-7">
              <DonutChart active={entered} hovered={hoveredStream} setHovered={setHoveredStream} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-3 text-center">
              Cycle 2025-26 placement share
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {streamApplicantShare.map((s) => {
                const isHovered = hoveredStream === s.stream;
                return (
                  <button
                    key={s.stream}
                    type="button"
                    onMouseEnter={() => setHoveredStream(s.stream)}
                    onMouseLeave={() => setHoveredStream(null)}
                    className="group flex items-center justify-between gap-4 px-3 py-2 rounded transition-colors hover:bg-bg-2"
                    style={{ opacity: hoveredStream && !isHovered ? 0.5 : 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="block w-3 h-3 rounded-sm" style={{ background: s.brandColor }} />
                      <span className="font-display font-semibold text-ink text-sm">{s.stream}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                        {s.programCount} {s.programCount === 1 ? 'programme' : 'programmes'}
                      </span>
                    </div>
                    <span className="font-display font-bold text-ink tabular-nums">{s.sharePct}%</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Catalogue */}
          <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
            {streamGroups.map((g, gi) => {
              const meta = streamApplicantShare.find((s) => s.stream === g.stream)!;
              return (
                <motion.div
                  key={g.stream}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.7 + gi * 0.12 }}
                  className="relative"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span aria-hidden="true" className="block w-2 h-2 rounded-full" style={{ background: meta.brandColor }} />
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{g.stream}</h3>
                    <span className="font-mono text-[10px] tabular-nums text-ink-3">· {g.programs.length}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {g.programs.map((p, pi) => (
                      <motion.li
                        key={`${g.stream}-${p.name}`}
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        animate={entered ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                        transition={{ duration: 0.4, ease: EASE, delay: 0.9 + gi * 0.12 + pi * 0.03 }}
                        className="group relative pl-4 py-1.5 border-l-2 border-line transition-colors hover:border-accent"
                      >
                        <div className="font-display font-semibold text-ink text-[15px] leading-tight tracking-tight">
                          {p.name}
                        </div>
                        {p.detail && (
                          <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3 mt-0.5">
                            {p.detail}
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

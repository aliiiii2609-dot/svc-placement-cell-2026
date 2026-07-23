import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { processSteps } from '@/lib/data/process';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Process Roadmap, consolidated single-section edition.
 *
 * The placement process as ONE cinematic section, not eight separate
 * 100vh chapters. Layout:
 *
 *   Left column (sticky on desktop, ~340px):
 *     - Kicker, heading, subhead
 *     - Stage navigation: 8 numbered chips, click to jump
 *     - The currently active stage's kicker + title preview
 *
 *   Right column (scrolls naturally):
 *     - 8 stage cards stacked vertically
 *     - Each card is glassy with brand-color accent stripe
 *     - Card contains: oversized stage number backdrop, kicker, title,
 *       description, deliverable badge
 *     - Card slides into focus on viewport intersection (light scale +
 *       brand-color glow), surrounding cards de-emphasize
 *
 * Background: dark slate with cool gradient wash + brand orbs drifting.
 *
 * Reduced motion: simple ordered list.
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
// Stage colors — cool palette drifting through the brand spectrum
// ---------------------------------------------------------------------------
const STAGE_COLORS = [
  '#7fd9c1', // mint
  '#6ba6ff', // azure
  '#a26bff', // violet
  '#ff6b9d', // rose
  '#ffb088', // peach
  '#7fd9c1',
  '#6ba6ff',
  '#a26bff',
];

// ---------------------------------------------------------------------------
// Stage card
// ---------------------------------------------------------------------------
function StageCard({
  step,
  index,
  isActive,
  reduced,
  onIntersect,
}: {
  step: (typeof processSteps)[number];
  index: number;
  isActive: boolean;
  reduced: boolean;
  onIntersect: (idx: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const color = STAGE_COLORS[index % STAGE_COLORS.length];

  // Scroll-driven parallax: oversized stage number drifts within the card
  // as the user scrolls past, giving a dramatic depth effect.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -80]);
  const parallaxX = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-30, 30]);

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
          if (e.intersectionRatio >= 0.3) {
            setEntered(true);
            onIntersect(index);
          }
        }
      },
      { threshold: [0.3, 0.55] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, index, onIntersect]);

  return (
    <motion.div
      ref={ref}
      id={`stage-${step.index}`}
      className="relative scroll-mt-32"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div
        className="relative p-7 md:p-9 overflow-hidden"
        style={{
          background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: `1px solid ${isActive ? `${color}50` : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: 6,
          boxShadow: isActive
            ? `0 32px 64px -32px ${color}40, 0 0 0 1px ${color}30 inset`
            : '0 12px 32px -16px rgba(0, 0, 0, 0.30)',
          transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Lens-flare sweep that animates across active cards */}
        {isActive && !reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: 0,
              bottom: 0,
              width: '40%',
              background: `linear-gradient(115deg, transparent 0%, ${color}30 45%, ${color}70 50%, ${color}30 55%, transparent 100%)`,
              filter: 'blur(6px)',
              mixBlendMode: 'screen',
            }}
            initial={{ left: '-50%' }}
            animate={{ left: '120%' }}
            transition={{ duration: 2.4, ease: EASE, repeat: Infinity, repeatDelay: 4 }}
          />
        )}

        {/* Oversized stage number — scroll-parallax drift */}
        <motion.div
          aria-hidden="true"
          className="absolute pointer-events-none select-none font-display font-bold leading-none"
          style={{
            top: -10,
            right: 14,
            fontSize: 'clamp(7rem, 14vw, 11rem)',
            color: color,
            opacity: isActive ? 0.22 : 0.09,
            letterSpacing: '-0.06em',
            transition: 'opacity 500ms ease',
            y: parallaxY,
            x: parallaxX,
          }}
        >
          {String(step.index).padStart(2, '0')}
        </motion.div>

        {/* Brand-color top stripe */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[2px] transition-all duration-700"
          style={{
            background: `linear-gradient(to right, ${color}, transparent)`,
            width: isActive ? '60%' : '25%',
          }}
        />

        <div className="relative">
          <div className="flex items-baseline gap-3 mb-3">
            <span
              aria-hidden="true"
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color }}
            >
              Stage {String(step.index).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              · {step.duration}
            </span>
          </div>

          <h3
            className="font-display font-bold text-white tracking-tight leading-[1.1] mb-3 max-w-2xl"
            style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)' }}
          >
            {step.title}
          </h3>

          <p className="text-white/65 text-[15px] leading-relaxed mb-5 max-w-2xl">
            {step.description}
          </p>

          {/* Deliverable strip */}
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="block h-px w-8" style={{ background: color }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Delivers · {step.output}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export function ProcessRoadmap() {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  // Scroll to a stage when picker clicked
  const jumpTo = (idx: number) => {
    const el = document.getElementById(`stage-${processSteps[idx].index}`);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  if (reduced) {
    return (
      <section className="relative py-24 bg-bg border-t border-line" id="process">
        <div className="container-svc">
          <div className="max-w-3xl mb-10">
            <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-3">
              The process · {processSteps.length} stages
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-3">
              How a drive runs.
            </h2>
          </div>
          <ol className="space-y-6">
            {processSteps.map((s) => (
              <li key={s.index} className="border-l-2 border-accent pl-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 mb-1">
                  Stage {String(s.index).padStart(2, '0')} · {s.duration}
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-1.5 tracking-tight">{s.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-24 md:py-32 border-y border-line overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #0a2540 0%, #0d2a4a 50%, #0a2540 100%)' }}
      id="process"
      aria-label="The placement process, end to end"
    >
      {/* Atmospheric backdrop with drifting orbs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 25%, rgba(127, 217, 193, 0.18), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(162, 107, 255, 0.18), transparent 55%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '5%',
          top: '20%',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(99, 91, 255, 0.20), transparent 65%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: '5%',
          bottom: '20%',
          width: 520,
          height: 520,
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.16), transparent 65%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-svc relative">
        <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-start">
          {/* Left: sticky navigator */}
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative inline-flex w-2 h-2">
                <span className="absolute inset-0 rounded-full opacity-70 animate-ping" style={{ background: '#7fd9c1' }} />
                <span className="relative w-2 h-2 rounded-full" style={{ background: '#7fd9c1' }} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                The process · {processSteps.length} stages
              </span>
            </div>
            <h2
              className="font-display font-bold text-white leading-[1.04] tracking-[-0.028em] mb-4"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)' }}
            >
              <WordReveal text="How a drive runs." active delay={0.1} stagger={0.04} />
            </h2>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              From the first recruiter email to onboarding. Every drive is run
              by a coordinator, on a schedule the cell publishes.
            </p>

            {/* Stage picker */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-3">
                Jump to stage
              </div>
              <div className="flex flex-wrap gap-1.5">
                {processSteps.map((s, i) => {
                  const isActive = i === activeIdx;
                  const color = STAGE_COLORS[i % STAGE_COLORS.length];
                  return (
                    <button
                      key={s.index}
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Jump to ${s.title}`}
                      className="group inline-flex items-center justify-center w-9 h-9 rounded text-[12px] font-mono font-bold tabular-nums transition-all duration-300"
                      style={{
                        background: isActive ? color : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#0a2540' : 'rgba(255, 255, 255, 0.6)',
                        border: `1px solid ${isActive ? color : 'rgba(255, 255, 255, 0.12)'}`,
                      }}
                    >
                      {String(s.index).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: stage cards on a connecting timeline */}
          <div className="relative">
            {/* Connecting timeline rail */}
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 w-px"
              style={{
                left: 20,
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(127, 217, 193, 0.4) 8%, rgba(99, 91, 255, 0.4) 50%, rgba(255, 107, 157, 0.4) 92%, transparent 100%)',
              }}
            />

            <div className="flex flex-col gap-5 md:gap-6">
              {processSteps.map((s, i) => (
                <div key={s.index} className="relative pl-10 md:pl-12">
                  {/* Stage node on timeline */}
                  <div
                    aria-hidden="true"
                    className="absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      left: 12,
                      top: 28,
                      background: i === activeIdx ? STAGE_COLORS[i % STAGE_COLORS.length] : 'rgba(255, 255, 255, 0.08)',
                      border: `2px solid ${i === activeIdx ? STAGE_COLORS[i % STAGE_COLORS.length] : 'rgba(255, 255, 255, 0.20)'}`,
                      boxShadow: i === activeIdx ? `0 0 16px ${STAGE_COLORS[i % STAGE_COLORS.length]}80` : 'none',
                    }}
                  >
                    {i === activeIdx && (
                      <span
                        className="block w-1.5 h-1.5 rounded-full"
                        style={{ background: '#0a2540' }}
                      />
                    )}
                  </div>

                  <StageCard
                    step={s}
                    index={i}
                    isActive={i === activeIdx}
                    reduced={reduced}
                    onIntersect={setActiveIdx}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitFlapCounter } from '@/components/ui/SplitFlapCounter';
import { Sunburst } from '@/components/animations/Sunburst';
import { currentCycleStats } from '@/lib/data/stats';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

const cells = [
  { label: 'Placement offers', value: currentCycleStats.totalPlacementOffers, decimals: 0, suffix: '', cap: 'Final selections across streams' },
  { label: 'Internship offers', value: currentCycleStats.totalInternshipOffers, decimals: 0, suffix: '', cap: 'Summer plus PPO-track' },
  { label: 'Peak CTC', value: currentCycleStats.peakCtcLPA, decimals: 2, suffix: 'LPA', cap: 'Highest fixed offer this cycle' },
  { label: 'Average CTC', value: currentCycleStats.averageCtcLPA, decimals: 2, suffix: 'LPA', cap: 'Mean of accepted offers' },
  { label: 'Gross offer value', value: currentCycleStats.grossOfferValueCr, decimals: 2, suffix: 'Cr', cap: 'Cumulative CTC across offers' },
  { label: 'Recruiters engaged', value: currentCycleStats.recruitersEngaged, decimals: 0, suffix: '+', cap: 'Firms that ran a process' },
];

/**
 * Dust layer — slow drifting tiny particles (60 dots) layered behind everything.
 * Pure decoration, reduced-motion safe.
 */
function DustLayer({ count = 60 }: { count?: number }) {
  const dots = Array.from({ length: count }).map((_, i) => ({
    left: (i * 71 + 13) % 100,
    top: (i * 41 + 7) % 100,
    size: 1 + (i % 3),
    delay: (i * 0.4) % 14,
    duration: 12 + (i % 7) * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: 0.18 + (i % 3) * 0.06,
          }}
          animate={{
            y: [0, -22, 0],
            x: [0, 6, -4, 0],
            opacity: [0.12, 0.42, 0.12],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Dotted texture pattern. SVG circles on a grid, very low opacity.
 * The kind of background dot pattern you see on Stripe / Linear hero areas.
 */
function DottedPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="stats-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(99, 91, 255, 0.18)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stats-dots)" />
    </svg>
  );
}

/**
 * Single hover-burst spark. Animates outward from a click/hover origin.
 */
type Spark = { id: number; x: number; y: number; angle: number; distance: number; color: string };

function HoverBurst({ sparks }: { sparks: Spark[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: 4,
              height: 4,
              background: s.color,
              boxShadow: `0 0 8px ${s.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(s.angle) * s.distance,
              y: Math.sin(s.angle) * s.distance,
              opacity: 0,
              scale: 0.4,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * StatsCell — wraps each metric in a hover-reactive container.
 * On hover or click, emits a burst of brand-color sparks from the cursor position.
 * Like Splice / Aquaman, where touching matter releases a flurry.
 */
function StatsCell({
  cell, index, reduced,
}: {
  cell: typeof cells[number];
  index: number;
  reduced: boolean;
}) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);

  const emit = (origin: { x: number; y: number }, count = 12) => {
    if (reduced) return;
    const colors = ['#635bff', '#a26bff', '#ff6b9d', '#ffb088'];
    const newSparks = Array.from({ length: count }).map((_, i) => ({
      id: ++idRef.current,
      x: origin.x,
      y: origin.y,
      angle: (Math.PI * 2 * i) / count + Math.random() * 0.3,
      distance: 40 + Math.random() * 60,
      color: colors[i % colors.length],
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    // Clear after animation
    window.setTimeout(() => {
      setSparks((prev) => prev.slice(newSparks.length));
    }, 1300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
      className="relative overflow-hidden bg-surface/95 backdrop-blur-sm p-8 md:p-10 hover:bg-surface-2 transition-colors duration-500 group cursor-default"
      onPointerEnter={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        emit({ x: e.clientX - rect.left, y: e.clientY - rect.top }, 10);
      }}
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        emit({ x: e.clientX - rect.left, y: e.clientY - rect.top }, 18);
      }}
    >
      <HoverBurst sparks={sparks} />
      <div className="relative">
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3 mb-3 group-hover:text-accent transition-colors">
          {cell.label}
        </div>
        <div className="font-display font-bold text-4xl md:text-5xl text-ink mb-2 tracking-[-0.025em]">
          <SplitFlapCounter value={cell.value} decimals={cell.decimals} suffix={cell.suffix} />
        </div>
        <div className="text-sm text-ink-3">{cell.cap}</div>
      </div>
    </motion.div>
  );
}

export function StatsBar() {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative section-spacing bg-bg-2 border-t border-b border-line overflow-hidden"
      id="stats"
    >
      {/* Background layers, far back to near */}
      <DottedPattern />
      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none opacity-[0.14]">
        <Sunburst count={120} color="#635bff" />
      </div>
      {!reduced && <DustLayer count={70} />}

      <div className="container-svc relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-14"
        >
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mb-4">
            Cycle {currentCycleStats.cycle} / Aggregate
          </div>
          <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.028em]">
            <span className="text-ink">Cycle data at a glance.</span>{' '}
            <span className="text-ink-3">Numbers for the running cycle.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden border border-line shadow-soft-lg">
          {cells.map((c, i) => (
            <StatsCell key={c.label} cell={c} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}

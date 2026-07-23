import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BadgeCheck, RefreshCcw, ListChecks, Sparkles } from 'lucide-react';
import { cvVettingPillars, trainingPrograms } from '@/lib/data/academic';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Initiatives by the Cell — editorial redesign.
 *
 * Top: four large numbered "pillar" cards laid out in a 2-column grid with
 *      alternating vertical offsets so they read as an editorial spread
 *      rather than a uniform 2x2.
 *
 *      Each card: full-size icon in a brand-color wash, oversized display
 *      title, body, optional supporting metric. Light theme.
 *
 * Below: training programmes as a single horizontal track of 3 numbered
 *        cards on a darker contrasting band.
 *
 * Background: light cream/lavender wash with two drifting orbs.
 */

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

const PILLAR_ICONS = [ShieldCheck, BadgeCheck, RefreshCcw, ListChecks] as const;
const PILLAR_COLORS = ['#1e4e8c', '#b8893b', '#1e4e8c', '#b8893b'];

// Editorial offset positions per pillar — alternating high/low for visual
// rhythm rather than a flat 2x2 grid.
const PILLAR_OFFSETS = [
  { lg: 'lg:translate-y-0',  delay: 0.0 },
  { lg: 'lg:translate-y-10', delay: 0.12 },
  { lg: 'lg:translate-y-6',  delay: 0.24 },
  { lg: 'lg:translate-y-16', delay: 0.36 },
];

export function InitiativesByCell() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
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
          if (e.intersectionRatio >= 0.12) {
            setEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: [0.12] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 border-t border-line overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #f6f8fb 0%, #eef1f6 100%)' }}
      aria-label="Initiatives run by the placement cell"
    >
      {/* Atmospheric backdrop */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '-10%',
          top: '15%',
          width: 580,
          height: 580,
          background: 'radial-gradient(circle, rgba(30, 78, 140, 0.16), transparent 65%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: '-8%',
          bottom: '8%',
          width: 620,
          height: 620,
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.14), transparent 65%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-svc relative">
        {/* Header */}
        <div className="max-w-3xl mb-14 md:mb-20">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Sparkles size={14} strokeWidth={2} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              Initiatives by the cell
            </span>
          </motion.div>
          <h2
            className="font-display font-bold text-ink leading-[1.02] tracking-[-0.032em] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
          >
            <WordReveal text="The work behind every drive." active={entered} delay={0.18} stagger={0.04} />
          </h2>
          <motion.p
            className="text-ink-3 text-base md:text-lg leading-relaxed max-w-2xl"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
          >
            Two layers. The vetting that protects recruiter time. The
            development that prepares the student for the desk they apply to.
          </motion.p>
        </div>

        {/* Part A: CV vetting four pillars in offset 2-column editorial grid */}
        <div className="mb-20 md:mb-28">
          <motion.div
            className="flex items-baseline gap-3 mb-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.85 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              Layer 01
            </span>
            <span aria-hidden="true" className="block h-px w-12 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
              CV vetting · four pillars
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8 md:gap-y-12">
            {cvVettingPillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i];
              const color = PILLAR_COLORS[i];
              const offset = PILLAR_OFFSETS[i];
              return (
                <motion.div
                  key={p.id}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 1.0 + offset.delay }}
                  className={`relative ${offset.lg}`}
                >
                  <div className="relative group">
                    {/* Number stamp */}
                    <div
                      className="absolute -top-3 -left-2 font-display font-bold tracking-[-0.04em] leading-none pointer-events-none select-none"
                      style={{
                        fontSize: 'clamp(5rem, 10vw, 7.5rem)',
                        color: color,
                        opacity: 0.10,
                        zIndex: 0,
                      }}
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </div>

                    {/* Card */}
                    <div
                      className="relative p-7 md:p-9"
                      style={{
                        background: 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        border: '1px solid rgba(10, 37, 64, 0.08)',
                        borderRadius: 4,
                        boxShadow: '0 20px 48px -28px rgba(10, 37, 64, 0.18)',
                        transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms, border-color 400ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!reduced) {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = `0 32px 56px -24px ${color}45`;
                          e.currentTarget.style.borderColor = `${color}30`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!reduced) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 20px 48px -28px rgba(10, 37, 64, 0.18)';
                          e.currentTarget.style.borderColor = 'rgba(10, 37, 64, 0.08)';
                        }
                      }}
                    >
                      {/* Brand-color top stripe */}
                      <div
                        aria-hidden="true"
                        className="absolute top-0 left-0 h-[2px] transition-all duration-700 group-hover:right-0"
                        style={{ background: color, right: '60%' }}
                      />

                      <div className="flex items-start gap-5">
                        <div
                          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-500"
                          style={{
                            background: `${color}14`,
                            color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color }}>
                            {p.kicker}
                          </div>
                          <h3 className="font-display font-bold text-ink text-xl md:text-2xl tracking-tight leading-[1.15] mb-3">
                            {p.title}
                          </h3>
                          <p className="text-sm text-ink-2 leading-relaxed">{p.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Part B: training programmes as a horizontal track */}
        <div className="relative">
          <motion.div
            className="flex items-baseline gap-3 mb-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 1.5 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              Layer 02
            </span>
            <span aria-hidden="true" className="block h-px w-12 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
              Training and development
            </span>
          </motion.div>

          <div className="relative">
            {/* Connecting timeline track */}
            <div
              aria-hidden="true"
              className="absolute hidden md:block top-7 left-7 right-7 h-px"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(30, 78, 140, 0.3), transparent)',
              }}
            />

            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              {trainingPrograms.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 1.65 + i * 0.12 }}
                  className="relative"
                >
                  {/* Timeline node */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg"
                      style={{
                        background: '#fff',
                        border: '2px solid #1e4e8c',
                        color: '#1e4e8c',
                        boxShadow: '0 6px 16px -6px rgba(30, 78, 140, 0.4)',
                        zIndex: 1,
                      }}
                    >
                      0{i + 1}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-ink text-lg md:text-xl tracking-tight leading-tight mb-2 pl-1">
                    {t.title}
                  </h3>
                  <p className="text-sm text-ink-2 leading-relaxed pl-1">
                    {t.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

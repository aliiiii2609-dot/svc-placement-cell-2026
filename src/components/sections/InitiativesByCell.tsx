import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BadgeCheck,
  RefreshCcw,
  ListChecks,
  Mic,
  MessagesSquare,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cvVettingPillars, trainingPrograms } from '@/lib/data/academic';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Initiatives by the Cell — unified glass-card redesign (light theme).
 *
 * One consistent card system across two labelled layers:
 *   Layer 01 · CV vetting        → four navy-toned pillar cards (2-col grid)
 *   Layer 02 · Training & dev.    → three gold-toned programme cards (3-col grid)
 *
 * Every card shares the same glass surface, padding, icon chip, kicker,
 * title and body treatment, and stretches to equal height within its row.
 * Motion is a subtle whileInView rise, gated on prefers-reduced-motion and
 * always resolving to fully visible.
 */

type IconType = ComponentType<LucideProps>;

const PILLAR_ICONS: readonly IconType[] = [ShieldCheck, BadgeCheck, RefreshCcw, ListChecks];
const PROGRAMME_ICONS: readonly IconType[] = [Mic, MessagesSquare, GraduationCap];

type Tone = 'accent' | 'gold';

const TONE: Record<Tone, { chip: string; text: string; num: string }> = {
  accent: {
    chip: 'bg-accent/10 border-accent/20',
    text: 'text-accent',
    num: 'text-accent/40',
  },
  gold: {
    chip: 'bg-gold/10 border-gold/25',
    text: 'text-gold',
    num: 'text-gold/45',
  },
};

function InitiativeCard({
  index,
  kicker,
  title,
  description,
  Icon,
  tone,
  reduced,
  delay,
}: {
  index: number;
  kicker: string;
  title: string;
  description: string;
  Icon: IconType;
  tone: Tone;
  reduced: boolean;
  delay: number;
}) {
  const t = TONE[tone];
  const rise = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.55, ease: EASE, delay },
      };

  return (
    <motion.article
      {...rise}
      className="glass h-full flex flex-col p-6 md:p-7 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${t.chip} ${t.text}`}
        >
          <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span
          className={`font-display font-bold leading-none tracking-tight tabular-nums ${t.num}`}
          style={{ fontSize: '2rem' }}
          aria-hidden="true"
        >
          0{index + 1}
        </span>
      </div>

      <div className={`mt-6 font-mono text-[10px] uppercase tracking-[0.2em] ${t.text}`}>
        {kicker}
      </div>
      <h3 className="mt-2 font-display text-lg md:text-xl font-bold leading-snug tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{description}</p>
    </motion.article>
  );
}

function LayerLabel({
  step,
  label,
  reduced,
}: {
  step: string;
  label: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="mb-8 flex items-center gap-3"
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">{step}</span>
      <span aria-hidden="true" className="h-px w-10 bg-line" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">{label}</span>
    </motion.div>
  );
}

export function InitiativesByCell() {
  const reduced = useReducedMotion();

  const headRise = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
      };

  return (
    <section
      className="relative overflow-hidden border-t border-line bg-gradient-to-b from-bg to-bg-2 py-24 md:py-32"
      aria-label="Initiatives run by the placement cell"
    >
      {/* Soft gold bloom, static and restrained — sits over paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[12%] h-[520px] w-[520px]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--gold) / 0.10), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-svc relative">
        {/* Header */}
        <div className="mb-16 max-w-3xl md:mb-20">
          <motion.div
            className="mb-4 flex items-center gap-2.5"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Sparkles size={14} strokeWidth={2} className="text-gold" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
              Initiatives by the cell
            </span>
          </motion.div>

          <motion.h2
            {...headRise}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-4 font-display font-bold leading-[1.03] tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)' }}
          >
            The work behind every drive.
          </motion.h2>

          <motion.p
            {...headRise}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg"
          >
            Two layers. The vetting that protects recruiter time, and the development that prepares
            the student for the desk they apply to.
          </motion.p>
        </div>

        {/* Layer 01 — CV vetting */}
        <div className="mb-16 md:mb-24">
          <LayerLabel step="Layer 01" label="CV vetting · four pillars" reduced={reduced} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
            {cvVettingPillars.map((p, i) => (
              <InitiativeCard
                key={p.id}
                index={i}
                kicker={p.kicker}
                title={p.title}
                description={p.description}
                Icon={PILLAR_ICONS[i] ?? ShieldCheck}
                tone="accent"
                reduced={reduced}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* Layer 02 — Training and development */}
        <div>
          <LayerLabel step="Layer 02" label="Training and development" reduced={reduced} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {trainingPrograms.map((t, i) => (
              <InitiativeCard
                key={t.id}
                index={i}
                kicker={t.kicker}
                title={t.title}
                description={t.description}
                Icon={PROGRAMME_ICONS[i] ?? GraduationCap}
                tone="gold"
                reduced={reduced}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

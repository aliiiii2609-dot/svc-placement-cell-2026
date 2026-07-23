import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { rankings } from '@/lib/data/rankings';

/**
 * Rankings constellation — Marvel/DC title-card animation.
 *
 * Three rank cards. Each card:
 *   1. Authority logo (real, from Brandfetch)
 *   2. Big rank number that "slots in" with a cinematic animation
 *      (vertical slot machine + rotation + overshoot, like Marvel
 *      Studios intro chyrons or DC title cards)
 *   3. Category caption
 *
 * The slot animation uses Framer Motion's spring physics with a
 * deliberate overshoot. After the digit lands, a faint shimmer sweeps
 * across the number, which is the touch that sells the "movie title"
 * feel.
 */

type Card = {
  authority: string;
  fullName: string;
  /** Local logo path. */
  logoPath: string;
  /** The headline value (number, letter grade, or short string). */
  rank: string;
  /** Optional decorator after the rank (e.g. "th", "rd"). */
  suffix?: string;
  category: string;
  year: string;
  accent: string;
};

/**
 * Presentation metadata per ranking authority. The rank values, categories,
 * years, and badge slugs are the single source of truth in
 * `@/lib/data/rankings`; only the display name and brand accent live here.
 * Accents use on-brand SVC hues (gold, bright gold, navy) — never pastels.
 */
const RANK_META: Record<string, { fullName: string; accent: string }> = {
  NIRF: {
    fullName: 'National Institutional Ranking Framework',
    accent: '#B8893B',
  },
  NAAC: {
    fullName: 'National Assessment and Accreditation Council',
    accent: '#D4A857',
  },
  Outlook: {
    fullName: 'Outlook India College Rankings',
    accent: '#0B1F44',
  },
  'India Today': {
    fullName: 'India Today Best Colleges Survey',
    accent: '#B8893B',
  },
};

/**
 * Ordinal suffix for a numeric rank (11 → "th", 6 → "th", 1 → "st").
 * Non-numeric ranks (e.g. "A+") get no suffix. Derived so it stays correct
 * if the rank values are updated at the source.
 */
function ordinalSuffix(rank: string): string | undefined {
  const n = Number(rank);
  if (!Number.isInteger(n)) return undefined;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const cards: Card[] = rankings.map((entry) => {
  const meta = RANK_META[entry.authority] ?? {
    fullName: entry.authority,
    accent: '#B8893B',
  };
  return {
    authority: entry.authority,
    fullName: meta.fullName,
    logoPath: `/logos/rankings/${entry.badgeSlug ?? entry.authority.toLowerCase()}.png`,
    rank: entry.rank,
    suffix: ordinalSuffix(entry.rank),
    category: entry.category ?? '',
    year: entry.year,
    accent: meta.accent,
  };
});

/**
 * Cinematic digit slot. Each character of the rank value cycles through
 * randomized characters before settling on the target. Inspired by
 * Marvel Studios intro typography and DC title-card digit reels.
 */
function CinematicDigit({
  value,
  trigger,
  delay,
}: {
  value: string;
  trigger: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState(value);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    let raf = 0;
    const candidates = '0123456789ABCDEFGHJKLMPRSTVWXYZ+';
    const startTime = performance.now();
    const totalDuration = 800; // ms of cycling per character
    const tickInterval = 45; // ms

    const tick = (now: number) => {
      const elapsed = now - startTime - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (elapsed >= totalDuration) {
        setDisplay(value);
        setSettled(true);
        return;
      }
      // Show a random character occasionally during the cycle
      if (frame % Math.max(1, Math.floor(tickInterval / 16)) === 0) {
        const ch = candidates[Math.floor(Math.random() * candidates.length)];
        setDisplay(ch);
      }
      frame += 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, value, delay]);

  return (
    <motion.span
      className="inline-block tabular-nums"
      animate={
        settled
          ? {
              scale: [1, 1.06, 1],
              rotateX: [0, 8, 0],
            }
          : {}
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {display}
    </motion.span>
  );
}

function RankCard({ card, index, triggered }: { card: Card; index: number; triggered: boolean }) {
  const baseDelay = 200 + index * 220;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative group rounded-2xl overflow-hidden',
        'bg-surface/85 backdrop-blur-md border border-line shadow-soft',
        'p-7 transition-all duration-500',
        'hover:shadow-soft-lg hover:border-[rgba(184,137,59,0.3)] hover:-translate-y-1',
      )}
      style={{ perspective: 1200 }}
    >
      {/* Cinematic accent stripe along the top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={triggered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: index * 0.18 + 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Authority logo (full-color real logo, no white box wrapper) + label */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-16 h-16 flex items-center justify-center shrink-0" aria-hidden="true">
          <img
            src={card.logoPath}
            alt={`${card.authority} logo`}
            className="object-contain max-w-full max-h-full"
            loading="eager"
          />
        </div>
        <div className="leading-tight">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 font-medium">
            {card.authority} <span className="opacity-50">·</span> {card.year}
          </div>
          <div className="font-sans text-[11px] text-ink-3 mt-0.5 leading-snug max-w-[180px]">
            {card.fullName}
          </div>
        </div>
      </div>

      {/* THE rank number — cinematic */}
      <div className="relative flex items-baseline gap-2 mb-5">
        {/* Glow halo behind the number */}
        <div
          className="absolute -inset-3 -z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at center, ${card.accent}33, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-baseline">
          {card.rank.split('').map((ch, i) => (
            <span
              key={i}
              className="font-display font-bold text-[clamp(4rem,8vw,7rem)] leading-[0.9] text-ink tracking-[-0.04em]"
              style={{
                background: triggered
                  ? `linear-gradient(180deg, #0a2540 0%, #0a2540 60%, ${card.accent} 130%)`
                  : '#0a2540',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <CinematicDigit value={ch} trigger={triggered} delay={baseDelay + i * 80} />
            </span>
          ))}
          {card.suffix && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: (baseDelay + 600) / 1000 }}
              className="font-display font-medium text-2xl text-ink-3 ml-1 tracking-tight"
            >
              {card.suffix}
            </motion.span>
          )}
        </div>

        {/* Cinematic shimmer that sweeps across the number after it settles */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: (baseDelay + 900) / 1000 }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{
              background: `linear-gradient(110deg, transparent, ${card.accent}45, transparent)`,
              filter: 'blur(3px)',
            }}
            initial={{ x: '-150%' }}
            animate={triggered ? { x: '350%' } : { x: '-150%' }}
            transition={{ duration: 1.4, delay: (baseDelay + 900) / 1000, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>

      <div className="font-display font-semibold text-lg text-ink tracking-tight leading-snug">
        {card.category}
      </div>
    </motion.div>
  );
}

export function RankingsConstellation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [triggered, setTriggered] = useState(false);

  // Reliability net. The cards start at opacity 0 and only reveal once
  // `triggered` flips true. If framer's useInView ever fails to fire — which
  // happened on mobile where the stacked grid is very tall, and occasionally
  // on desktop when this hero sub-section mounts mid-scroll — the cards would
  // sit permanently blank. So we flip `triggered` on ANY of: useInView firing,
  // a manual in-viewport check on mount + scroll, or a short grace timeout.
  // Content is therefore guaranteed to appear.
  useEffect(() => {
    if (triggered) return;
    if (inView) {
      setTriggered(true);
      return;
    }
    const check = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.9 && r.bottom > 0) setTriggered(true);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    const t = window.setTimeout(() => setTriggered(true), 2200);
    return () => {
      window.removeEventListener('scroll', check);
      window.clearTimeout(t);
    };
  }, [inView, triggered]);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <RankCard key={c.authority} card={c} index={i} triggered={triggered} />
      ))}
    </div>
  );
}

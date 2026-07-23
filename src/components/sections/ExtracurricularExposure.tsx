import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { studentSocieties, type SocietyCategory } from '@/lib/data/academic';
import { brandIconUrl } from '@/lib/data/brand';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Extracurricular Exposure section.
 *
 * Three glassy category panes, each containing the society names as a
 * cascade of editorial chips. Categories: Academic, Cultural, Social
 * Service & Entrepreneurship.
 *
 * The pattern: editorial publication, not a logo grid. Each society name
 * reads cleanly without needing a sourced logo bitmap. Hover treatment
 * draws a brand-color hairline beneath the chip.
 *
 * Atmospheric backdrop with two large blurred gradient orbs (cream and
 * lavender, drifting slowly), plus the site-wide ambient dust layer
 * running over the top.
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

// ---------------------------------------------------------------------------
// Society chip: square logo tile + name. Fixed height (40px), variable width.
// Uses Brandfetch icon when domain is available, monogram otherwise.
// ---------------------------------------------------------------------------
function SocietyChip({
  society,
  brandColor,
  entered,
  delay,
  reduced,
}: {
  society: (typeof studentSocieties)[number];
  brandColor: string;
  entered: boolean;
  delay: number;
  reduced: boolean;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const useLogo = !!society.domain && !logoFailed;
  const monogram = society.shortName ?? society.name
    .split(/[\s,&-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 3).toUpperCase();

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="inline-flex"
    >
      <span
        className="group relative inline-flex items-center gap-2.5 pr-3.5 py-1 rounded-full bg-white border border-ink/10 transition-all duration-300 hover:border-ink/25 hover:shadow-soft"
        style={{ cursor: 'default', height: 38 }}
      >
        {/* Logo tile or monogram */}
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 30,
            height: 30,
            marginLeft: 4,
            borderRadius: '20%',
            background: useLogo ? '#fff' : `${brandColor}1a`,
            border: useLogo ? '1px solid rgba(10, 37, 64, 0.06)' : `1px solid ${brandColor}40`,
            overflow: 'hidden',
          }}
        >
          {useLogo ? (
            <img
              src={brandIconUrl(society.domain!)}
              alt=""
              className="w-full h-full object-contain"
              style={{ padding: '3px' }}
              loading="lazy"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="font-display font-bold tracking-tight"
              style={{ color: brandColor, fontSize: monogram.length <= 2 ? 11 : 9 }}
            >
              {monogram}
            </span>
          )}
        </span>
        {/* Name */}
        <span className="font-display font-medium text-ink text-[12.5px] tracking-tight leading-none">
          {society.name}
        </span>
      </span>
    </motion.li>
  );
}

const CATEGORY_META: Record<SocietyCategory, { kicker: string; brandColor: string; description: string }> = {
  'Academic': {
    kicker: 'Academic societies',
    brandColor: '#1e4e8c',
    description:
      'Classroom learning extended through hands-on practice. Consulting projects, equity research desks, debating circuits, model finance.',
  },
  'Cultural': {
    kicker: 'Cultural societies',
    brandColor: '#b8893b',
    description:
      'A platform for creative practice. Dramatics in English and Hindi, fine arts, choreography, music. The campus stays loud and curious.',
  },
  'Social Service & Entrepreneurship': {
    kicker: 'Service and enterprise',
    brandColor: '#b8893b',
    description:
      'Community impact and student ventures, side by side. Enactus, Connecting Dreams, the NSS wing, and the cell-incubated impact projects.',
  },
};

function CategoryPane({
  category,
  societies,
  entered,
  rowDelay,
  reduced,
}: {
  category: SocietyCategory;
  societies: typeof studentSocieties;
  entered: boolean;
  rowDelay: number;
  reduced: boolean;
}) {
  const meta = CATEGORY_META[category];
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: EASE, delay: rowDelay }}
      className="relative"
    >
      {/* Glassy card */}
      <div
        className="relative p-7 md:p-8 h-full"
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(10, 37, 64, 0.08)',
          borderRadius: 4,
          boxShadow: '0 24px 48px -32px rgba(10, 37, 64, 0.18), 0 4px 12px -6px rgba(10, 37, 64, 0.06)',
        }}
      >
        {/* Brand-color accent stripe top */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t"
          style={{ background: `linear-gradient(to right, ${meta.brandColor}, transparent)` }}
        />

        <div className="flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="block w-1.5 h-1.5 rounded-full" style={{ background: meta.brandColor }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            {meta.kicker}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-ink-3">
            · {societies.length}
          </span>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed mb-5">
          {meta.description}
        </p>

        <div className="h-px bg-line mb-5" aria-hidden="true" />

        <ul className="flex flex-wrap gap-2">
          {societies.map((s, i) => (
            <SocietyChip
              key={s.name}
              society={s}
              brandColor={meta.brandColor}
              entered={entered}
              delay={rowDelay + 0.35 + i * 0.045}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function ExtracurricularExposure() {
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
          if (e.intersectionRatio >= 0.15) {
            setEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: [0.15] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const byCategory: Array<{ category: SocietyCategory; entries: typeof studentSocieties }> = [
    { category: 'Academic',  entries: studentSocieties.filter((s) => s.category === 'Academic') },
    { category: 'Cultural',  entries: studentSocieties.filter((s) => s.category === 'Cultural') },
    { category: 'Social Service & Entrepreneurship', entries: studentSocieties.filter((s) => s.category === 'Social Service & Entrepreneurship') },
  ];

  return (
    <section
      ref={ref}
      className="relative section-spacing border-t border-line overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #f6f8fb 0%, #eef1f6 100%)' }}
      aria-label="Extracurricular societies at SVC"
    >
      {/* Atmospheric blurred orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 pointer-events-none"
        style={{
          width: 580,
          height: 580,
          background:
            'radial-gradient(circle, rgba(30, 78, 140, 0.18), transparent 65%)',
          filter: 'blur(80px)',
          animation: 'orb-drift-a 26s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 pointer-events-none"
        style={{
          width: 620,
          height: 620,
          background:
            'radial-gradient(circle, rgba(255, 107, 157, 0.16), transparent 65%)',
          filter: 'blur(90px)',
          animation: 'orb-drift-b 32s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes orb-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes orb-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -15px) scale(1.04); }
        }
      `}</style>

      <div className="container-svc relative">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-14">
          <motion.div
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            Extracurricular exposure
          </motion.div>
          <h2
            className="font-display font-bold text-ink leading-[1.04] tracking-[-0.028em] mb-3"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
          >
            <WordReveal text="The campus that runs alongside the classroom." active={entered} delay={0.18} stagger={0.04} />
          </h2>
          <motion.p
            className="text-ink-3 text-base md:text-lg leading-relaxed max-w-2xl mt-3"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
          >
            Most graduates of the cell are also office-bearers of a society.
            The work of running an organisation while studying for finals
            shows up later in interviews.
          </motion.p>
        </div>

        {/* Three category panes */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {byCategory.map((g, gi) => (
            <CategoryPane
              key={g.category}
              category={g.category}
              societies={g.entries}
              entered={entered}
              rowDelay={0.8 + gi * 0.18}
              reduced={reduced}
            />
          ))}
        </div>

        {/* Bottom telemetry */}
        <motion.div
          className="mt-12 pt-6 border-t border-line flex items-center justify-between gap-4 flex-wrap"
          initial={reduced ? false : { opacity: 0 }}
          animate={entered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 1.6 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            {studentSocieties.length} societies · 3 categories
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            Reproduced from the 2025-26 brochure
          </span>
        </motion.div>
      </div>
    </section>
  );
}

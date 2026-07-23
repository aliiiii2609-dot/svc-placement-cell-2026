import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  higherEdInstitutions,
  groupHigherEdBySector,
  type HigherEdSector,
  type HigherEdInstitution,
} from '@/lib/data/higher-ed';
import { brandLogoUrl } from '@/lib/data/brand';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

function CursorGlow({ x, y }: { x: number; y: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none rounded-full"
      style={{
        left: x - 90,
        top: y - 90,
        width: 180,
        height: 180,
        background: 'radial-gradient(circle, rgba(99, 91, 255, 0.18), transparent 70%)',
        filter: 'blur(14px)',
        zIndex: 5,
      }}
    />
  );
}

/**
 * Single institution frame — broadcast-graphic per brief.
 * Treatment matches Core Team:
 *   - Hairline rule below the logo zone
 *   - Index number top-right
 *   - Focus-pull on hover (this frame brightens, others dim)
 *   - Hairline overshoots on hover
 *   - Cursor-follow glow on the logo area
 */
function InstitutionFrame({
  institution,
  index,
  entered,
  hoveredId,
  setHoveredId,
  reduced,
}: {
  institution: HigherEdInstitution;
  index: number;
  entered: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  reduced: boolean;
}) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const isAnyHovered = hoveredId !== null;
  const isHovered = hoveredId === institution.slug;
  const isDimmed = isAnyHovered && !isHovered;

  const display = institution.shortName ?? institution.name;
  const initials = display
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  // Wave entrance delay
  const waveDelay = (index % 12) * 0.05;

  return (
    <motion.a
      href={`https://${institution.domain}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHoveredId(institution.slug)}
      onMouseLeave={() => {
        setHoveredId(null);
        setCursor(null);
      }}
      aria-label={`${institution.name}, ${institution.location}. Opens in a new tab.`}
      title={`${institution.name} · ${institution.location}`}
      className={cn(
        'relative group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md',
      )}
      animate={{ opacity: isDimmed ? 0.55 : 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Logo zone */}
      <motion.div
        onPointerMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className={cn(
          'relative w-full flex items-center justify-center overflow-hidden bg-surface h-24',
        )}
        initial={reduced ? false : { clipPath: 'inset(100% 0 0 0)' }}
        animate={
          reduced
            ? undefined
            : entered
            ? { clipPath: 'inset(0% 0 0 0)' }
            : { clipPath: 'inset(100% 0 0 0)' }
        }
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 + waveDelay }}
      >
        {!failed ? (
          <motion.img
            src={brandLogoUrl(institution.domain, { theme: 'light', fallback: 'transparent' })}
            alt={`${institution.name} logo`}
            className="object-contain max-w-[78%] max-h-[64%]"
            loading="lazy"
            onError={() => setFailed(true)}
            animate={isHovered ? { scale: 1.04 } : { scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        ) : (
          <span className="font-display font-bold text-ink tracking-tight text-2xl">
            {initials}
          </span>
        )}

        {!reduced && isHovered && cursor && <CursorGlow x={cursor.x} y={cursor.y} />}

        {/* Index number top-right, low opacity */}
        <motion.span
          aria-hidden="true"
          className="absolute top-2 right-2 font-mono uppercase tracking-[0.16em] text-ink-3"
          initial={reduced ? false : { opacity: 0 }}
          animate={
            reduced
              ? undefined
              : entered
              ? { opacity: isHovered ? 0.8 : 0.3 }
              : { opacity: 0 }
          }
          transition={{ duration: 0.4, ease: EASE, delay: 1.2 + index * 0.02 }}
          style={{ fontSize: 10 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
      </motion.div>

      {/* Hairline rule — overshoots on hover */}
      <motion.div
        className="relative my-2.5"
        initial={reduced ? false : { scaleX: 0, transformOrigin: 'left' }}
        animate={reduced ? undefined : entered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 0.4,
          ease: EASE,
          delay: 0.3 + waveDelay + 0.55,
        }}
      >
        <motion.span
          className="block h-px"
          animate={
            isHovered
              ? { marginLeft: -10, marginRight: -10, backgroundColor: 'rgba(99, 91, 255, 0.55)' }
              : { marginLeft: 0, marginRight: 0, backgroundColor: 'rgba(10, 37, 64, 0.12)' }
          }
          transition={{ duration: 0.4, ease: EASE }}
        />
      </motion.div>

      {/* Type beneath the hairline */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 4 }}
        animate={
          reduced
            ? undefined
            : entered
            ? { opacity: isDimmed ? 0.55 : 1, y: 0 }
            : { opacity: 0, y: 4 }
        }
        transition={{
          duration: 0.4,
          ease: EASE,
          delay: 0.3 + waveDelay + 0.75,
        }}
      >
        <div className="font-display font-semibold text-[13px] md:text-sm text-ink leading-tight">
          {display}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mt-1">
          {institution.location}
        </div>
      </motion.div>
    </motion.a>
  );
}

const sectorLabels: Record<HigherEdSector, string> = {
  IIM: 'Indian Institutes of Management',
  'Indian B-School': 'Other Indian Business Schools',
  'Global B-School': 'Global Business Schools',
  'Public Policy': 'Public Policy',
  Law: 'Law',
  'Indian Graduate': 'Indian Graduate Programs',
  'Global Graduate': 'Global Graduate Programs',
};

export function HigherEducationSection() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      setEntered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.15) {
            setEntered(true);
          }
        }
      },
      { threshold: [0.15] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const grouped = groupHigherEdBySector();
  const sectorOrder: HigherEdSector[] = [
    'IIM',
    'Indian B-School',
    'Global B-School',
    'Public Policy',
    'Law',
  ];

  // Marquee strip: duplicate the institution list for seamless loop

  let runningIndex = 0;

  return (
    <section
      ref={ref as never}
      className="section-spacing bg-bg border-t border-line"
      id="higher-education"
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="container-svc">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={entered ? { opacity: 1, y: 0 } : reduced ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl mb-12 md:mb-14"
        >
          <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent mb-3">
            Higher Education Acceptances
          </div>
          <h2
            className="font-display font-bold leading-[1.05] tracking-[-0.028em]"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
          >
            <span className="text-ink">Where graduates go next.</span>{' '}
            <span className="text-ink-3">Indian and global programs that have admitted SVC alumni.</span>
          </h2>
        </motion.div>

        <div className="space-y-14">
          {sectorOrder.map((sector, sectionIdx) => {
            const list = grouped[sector];
            if (!list || list.length === 0) return null;

            return (
              <motion.div
                key={sector}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={
                  entered
                    ? { opacity: 1, y: 0 }
                    : reduced
                    ? undefined
                    : { opacity: 0, y: 12 }
                }
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: 0.15 + sectionIdx * 0.08,
                }}
              >
                <div className="mb-5 flex items-baseline gap-3">
                  <span
                    className="block h-px shrink-0"
                    style={{ width: 24, background: 'rgba(99, 91, 255, 0.6)' }}
                    aria-hidden="true"
                  />
                  <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight">
                    {sectorLabels[sector]}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
                  {list.map((inst) => {
                    const i = runningIndex++;
                    return (
                      <InstitutionFrame
                        key={inst.slug}
                        institution={inst}
                        index={i}
                        entered={entered}
                        hoveredId={hoveredId}
                        setHoveredId={setHoveredId}
                        reduced={reduced}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-sm text-ink-3 max-w-3xl">
          Institutions that have admitted SVC alumni in recent cycles. Per-candidate admissions and scholarship outcomes are not published.
        </div>
      </div>
    </section>
  );
}

export const higherEducationCount = higherEdInstitutions.length;

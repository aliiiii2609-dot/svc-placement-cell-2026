import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { coreTeam, convener, principal } from '@/lib/data/team';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { X, Mail } from 'lucide-react';
import { CinematicParticles } from '@/components/ui/CinematicParticles';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Unified Council — Convener + Core Team as one connected editorial moment.
 *
 * Layout:
 *   - Kicker + section heading (top)
 *   - Convener composition (asymmetric two-column, portrait larger than team)
 *   - Full-width hairline rule (connecting tissue)
 *   - "Core Team · Year III cohort, 2025-26" kicker
 *   - 6-member tight 3-column grid
 *
 * Index numbering: Convener is "00" (team principal). Core Team is 01..06.
 *
 * Entrance choreography (~2.4s end-to-end, fired once at 20% viewport):
 *   1. Section kicker fades in (240ms)
 *   2. Heading word-by-word reveal (35ms stagger)
 *   3. 120ms beat of stillness
 *   4. Convener portrait wipes in via clip-path (380ms, slower for seniority)
 *   5. Name word-reveal, title fades, hairline draws L->R, email fades
 *   6. Connecting hairline rule draws L->R (480ms, editorial weight)
 *   7. Core Team kicker fades beneath
 *   8. Core Team grid assembles in diagonal wave from top-left to bottom-right
 *      - 60ms diagonal stagger between portraits
 *      - portrait clip-path wipe (280ms each)
 *      - hairline beneath draws 80ms after portrait completes
 *      - name / role / course cascade with 30ms internal stagger
 *      - index numbers fade in last at low opacity
 *
 * Hover: portrait scales (1.03), hairline overshoots ~14px each side, other
 * members focus-pull to 0.65/0.50 opacity. Hovered index number brightens.
 *
 * Click: frame morphs via layoutId into a detail overlay. Close on Escape /
 * click outside.
 *
 * Reduced motion: all elements visible immediately, no wipe-ins or
 * focus-pull. Click-to-expand still works.
 *
 * Mobile: Convener stacks vertically (portrait above details). Core Team
 * collapses to single column.
 */

type Member = {
  id: string;
  name: string;
  role: string;
  course: string;
  year?: string;
  email?: string;
  phone?: string;
  photoPath?: string;
  bio?: string;
};

const convenerMember: Member = {
  id: 'convener-abhishek-malhotra',
  name: convener.name,
  role: 'Faculty Convener',
  course: convener.department,
  email: convener.email,
  phone: convener.phone,
  photoPath: convener.photoPath,
};

const principalMember: Member = {
  id: 'principal-vajala-ravi',
  name: principal.name,
  role: 'Principal',
  course: principal.department,
  email: principal.email,
  phone: principal.phone,
  photoPath: principal.photoPath,
};

// ---------------------------------------------------------------------------
// Word-by-word reveal heading.
// ---------------------------------------------------------------------------
function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  active,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  active: boolean;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.18em]">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={active ? { y: '0%' } : { y: '105%' }}
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
// Member frame — used for both Convener (large) and Core Team (small).
// Click → layoutId morph to detail card.
// ---------------------------------------------------------------------------
function MemberFrame({
  member,
  variant,
  active,
  entered,
  hoveredId,
  setHoveredId,
  onOpen,
  reduced,
  staggerDelay = 0,
}: {
  member: Member;
  variant: 'convener' | 'team';
  active: boolean;
  entered: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onOpen: (m: Member) => void;
  reduced: boolean;
  staggerDelay?: number;
}) {
  const focused = hoveredId === member.id;
  const dimmed = hoveredId !== null && !focused;
  const isLarge = variant === 'convener';
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.button
      layoutId={reduced ? undefined : `member-${member.id}`}
      onClick={() => onOpen(member)}
      onMouseEnter={() => setHoveredId(member.id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(member.id)}
      onBlur={() => setHoveredId(null)}
      animate={
        reduced
          ? {}
          : { opacity: dimmed ? 0.55 : 1, transition: { duration: 0.4, ease: EASE } }
      }
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="group relative block text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md w-full"
      aria-label={`${member.name}, ${member.role}`}
      style={{ perspective: 1000 }}
    >
      {/* Soft atmospheric backdrop behind frame (CSS-only, no WebGL) */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none transition-opacity duration-500"
        style={{
          inset: -14,
          background: focused
            ? 'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.22), transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.08), transparent 70%)',
          filter: 'blur(20px)',
          opacity: focused ? 1 : 0.45,
          zIndex: -1,
        }}
      />

      {/* Portrait frame */}
      <motion.div
        layoutId={reduced ? undefined : `member-photo-${member.id}`}
        className={`relative w-full overflow-hidden bg-bg-2 ${isLarge ? 'aspect-[4/5]' : 'aspect-square'}`}
        initial={reduced ? false : { clipPath: 'inset(100% 0 0 0)' }}
        animate={
          reduced
            ? undefined
            : (entered || active)
              ? { clipPath: 'inset(0% 0 0 0)' }
              : { clipPath: 'inset(100% 0 0 0)' }
        }
        transition={{ duration: isLarge ? 0.55 : 0.38, ease: EASE, delay: staggerDelay }}
        style={{
          boxShadow: focused && !reduced
            ? '0 32px 60px -32px rgba(10, 37, 64, 0.40), 0 8px 16px -6px rgba(99, 91, 255, 0.18)'
            : '0 16px 40px -28px rgba(10, 37, 64, 0.30), 0 4px 8px -4px rgba(10, 37, 64, 0.10)',
          transition: 'box-shadow 600ms ease',
        }}
      >
        {/* Portrait or initials fallback */}
        {member.photoPath ? (
          <motion.img
            src={member.photoPath}
            alt={`Portrait of ${member.name}`}
            className="w-full h-full object-cover object-top"
            style={{ transformOrigin: 'center' }}
            animate={focused && !reduced ? { scale: 1.03 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5">
            <span className="font-display font-bold text-accent" style={{ fontSize: isLarge ? '5rem' : '3rem' }}>
              {initials}
            </span>
          </div>
        )}

        {/* Cursor-follow glow on hover */}
        {focused && !reduced && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.15), transparent 65%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Inner top hairline for depth (replaces drop shadow per brief) */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: 'rgba(255, 255, 255, 0.4)' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Hairline rule beneath portrait — overshoots on hover */}
      <div className="relative h-3.5 mt-2.5">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-px"
          style={{ background: focused && !reduced ? '#635bff' : 'rgba(10, 37, 64, 0.18)' }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={
            reduced
              ? undefined
              : entered
                ? { scaleX: 1, left: focused ? -14 : 0, right: focused ? -14 : 0 }
                : { scaleX: 0 }
          }
          transition={{ duration: 0.45, ease: EASE, delay: staggerDelay + 0.3 }}
        />
      </div>

      {/* Type cascade */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={
          reduced
            ? undefined
            : entered
              ? { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: staggerDelay + 0.42 } }
              : { opacity: 0, y: 6 }
        }
      >
        <div className={`font-display font-bold text-ink leading-tight tracking-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-[13px]'}`}>
          {member.name}
        </div>
        <div className={`font-sans text-ink-2 mt-0.5 ${isLarge ? 'text-sm' : 'text-[11px]'}`}>
          {member.role}
        </div>
        <div className={`font-mono uppercase tracking-[0.14em] text-ink-3 mt-0.5 ${isLarge ? 'text-[11px]' : 'text-[9px]'}`}>
          {member.course}{member.year ? ` · Year ${member.year}` : ''}
        </div>
      </motion.div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Detail overlay — opens on click, morphs via layoutId.
// Editorial Spread Reveal pattern, 1380ms total (240 + 440 + 520 + 180).
// ---------------------------------------------------------------------------
function DetailOverlay({
  member,
  onClose,
  reduced,
}: {
  member: Member;
  onClose: () => void;
  reduced: boolean;
}) {
  // Total entrance time: 240 (lift) + 440 (morph) + 520 (reveal) + 180 (settle) = 1380ms
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Step progression: lift -> morph -> reveal -> settle
  useEffect(() => {
    if (reduced) {
      setStage(3);
      return;
    }
    const t1 = window.setTimeout(() => setStage(1), 240);
    const t2 = window.setTimeout(() => setStage(2), 240 + 440);
    const t3 = window.setTimeout(() => setStage(3), 240 + 440 + 520);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [reduced]);

  if (reduced) {
    // Simple overlay, no morph or cascade
    return (
      <motion.div
        className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail for ${member.name}`}
      >
        <div className="absolute inset-0 bg-bg/85 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
        <div className="relative z-10 bg-surface border border-line max-w-3xl w-full grid md:grid-cols-[320px_1fr] overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center hover:border-accent transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-bg-2 overflow-hidden">
            {member.photoPath ? (
              <img src={member.photoPath} alt="" className="w-full h-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-accent bg-gradient-to-br from-accent/20 to-accent/5">
                {member.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
            )}
          </div>
          <div className="p-7 md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">{member.role}</div>
            <h3 className="font-display font-bold text-2xl md:text-4xl text-ink tracking-tight leading-tight mb-3">
              {member.name}
            </h3>
            <div className="font-sans text-sm text-ink-2 mb-1">{member.role}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 mb-5">
              {member.course}{member.year ? ` · Year ${member.year}` : ''}
            </div>
            {member.bio && (
              <p className="text-sm text-ink-2 leading-relaxed pt-5 border-t border-line mb-4">{member.bio}</p>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-deep transition-colors"
              >
                <Mail size={14} />
                {member.email}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail for ${member.name}`}
    >
      {/* Deeper backdrop with proper opacity so text reads */}
      <motion.div
        className="absolute inset-0 backdrop-blur-xl"
        style={{ background: 'rgba(10, 37, 64, 0.75)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Ambient particles drift across the whole overlay */}
      {stage >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <CinematicParticles tint="cream" orbAnchor="top-right" density={60} intensity={0.8} />
        </div>
      )}

      <motion.div
        layoutId={`member-${member.id}`}
        className="relative z-10 max-w-4xl w-full grid md:grid-cols-[360px_1fr] gap-7 md:gap-10 items-start"
        transition={{ duration: 0.44, ease: EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/25 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-colors text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Larger portrait — morphs in via layoutId */}
        <motion.div
          layoutId={`member-photo-${member.id}`}
          className="relative aspect-[4/5] bg-bg-2 overflow-hidden"
          style={{
            boxShadow: '0 40px 80px -32px rgba(0, 0, 0, 0.6), 0 12px 24px -8px rgba(99, 91, 255, 0.30)',
          }}
        >
          {member.photoPath ? (
            <img src={member.photoPath} alt="" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-display text-7xl text-accent bg-gradient-to-br from-accent/20 to-accent/5">
              {member.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
          )}
          {/* Hairline beneath portrait — overshoots */}
          <motion.div
            className="absolute bottom-0 -left-3 -right-3 h-px origin-left"
            style={{ background: '#7fd9c1' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: stage >= 2 ? 0.12 : 0 }}
          />
        </motion.div>

        {/* Right side — glassy text card with high-contrast text on dark backdrop */}
        <div
          className="relative md:pt-2 p-6 md:p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 4,
            boxShadow: '0 24px 48px -24px rgba(0, 0, 0, 0.40)',
          }}
        >
          {/* Role kicker */}
          <motion.div
            className="inline-flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: stage >= 2 ? 0.05 : 0 }}
          >
            <span aria-hidden="true" className="block w-1.5 h-1.5 rounded-full" style={{ background: '#7fd9c1' }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
              {member.role}
            </span>
          </motion.div>

          {/* Name with word-by-word reveal */}
          <h3
            className="font-display font-bold text-white tracking-tight leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}
          >
            <WordReveal text={member.name} active={stage >= 2} delay={0.1} stagger={0.04} />
          </h3>

          {/* Course and year */}
          <motion.div
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: stage >= 2 ? 0.32 : 0 }}
          >
            {member.course}{member.year ? ` · Year ${member.year}` : ''}
          </motion.div>

          {/* Hairline rule */}
          <motion.div
            className="h-px bg-white/20 origin-left mb-5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: stage >= 2 ? 0.38 : 0 }}
          />

          {/* Bio */}
          {member.bio && (
            <motion.p
              className="text-sm md:text-base text-white/80 leading-relaxed mb-5"
              initial={{ opacity: 0, y: 12 }}
              animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: EASE, delay: stage >= 2 ? 0.42 : 0 }}
            >
              {member.bio}
            </motion.p>
          )}

          {/* Email last */}
          {member.email && (
            <motion.a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 text-sm text-white hover:text-white/70 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: stage >= 2 ? 0.5 : 0 }}
            >
              <Mail size={14} />
              {member.email}
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main unified section.
// ---------------------------------------------------------------------------
export function UnifiedCouncil() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openMember, setOpenMember] = useState<Member | null>(null);

  // Trigger entrance at 20% visibility.
  useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    const el = document.getElementById('unified-council');
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.2) {
            setEntered(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: [0.2] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Diagonal wave stagger for the 3-col grid:
  // For each (row, col), delay = baseDelay + (row + col) * 0.06
  const gridStaggerDelay = (i: number) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return 1.0 + (row + col) * 0.06; // base 1.0s after section heading
  };

  return (
    <>
      <section
        id="unified-council"
        className="relative section-spacing bg-bg border-t border-line overflow-hidden"
        aria-labelledby="council-heading"
      >
        {/* Ambient warm gradient — barely perceptible */}
        <motion.div
          className="absolute pointer-events-none inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 25% 30%, rgba(99, 91, 255, 0.06), transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(255, 176, 136, 0.07), transparent 55%)',
          }}
          animate={
            reduced
              ? undefined
              : { backgroundPosition: ['0% 0%', '3% 2%', '0% 0%'] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Optional left-edge vertical hairline binding both blocks */}
        <div
          className="absolute left-6 md:left-10 top-[var(--top, 0)] bottom-12 w-px hidden md:block"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(99, 91, 255, 0.22) 12%, rgba(99, 91, 255, 0.22) 88%, transparent)',
            top: 110,
          }}
          aria-hidden="true"
        />

        <div className="container-svc relative">
          {/* Kicker */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4"
          >
            The council · 2025-26
          </motion.div>

          {/* Heading */}
          <h2
            id="council-heading"
            className="font-display font-bold leading-[1.04] tracking-[-0.028em] mb-12 md:mb-16 text-ink"
            style={{ fontSize: 'clamp(2rem, 4.8vw, 3.8rem)' }}
          >
            <WordReveal
              text="The people who run the cell."
              active={entered}
              delay={0.18}
              stagger={0.04}
              className="text-ink"
            />
          </h2>

          {/* Leadership composition — Principal + Convener side by side */}
          <div className="relative mb-10 md:mb-12">
            {/* Atmospheric backdrop */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                left: -40,
                top: -30,
                width: 480,
                height: 480,
                background: 'radial-gradient(ellipse, rgba(99, 91, 255, 0.18), transparent 65%)',
                filter: 'blur(70px)',
                zIndex: 0,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                right: 0,
                top: 40,
                width: 440,
                height: 440,
                background: 'radial-gradient(ellipse, rgba(255, 107, 157, 0.15), transparent 65%)',
                filter: 'blur(80px)',
                zIndex: 0,
              }}
            />

            <div className="relative grid md:grid-cols-2 gap-7 md:gap-10 lg:gap-14">
              {/* Principal block */}
              <div className="relative">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
                  Principal
                </div>
                <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[200px_1fr] gap-5 items-start">
                  <MemberFrame
                    member={principalMember}
                    variant="convener"
                    active
                    entered={entered}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    onOpen={setOpenMember}
                    reduced={reduced}
                    staggerDelay={0.7}
                  />
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={
                      reduced
                        ? undefined
                        : entered
                          ? { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.95 } }
                          : { opacity: 0, y: 14 }
                    }
                    className="pt-3"
                  >
                    <div className="font-display font-bold text-ink text-lg md:text-xl tracking-tight mb-1 leading-tight">
                      {principal.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-3">
                      {principal.department}
                    </div>
                    {principal.email && (
                      <a
                        href={`mailto:${principal.email}`}
                        className="text-sm text-accent hover:text-accent-deep transition-colors inline-flex items-center gap-1.5"
                      >
                        <Mail size={13} />
                        {principal.email}
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Convener block */}
              <div className="relative">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
                  Faculty Convener
                </div>
                <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[200px_1fr] gap-5 items-start">
                  <MemberFrame
                    member={convenerMember}
                    variant="convener"
                    active
                    entered={entered}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    onOpen={setOpenMember}
                    reduced={reduced}
                    staggerDelay={0.8}
                  />
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={
                      reduced
                        ? undefined
                        : entered
                          ? { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 1.05 } }
                          : { opacity: 0, y: 14 }
                    }
                    className="pt-3"
                  >
                    <div className="font-display font-bold text-ink text-lg md:text-xl tracking-tight mb-1 leading-tight">
                      {convener.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-3">
                      {convener.department}
                    </div>
                    <a
                      href={`mailto:${convener.email}`}
                      className="text-sm text-accent hover:text-accent-deep transition-colors inline-flex items-center gap-1.5 mb-1"
                    >
                      <Mail size={13} />
                      {convener.email}
                    </a>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                      {convener.phone}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting hairline rule — full width */}
          <div className="relative mb-7 md:mb-9">
            <motion.div
              className="h-px origin-left"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(99, 91, 255, 0.4) 12%, rgba(99, 91, 255, 0.4) 88%, transparent)',
              }}
              initial={reduced ? false : { scaleX: 0 }}
              animate={
                reduced
                  ? undefined
                  : entered
                    ? { scaleX: 1, transition: { duration: 0.7, ease: EASE, delay: 1.15 } }
                    : { scaleX: 0 }
              }
            />
          </div>

          {/* Core Team kicker */}
          <motion.div
            className="mb-7 md:mb-9 flex items-baseline gap-3 flex-wrap"
            initial={reduced ? false : { opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 1.3 }}
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent">
              Core team
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Year III cohort · 2025-26 · {String(coreTeam.length).padStart(2, '0')} members
            </span>
          </motion.div>

          {/* Core Team grid — tight 3-column, intimate spacing */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-7">
            {coreTeam.map((m, i) => (
              <MemberFrame
                key={m.id}
                member={m}
                variant="team"
                active
                entered={entered}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onOpen={setOpenMember}
                reduced={reduced}
                staggerDelay={gridStaggerDelay(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openMember && (
          <DetailOverlay
            member={openMember}
            onClose={() => setOpenMember(null)}
            reduced={reduced}
          />
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { councilHeads } from '@/lib/data/council';
import { coordinators } from '@/lib/data/coordinators';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils/cn';

/**
 * Council & Coordinators pill marquee.
 *
 * Off-white pills with circular initial-avatars overlapping the left edge,
 * scrolling in alternating directions. Hover pauses the row.
 *
 * On click: pill expands into a detail card via Framer Motion's layoutId
 * FLIP animation (the Raycast pattern). Background dims behind it.
 *
 * The avatar discs are MONOGRAM-BASED, not photo-based. This avoids the
 * brick-wall background artifact that comes from feathering team portraits
 * shot against walls. Each person gets a deterministic brand-palette gradient
 * derived from their id, so the overall composition has visual rhythm.
 *
 * Reduced motion: marquee freezes, collapses to a static wrapping grid.
 */

/** Extract 1-2 letter monogram from a person's name. */
function avatarInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/**
 * Deterministic brand-palette gradient for a member id.
 * Navy + gold only (no off-brand pastels): the monogram fallback that shows
 * when a headshot is missing still reads as part of the navy/gold system.
 */
function avatarGradient(id: string): string {
  const palettes = [
    'linear-gradient(135deg, #1e4e8c 0%, #b8893b 100%)', // navy → gold
    'linear-gradient(135deg, #b8893b 0%, #d4a857 100%)', // gold → bright gold
    'linear-gradient(135deg, #d4a857 0%, #1e4e8c 100%)', // bright gold → navy
    'linear-gradient(135deg, #1e4e8c 0%, #0a2540 100%)', // navy → deep navy
    'linear-gradient(135deg, #0a2540 0%, #b8893b 100%)', // deep navy → gold
    'linear-gradient(135deg, #d4a857 0%, #b8893b 100%)', // bright gold → gold
    'linear-gradient(135deg, #0a2540 0%, #1e4e8c 100%)', // deep navy → navy
    'linear-gradient(135deg, #b8893b 0%, #0a2540 100%)', // gold → deep navy
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return palettes[hash % palettes.length];
}

/**
 * Photo avatar with monogram fallback. Renders the person's headshot filling
 * the circular container; on load failure it falls back to the deterministic
 * gradient background (owned by the parent container) + initials. Each instance
 * tracks its own load state. No lazy loading: this section is deferred-mounted,
 * where lazy images fail to trigger.
 */
function MemberAvatar({
  member, fontSize, letterSpacing,
}: { member: Member; fontSize: string; letterSpacing: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="relative z-10 font-display font-bold text-white tracking-tight"
        style={{ fontSize, letterSpacing }}
      >
        {avatarInitials(member.name)}
      </span>
    );
  }

  return (
    <img
      src={`/images/people/${member.id}.jpg`}
      alt={member.name}
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover object-top"
    />
  );
}

type Member = {
  id: string;
  name: string;
  course: string;
  role?: string;
  department?: string;
  year?: 'I' | 'II' | 'III' | 'IV';
  email?: string;
  group: 'council' | 'coordinator';
};

const allCouncil: Member[] = councilHeads.map((h) => ({
  id: h.id,
  name: h.name,
  course: h.course,
  role: 'Council Head',
  department: h.department,
  year: h.year,
  email: h.email,
  group: 'council',
}));

const allCoordinators: Member[] = coordinators.map((c) => ({
  id: c.id,
  name: c.name,
  course: c.course,
  role: 'Placement Coordinator',
  year: c.year,
  group: 'coordinator',
}));

function chunkIntoRows(arr: Member[], rows: number): Member[][] {
  const perRow = Math.ceil(arr.length / rows);
  return Array.from({ length: rows }, (_, i) => arr.slice(i * perRow, (i + 1) * perRow));
}

function MemberPill({
  member, onClick, reduced,
}: { member: Member; onClick: () => void; reduced: boolean }) {
  return (
    <motion.button
      layoutId={reduced ? undefined : `pill-${member.id}`}
      onClick={onClick}
      whileHover={reduced ? undefined : { y: -3, transition: { type: 'spring', stiffness: 260, damping: 26 } }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      aria-label={`${member.name}, ${member.role}, ${member.course}`}
      className={cn(
        'group relative inline-flex items-center gap-3.5 pl-1 pr-7 py-1',
        'bg-surface border border-line rounded-full',
        'shadow-soft hover:shadow-soft-lg',
        'h-[68px] mx-2.5 shrink-0',
        'transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-[rgba(156,122,58,0.35)]',
      )}
    >
      <motion.div
        layoutId={reduced ? undefined : `avatar-${member.id}`}
        className={cn(
          'w-[58px] h-[58px] rounded-full overflow-hidden relative',
          'flex items-center justify-center shrink-0',
          'border-[3px] border-bg shadow-soft',
          'transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'group-hover:scale-[1.08] group-hover:border-accent/40',
        )}
        style={{
          marginLeft: '-6px',
          background: avatarGradient(member.id),
        }}
      >
        <MemberAvatar member={member} fontSize="20px" letterSpacing="-0.02em" />
      </motion.div>

      <div className="text-left leading-tight flex flex-col justify-center pr-1">
        <motion.div
          layoutId={reduced ? undefined : `name-${member.id}`}
          className="font-sans text-[15px] font-medium text-ink whitespace-nowrap"
        >
          {member.name}
        </motion.div>
        <motion.div
          layoutId={reduced ? undefined : `course-${member.id}`}
          className="font-sans text-[12px] text-ink-3 whitespace-nowrap"
          style={{ opacity: 0.7 }}
        >
          {member.course}
        </motion.div>
      </div>
    </motion.button>
  );
}

function MemberDetail({ member, onClose }: { member: Member; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog on open so keyboard + screen-reader users land here.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[5000] bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${member.name}`}
    >
      <motion.div
        layoutId={`pill-${member.id}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-line rounded-3xl shadow-soft-lg w-full max-w-sm overflow-hidden relative"
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {/* Soft navy → gold bloom behind the header, keeps the card on-brand and premium. */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, rgba(184,137,59,0.16), transparent 60%), radial-gradient(120% 120% at 50% 0%, rgba(30,78,140,0.10), transparent 70%)',
          }}
          aria-hidden="true"
        />

        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-2 hover:bg-accent-soft text-ink-3 hover:text-accent transition-colors inline-flex items-center justify-center z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          aria-label="Close detail"
        >
          <X size={16} />
        </button>

        <div className="relative px-7 pt-10 pb-8 flex flex-col items-center text-center">
          <motion.div
            layoutId={`avatar-${member.id}`}
            className="w-28 h-28 rounded-full overflow-hidden border-[5px] border-surface shadow-soft-lg mb-5 flex items-center justify-center relative ring-1 ring-accent/25"
            style={{ background: avatarGradient(member.id) }}
          >
            <MemberAvatar member={member} fontSize="40px" letterSpacing="-0.03em" />
          </motion.div>

          <motion.div
            layoutId={`name-${member.id}`}
            className="font-display text-[1.75rem] leading-tight text-ink mb-2.5"
          >
            {member.name}
          </motion.div>

          <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent mb-5 max-w-full break-words">
            {member.role}
            {member.department && ` · ${member.department}`}
          </div>

          <div className="w-12 h-px bg-line mb-5" aria-hidden="true" />

          <div className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-3 mb-1">
            Course
          </div>
          <motion.div
            layoutId={`course-${member.id}`}
            className="text-[0.95rem] text-ink-2 mb-6 break-words"
          >
            {member.course}
          </motion.div>

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 max-w-full px-5 py-2.5 rounded-full bg-accent text-surface text-[0.82rem] font-medium hover:bg-gold-deep transition-colors shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MarqueeRow({
  members, reverse, duration, onPillClick, reduced,
}: { members: Member[]; reverse: boolean; duration: number; onPillClick: (m: Member) => void; reduced: boolean }) {
  if (reduced) {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {members.map((m) => (
          <MemberPill key={m.id} member={m} onClick={() => onPillClick(m)} reduced />
        ))}
      </div>
    );
  }
  const doubled = [...members, ...members];
  return (
    <div className="overflow-hidden mask-image group/row">
      <div
        className={cn(
          'flex w-max py-2',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          'group-hover/row:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((m, i) => (
          <MemberPill key={`${m.id}-${i}`} member={m} onClick={() => onPillClick(m)} reduced={false} />
        ))}
      </div>
    </div>
  );
}

/**
 * Floating brand-color particles for the Council and Coordinator sections.
 * Two layers:
 *   1. Big ambient SVG blobs (5) that drift slowly — the "water" feel
 *   2. Small particle dots (count) that breathe and rise
 * Reduced-motion safe.
 */
function CouncilParticles({ count = 28 }: { count?: number }) {
  const dots = Array.from({ length: count }).map((_, i) => ({
    left: (i * 73 + 11) % 100,
    top: (i * 37 + 17) % 100,
    size: 2 + ((i * 7) % 5),
    delay: (i * 0.45) % 9,
    duration: 9 + ((i * 3) % 6),
    color: ['#1e4e8c', '#b8893b', '#b8893b', '#d4a857', '#1e4e8c'][i % 5],
  }));

  const blobs = [
    { x: 8, y: 22, size: 220, color: 'rgba(30, 78, 140, 0.18)', dur: 22 },
    { x: 72, y: 18, size: 260, color: 'rgba(184, 137, 59, 0.16)', dur: 26 },
    { x: 40, y: 60, size: 240, color: 'rgba(184, 137, 59, 0.14)', dur: 30 },
    { x: 86, y: 70, size: 200, color: 'rgba(30, 78, 140, 0.16)', dur: 28 },
    { x: 18, y: 82, size: 180, color: 'rgba(212, 168, 87, 0.14)', dur: 24 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Layer 1: ambient flowing blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            filter: 'blur(36px)',
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: b.dur,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Layer 2: small particles */}
      {dots.map((d, i) => (
        <motion.span
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.color,
            opacity: 0.35,
            boxShadow: `0 0 10px ${d.color}66`,
          }}
          animate={{
            y: [0, -32, 0],
            x: [0, 10, -6, 0],
            opacity: [0.22, 0.55, 0.22],
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

export function CouncilOrbit() {
  const reduced = useReducedMotion();
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!activeMember) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMember(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeMember]);

  const councilRows = chunkIntoRows(allCouncil, 2);
  const coordinatorRows = chunkIntoRows(allCoordinators, 3);

  return (
    <>
      <section className="section-spacing relative overflow-hidden" id="council-heads">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(30, 78, 140, 0.12), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(184, 137, 59, 0.08), transparent 60%)',
          }}
          aria-hidden="true"
        />
        {!reduced && <CouncilParticles count={32} />}
        <div className="container-svc relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mb-12"
          >
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mb-4">The Council 2026-27</div>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[1.05] tracking-[-0.03em] text-ink mb-5">Council 2026-27</h2>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">Department heads across Editorial, Events &amp; Logistics, Documentation, Social Media &amp; Marketing, and PR &amp; Outreach. Click any pill for details.</p>
          </motion.div>

          <div className="space-y-2">
            {councilRows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <MarqueeRow
                  members={row}
                  reverse={i % 2 === 1}
                  duration={50}
                  onPillClick={setActiveMember}
                  reduced={reduced}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-line bg-bg-2 relative overflow-hidden" id="coordinators">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(184, 137, 59, 0.12), transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(30, 78, 140, 0.10), transparent 60%)',
          }}
          aria-hidden="true"
        />
        {!reduced && <CouncilParticles count={26} />}
        <div className="container-svc relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mb-12"
          >
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mb-4">Placement Coordinators 2026-27</div>
            <h2 className="font-display font-bold text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[1.05] tracking-[-0.03em] text-ink mb-5">Placement Coordinators 2026-27</h2>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">Recruiter outreach, shortlist verification, drive logistics, and post-offer follow-through.</p>
          </motion.div>

          <div className="space-y-2">
            {coordinatorRows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <MarqueeRow
                  members={row}
                  reverse={i % 2 === 1}
                  duration={70}
                  onPillClick={setActiveMember}
                  reduced={reduced}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeMember && <MemberDetail member={activeMember} onClose={() => setActiveMember(null)} />}
      </AnimatePresence>
    </>
  );
}

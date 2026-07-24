import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CouncilDepartment, CouncilMember, Coordinator } from '@/types';
import { councilHeads } from '@/lib/data/council';
import { coordinators } from '@/lib/data/coordinators';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils/cn';

/**
 * Council & Coordinators — the team behind the team.
 *
 * Two movements:
 *   1. The Council — 13 department heads grouped by department in refined glass
 *      cards. Monogram avatars (there are no per-member photos). Cards reveal
 *      once on scroll and settle visible.
 *   2. The Coordinators — a continuously scrolling two-row marquee of the ~30
 *      coordinators as small glass avatar chips. Rows run in opposite
 *      directions, pause on hover, and loop forever via a pure CSS translateX
 *      animation (the `animate-marquee` / `animate-marquee-reverse` utilities).
 *
 * Motion is gated on prefers-reduced-motion: the marquee collapses to a static
 * wrapping grid and the reveals render immediately visible.
 *
 * Palette: navy accent + gold + glass over paper. No purple, no pastels.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The person surfaced in the click-to-open dialog. `meta` carries the
 * department for a council member, or the label "Coordinator".
 */
type SelectedPerson = {
  id: string;
  name: string;
  course: string;
  meta: string;
};

/** Fixed presentation order for the five departments. */
const DEPARTMENT_ORDER: CouncilDepartment[] = [
  'Editorial',
  'Events & Logistics',
  'Documentation',
  'Social Media & Marketing',
  'PR & Outreach',
];

/** Extract a 1-2 letter monogram from a person's name. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Deterministic navy-or-gold monogram gradient keyed off the id, so adjacent
 * avatars alternate tone without ever leaving the brand palette.
 */
function monogramGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const gradients = [
    'linear-gradient(135deg, #1e4e8c 0%, #0a2540 100%)',
    'linear-gradient(135deg, #b8893b 0%, #d4a857 100%)',
    'linear-gradient(135deg, #0a2540 0%, #1e4e8c 100%)',
    'linear-gradient(135deg, #d4a857 0%, #b8893b 100%)',
  ];
  return gradients[hash % gradients.length];
}

/** Council heads bucketed into their department, preserving source order. */
const councilByDepartment: { department: CouncilDepartment; members: CouncilMember[] }[] =
  DEPARTMENT_ORDER.map((department) => ({
    department,
    members: councilHeads.filter((head) => head.department === department),
  })).filter((group) => group.members.length > 0);

// ---------------------------------------------------------------------------
// Monogram avatar disc.
// ---------------------------------------------------------------------------
function Monogram({
  id,
  name,
  size,
}: {
  id: string;
  name: string;
  size: number;
}) {
  // Prefer the member's real headshot (public/images/people/<id>.jpg). Falls
  // back to a monogram disc if the photo is missing or fails to load, so the
  // grid always looks complete.
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src={`/images/people/${id}.jpg`}
        alt={name}
        decoding="async"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover object-top shadow-soft ring-1 ring-line"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white shadow-soft"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        letterSpacing: '-0.02em',
        background: monogramGradient(id),
      }}
    >
      {initialsOf(name)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Council department card.
// ---------------------------------------------------------------------------
function DepartmentCard({
  department,
  members,
  index,
  reduced,
  onSelect,
}: {
  department: CouncilDepartment;
  members: CouncilMember[];
  index: number;
  reduced: boolean;
  onSelect: (person: SelectedPerson) => void;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.06 }}
      className="glass flex flex-col p-6 md:p-7"
    >
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {department}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          {String(members.length).padStart(2, '0')}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              onClick={() =>
                onSelect({
                  id: member.id,
                  name: member.name,
                  course: member.course,
                  meta: member.department,
                })
              }
              className={cn(
                'flex w-full items-center gap-3.5 rounded-xl px-2 py-2 text-left min-h-[44px]',
                'transition-colors duration-200 hover:bg-ink/[0.04]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              )}
              aria-label={`View ${member.name}`}
            >
              <Monogram id={member.id} name={member.name} size={42} />
              <div className="min-w-0 leading-tight">
                <div className="truncate font-sans text-[15px] font-medium text-ink">
                  {member.name}
                </div>
                <div className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                  {member.course}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Coordinator chip.
// ---------------------------------------------------------------------------
function CoordinatorChip({
  coordinator,
  onSelect,
}: {
  coordinator: Coordinator;
  onSelect: (person: SelectedPerson) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect({
          id: coordinator.id,
          name: coordinator.name,
          course: coordinator.course,
          meta: 'Coordinator',
        })
      }
      aria-label={`View ${coordinator.name}`}
      className={cn(
        'group/chip inline-flex min-h-[44px] shrink-0 items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 text-left',
        'border border-line bg-surface shadow-soft',
        'transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-soft-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      )}
    >
      <Monogram id={coordinator.id} name={coordinator.name} size={38} />
      <div className="text-left leading-tight">
        <div className="whitespace-nowrap font-sans text-[13px] font-medium text-ink">
          {coordinator.name}
        </div>
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
          {coordinator.course}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// A single scrolling marquee row. Track is doubled so translateX(-50%) loops
// seamlessly. Pauses on hover. Clipped by an overflow-hidden parent so the
// wide track never causes horizontal PAGE overflow.
// ---------------------------------------------------------------------------
function MarqueeRow({
  members,
  reverse,
  durationSeconds,
  onSelect,
}: {
  members: Coordinator[];
  reverse: boolean;
  durationSeconds: number;
  onSelect: (person: SelectedPerson) => void;
}) {
  const track = [...members, ...members];
  return (
    <div className="mask-image group/row overflow-hidden">
      <div
        className={cn(
          'flex w-max gap-3 py-2',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          'group-hover/row:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {track.map((coordinator, i) => (
          <CoordinatorChip
            key={`${coordinator.id}-${i}`}
            coordinator={coordinator}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Person dialog — a clean modal with a larger photo, name, course, and the
// person's role/department. Accessible: role="dialog" + aria-modal, focus moves
// to the close button on open and restores on close, Escape and backdrop-click
// both dismiss. Motion is gated on prefers-reduced-motion and ends visible.
// ---------------------------------------------------------------------------
function PersonModal({
  person,
  reduced,
  onClose,
}: {
  person: SelectedPerson;
  reduced: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `person-modal-title-${person.id}`;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="glass-strong relative z-[1] w-full max-w-sm overflow-hidden p-7 text-center"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            'absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-3',
            'transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <Monogram id={person.id} name={person.name} size={148} />
          <h3
            id={titleId}
            className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink"
          >
            {person.name}
          </h3>
          <p className="mt-1.5 font-sans text-[15px] text-ink-2">{person.course}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {person.meta}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section.
// ---------------------------------------------------------------------------
export function CouncilCoordinators() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<SelectedPerson | null>(null);

  // Split coordinators into two balanced rows for the opposing-direction effect.
  const mid = Math.ceil(coordinators.length / 2);
  const rowOne = coordinators.slice(0, mid);
  const rowTwo = coordinators.slice(mid);

  return (
    <section
      id="council-coordinators"
      className="section-spacing relative overflow-hidden border-t border-line bg-bg"
      aria-labelledby="council-coordinators-heading"
    >
      {/* Soft brand bloom — barely-there navy/gold radial wash on paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 15%, rgba(30, 78, 140, 0.08), transparent 55%), radial-gradient(ellipse at 82% 85%, rgba(184, 137, 59, 0.09), transparent 55%)',
        }}
      />

      <div className="container-svc relative">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 max-w-2xl md:mb-16"
        >
          <div className="eyebrow mb-4">The Placement Cell</div>
          <h2
            id="council-coordinators-heading"
            className="display-italic font-display font-bold leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
          >
            The Council and <em>Placement Coordinators.</em>
          </h2>
        </motion.div>

        {/* Council — department glass cards. */}
        <div className="mb-16 md:mb-20">
          <div className="mb-6 flex items-baseline gap-3">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold">
              The Council
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              {String(councilHeads.length).padStart(2, '0')} heads · 05 departments
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {councilByDepartment.map((group, i) => (
              <DepartmentCard
                key={group.department}
                department={group.department}
                members={group.members}
                index={i}
                reduced={reduced}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>

        {/* Coordinators — the scrolling marquee. */}
        <div>
          <div className="mb-6 flex items-baseline gap-3">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold">
              The Coordinators
            </span>
          </div>
        </div>
      </div>

      {/* Marquee lives outside the container so the rows can run edge to edge. */}
      {reduced ? (
        <div className="container-svc relative">
          <div className="flex flex-wrap gap-3">
            {coordinators.map((coordinator) => (
              <CoordinatorChip
                key={coordinator.id}
                coordinator={coordinator}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col gap-3">
          <MarqueeRow
            members={rowOne}
            reverse={false}
            durationSeconds={58}
            onSelect={setSelected}
          />
          <MarqueeRow members={rowTwo} reverse durationSeconds={64} onSelect={setSelected} />
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <PersonModal
            person={selected}
            reduced={reduced}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

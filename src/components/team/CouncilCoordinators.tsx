import { motion } from 'framer-motion';
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
}: {
  department: CouncilDepartment;
  members: CouncilMember[];
  index: number;
  reduced: boolean;
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

      <ul className="flex flex-col gap-4">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3.5">
            <Monogram id={member.id} name={member.name} size={42} />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-sans text-[15px] font-medium text-ink">
                {member.name}
              </div>
              <div className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                {member.course} · Year {member.year}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Coordinator chip.
// ---------------------------------------------------------------------------
function CoordinatorChip({ coordinator }: { coordinator: Coordinator }) {
  return (
    <div
      className={cn(
        'group/chip inline-flex shrink-0 items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5',
        'border border-line bg-surface shadow-soft',
        'transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-soft-lg',
      )}
    >
      <Monogram id={coordinator.id} name={coordinator.name} size={38} />
      <div className="text-left leading-tight">
        <div className="whitespace-nowrap font-sans text-[13px] font-medium text-ink">
          {coordinator.name}
        </div>
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
          {coordinator.course} · {coordinator.year}
        </div>
      </div>
    </div>
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
}: {
  members: Coordinator[];
  reverse: boolean;
  durationSeconds: number;
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
          <CoordinatorChip key={`${coordinator.id}-${i}`} coordinator={coordinator} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section.
// ---------------------------------------------------------------------------
export function CouncilCoordinators() {
  const reduced = useReducedMotion();

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
          <div className="eyebrow mb-4">Council &amp; Coordinators</div>
          <h2
            id="council-coordinators-heading"
            className="display-italic font-display font-bold leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
          >
            The team behind the <em>team.</em>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Thirteen department heads and more than thirty coordinators keep every
            drive, event, and recruiter conversation moving.
          </p>
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
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              {coordinators.length} across every course
            </span>
          </div>
        </div>
      </div>

      {/* Marquee lives outside the container so the rows can run edge to edge. */}
      {reduced ? (
        <div className="container-svc relative">
          <div className="flex flex-wrap gap-3">
            {coordinators.map((coordinator) => (
              <CoordinatorChip key={coordinator.id} coordinator={coordinator} />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col gap-3">
          <MarqueeRow members={rowOne} reverse={false} durationSeconds={58} />
          <MarqueeRow members={rowTwo} reverse durationSeconds={64} />
        </div>
      )}
    </section>
  );
}

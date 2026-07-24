import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Phone, X } from 'lucide-react';
import { coreTeam } from '@/lib/data/team';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

type Member = (typeof coreTeam)[number];

/**
 * Home "Core Team" section.
 *
 * A refined, editorial roster of the six students who run the cell:
 *   - Quiet gold eyebrow + a single display heading ("The Core Team 2026-27")
 *   - A medium, modern portrait-card grid (1 / 2 / 3 columns): a tall portrait
 *     photo on top, then the name (font-display) and a gold mono role kicker.
 *     No course, phone, or email on the card face.
 *   - Clicking a card opens an accessible dialog with the larger portrait,
 *     full bio, and live mailto / tel links (course omitted here too)
 *   - A quiet footer link through to the full /team page
 *
 * The faculty convener is deliberately NOT rendered here — he is featured once,
 * in the homepage LeadershipDesks section. This strip is student leadership only.
 *
 * Portraits load eagerly (this section is deferred-mounted, so lazy loading
 * never fires). Framing is tuned per member via a vertical object-position
 * lookup: most faces sit high in the frame, but two members photograph low with
 * wall above, so they use a lower crop. On image error a gold monogram disc
 * stands in, so a card never renders as a broken frame. Motion is a subtle
 * whileInView rise, gated on reduced motion and always resolving to fully
 * visible content.
 */

/**
 * Per-member vertical crop. Most portraits frame well showing the upper area,
 * but `shiv-chopra` and `gurbani-chandok` have faces low in the frame (wall
 * above) that a top crop would cut, so they show the lower portion instead.
 */
const OBJECT_POSITION: Record<string, string> = {
  'shiv-chopra': 'center 78%',
  'gurbani-chandok': 'center 78%',
};
const DEFAULT_OBJECT_POSITION = 'center 22%';

function objectPositionFor(id: string): string {
  return OBJECT_POSITION[id] ?? DEFAULT_OBJECT_POSITION;
}

/** Derive up-to-two-letter initials from a display name. */
function initialsFromName(name: string): string {
  const parts = name
    .replace(/^Dr\.?\s+|^Prof\.?\s+|^Mr\.?\s+|^Ms\.?\s+/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface PortraitProps {
  src: string;
  alt: string;
  initials: string;
  objectPosition: string;
}

/**
 * Portrait that degrades to a gold monogram disc on load failure.
 * Eager loading (never lazy) because this section is deferred-mounted.
 */
function Portrait({ src, alt, initials, objectPosition }: PortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-2">
      {failed || !src ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-soft to-bg-2"
          aria-label={alt}
          role="img"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-surface md:h-24 md:w-24">
            <span
              className="select-none font-display font-bold tracking-tight text-gold"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
            >
              {initials}
            </span>
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover/card:scale-[1.04]"
        />
      )}
    </div>
  );
}

/** Accessible member dialog: larger portrait, bio, and live contact links. */
function MemberDialog({ member, onClose }: { member: Member; onClose: () => void }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `team-dialog-title-${member.id}`;
  const initials = member.initials || initialsFromName(member.name);

  // Focus the dialog on open, lock body scroll, and close on Escape.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.25, ease: EASE }}
    >
      {/* Backdrop — click closes */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE }}
        className="group/card glass-strong relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl outline-none sm:rounded-2xl md:flex-row"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors duration-300 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {/* Portrait */}
        <div className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden bg-bg-2 md:aspect-auto md:w-2/5">
          <Portrait
            src={member.photoPath}
            alt={`Portrait of ${member.name}`}
            initials={initials}
            objectPosition={objectPositionFor(member.id)}
          />
        </div>

        {/* Detail */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 md:p-8">
          <p className="kicker !normal-case tracking-[0.08em]">{member.role}</p>
          <h3
            id={titleId}
            className="mt-2 font-display font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', hyphens: 'none' }}
          >
            {member.name}
          </h3>

          <span className="mt-3 block h-px w-10 bg-gold" aria-hidden="true" />

          <p className="mt-5 text-[14px] leading-relaxed text-ink-2">{member.bio}</p>

          <div className="mt-6 flex flex-col gap-2.5 pt-1">
            <a
              href={`mailto:${member.email}`}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] text-ink-2 transition-colors duration-300 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Mail size={15} strokeWidth={1.75} className="flex-shrink-0 text-gold" />
              <span className="truncate">{member.email}</span>
            </a>
            <a
              href={`tel:${member.phone.replace(/\s+/g, '')}`}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] text-ink-2 transition-colors duration-300 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Phone size={15} strokeWidth={1.75} className="flex-shrink-0 text-gold" />
              <span>{member.phone}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HomeTeamStrip() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Member | null>(null);

  const rise = (index: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, delay: reduced ? 0 : index * 0.06, ease: EASE },
  });

  return (
    <section className="section-spacing border-t border-line" id="team">
      <div className="container-svc">
        {/* Header */}
        <div className="mb-10 max-w-2xl md:mb-14">
          <motion.div {...rise(0)} className="eyebrow mb-3">
            The Placement Cell
          </motion.div>
          <motion.h2
            {...rise(1)}
            className="font-display font-bold leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            The Core Team 2026-27
          </motion.h2>
        </div>

        {/* Core team — portrait cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {coreTeam.map((member, i) => {
            const initials = member.initials || initialsFromName(member.name);
            return (
              <motion.div key={member.id} {...rise(i)}>
                <button
                  type="button"
                  onClick={() => setActive(member)}
                  aria-label={`Open profile of ${member.name}, ${member.role}`}
                  aria-haspopup="dialog"
                  className="group/card glass block w-full overflow-hidden text-left transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-soft-lg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  {/* Portrait */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-2">
                    <Portrait
                      src={member.photoPath}
                      alt={`Portrait of ${member.name}`}
                      initials={initials}
                      objectPosition={objectPositionFor(member.id)}
                    />
                    {/* Soft ink scrim at the base for depth and legibility */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Name + role */}
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <h3
                        className="font-display text-[17px] font-semibold leading-snug tracking-tight text-ink"
                        style={{ hyphens: 'none' }}
                      >
                        {member.name}
                      </h3>
                      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                        {member.role}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={17}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-ink-3 transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-accent"
                    />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <motion.div {...rise(0)} className="mt-10 md:mt-12">
          <Link
            to="/team"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors duration-300 hover:text-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            See the full team
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>

      {/* Member dialog */}
      <AnimatePresence>
        {active && <MemberDialog member={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

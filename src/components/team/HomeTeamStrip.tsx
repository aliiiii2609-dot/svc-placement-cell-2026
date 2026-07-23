import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { convener, coreTeam } from '@/lib/data/team';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home "Meet the team" strip.
 *
 * A restrained, editorial preview of the people behind the cell:
 *   - Eyebrow + display heading (one gold emphasis word) + one-line intro
 *   - The faculty convener featured in a larger glass card (portrait / monogram)
 *   - The core team as a responsive glass-card grid (1 / 2 / 3 columns)
 *   - A quiet footer link through to the full /team page
 *
 * Portraits fall back to an initials monogram whenever the image is
 * missing, so a card never renders as a broken frame. Motion is a
 * subtle whileInView rise with a small stagger, gated on reduced motion.
 */

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

interface AvatarProps {
  src: string;
  alt: string;
  initials: string;
  className?: string;
}

/** Square portrait that degrades to a gold-tinted monogram on load failure. */
function Avatar({ src, alt, initials, className = '' }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-2 ${className}`}
        aria-label={alt}
        role="img"
      >
        <span
          className="font-display font-bold tracking-tight text-gold select-none"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/** Small mailto pill shared by the convener card and each member card. */
function EmailPill({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 transition-colors duration-300 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <Mail size={13} strokeWidth={1.75} className="flex-shrink-0" />
      <span className="truncate">{email}</span>
    </a>
  );
}

export function HomeTeamStrip() {
  const reduced = useReducedMotion();

  const rise = (index: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, delay: reduced ? 0 : index * 0.08, ease: EASE },
  });

  const convenerInitials = initialsFromName(convener.name);

  return (
    <section className="section-spacing border-t border-line" id="team">
      <div className="container-svc">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <motion.div {...rise(0)} className="eyebrow mb-4">
            The team
          </motion.div>
          <motion.h2
            {...rise(1)}
            className="font-display font-bold text-ink leading-[1.05] tracking-tight display-italic"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            The people behind the <em>cell.</em>
          </motion.h2>
          <motion.p {...rise(2)} className="mt-4 text-[15px] md:text-base text-ink-2 leading-relaxed">
            A student-led team, guided by faculty, that runs every drive, brief, and
            conversation across the cycle.
          </motion.p>
        </div>

        {/* Convener — featured glass card */}
        <motion.div {...rise(0)} className="mb-6 md:mb-8">
          <div className="glass p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <Avatar
                src={convener.photoPath}
                alt={`Portrait of ${convener.name}`}
                initials={convenerInitials}
                className="h-28 w-28 flex-shrink-0 rounded-2xl md:h-36 md:w-36"
              />
              <div className="min-w-0">
                <div className="kicker mb-3">Faculty convener</div>
                <h3
                  className="font-display font-bold text-ink leading-tight tracking-tight [text-wrap:balance]"
                  style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)' }}
                >
                  {convener.name}
                </h3>
                <p className="mt-1.5 text-[15px] text-ink-2">{convener.title}</p>
                <p className="mt-0.5 text-sm text-ink-3">{convener.department}</p>
                <div className="mt-5">
                  <EmailPill email={convener.email} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core team — responsive glass grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {coreTeam.map((member, i) => (
            <motion.div key={member.id} {...rise(i)}>
              <article className="glass h-full p-6 md:p-7">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={member.photoPath}
                    alt={`Portrait of ${member.name}`}
                    initials={member.initials || initialsFromName(member.name)}
                    className="h-16 w-16 flex-shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-ink leading-snug tracking-tight [overflow-wrap:anywhere]">
                      {member.name}
                    </h3>
                    <p className="kicker mt-1.5 !normal-case tracking-[0.1em]">{member.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-[13.5px] text-ink-2 leading-relaxed">{member.bio}</p>
                <div className="mt-5">
                  <EmailPill email={member.email} />
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div {...rise(0)} className="mt-10 md:mt-12">
          <Link
            to="/team"
            className="group inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors duration-300 hover:text-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            See the full team
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

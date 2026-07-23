import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { coreTeam } from '@/lib/data/team';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home "Meet the team" strip.
 *
 * A restrained, editorial preview of the students who run the cell:
 *   - Eyebrow + display heading (one gold emphasis word) + one-line intro
 *   - The core team as a portrait-forward glass-card grid (1 / 2 / 3 columns)
 *   - A quiet footer link through to the full /team page
 *
 * The faculty convener is deliberately NOT rendered here — he is featured
 * once, in the homepage LeadershipDesks section, so the home page shows him
 * a single time. This strip is student leadership only.
 *
 * Each card leads with a tall portrait (gold-tinted monogram fallback on
 * image error, so a card never renders as a broken frame), then name, a gold
 * mono role kicker, a short real detail from the data, and a mailto pill.
 * Hover lifts the card, breathes the portrait, and draws a gold underline.
 * Motion is a subtle whileInView rise with a small stagger, gated on reduced
 * motion, and always resolves to fully visible content.
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

interface PortraitProps {
  src: string;
  alt: string;
  initials: string;
}

/**
 * Tall 4:5 portrait that degrades to a gold monogram disc on load failure.
 * The image scales gently when its parent card is hovered (group/card).
 */
function Portrait({ src, alt, initials }: PortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-2">
      {failed || !src ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-bg-2"
          aria-label={alt}
          role="img"
        >
          <span className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold-soft md:h-28 md:w-28">
            <span
              className="select-none font-display font-bold tracking-tight text-gold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              {initials}
            </span>
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[600ms] ease-out group-hover/card:scale-[1.04]"
        />
      )}

      {/* Inner top hairline for depth */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40"
        aria-hidden="true"
      />
      {/* Soft bottom vignette so the card seam reads softly */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 37, 64, 0.28), transparent)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/** Small mailto pill (>=44px tap target) used by each member card. */
function EmailPill({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[12px] text-ink-2 transition-colors duration-300 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay: reduced ? 0 : index * 0.08, ease: EASE },
  });

  return (
    <section className="section-spacing border-t border-line" id="team">
      <div className="container-svc">
        {/* Header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <motion.div {...rise(0)} className="eyebrow mb-4">
            The team
          </motion.div>
          <motion.h2
            {...rise(1)}
            className="display-italic font-display font-bold leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            The students who run the <em>cell.</em>
          </motion.h2>
          <motion.p
            {...rise(2)}
            className="mt-4 text-[15px] leading-relaxed text-ink-2 md:text-base"
          >
            Six elected leads carry the drives, briefs, and recruiter
            conversations across the cycle.
          </motion.p>
        </div>

        {/* Core team — portrait-forward glass grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreTeam.map((member, i) => (
            <motion.article
              key={member.id}
              {...rise(i)}
              className="group/card glass flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-soft-lg)]"
            >
              <Portrait
                src={member.photoPath}
                alt={`Portrait of ${member.name}`}
                initials={member.initials || initialsFromName(member.name)}
              />

              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3
                  className="font-display font-semibold leading-snug tracking-tight text-ink [text-wrap:balance]"
                  style={{ fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', hyphens: 'none' }}
                >
                  {member.name}
                </h3>

                {/* Gold underline — draws wider on hover */}
                <span
                  className="mt-3 block h-px w-8 bg-gold transition-[width] duration-500 ease-out group-hover/card:w-16"
                  aria-hidden="true"
                />

                <p
                  className="kicker mt-3 !normal-case tracking-[0.08em] [text-wrap:balance]"
                  style={{ hyphens: 'none' }}
                >
                  {member.role}
                </p>

                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
                  {member.bio}
                </p>

                <div className="mt-6 pt-2">
                  <EmailPill email={member.email} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div {...rise(0)} className="mt-12 md:mt-14">
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
    </section>
  );
}

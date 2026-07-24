import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';
import { CouncilCoordinators } from '@/components/team/CouncilCoordinators';
import { coreTeam, convener, principal } from '@/lib/data/team';
import type { CoreTeamMember, ConvenerProfile } from '@/types';

/**
 * The Team — "The People / Who runs the cell."
 *
 * One page, four groups, each rendered once:
 *   1. Leadership       Principal + Faculty Convener (team.ts), photos + contact.
 *   2. Core team        The six-member core team (team.ts). Name, role, photo,
 *                       bio, contact. Course intentionally omitted per the cell.
 *   3. CouncilCoordinators  Department heads + the coordinator marquee, with real
 *                       headshots (monogram fallback) and click-to-open modals.
 *                       This is the single council + coordinators block; the old
 *                       monogram-only UnifiedCouncil / CouncilOrbit are gone.
 *   4. TeamPhotoShowcase  Archive photographs of the cohort.
 */
const TeamPhotoShowcase = lazyWithRetry(() =>
  import('@/components/team/TeamPhotoShowcase').then((m) => ({ default: m.TeamPhotoShowcase })),
);

const EASE = [0.22, 1, 0.36, 1] as const;

/** 1-2 letter monogram from a person's name, for the photo fallback. */
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

/** Headshot that falls back to a navy monogram disc if the photo is missing. */
function Portrait({
  src,
  alt,
  initials,
}: {
  src?: string;
  alt: string;
  initials: string;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5"
    >
      <span className="font-display text-4xl font-bold text-accent">{initials}</span>
    </div>
  );
}

/** Leadership card — Principal / Convener. Portrait beside name, role, contact. */
function LeadershipCard({ person, label }: { person: ConvenerProfile; label: string }) {
  return (
    <div className="glass flex gap-5 p-5 sm:p-6">
      <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl bg-bg-2 ring-1 ring-line sm:w-32">
        <Portrait src={person.photoPath} alt={`Portrait of ${person.name}`} initials={initialsOf(person.name)} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="eyebrow mb-2">{label}</span>
        <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
          {person.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {person.department}
        </p>
        <div className="mt-auto flex flex-col gap-1.5 pt-4">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="inline-flex items-center gap-1.5 break-all text-sm text-accent transition-colors hover:text-accent-deep"
            >
              <Mail size={13} className="shrink-0" />
              {person.email}
            </a>
          )}
          {person.phone && (
            <span className="font-mono text-[11px] tracking-wide text-ink-3">{person.phone}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Core team card — photo-forward. Name, role, bio, contact. No course. */
function CoreTeamCard({ member }: { member: CoreTeamMember }) {
  return (
    <article className="glass group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-2">
        <Portrait src={member.photoPath} alt={`Portrait of ${member.name}`} initials={member.initials} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-ink">
          {member.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
          {member.role}
        </p>
        {member.bio && <p className="mt-3 text-sm leading-relaxed text-ink-2">{member.bio}</p>}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="mt-auto inline-flex items-center gap-1.5 break-all pt-4 text-sm text-accent transition-colors hover:text-accent-deep"
          >
            <Mail size={13} className="shrink-0" />
            {member.email}
          </a>
        )}
      </div>
    </article>
  );
}

export function TeamPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-bg-2/50">
        <div className="container-svc pt-14 pb-12 md:pt-20 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-3xl"
          >
            <div className="eyebrow mb-4">The People</div>
            <h1 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
              Who runs the <span className="text-gold">cell.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
              The Faculty Convener, the core team, the department heads, and the coordinators who run
              every drive. If you are a recruiter, these are the people who will answer your email.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership + Core team */}
      <section className="section-spacing border-t border-line bg-bg" aria-labelledby="core-team-heading">
        <div className="container-svc">
          <div className="mb-6 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold">
              Leadership
            </span>
          </div>
          <div className="mb-16 grid gap-5 md:grid-cols-2 md:mb-20">
            <LeadershipCard person={principal} label="Principal" />
            <LeadershipCard person={convener} label="Faculty Convener" />
          </div>

          <div className="mb-6 flex flex-wrap items-baseline gap-3">
            <h2
              id="core-team-heading"
              className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold"
            >
              Core team
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              {String(coreTeam.length).padStart(2, '0')} members · 2026-27
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreTeam.map((member) => (
              <CoreTeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Council + Coordinators — real headshots, grouped council + marquee, modals */}
      <CouncilCoordinators />

      {/* Archive photographs of the cohort */}
      <DeferLazy minHeight={560}>
        <TeamPhotoShowcase />
      </DeferLazy>

      {/* Contact */}
      <section className="section-spacing border-t border-line bg-bg-2">
        <div className="container-svc text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            Reach the desk
          </p>
          <h2 className="mb-6 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            One address, always answered.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:placement@svc.ac.in"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              placement@svc.ac.in
            </a>
            <Link
              to="/recruiters"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Recruit with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recruiters } from '@/lib/data/partners';
import { brandIconUrl } from '@/lib/data/brand';
import { previousCycleStats } from '@/lib/data/stats';

/**
 * Recruit at Venky — the recruiters-page hero.
 *
 * Floating company logos are the centrepiece: a gentle constellation of the
 * cell's real recruiter logos (from partners.ts) drifting over a navy glass
 * backdrop. Every tile pulls its logo from the Brandfetch CDN via the domain
 * field and falls back to a brand-colour initials disc when a logo is missing.
 *
 * Performance and motion:
 *   - Drift is pure CSS transform (translate only), desynced per tile. No
 *     per-frame JS, no physics, no layout thrash.
 *   - prefers-reduced-motion is honoured globally (see globals.css, which
 *     forces animation-duration to ~0), so the constellation renders static.
 *   - Below 768px the constellation is display:none and a clean static logo
 *     grid renders instead, so phones never run the drift or the absolute
 *     layout.
 *
 * Data comes only from partners.ts (the featured set); positions are a fixed
 * hand-tuned scatter so tiles never overlap. Export name/props are unchanged.
 */

const featured = recruiters.filter((r) => r.featured);

/** Hand-tuned scatter (percent coords + tile size in px). The two largest
 *  slots fall on featured[5] and featured[10] — BCG and Goldman Sachs. */
const SLOTS: Array<{ x: number; y: number; s: number }> = [
  { x: 14, y: 12, s: 56 },
  { x: 40, y: 10, s: 68 },
  { x: 63, y: 14, s: 56 },
  { x: 86, y: 12, s: 68 },
  { x: 17, y: 32, s: 68 },
  { x: 38, y: 30, s: 88 },
  { x: 61, y: 34, s: 68 },
  { x: 84, y: 32, s: 56 },
  { x: 13, y: 52, s: 56 },
  { x: 36, y: 52, s: 68 },
  { x: 60, y: 50, s: 88 },
  { x: 85, y: 54, s: 68 },
  { x: 16, y: 72, s: 68 },
  { x: 39, y: 74, s: 56 },
  { x: 62, y: 72, s: 68 },
  { x: 86, y: 72, s: 56 },
  { x: 14, y: 90, s: 56 },
  { x: 40, y: 90, s: 68 },
  { x: 63, y: 88, s: 56 },
  { x: 86, y: 90, s: 68 },
];

function initialsOf(name: string): string {
  return name
    .split(/[\s&.\-,]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// A single logo tile. Fills its parent; the parent controls the size.
// ---------------------------------------------------------------------------
function LogoTile({
  slug,
  name,
  domain,
  brandColor,
}: {
  slug: string;
  name: string;
  domain?: string;
  brandColor?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = domain ? brandIconUrl(domain) : '';
  const showLogo = !!src && !failed;

  return (
    <Link
      to={`/companies/${slug}`}
      title={name}
      aria-label={name}
      className="group block w-full h-full rounded-[22%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div
        className="relative w-full h-full rounded-[22%] bg-white overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        style={{
          border: '1px solid rgba(10,37,64,0.08)',
          boxShadow:
            '0 6px 18px -8px rgba(3,12,28,0.55), 0 2px 4px -2px rgba(3,12,28,0.35)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          {showLogo ? (
            <img
              src={src}
              alt=""
              loading="lazy"
              className="max-w-full max-h-full object-contain"
              onError={() => setFailed(true)}
            />
          ) : (
            <span
              className="font-display font-bold leading-none tracking-tight"
              style={{ color: brandColor ?? '#1e4e8c', fontSize: 'clamp(0.7rem, 3.2vw, 1.05rem)' }}
            >
              {initialsOf(name)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
export function RecruiterGalaxy() {
  const stats = [
    { value: String(previousCycleStats.totalPlacementOffers), label: 'Placement offers' },
    { value: String(previousCycleStats.totalInternshipOffers), label: 'Internship offers' },
    { value: String(previousCycleStats.recruitersEngaged), label: 'Recruiters engaged' },
    { value: `${previousCycleStats.peakCtcLPA}`, label: 'Peak CTC · LPA' },
  ];

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Recruit at Venky"
      style={{ background: 'linear-gradient(160deg, #0a2540 0%, #0c2c4e 45%, #0a2540 100%)' }}
    >
      {/* Colour blooms */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 82% 18%, rgba(156,122,58,0.20), transparent 55%), radial-gradient(ellipse at 12% 82%, rgba(30,78,140,0.30), transparent 55%)',
        }}
      />
      {/* Faint hairline grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 44px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 44px)',
        }}
      />

      <div className="container-svc relative section-spacing">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold">
              For recruiters
            </span>
            <h1
              className="font-display font-bold text-white leading-[1.03] tracking-[-0.03em] mt-4 mb-5 text-balance"
              style={{ fontSize: 'clamp(2.4rem, 5.4vw, 4rem)' }}
            >
              Recruit at <span className="text-gold">Venky.</span>
              <span className="block text-white/45">One desk, every drive.</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md text-pretty">
              Write to the placement cell with the role, eligibility, headcount, and
              timeline. A coordinator runs the drive end to end, on a schedule the cell
              publishes.
            </p>

            {/* Aggregate stat chips */}
            <div className="mt-8 max-w-lg">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2.5">
                {previousCycleStats.cycle} · last completed cycle
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl px-3.5 py-3 bg-white/[0.06] border border-white/10"
                  >
                    <dd className="font-display font-bold text-white text-xl leading-none tabular-nums">
                      {s.value}
                    </dd>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/55 mt-2 leading-tight">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#interest"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-ink font-medium min-h-[44px] hover:bg-gold hover:text-white transition-colors shadow-soft-lg"
              >
                Share a hiring brief
                <span aria-hidden="true">→</span>
              </a>
              <Link
                to="/recruiters/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white/85 font-medium min-h-[44px] hover:border-white/60 hover:text-white transition-colors"
              >
                Recruiter dashboard
              </Link>
            </div>
          </div>

          {/* Floating logos */}
          <div>
            {/* Desktop constellation (drifts; hidden on phones) */}
            <div
              className="hidden md:block relative w-full mx-auto"
              style={{ aspectRatio: '1 / 1', maxWidth: 560 }}
            >
              {SLOTS.map((slot, i) => {
                const r = featured[i];
                if (!r) return null;
                const dur = 11 + (i % 5) * 1.4;
                const delay = (i % 7) * 0.55;
                return (
                  <div
                    key={r.slug}
                    className="absolute"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: slot.s,
                      height: slot.s,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className="w-full h-full will-change-transform"
                      style={{ animation: `galaxy-drift-${i % 3} ${dur}s ease-in-out ${delay}s infinite` }}
                    >
                      <LogoTile slug={r.slug} name={r.name} domain={r.domain} brandColor={r.brandColor} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile grid (static, clean) */}
            <div className="grid md:hidden grid-cols-4 gap-2.5">
              {featured.slice(0, 16).map((r) => (
                <div key={r.slug} className="aspect-square">
                  <LogoTile slug={r.slug} name={r.name} domain={r.domain} brandColor={r.brandColor} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 md:mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 max-w-2xl text-pretty">
          A selection of firms that have hired at SVC. The full directory lives in the recruiter dashboard.
        </p>
      </div>

      <style>{`
        @keyframes galaxy-drift-0 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-10px,0); } }
        @keyframes galaxy-drift-1 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(6px,-7px,0); } }
        @keyframes galaxy-drift-2 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-6px,-8px,0); } }
      `}</style>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recruiters } from '@/lib/data/partners';
import { brandIconUrl } from '@/lib/data/brand';

/**
 * Recruit at Venky — the recruiters-page hero.
 *
 * The centrepiece is a floating constellation of the cell's real recruiter
 * logos: rounded-square glass tiles that drift gently over a navy backdrop.
 * This is the old, well-liked "floating elements" treatment, restored.
 *
 * Design:
 *   - A three-tier hierarchy gives the cluster an organic, hand-composed
 *     feel instead of a rigid grid. Premium firms sit largest with a thin
 *     brand-colour accent ring; strong firms are mid-size with a brand dot;
 *     standard firms are compact. Sizes and a hand-tuned scatter are the
 *     only thing hardcoded here — every logo, name, colour, and domain is
 *     read from partners.ts.
 *   - Each tile pulls its square logo from the Brandfetch CDN (brandIconUrl)
 *     and falls back to a brand-colour initials disc when a logo is missing.
 *
 * Performance and motion:
 *   - Drift is pure CSS transform (translate only), desynced per tile. No
 *     per-frame JS, no physics, no ResizeObserver, no layout thrash. Tiles
 *     are positioned in percentages so no measuring is needed.
 *   - prefers-reduced-motion is honoured globally (globals.css forces
 *     animation-duration to ~0), so the constellation renders static.
 *   - Below 768px the constellation is display:none and a clean static logo
 *     grid renders instead, so phones never run the drift or absolute layout.
 */

type Tier = 'premium' | 'strong' | 'standard';

interface Slot {
  slug: string;
  tier: Tier;
  /** Centre position as a percent of the constellation box. */
  x: number;
  y: number;
}

/** Fixed tile size (px) per tier. Small enough to stay lag-free, large
 *  enough to keep a comfortable tap target on the standard tier. */
const TIER_SIZE: Record<Tier, number> = {
  premium: 84,
  strong: 68,
  standard: 56,
};

/**
 * Hand-tuned scatter. Positions are clamped to the 8–92% band so tiles never
 * touch the section edge (the section also clips overflow). Slugs reference
 * partners.ts; no recruiter data is duplicated here.
 */
const LAYOUT: Slot[] = [
  // Premium — larger, clustered toward the centre
  { slug: 'bcg',              tier: 'premium',  x: 78, y: 14 },
  { slug: 'bain',             tier: 'premium',  x: 90, y: 30 },
  { slug: 'goldman-sachs',    tier: 'premium',  x: 50, y: 38 },
  { slug: 'de-shaw',          tier: 'premium',  x: 70, y: 54 },
  { slug: 'deloitte',         tier: 'premium',  x: 26, y: 13 },
  { slug: 'ey',               tier: 'premium',  x: 88, y: 50 },
  { slug: 'kpmg',             tier: 'premium',  x: 37, y: 27 },
  { slug: 'pwc',              tier: 'premium',  x: 14, y: 33 },
  { slug: 'icici-prudential', tier: 'premium',  x: 60, y: 71 },

  // Strong — mid-size, fanned out
  { slug: 'accenture',        tier: 'strong',   x: 63, y: 24 },
  { slug: 'icici-bank',       tier: 'strong',   x: 11, y: 60 },
  { slug: 'hdfc-bank',        tier: 'strong',   x: 39, y: 64 },
  { slug: 'grant-thornton',   tier: 'strong',   x: 81, y: 76 },
  { slug: 'hcl-technologies', tier: 'strong',   x: 23, y: 77 },
  { slug: 'aon',              tier: 'strong',   x: 59, y: 9  },
  { slug: 'wtw',              tier: 'strong',   x: 27, y: 47 },
  { slug: 'genpact',          tier: 'strong',   x: 90, y: 66 },

  // Standard — compact, filling the perimeter
  { slug: 'masters-union',    tier: 'standard', x: 49, y: 14 },
  { slug: 'exl',              tier: 'standard', x: 51, y: 87 },
  { slug: 'zomato',           tier: 'standard', x: 87, y: 88 },
  { slug: 'glg',              tier: 'standard', x: 71, y: 90 },
  { slug: 'oxane-partners',   tier: 'standard', x: 10, y: 79 },
  { slug: 'futures-first',    tier: 'standard', x: 88, y: 9  },
  { slug: 'hubspot',          tier: 'standard', x: 31, y: 91 },
];

interface TileData extends Slot {
  name: string;
  domain?: string;
  brandColor: string;
  size: number;
}

/** Resolve each slot against partners.ts once, at module load. */
const tiles: TileData[] = LAYOUT.map((slot) => {
  const data = recruiters.find((r) => r.slug === slot.slug);
  return {
    ...slot,
    name: data?.name ?? slot.slug,
    domain: data?.domain,
    brandColor: data?.brandColor ?? '#1e4e8c',
    size: TIER_SIZE[slot.tier],
  };
});

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
// A single logo tile — fills its parent; the parent controls size + motion.
// ---------------------------------------------------------------------------
function LogoTile({
  slug,
  name,
  domain,
  brandColor,
  tier,
  size,
}: {
  slug: string;
  name: string;
  domain?: string;
  brandColor: string;
  tier?: Tier;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const src = domain ? brandIconUrl(domain) : '';
  const showLogo = !!src && !failed;
  const showRing = tier === 'premium';
  const showDot = tier === 'strong';
  const initialsSize = size ? size * (initialsOf(name).length <= 2 ? 0.36 : 0.26) : undefined;

  return (
    <Link
      to={`/companies/${slug}`}
      title={name}
      aria-label={name}
      className="group relative block w-full h-full rounded-[22%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {/* Premium accent ring, offset just outside the tile */}
      {showRing && (
        <span
          aria-hidden="true"
          className="absolute pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            inset: -5,
            border: `1.5px solid ${brandColor}`,
            borderRadius: '26%',
          }}
        />
      )}

      {/* Tile body */}
      <div
        className="relative w-full h-full rounded-[22%] bg-white overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        style={{
          border: '1px solid rgba(10,37,64,0.08)',
          boxShadow:
            '0 6px 18px -8px rgba(3,12,28,0.55), 0 2px 4px -2px rgba(3,12,28,0.35)',
        }}
      >
        {/* Subtle brand-colour wash */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 28%, ${brandColor}12, transparent 62%)` }}
        />

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
              style={{
                color: brandColor,
                fontSize: initialsSize ? `${initialsSize}px` : 'clamp(0.7rem, 3.2vw, 1.05rem)',
              }}
            >
              {initialsOf(name)}
            </span>
          )}
        </div>

        {/* Strong-tier brand dot */}
        {showDot && (
          <span
            aria-hidden="true"
            className="absolute pointer-events-none rounded-full"
            style={{ top: 6, right: 6, width: 6, height: 6, background: brandColor, opacity: 0.85 }}
          />
        )}
      </div>

      {/* Hover glow */}
      <span
        aria-hidden="true"
        className="absolute pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity duration-500"
        style={{
          inset: -14,
          background: `radial-gradient(circle, ${brandColor}55 0%, transparent 70%)`,
          filter: 'blur(10px)',
          borderRadius: '26%',
          zIndex: -1,
        }}
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
export function RecruiterGalaxy() {
  const featured = recruiters.filter((r) => r.featured);

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

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/recruiters#interest"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-ink font-medium min-h-[44px] hover:bg-gold hover:text-white transition-colors shadow-soft-lg"
              >
                Share a hiring brief
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Floating logo constellation */}
          <div>
            {/* Desktop constellation (drifts; hidden on phones) */}
            <div
              className="hidden md:block relative w-full mx-auto"
              style={{ aspectRatio: '1 / 1', maxWidth: 560 }}
            >
              {tiles.map((t, i) => {
                const dur = 11 + (i % 5) * 1.4;
                const delay = (i % 7) * 0.55;
                return (
                  <div
                    key={t.slug}
                    className="absolute"
                    style={{
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      width: t.size,
                      height: t.size,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className="relative w-full h-full will-change-transform"
                      style={{ animation: `galaxy-drift-${i % 3} ${dur}s ease-in-out ${delay}s infinite` }}
                    >
                      <LogoTile
                        slug={t.slug}
                        name={t.name}
                        domain={t.domain}
                        brandColor={t.brandColor}
                        tier={t.tier}
                        size={t.size}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile grid (static, clean) */}
            <div className="grid md:hidden grid-cols-4 gap-2.5">
              {featured.slice(0, 16).map((r) => (
                <div key={r.slug} className="relative aspect-square">
                  <LogoTile slug={r.slug} name={r.name} domain={r.domain} brandColor={r.brandColor ?? '#1e4e8c'} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 md:mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 max-w-2xl text-pretty">
          A selection of firms that have hired at Sri Venkateswara College across recent cycles.
        </p>
      </div>

      <style>{`
        @keyframes galaxy-drift-0 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-9px,0); } }
        @keyframes galaxy-drift-1 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(6px,-6px,0); } }
        @keyframes galaxy-drift-2 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-6px,-7px,0); } }
      `}</style>
    </section>
  );
}

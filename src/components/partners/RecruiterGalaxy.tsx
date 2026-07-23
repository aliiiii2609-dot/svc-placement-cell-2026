import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { recruiters } from '@/lib/data/partners';
import { brandIconUrl } from '@/lib/data/brand';
import { cn } from '@/lib/utils/cn';

/**
 * Recruiter Constellation.
 *
 * Uniform rounded-square tile system (macOS app icon / Stripe customer grid
 * standard). Every tile shares the same template:
 *
 *   - White interior, hairline border, border-radius 22% (square that
 *     reads as a friendly app icon)
 *   - Brandfetch square icon at 64-68% width, centered
 *   - Float drift animation, very slow, randomized phase per tile
 *
 * Tier hierarchy:
 *
 *   - Premium tier (MBB consulting, Goldman Sachs, D.E. Shaw, Big 4 audit,
 *     American Express, Nomura, ICICI Prudential, Arcesium, DSP BlackRock):
 *     larger tile size, 2px accent ring in the firm's brand color offset
 *     6px outside the tile, premium badge on hover
 *
 *   - Strong tier (Accenture, ZS, AON, WTW, Genpact, EXL, HCL, TresVista,
 *     Grant Thornton, BSR, Futures First, Oxane, ICICI Bank, HDFC Bank,
 *     Masters Union): medium size, brand-color dot indicator at top-right
 *
 *   - Standard tier: compact size, hairline border only
 *
 * Known wordmark-only logos (companies whose Brandfetch icon is a wide
 * wordmark, e.g. "D E Shaw & Co", "GLG", "BSR & Co"): rendered as a clean
 * display-font monogram in the firm's brand color, so the tile stays
 * visually consistent with every other tile in the cluster.
 *
 * No more colored bubble backgrounds. No more cropped wordmarks. Every tile
 * looks intentional.
 */

type Tier = 'premium' | 'strong' | 'standard';

interface BubbleConfig {
  slug: string;
  tier: Tier;
  /** Pre-selected pixel coordinates (relative to container, 0-100 percent). */
  x: number;
  y: number;
}

/**
 * Pre-defined positions, hand-tuned for premium tier centerpiece reading.
 * Premium tiles cluster slightly toward the center; strong tiles fan out;
 * standard tiles fill the perimeter. Sizes derive from tier in code.
 */
const LAYOUT: BubbleConfig[] = [
  // Premium tier — centerpiece reading, slightly larger
  { slug: 'bcg',                  tier: 'premium',  x: 78, y: 14 },
  { slug: 'bain',                 tier: 'premium',  x: 92, y: 30 },
  { slug: 'goldman-sachs',        tier: 'premium',  x: 50, y: 38 },
  { slug: 'de-shaw',              tier: 'premium',  x: 70, y: 52 },
  { slug: 'deloitte',             tier: 'premium',  x: 26, y: 12 },
  { slug: 'ey',                   tier: 'premium',  x: 88, y: 50 },
  { slug: 'kpmg',                 tier: 'premium',  x: 38, y: 26 },
  { slug: 'pwc',                  tier: 'premium',  x: 14, y: 32 },
  { slug: 'icici-prudential',     tier: 'premium',  x: 60, y: 70 },

  // Strong tier — medium, fanned out
  { slug: 'accenture',            tier: 'strong',   x: 64, y: 24 },
  { slug: 'icici-bank',           tier: 'strong',   x: 8,  y: 60 },
  { slug: 'hdfc-bank',            tier: 'strong',   x: 40, y: 64 },
  { slug: 'grant-thornton',       tier: 'strong',   x: 80, y: 76 },
  { slug: 'hcl-technologies',     tier: 'strong',   x: 22, y: 76 },
  { slug: 'aon',                  tier: 'strong',   x: 60, y: 8  },
  { slug: 'wtw',                  tier: 'strong',   x: 26, y: 46 },
  { slug: 'genpact',              tier: 'strong',   x: 96, y: 68 },

  // Standard tier — compact, perimeter
  { slug: 'masters-union',        tier: 'standard', x: 50, y: 14 },
  { slug: 'exl',                  tier: 'standard', x: 52, y: 86 },
  { slug: 'zomato',               tier: 'standard', x: 90, y: 88 },
  { slug: 'glg',                  tier: 'standard', x: 70, y: 90 },
  { slug: 'oxane-partners',       tier: 'standard', x: 6,  y: 78 },
  { slug: 'futures-first',        tier: 'standard', x: 90, y: 6  },
  { slug: 'hubspot',              tier: 'standard', x: 30, y: 94 },
];

const TIER_SIZE: Record<Tier, number> = {
  premium: 92,
  strong: 74,
  standard: 60,
};

/**
 * Brands whose Brandfetch icon is a wordmark (not a square icon),
 * meaning the bitmap renders cropped or empty. For these we use a
 * designed monogram tile (display-font letters in brand color) which
 * reads consistently with the other tiles.
 */
const FORCE_MONOGRAM: Record<string, { mono: string; color: string }> = {
  'goldman-sachs':  { mono: 'GS',  color: '#7399c6' },
  'de-shaw':        { mono: 'DE',  color: '#b91c2c' },
  'masters-union':  { mono: 'MU',  color: '#0a2540' },
  'glg':            { mono: 'GLG', color: '#0d2545' },
  'futures-first':  { mono: 'FF',  color: '#1a3a52' },
  'oxane-partners': { mono: 'OP',  color: '#1c4d7a' },
  'bsr-co':         { mono: 'BSR', color: '#0070c0' },
};

interface Bubble extends BubbleConfig {
  name: string;
  domain?: string;
  brandColor: string;
  size: number;
  delay: number;
}

const bubbles: Bubble[] = LAYOUT
  .map((cfg, i) => {
    const data = recruiters.find((r) => r.slug === cfg.slug);
    return {
      ...cfg,
      name: data?.name ?? cfg.slug,
      domain: data?.domain,
      brandColor: data?.brandColor ?? '#635bff',
      size: TIER_SIZE[cfg.tier],
      delay: (i * 0.31) % 4,
    };
  });

// ---------------------------------------------------------------------------
// Bubble node — uniform rounded-square tile
// ---------------------------------------------------------------------------
function BubbleNode({ bubble, containerW, containerH }: { bubble: Bubble; containerW: number; containerH: number }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const forceMono = FORCE_MONOGRAM[bubble.slug];
  const logoSrc = !forceMono && bubble.domain ? brandIconUrl(bubble.domain) : '';
  const useBitmap = !forceMono && !!logoSrc && !logoFailed;
  const showRing = bubble.tier === 'premium';
  const showDot = bubble.tier === 'strong';

  // Monogram tile content
  const monogramText = forceMono?.mono ?? bubble.name
    .split(/[\s&-]+/).filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const monogramColor = forceMono?.color ?? bubble.brandColor;

  const left = (bubble.x / 100) * containerW - bubble.size / 2;
  const top = (bubble.y / 100) * containerH - bubble.size / 2;

  return (
    <Link
      to={`/companies/${bubble.slug}`}
      aria-label={bubble.name}
      title={bubble.name}
      style={{
        left,
        top,
        width: bubble.size,
        height: bubble.size,
        animation: `bubble-float ${10 + (bubble.delay % 3) * 2.5}s ease-in-out ${bubble.delay}s infinite`,
      }}
      className={cn(
        'absolute group block',
        'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:scale-[1.08] hover:z-10',
      )}
    >
      {/* Outer accent ring for premium tier */}
      {showRing && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none transition-opacity duration-400 group-hover:opacity-100"
          style={{
            top: -6,
            left: -6,
            right: -6,
            bottom: -6,
            border: `2px solid ${bubble.brandColor}`,
            borderRadius: '26%',
            opacity: 0.55,
          }}
        />
      )}

      {/* Tile body — uniform rounded square */}
      <div
        className="relative w-full h-full bg-white"
        style={{
          borderRadius: '22%',
          border: '1px solid rgba(10, 37, 64, 0.10)',
          boxShadow: '0 6px 18px -8px rgba(10, 37, 64, 0.20), 0 2px 4px -2px rgba(10, 37, 64, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Brand-color radial wash, very subtle */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${bubble.brandColor}10, transparent 60%)`,
          }}
        />

        {/* Logo or monogram */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '18%' }}>
          {useBitmap ? (
            <img
              src={logoSrc}
              alt=""
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="font-display font-bold tracking-tight"
              style={{
                color: monogramColor,
                fontSize: bubble.size * (monogramText.length <= 2 ? 0.40 : 0.26),
                letterSpacing: '-0.03em',
              }}
            >
              {monogramText}
            </span>
          )}
        </div>

        {/* Strong-tier dot indicator at top-right */}
        {showDot && (
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: bubble.brandColor,
              opacity: 0.85,
            }}
          />
        )}
      </div>

      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          inset: -16,
          background: `radial-gradient(circle, ${bubble.brandColor}55 0%, transparent 70%)`,
          filter: 'blur(10px)',
          borderRadius: '26%',
          zIndex: -1,
        }}
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Galaxy section
// ---------------------------------------------------------------------------
export function RecruiterGalaxy() {
  const constellationRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = constellationRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className="relative section-spacing border-t border-line overflow-hidden bg-bg"
      aria-label="Recruit at Venky"
    >
      {/* Soft warm gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 80%, rgba(255, 176, 136, 0.18), transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(99, 91, 255, 0.10), transparent 55%)',
        }}
      />

      <div className="container-svc relative">
        <div className="grid lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4">
              Recruiters and partners
            </div>
            <h2
              className="font-display font-bold text-ink leading-[1.04] tracking-[-0.028em] mb-3"
              style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}
            >
              Recruit at Venky.
              <span className="block text-ink-3">One desk for every drive.</span>
            </h2>
            <p className="text-ink-2 text-base md:text-lg leading-relaxed mt-5 max-w-md">
              Write to the placement cell with role, eligibility, location,
              headcount, and timeline. A coordinator confirms within three
              working days and runs the drive on a published schedule.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/recruiters"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-medium hover:bg-accent transition-colors shadow-soft"
              >
                Explore recruiter directory
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/recruiters#contact"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-deep transition-colors px-3 py-2"
              >
                Contact our team
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Tier legend */}
            <div className="mt-10 pt-6 border-t border-line max-w-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-3">
                Featured here
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block w-3.5 h-3.5 rounded-[4px] border-2" style={{ borderColor: '#635bff' }} />
                  <span className="text-ink-2 font-mono uppercase tracking-[0.12em]">Premium tier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block w-3.5 h-3.5 rounded-[4px] border border-ink/15 relative">
                    <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-accent" />
                  </span>
                  <span className="text-ink-2 font-mono uppercase tracking-[0.12em]">Strong tier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block w-3.5 h-3.5 rounded-[4px] border border-ink/15" />
                  <span className="text-ink-2 font-mono uppercase tracking-[0.12em]">Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — the constellation */}
          <div
            ref={constellationRef}
            className="relative w-full"
            style={{ aspectRatio: '5 / 4', minHeight: 460 }}
          >
            {size.w > 0 &&
              bubbles.map((b) => (
                <BubbleNode
                  key={b.slug}
                  bubble={b}
                  containerW={size.w}
                  containerH={size.h}
                />
              ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubble-float {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(6px, -8px); }
        }
      `}</style>
    </section>
  );
}

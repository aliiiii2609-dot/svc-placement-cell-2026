import { useState } from 'react';
import { recruiters } from '@/lib/data/partners';
import { brandLogoUrl } from '@/lib/data/brand';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

/**
 * Recruiter logo + name marquee.
 *
 * Each tile pairs the brand icon (square Brandfetch icon) with the firm's
 * display name. Logo and name read together as a single mark. Slow
 * continuous slide, edge-faded, pauses on hover. Like Stripe's customer
 * strip but with paired naming for clarity.
 */

function Tile({
  slug, name, domain, brandColor,
}: { slug: string; name: string; domain?: string; brandColor?: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = !!domain && !logoFailed;

  return (
    <Link
      to={`/companies/${slug}`}
      aria-label={name}
      className={cn(
        'group inline-flex items-center gap-3.5 shrink-0',
        'h-[64px] px-7 mx-1',
        'transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:scale-[1.04] hover:-translate-y-0.5',
      )}
    >
      {showLogo && (
        <img
          src={brandLogoUrl(domain!, { type: 'icon', theme: 'light', fallback: 'transparent' })}
          alt=""
          className="object-contain shrink-0"
          style={{
            maxWidth: 36,
            maxHeight: 36,
            opacity: 0.95,
          }}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span
        className="font-display font-semibold whitespace-nowrap tracking-tight text-[19px] md:text-[21px] transition-colors duration-400"
        style={{
          color: showLogo ? '#0a2540' : (brandColor ?? '#0a2540'),
        }}
      >
        {name}
      </span>
    </Link>
  );
}

export function RecruiterMarqueeBar() {
  const list = [...recruiters, ...recruiters];

  return (
    <section
      className="relative py-12 border-y border-line bg-surface overflow-hidden"
      aria-label="Recruiters at SVC"
    >
      {/* Warm gradient bleed from right — peach, blush, lavender, heavily blurred */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: '-15%',
          top: '-30%',
          width: '60%',
          height: '160%',
          background:
            'radial-gradient(ellipse at center, rgba(255, 176, 136, 0.20) 0%, rgba(255, 107, 157, 0.16) 30%, rgba(184, 137, 59, 0.12) 60%, transparent 80%)',
          filter: 'blur(60px)',
          animation: 'strip-bleed-drift 24s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes strip-bleed-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.85; }
          50%      { transform: translate(-20px, 12px); opacity: 1; }
        }
      `}</style>

      <div className="container-svc relative">
        <div className="text-center mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            Recruiters at SVC across recent cycles
          </span>
        </div>
      </div>

      <div className="mask-image overflow-hidden relative">
        <div
          className="flex w-max animate-marquee group hover:[animation-play-state:paused]"
          style={{ animationDuration: '120s' }}
          role="region"
          aria-label="Scrolling list of recruiter firms"
        >
          {list.map((r, i) => (
            <Tile
              key={`${r.slug}-${i}`}
              slug={r.slug}
              name={r.name}
              domain={r.domain}
              brandColor={r.brandColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

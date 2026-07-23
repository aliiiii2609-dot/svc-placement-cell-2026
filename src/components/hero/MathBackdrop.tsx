import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Math / blueprint backdrop layer for the hero.
 *
 * Subtle inked geometry: a square grid, faint mathematical expressions, and a
 * couple of engineering-blueprint flourishes (circles, dimension lines).
 * Designed to sit BEHIND a low-opacity building photo so the building floats
 * over what reads like a campus architectural drawing.
 *
 * Performance: this is now a fully STATIC SVG. It previously ran infinite CSS
 * `float` loops on every expression and two `spin` loops on the flourish
 * groups — continuous compositor work that never stopped, even when the hero
 * had been scrolled far off screen. All of that is gone. On mobile (< 768px)
 * and with prefers-reduced-motion the decorative flourishes and expressions are
 * dropped entirely and only the cheap grid remains, so the hero stays light on
 * the devices that need it most.
 */

const EXPRESSIONS = [
  '∫₀^∞ e^(-x²) dx',
  'E = mc²',
  'ζ(s) = Σ 1/n^s',
  'a² + b² = c²',
  '∇ × E = -∂B/∂t',
  'eⁱπ + 1 = 0',
  'P(A∩B) = P(A)P(B|A)',
  'F = ma',
];

type Pos = { left: number; top: number; rotate: number; size: number };
// Hand-placed coordinates (% of container) so the expressions feel scattered.
const POSITIONS: Pos[] = [
  { left: 6, top: 8, rotate: -4, size: 14 },
  { left: 55, top: 6, rotate: -3, size: 12 },
  { left: 82, top: 12, rotate: 1, size: 14 },
  { left: 4, top: 40, rotate: 2, size: 13 },
  { left: 78, top: 34, rotate: 3, size: 12 },
  { left: 12, top: 70, rotate: -1, size: 13 },
  { left: 62, top: 80, rotate: 3, size: 13 },
  { left: 40, top: 62, rotate: 2, size: 12 },
];

/** True on narrow viewports; kept in state so SSR/first paint is stable. */
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}

export function MathBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  // On mobile or reduced-motion, keep only the near-free grid layer.
  const light = mobile || reduced;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Layer 1: faint square grid (cheap, always on) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(10, 37, 64, 0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {light ? null : (
        <>
          {/* Layer 2: static floating math expressions */}
          {EXPRESSIONS.map((expr, i) => {
            const pos = POSITIONS[i];
            return (
              <span
                key={i}
                className="absolute font-mono select-none"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: `rotate(${pos.rotate}deg)`,
                  fontSize: `${pos.size}px`,
                  color: 'rgba(10, 37, 64, 0.10)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {expr}
              </span>
            );
          })}

          {/* Layer 3: static engineering-blueprint flourishes */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="rgba(30, 78, 140, 0.08)" strokeWidth="1" fill="none">
              <circle cx="850" cy="200" r="180" />
              <circle cx="850" cy="200" r="140" strokeDasharray="2 6" />
              <line x1="670" y1="200" x2="1030" y2="200" />
              <line x1="850" y1="20" x2="850" y2="380" />
            </g>
            <g stroke="rgba(10, 37, 64, 0.08)" strokeWidth="1" fill="none">
              <polygon points="180,540 260,660 100,660" />
              <circle cx="180" cy="620" r="60" />
            </g>
            <line x1="0" y1="400" x2="1000" y2="400" stroke="rgba(10, 37, 64, 0.06)" strokeWidth="0.6" strokeDasharray="2 6" />
            <line x1="500" y1="0" x2="500" y2="800" stroke="rgba(10, 37, 64, 0.06)" strokeWidth="0.6" strokeDasharray="2 6" />
          </svg>
        </>
      )}
    </div>
  );
}

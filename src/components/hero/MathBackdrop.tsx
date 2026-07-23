import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Math / blueprint backdrop layer for the hero.
 *
 * Subtle inked geometry: a square grid, faint mathematical expressions
 * floating at low opacity, and a few engineering-blueprint flourishes
 * (circles, dimension lines). Designed to sit BEHIND a low-opacity
 * building photo so the building floats over what reads like a campus
 * architectural drawing.
 *
 * Pure SVG, no JS animation loop. Inherits the section's reduced-motion
 * preference: with reduced motion, the slow rotation and float on the
 * geometric flourishes are paused.
 */

const EXPRESSIONS = [
  // Math-y typography, neutral and educational
  '∫₀^∞ e^(-x²) dx',
  'E = mc²',
  'ζ(s) = Σ 1/n^s',
  'lim_{n→∞} (1+1/n)^n',
  'a² + b² = c²',
  '∇ × E = -∂B/∂t',
  'eⁱπ + 1 = 0',
  'f(x) = Σ aₙxⁿ',
  'P(A∩B) = P(A)P(B|A)',
  'F = ma',
  '∮ E·dA = Q/ε₀',
  'σ² = E[(X-μ)²]',
  'd/dx[ln x] = 1/x',
  '∂²u/∂t² = c²∇²u',
];

type Pos = { left: number; top: number; rotate: number; size: number };
// Hand-placed coordinates (% of container) so the expressions feel scattered, not gridded
const POSITIONS: Pos[] = [
  { left: 6, top: 8, rotate: -4, size: 14 },
  { left: 28, top: 14, rotate: 2, size: 13 },
  { left: 55, top: 6, rotate: -3, size: 12 },
  { left: 82, top: 12, rotate: 1, size: 14 },
  { left: 4, top: 32, rotate: 2, size: 13 },
  { left: 48, top: 38, rotate: -2, size: 15 },
  { left: 78, top: 28, rotate: 3, size: 12 },
  { left: 12, top: 58, rotate: -1, size: 13 },
  { left: 40, top: 64, rotate: 2, size: 12 },
  { left: 72, top: 56, rotate: -4, size: 14 },
  { left: 8, top: 82, rotate: 1, size: 13 },
  { left: 36, top: 88, rotate: -2, size: 12 },
  { left: 62, top: 84, rotate: 3, size: 13 },
  { left: 88, top: 76, rotate: -1, size: 12 },
];

export function MathBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();

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
      {/* Layer 1: faint square grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(10, 37, 64, 0.06)"
              strokeWidth="1"
            />
          </pattern>
          <pattern id="hero-grid-fine" width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M 12 0 L 0 0 0 12"
              fill="none"
              stroke="rgba(10, 37, 64, 0.03)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid-fine)" />
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Layer 2: floating math expressions in JetBrains Mono */}
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
              animation: reduced
                ? undefined
                : `float ${10 + (i % 5) * 2}s ease-in-out ${(i * 0.5) % 6}s infinite`,
            }}
          >
            {expr}
          </span>
        );
      })}

      {/* Layer 3: engineering-blueprint flourishes (circles, axes) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle protractor arc, top-right */}
        <g
          stroke="rgba(30, 78, 140, 0.08)"
          strokeWidth="1"
          fill="none"
          style={{
            transformOrigin: '850px 200px',
            animation: reduced ? undefined : 'spin 120s linear infinite',
          }}
        >
          <circle cx="850" cy="200" r="180" />
          <circle cx="850" cy="200" r="140" strokeDasharray="2 6" />
          <circle cx="850" cy="200" r="100" />
          <line x1="670" y1="200" x2="1030" y2="200" />
          <line x1="850" y1="20" x2="850" y2="380" />
        </g>

        {/* Subtle compass / triangle, bottom-left */}
        <g
          stroke="rgba(10, 37, 64, 0.08)"
          strokeWidth="1"
          fill="none"
          style={{
            transformOrigin: '180px 620px',
            animation: reduced ? undefined : 'spin 180s linear infinite reverse',
          }}
        >
          <polygon points="180,540 260,660 100,660" />
          <circle cx="180" cy="620" r="60" />
          <circle cx="180" cy="620" r="2" fill="rgba(10, 37, 64, 0.15)" />
        </g>

        {/* Dotted axes through the center */}
        <line
          x1="0"
          y1="400"
          x2="1000"
          y2="400"
          stroke="rgba(10, 37, 64, 0.06)"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
        <line
          x1="500"
          y1="0"
          x2="500"
          y2="800"
          stroke="rgba(10, 37, 64, 0.06)"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
      </svg>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

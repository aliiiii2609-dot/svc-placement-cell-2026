import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Cinematic Particles + Orb, 2D canvas edition.
 *
 * Previously this drew ~60 soft dots via a Three.js WebGL Points cloud with a
 * custom ShaderMaterial. That pulled the entire three.js runtime (~597 kB raw,
 * ~160 kB gzipped) into the bundle to render sixty fuzzy circles on one
 * section of one page. This version produces the same visual with the 2D
 * canvas API and no dependency at all.
 *
 * Visual parity with the WebGL version is deliberate:
 *   - Soft radial-gradient sprite, built once at 64px and blitted per particle
 *     (drawImage of a cached sprite is far cheaper than per-particle
 *     createRadialGradient, which was the naive-2D trap this avoids).
 *   - Per-particle opacity 0.04-0.10, size 8-22px, drift under 8 px/s.
 *   - Wrap-on-exit, DPR-aware up to 2x, pause on tab hide.
 *
 * Performance fallbacks (unchanged):
 *   - prefers-reduced-motion: static gradient wash, no canvas
 *   - viewport width below 768px: static wash
 *   - navigator.hardwareConcurrency below 4: static wash
 */

type OrbTint = 'cream' | 'warm-neutral';

const TINT_CSS: Record<OrbTint, string> = {
  cream:          'radial-gradient(circle, rgba(245, 232, 210, 0.45) 0%, rgba(245, 232, 210, 0.18) 35%, transparent 70%)',
  'warm-neutral': 'radial-gradient(circle, rgba(212, 220, 230, 0.40) 0%, rgba(212, 220, 230, 0.16) 35%, transparent 70%)',
};

/** RGB triplet per tint, used for the canvas sprite. Matches TINT_CSS. */
const TINT_RGB: Record<OrbTint, string> = {
  cream: '245, 232, 210',
  'warm-neutral': '212, 220, 230',
};

const ORB_ANCHOR_STYLES: Record<string, React.CSSProperties> = {
  'top-left':     { left: '-10%', top: '-10%' },
  'top-right':    { right: '-10%', top: '-10%' },
  'bottom-left':  { left: '-10%', bottom: '-10%' },
  'bottom-right': { right: '-10%', bottom: '-10%' },
  'center':       { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
};

export interface CinematicParticlesProps {
  tint?: OrbTint;
  orbAnchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  density?: number;
  intensity?: number;
}

function isLowCapacity(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < 768) return true;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores < 4) return true;
  return false;
}

/**
 * Build the soft circular sprite once per tint and cache it. Every particle is
 * a drawImage of this canvas, scaled and alpha-modulated. This is the whole
 * trick that makes the 2D path as cheap as the WebGL one at this particle count.
 */
const spriteCache = new Map<OrbTint, HTMLCanvasElement>();
function getParticleSprite(tint: OrbTint): HTMLCanvasElement {
  const cached = spriteCache.get(tint);
  if (cached) return cached;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rgb = TINT_RGB[tint];
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,    `rgba(${rgb}, 1)`);
  gradient.addColorStop(0.45, `rgba(${rgb}, 0.35)`);
  gradient.addColorStop(1,    `rgba(${rgb}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  spriteCache.set(tint, canvas);
  return canvas;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function CinematicParticles({
  tint = 'cream',
  orbAnchor = 'top-right',
  density = 80,
  intensity = 1,
}: CinematicParticlesProps) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lowCap, setLowCap] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLowCap(isLowCapacity());
    const onResize = () => setLowCap(isLowCapacity());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Only animate while the section is actually on screen. The WebGL version
  // rendered every frame regardless of scroll position, burning a rAF loop on
  // a section the visitor had long since scrolled past.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, lowCap]);

  useEffect(() => {
    if (reduced || lowCap || !inView) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const sprite = getParticleSprite(tint);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const seed = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width || window.innerWidth;
      h = rect.height || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      particles = Array.from({ length: density }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.03 + Math.random() * 0.1; // under 8 px/s at 60fps
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 8 + Math.random() * 14,
          opacity: 0.04 + Math.random() * 0.06,
        };
      });
    };

    seed();
    build();

    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) { p.x = w + 20; p.y = Math.random() * h; }
        else if (p.x > w + 20) { p.x = -20; p.y = Math.random() * h; }
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        else if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }

        ctx.globalAlpha = p.opacity * intensity;
        ctx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      seed();
      build();
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, lowCap, inView, density, intensity, tint]);

  if (reduced || lowCap) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: TINT_CSS[tint], opacity: 0.5 * intensity }}
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: TINT_CSS[tint],
          filter: 'blur(100px)',
          opacity: 0.85 * intensity,
          animation: 'cinematic-orb-drift 30s ease-in-out infinite',
          ...ORB_ANCHOR_STYLES[orbAnchor],
        }}
      />
      <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
      <style>{`
        @keyframes cinematic-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(40px, 30px) scale(1.05); }
        }
      `}</style>
    </>
  );
}

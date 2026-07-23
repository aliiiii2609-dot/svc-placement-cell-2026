import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Ambient floating particles, Stripe-style.
 *
 * Soft drifting dots in cream and accent colors, very low opacity, rendered
 * to a canvas behind hero content. Reference: stripe.com agentic-commerce
 * background and the financial-particle bursts. Not a hero feature — pure
 * atmosphere, easy to miss until you notice it's there.
 *
 * Density is intentionally low (60 particles) so it never competes with
 * text. Reduced-motion: skips entirely.
 */
type Props = {
  className?: string;
  count?: number;
  /** Particle base color, default near-accent. */
  color?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
};

export function ParticleField({ className, count = 60, color = '99, 91, 255' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.45 + 0.12,
      hue: Math.random(),
    }));

    const render = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap softly
        if (p.x < -10) p.x = w() + 10;
        if (p.x > w() + 10) p.x = -10;
        if (p.y < -10) p.y = h() + 10;
        if (p.y > h() + 10) p.y = -10;

        // Mix between accent (purple) and rose for variety
        const useRose = p.hue > 0.6;
        const c = useRose ? '255, 107, 157' : color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${p.alpha})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${p.alpha * 0.08})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count, color, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

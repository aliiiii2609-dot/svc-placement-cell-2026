import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Ambient floating particles, Stripe-style.
 *
 * Soft drifting dots in gold and cream, very low opacity, rendered to a canvas
 * behind hero content. Pure atmosphere — easy to miss until you notice it.
 *
 * Performance discipline (this is the important part):
 *   - Hard-disabled on mobile (< 768px) and prefers-reduced-motion.
 *   - The rAF loop only runs while the canvas is actually on screen
 *     (IntersectionObserver) AND the tab is visible. It used to run forever,
 *     burning a frame loop even after the hero scrolled away.
 *   - Low particle count and a single fill per particle (the old code drew a
 *     second 3x-radius "glow" circle per particle, doubling fill cost for a
 *     barely visible halo — removed).
 *   - Palette is navy/gold only, no purple.
 */
type Props = {
  className?: string;
  count?: number;
  /** Particle base color as an "r, g, b" triplet. Default gold. */
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

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function ParticleField({ className, count = 28, color = '212, 168, 87' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapReducedMotion = useReducedMotion();
  const [mobile, setMobile] = useState(isMobile);
  const [inView, setInView] = useState(false);

  const disabled = wrapReducedMotion || mobile;

  useEffect(() => {
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Track on-screen state so we never animate a canvas nobody can see.
  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '150px' },
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, [disabled]);

  useEffect(() => {
    if (disabled || !inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      if (!running) return;
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w() + 10;
        if (p.x > w() + 10) p.x = -10;
        if (p.y < -10) p.y = h() + 10;
        if (p.y > h() + 10) p.y = -10;

        // Mix gold with warm cream for variety — no purple.
        const c = p.hue > 0.6 ? '245, 232, 210' : color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${p.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, color, disabled, inView]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Custom cursor — professional core, playful details.
 *
 * Composition:
 *   - Inner dot: tracks the pointer exactly, snaps to the centre of
 *     interactive targets via magnetic pull (8px tolerance).
 *   - Outer ring: lerps to the pointer with easing (smooth trail), grows
 *     to wrap interactive targets and tints by category.
 *   - Soft aura: very slow lerp, near-transparent ambient glow.
 *   - Tag label: contextual text floats next to the cursor on hover of
 *     specific target types (View, Open, Drag, etc.).
 *
 * Idle wobble: if the pointer doesn't move for 1.5s, the ring softly
 * pulses to feel alive. Cancels on next move.
 *
 * Performance: rAF loop, transform-only animations, no layout thrash.
 * Skipped entirely on touch devices and reduced-motion.
 */

type CursorState = 'default' | 'text' | 'link' | 'button' | 'view' | 'drag' | 'plus' | 'hidden';

const STATE_TINTS: Record<CursorState, string> = {
  default: '#635bff',
  text:    '#635bff',
  link:    '#635bff',
  button:  '#a26bff',
  view:    '#6ba6ff',
  drag:    '#ff6b9d',
  plus:    '#7fd9c1',
  hidden:  '#635bff',
};

const STATE_LABELS: Record<CursorState, string> = {
  default: '',
  text:    '',
  link:    '',
  button:  '',
  view:    'View',
  drag:    'Drag',
  plus:    'Add',
  hidden:  '',
};

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      setState('hidden');
      return;
    }

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const aura = auraRef.current!;
    const label = labelRef.current!;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let magnetX: number | null = null;
    let magnetY: number | null = null;
    let lastMoveTs = Date.now();
    let idleScale = 1;
    let rafId = 0;
    let running = false;

    // Cache the magnetic target's rect and only recompute it when the pointer
    // moves onto a different element, rather than on every single mousemove.
    let lastMagnetEl: HTMLElement | null = null;
    let lastMagnetRect: DOMRect | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTs = Date.now();

      const target = e.target as HTMLElement | null;
      const magnetic = target?.closest('a, button, [role="button"]') as HTMLElement | null;
      if (magnetic) {
        if (magnetic !== lastMagnetEl) {
          lastMagnetEl = magnetic;
          lastMagnetRect = magnetic.getBoundingClientRect();
        }
        const r = lastMagnetRect!;
        magnetX = r.left + r.width / 2;
        magnetY = r.top + r.height / 2;
      } else {
        lastMagnetEl = null;
        lastMagnetRect = null;
        magnetX = null;
        magnetY = null;
      }
    };

    const tick = () => {
      let dotX = mouseX;
      let dotY = mouseY;
      if (magnetX !== null && magnetY !== null) {
        const dx = magnetX - mouseX;
        const dy = magnetY - mouseY;
        const dist = Math.hypot(dx, dy);
        const pull = Math.min(8, dist * 0.18);
        if (dist > 0) {
          dotX += (dx / dist) * pull;
          dotY += (dy / dist) * pull;
        }
      }

      ringX += (dotX - ringX) * 0.22;
      ringY += (dotY - ringY) * 0.22;
      auraX += (mouseX - auraX) * 0.06;
      auraY += (mouseY - auraY) * 0.06;

      const idleMs = Date.now() - lastMoveTs;
      if (idleMs > 1500) {
        const t = (idleMs - 1500) / 1200;
        idleScale = 1 + Math.sin(t * Math.PI) * 0.08;
      } else {
        idleScale += (1 - idleScale) * 0.25;
      }

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${idleScale.toFixed(3)})`;
      aura.style.transform = `translate3d(${auraX.toFixed(2)}px, ${auraY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${mouseX + 18}px, ${mouseY + 18}px, 0)`;
      if (running) rafId = requestAnimationFrame(tick);
    };

    // Pause the loop whenever nothing can change on screen: the window is
    // blurred/backgrounded, or the pointer has left the document entirely.
    // Resume on focus / re-entry. This keeps rAF from spinning forever.
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || !t.closest) return setState('default');
      if (t.closest('input, textarea, [contenteditable="true"]')) return setState('text');
      const button = t.closest('button, [role="button"], [data-cursor="button"]');
      const link   = t.closest('a, [data-cursor="link"]');
      if (button) return setState('button');
      if (link)   return setState('link');
      if (t.closest('img, [data-cursor="view"]')) return setState('view');
      if (t.closest('[data-cursor="drag"]')) return setState('drag');
      if (t.closest('[data-cursor="plus"]')) return setState('plus');
      return setState('default');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('blur', stop);
    window.addEventListener('focus', start);
    document.addEventListener('mouseleave', stop);
    document.addEventListener('mouseenter', start);
    start();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('blur', stop);
      window.removeEventListener('focus', start);
      document.removeEventListener('mouseleave', stop);
      document.removeEventListener('mouseenter', start);
      stop();
    };
  }, [reduced]);

  if (state === 'hidden' || reduced) return null;

  const tint = STATE_TINTS[state];
  const labelText = STATE_LABELS[state];

  const ringSize =
    state === 'view'   ? 64 :
    state === 'button' ? 52 :
    state === 'link'   ? 48 :
    state === 'drag'   ? 44 :
    state === 'plus'   ? 40 :
    state === 'text'   ? 0  :
    28;
  const dotSize = state === 'text' ? 2 : 6;
  const dotHeight = state === 'text' ? 18 : 6;

  return (
    <>
      <div
        ref={auraRef}
        className="fixed left-0 top-0 pointer-events-none rounded-full transition-colors duration-500"
        style={{
          zIndex: 9996,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${tint}28, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 pointer-events-none rounded-full transition-[width,height,border-color] duration-300"
        style={{
          zIndex: 9998,
          width: ringSize,
          height: ringSize,
          border: `1.5px solid ${tint}`,
          opacity: state === 'text' ? 0 : 0.65,
        }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 pointer-events-none rounded-full transition-[width,height,background-color] duration-200"
        style={{
          zIndex: 9999,
          width: dotSize,
          height: dotHeight,
          background: tint,
        }}
        aria-hidden="true"
      />
      <div
        ref={labelRef}
        className="fixed left-0 top-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] font-semibold pointer-events-none transition-opacity duration-200"
        style={{
          zIndex: 9997,
          color: tint,
          opacity: labelText ? 1 : 0,
        }}
        aria-hidden="true"
      >
        {labelText}
      </div>
    </>
  );
}

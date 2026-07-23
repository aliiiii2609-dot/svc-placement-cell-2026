import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 4500;

/**
 * GallerySlideshow — an editorial, LAG-FREE photo slideshow of the cell's
 * real event photography.
 *
 * Performance notes (the owner explicitly wants this smooth):
 *   - Every slide is a stacked <img>; only OPACITY (and a hair of scale)
 *     transitions, both GPU-composited. No layout property is ever animated.
 *   - Auto-advance is a single window.setInterval, cleared on unmount and
 *     whenever the deck is paused (hover / focus) or reduced-motion is on.
 *     There is no requestAnimationFrame loop anywhere.
 *   - The first photo loads eagerly; the rest are loading="lazy" +
 *     decoding="async", so the browser only fetches them as needed.
 *   - prefers-reduced-motion: auto-advance is disabled and crossfades become
 *     instant (0ms). Manual controls remain fully usable.
 */

interface Slide {
  src: string;
  caption: string;
}

const slides: Slide[] = [
  { src: '/gallery/internship-fair.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-1.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-2.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-3.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-4.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-5.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/ifair-6.jpg', caption: 'Internship Fair 2026' },
  { src: '/gallery/career-1.png', caption: 'Career Guidance Session' },
  { src: '/gallery/career-2.png', caption: 'Career Guidance Session' },
  { src: '/gallery/team.jpg', caption: 'The Placement Cell Team' },
];

export function GallerySlideshow() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = slides.length;

  const goTo = useCallback((index: number) => {
    setActive(((index % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Single interval. Re-armed after every slide change so each photo gets a
  // full dwell; torn down on pause, reduced-motion, or unmount.
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, count, active]);

  // Lightweight swipe (touch only, no listeners while dragging).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const fade = reduced ? 'none' : `opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)`;

  const rise = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
        };

  return (
    <section className="section-spacing border-t border-line" id="gallery">
      <div className="container-svc">
        {/* Header */}
        <div className="mb-10 md:mb-14 max-w-2xl">
          <motion.div {...rise(0)} className="eyebrow mb-4">
            In frame
          </motion.div>
          <motion.h2
            {...rise(1)}
            className="font-display font-bold text-ink leading-[1.05] tracking-tight display-italic"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            The cell, <em>in action.</em>
          </motion.h2>
          <motion.p {...rise(2)} className="mt-4 text-[15px] md:text-base text-ink-2 leading-relaxed">
            Photographs from our fairs, guidance sessions, and the team that runs them.
          </motion.p>
        </div>

        {/* Stage */}
        <motion.div {...rise(0)}>
          <div
            className="glass relative overflow-hidden rounded-2xl"
            role="group"
            aria-roledescription="carousel"
            aria-label="Placement cell photo gallery"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Aspect box — object-cover guarantees no stretch, no layout shift */}
            <div className="relative aspect-[3/2] w-full bg-bg-2">
              {slides.map((slide, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={slide.src}
                    className="absolute inset-0"
                    aria-hidden={!isActive}
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1)' : 'scale(1.03)',
                      transition: fade,
                      willChange: 'opacity, transform',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.caption}
                      className="h-full w-full object-cover"
                      draggable={false}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding={i === 0 ? 'auto' : 'async'}
                    />
                    {/* Caption plate */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-4 sm:p-6">
                      <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white">
                        {slide.caption}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Prev / Next — 44px tap targets, always reachable */}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-surface/80 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-surface/80 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Thumbnail strip — click to jump; scrolls, never overflows the page */}
          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Choose a photo"
          >
            {slides.map((slide, i) => {
              const isActive = i === active;
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show photo ${i + 1}: ${slide.caption}`}
                  onClick={() => goTo(i)}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isActive
                      ? 'border-gold opacity-100'
                      : 'border-line opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

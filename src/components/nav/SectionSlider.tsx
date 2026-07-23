import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * SectionSlider — sticky horizontal chapter nav.
 *
 * The home page's problem was never only that it was long. It was that it was
 * long AND opaque: a visitor had no idea what was below, how much of it there
 * was, or how to get to the one thing they came for. The only control on offer
 * was the scroll wheel.
 *
 * This pins a horizontal strip of chapter pills under the header once the hero
 * has passed. It does three jobs at once:
 *   - a table of contents, so the page's shape is legible at a glance
 *   - a jump control, so nobody has to scroll through four sections to reach
 *     the fifth
 *   - a progress indicator, via scroll-spy, so position is always obvious
 *
 * It is a slider in the horizontal-scroll sense: on a phone the pills overflow
 * and scroll sideways, and the active pill keeps itself in view.
 *
 * Implementation notes:
 *   - Scroll-spy is IntersectionObserver, not a scroll handler. A scroll
 *     handler firing getBoundingClientRect() per section per frame is exactly
 *     the sort of thing that makes a page feel heavy, which is what we are
 *     here to fix.
 *   - `scrollIntoView({ behavior: 'smooth' })` is not used, because Lenis owns
 *     scrolling and the two fight. Lenis's own scrollTo is used where present,
 *     with a native fallback.
 *   - Height is fixed and reserved so pinning does not shift layout.
 */

export interface SliderSection {
  /** DOM id of the section this pill jumps to. */
  id: string;
  /** Short label. Two words maximum; these are pills, not headlines. */
  label: string;
}

type LenisLike = { scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number }) => void };

const HEADER_OFFSET = 72; // matches the header's h-[72px] and main's pt-[72px]
const SLIDER_HEIGHT = 52;

export function SectionSlider({ sections }: { sections: SliderSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [pinned, setPinned] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Pin the strip once its natural position scrolls under the header.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll-spy.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // Track ratios rather than taking the first intersecting entry: with tall
    // sections several are on screen at once, and "first" would flicker.
    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best = '';
        let bestRatio = 0;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      {
        rootMargin: `-${HEADER_OFFSET + SLIDER_HEIGHT}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active pill visible in the horizontal strip on narrow screens.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const pill = strip.querySelector<HTMLElement>(`[data-pill="${activeId}"]`);
    if (!pill) return;
    const sLeft = strip.scrollLeft;
    const sRight = sLeft + strip.clientWidth;
    const pLeft = pill.offsetLeft;
    const pRight = pLeft + pill.offsetWidth;
    if (pLeft < sLeft + 16) strip.scrollTo({ left: pLeft - 16, behavior: 'smooth' });
    else if (pRight > sRight - 16) strip.scrollTo({ left: pRight - strip.clientWidth + 16, behavior: 'smooth' });
  }, [activeId]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = -(HEADER_OFFSET + SLIDER_HEIGHT);

    // Lenis owns the scroll position when it is mounted. Calling native
    // scrollTo underneath it produces a visible fight between the two.
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'auto' });
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        style={{ height: SLIDER_HEIGHT }}
        className={cn('relative z-40', pinned && 'sticky')}
      >
        <div
          className={cn(
            'transition-all duration-300',
            pinned
              ? 'fixed left-0 right-0 bg-bg/90 backdrop-blur-xl border-b border-line shadow-[0_1px_20px_-12px_rgba(10,37,64,0.25)]'
              : 'absolute left-0 right-0 border-y border-line bg-bg-2/40',
          )}
          style={pinned ? { top: HEADER_OFFSET } : undefined}
        >
          <nav
            ref={stripRef}
            aria-label="Page sections"
            className="container-svc flex items-center gap-1.5 overflow-x-auto scrollbar-none"
            style={{ height: SLIDER_HEIGHT, scrollbarWidth: 'none' }}
          >
            {sections.map((s) => {
              const active = s.id === activeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  data-pill={s.id}
                  onClick={() => jump(s.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.13em] transition-colors duration-300 whitespace-nowrap',
                    active
                      ? 'bg-accent text-white'
                      : 'text-ink-3 hover:text-accent hover:bg-accent-soft',
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

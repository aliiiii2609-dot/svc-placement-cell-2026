import { Suspense, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

/**
 * Defer
 * -----
 * Renders `children` only once the placeholder is within `rootMargin` of the
 * viewport, then keeps them mounted forever after.
 *
 * Why the home page needs this: it composes many sections, several of which are
 * 400-800 line components that build SVG charts, seed particle systems, start
 * rAF loops and register scroll listeners on mount. Deferring keeps a visitor
 * who never scrolls past the hero from paying for all of them up front.
 *
 * Reserved height: the placeholder reserves scroll space so resolving sections
 * do not shift layout. It used to reserve the caller's full estimate (up to
 * 900px), which meant large BLANK bands sat below the fold and read as "empty
 * screens" before content streamed in. We now (a) cap the reserved height to a
 * modest maximum so the gap is never huge, and (b) fill it with a faint
 * pulsing skeleton instead of nothing, so an approaching section reads as
 * "loading" rather than "broken". The IntersectionObserver defer behavior is
 * unchanged.
 */

/** Largest space we will reserve for a not-yet-mounted section. */
const MAX_RESERVED_PX = 420;

function reservedHeight(minHeight: number | string): string {
  if (typeof minHeight === 'number') {
    return `${Math.min(minHeight, MAX_RESERVED_PX)}px`;
  }
  return minHeight;
}

/** Faint, low-cost skeleton so deferred space never reads as a dead blank gap. */
function Skeleton({ minHeight }: { minHeight: number | string }) {
  const style: CSSProperties = {
    minHeight: reservedHeight(minHeight),
    background:
      'linear-gradient(180deg, rgba(11,31,68,0.03) 0%, rgba(11,31,68,0.015) 100%)',
    borderRadius: 16,
  };
  return (
    <div
      style={style}
      className="animate-pulse mx-auto w-[92%] max-w-6xl my-6"
      aria-hidden="true"
    />
  );
}

export function Defer({
  children,
  minHeight = 320,
  rootMargin = '400px',
}: {
  children: ReactNode;
  /** Approximate rendered height, used to reserve scroll space (capped). */
  minHeight?: number | string;
  /** How far ahead of the viewport to start mounting. */
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    // No IntersectionObserver (very old browser, or a crawler that executes JS
    // but stubs the API): render immediately rather than hiding content.
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  if (show) return <>{children}</>;

  return (
    <div ref={ref} aria-hidden="true">
      <Skeleton minHeight={minHeight} />
    </div>
  );
}

/**
 * Convenience wrapper for sections that are also code-split via lazyWithRetry.
 * Suspense only ever resolves once the section is near the viewport, so the
 * chunk request happens on approach rather than at page load.
 */
export function DeferLazy({
  children,
  minHeight = 320,
  rootMargin = '400px',
}: {
  children: ReactNode;
  minHeight?: number | string;
  rootMargin?: string;
}) {
  return (
    <Defer minHeight={minHeight} rootMargin={rootMargin}>
      <Suspense fallback={<Skeleton minHeight={minHeight} />}>{children}</Suspense>
    </Defer>
  );
}

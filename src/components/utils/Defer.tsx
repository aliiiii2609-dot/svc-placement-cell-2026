import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Defer
 * -----
 * Renders `children` only once the placeholder is within `rootMargin` of the
 * viewport, then keeps them mounted forever after.
 *
 * Why the home page needs this: it composes 28 sections, several of which are
 * 400-800 line components that build SVG charts, seed particle systems, start
 * rAF loops and register Framer Motion scroll listeners on mount. React mounts
 * all of them during the first commit, so a visitor who never scrolls past the
 * hero still pays for the council orbit, the recruiter galaxy, the cycle
 * dashboard and everything else. That first commit is the long task that makes
 * the page feel stuck for the first second on a mid-range phone.
 *
 * Deferring is preferred over CSS `content-visibility: auto` here. The CSS
 * approach skips *painting* off-screen content but still mounts the component,
 * runs its effects, and starts its timers, so the rAF loops would all still be
 * live. It also interacts badly with the sticky and scroll-linked elements
 * already on this page.
 *
 * `minHeight` reserves space so deferred content does not cause layout shift
 * or let the scrollbar jump as sections resolve. Pass a rough height for the
 * section; it only has to be close.
 */
export function Defer({
  children,
  minHeight = 480,
  rootMargin = '400px',
}: {
  children: ReactNode;
  /** Approximate rendered height, used to reserve scroll space. */
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
    <div
      ref={ref}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
      aria-hidden="true"
    />
  );
}

/**
 * Convenience wrapper for sections that are also code-split via lazyWithRetry.
 * Suspense only ever resolves once the section is near the viewport, so the
 * chunk request happens on approach rather than at page load.
 */
export function DeferLazy({
  children,
  minHeight = 480,
  rootMargin = '400px',
}: {
  children: ReactNode;
  minHeight?: number | string;
  rootMargin?: string;
}) {
  return (
    <Defer minHeight={minHeight} rootMargin={rootMargin}>
      <Suspense
        fallback={
          <div
            style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
            aria-hidden="true"
          />
        }
      >
        {children}
      </Suspense>
    </Defer>
  );
}

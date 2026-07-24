import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top when the route changes.
 *
 * Without this, react-router-dom preserves scroll position across route
 * changes. On a long homepage, clicking a nav link can appear to do
 * nothing because the user lands deep in the next route and the new
 * page's hero is offscreen above. This component mounts at the App
 * root and scrolls to top on every pathname change.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If the route carries a hash (e.g. /recruiters#interest), scroll to that
    // section instead of the top. scroll-mt-* on the target keeps it clear of
    // the sticky header. The target sits below sections whose images and logos
    // (recruiter constellation, the by-cycle grid) load after mount and push it
    // down, so a single scroll lands too high. We re-scroll a few times as the
    // layout settles, and stop as soon as it stabilises or the user scrolls.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let cancelled = false;
      const onUserScroll = () => { cancelled = true; };
      window.addEventListener('wheel', onUserScroll, { passive: true, once: true });
      window.addEventListener('touchmove', onUserScroll, { passive: true, once: true });

      let lastTop = NaN;
      const attempts = [0, 60, 160, 320, 550, 850];
      const timers: number[] = [];
      attempts.forEach((delay) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            const el = document.getElementById(id);
            if (!el) return;
            const top = el.getBoundingClientRect().top;
            // Already parked at the target — nothing more to do.
            if (Math.abs(top) < 4 && Math.abs(top - lastTop) < 4) return;
            lastTop = top;
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
          }, delay),
        );
      });
      return () => {
        cancelled = true;
        timers.forEach((t) => window.clearTimeout(t));
        window.removeEventListener('wheel', onUserScroll);
        window.removeEventListener('touchmove', onUserScroll);
      };
    }
    // Use auto behavior, not smooth, so the new page is instantly at the top
    // before the user perceives any "stickiness".
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

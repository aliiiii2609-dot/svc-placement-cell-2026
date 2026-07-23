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
    // If the route carries a hash (e.g. /alumni#register), scroll to that
    // section instead of the top. scroll-mt-* on the target keeps it clear of
    // the sticky header. Deferred a frame so the lazy route has mounted.
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      return;
    }
    // Use auto behavior, not smooth, so the new page is instantly at the top
    // before the user perceives any "stickiness".
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

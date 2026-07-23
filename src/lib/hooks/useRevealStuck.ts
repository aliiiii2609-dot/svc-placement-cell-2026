import { useEffect } from 'react';

/**
 * Safety net for scroll-reveal animations.
 *
 * Sections on this site animate in with framer-motion's `whileInView`. Most of
 * them are also mounted lazily (code-split + IntersectionObserver-deferred), and
 * that async mount can occasionally race the reveal observer so an element is
 * left at its initial `opacity: 0` even though it is sitting in the viewport.
 * The result reads as a blank/empty screen.
 *
 * This hook guarantees that never persists: on load, on route change, and while
 * scrolling (throttled), it finds any element inside <main> that is currently in
 * the viewport but still pinned at inline `opacity: 0`, and gently reveals it.
 * Elements that are below the fold are left alone so their normal reveal still
 * plays; elements that already animated in sit at opacity 1 and are never
 * matched. It only ever moves content from hidden to visible.
 */
export function useRevealStuck(routeKey: string) {
  useEffect(() => {
    let last = 0;
    let raf = 0;

    const reveal = () => {
      const main = document.getElementById('main');
      if (!main) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // framer writes the initial hidden state as an inline `opacity: 0`.
      const nodes = main.querySelectorAll<HTMLElement>(
        '[style*="opacity: 0"], [style*="opacity:0"]',
      );
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.top < vh * 0.96 && r.bottom > vh * 0.04 && r.height > 4;
        if (!inView) return;
        el.style.transition = 'opacity .45s ease, transform .45s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };

    const onScroll = () => {
      const now = Date.now();
      if (now - last < 140) return; // throttle: cheap during fast scroll
      last = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(reveal);
    };

    // A few passes after mount to catch sections that stream in just after load.
    const timers = [250, 800, 1600].map((t) => window.setTimeout(reveal, t));
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [routeKey]);
}

import { useEffect, useState } from 'react';

/**
 * Returns true if the user has prefers-reduced-motion enabled
 * OR the document body carries a "reduced-motion" class
 * (set by the in-app sound/motion toggle).
 *
 * Use this everywhere a heavy animation is about to fire so the
 * reduced-motion variant of the experience plays instead.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const classed = document.body.classList.contains('reduced-motion');
    return mq.matches || classed;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const classed = document.body.classList.contains('reduced-motion');
      setReduced(mq.matches || classed);
    };

    mq.addEventListener('change', update);

    // Watch for the body class toggle (footer toggle, settings menu).
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mq.removeEventListener('change', update);
      observer.disconnect();
    };
  }, []);

  return reduced;
}

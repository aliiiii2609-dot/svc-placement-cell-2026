import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [showCurtain, setShowCurtain] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    setShowCurtain(true);
    const t = window.setTimeout(() => setShowCurtain(false), 700);
    return () => window.clearTimeout(t);
  }, [location.pathname, reduced]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -10 }}
          transition={{ duration: reduced ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showCurtain && !reduced && (
          <motion.div
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1, transformOrigin: 'top' }}
            exit={{ scaleY: 0, transformOrigin: 'bottom' }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[8000] bg-bg pointer-events-none flex items-center justify-center"
          >
            <motion.img
              src="/logos/svc-crest.png"
              alt=""
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 0.8, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-24 h-24"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

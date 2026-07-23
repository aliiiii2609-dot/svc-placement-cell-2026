import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type ToastItem = { id: string; message: string; tone: 'info' | 'success' | 'error' };
type ToastFn = (message: string, tone?: ToastItem['tone']) => void;

const ToastCtx = createContext<ToastFn>(() => undefined);

export function useToast(): ToastFn {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback<ToastFn>((message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((cur) => [...cur, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((cur) => cur.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    (window as unknown as { svcToast: ToastFn }).svcToast = push;
  }, [push]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto min-w-[260px] max-w-[420px] px-4 py-3 rounded-lg border bg-surface text-ink text-sm shadow-2xl backdrop-blur',
                t.tone === 'success' && 'border-teal',
                t.tone === 'error' && 'border-red',
                t.tone === 'info' && 'border-accent',
              )}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

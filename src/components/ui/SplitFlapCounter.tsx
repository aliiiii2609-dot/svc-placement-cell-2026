import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { sound } from '@/lib/audio/sound-controller';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/utils/cn';

type Props = {
  /** Final numeric value to count to. */
  value: number;
  /** Decimal places to preserve, default 0. */
  decimals?: number;
  /** Optional suffix like "+", "LPA", "Cr". */
  suffix?: string;
  /** Optional className for the outer wrapper. */
  className?: string;
  /** Duration of the count animation in ms. */
  durationMs?: number;
};

/**
 * SplitFlapCounter: counts from 0 up to `value` when scrolled into view.
 * Each digit slot "flips" through values like a Solari board.
 * Plays the sound.counter-tick cue on each digit change (rate-gated).
 */
export function SplitFlapCounter({
  value,
  decimals = 0,
  suffix,
  className,
  durationMs = 1500,
}: Props) {
  const [display, setDisplay] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const startedRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let lastSoundAt = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = eased * value;
      setDisplay(v);
      if (now - lastSoundAt > 110) {
        sound.play('counter-tick');
        lastSoundAt = now;
      }
      if (t < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value, durationMs, reduced]);

  const formatted = display.toFixed(decimals);

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-baseline gap-0.5 font-display font-medium tabular-nums',
        className,
      )}
      aria-label={`${formatted}${suffix ?? ''}`}
    >
      {formatted.split('').map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          className={ch.match(/\d/) ? 'inline-block' : 'opacity-80'}
        >
          {ch}
        </span>
      ))}
      {suffix && <span className="ml-1 text-[0.7em] text-ink-2">{suffix}</span>}
    </span>
  );
}

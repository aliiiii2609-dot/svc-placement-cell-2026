import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

/**
 * Stripe-style radial sunburst.
 *
 * A half-dome of dotted lines radiating from a center point at the bottom.
 * Used as a signature animation behind stat sections. Pure SVG.
 *
 * Reference: stripe.com/in homepage scroll, the "transactions per minute"
 * section. Their version uses ~200 lines; we use 80 for performance.
 */
type Props = {
  /** Number of radiating lines. Default 80. */
  count?: number;
  /** Hex color of the line/dot. Default cream gold. */
  color?: string;
  /** Width container. Default 100%. */
  className?: string;
};

export function Sunburst({ count = 80, color = '#9c7a3a', className }: Props) {
  const lines = useMemo(() => {
    // Half-dome: angles from 180° to 360° (top half of unit circle, since SVG y-axis flips)
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // Angle from 180° (left) to 360° (right) sweeping through 270° (top)
      const angle = Math.PI + t * Math.PI;
      // Slight randomness for organic feel
      const lengthBase = 0.85 + Math.sin(t * Math.PI) * 0.15; // longest at top, shorter at sides
      const length = lengthBase * (0.95 + Math.random() * 0.1);
      const x1 = 50;
      const y1 = 100;
      const x2 = 50 + Math.cos(angle) * 50 * length;
      const y2 = 100 + Math.sin(angle) * 100 * length;
      arr.push({ x1, y1, x2, y2, delay: i * 0.005 });
    }
    return arr;
  }, [count]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax meet"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      {lines.map((l, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: l.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <line
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={color}
            strokeWidth={0.15}
            strokeOpacity={0.4}
          />
          <circle cx={l.x2} cy={l.y2} r={0.35} fill={color} fillOpacity={0.8} />
        </motion.g>
      ))}
    </svg>
  );
}

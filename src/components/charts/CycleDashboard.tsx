import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { currentCycleStats, previousCycleStats, trendCycles } from '@/lib/data/stats';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cycle dashboard — the SUPPORTING DETAIL that flows beneath StatsBar.
 *
 * StatsBar owns the single titled "The numbers, plainly." headline plus the
 * KPI grid (offers, CTC, gross value, recruiters). This section deliberately
 * carries NO section header, NO cycle eyebrow, NO hero total and NO repeated
 * KPI tiles. It reads as a continuation and leads straight into the charts:
 *
 *   1. Stream split — where the offers landed (segmented arc + callouts).
 *   2. Eight-cycle trajectory — peak CTC step-line + offer-volume bars.
 *   3. This cycle vs last — twin bars per compensation metric.
 *
 * No chart-junk. Every number carries a unit (LPA / Cr / offers) and a
 * one-line caption. Navy + gold only.
 */

const cur = currentCycleStats;
const prev = previousCycleStats;

// ---------------------------------------------------------------------------
// Editorial step-line chart for the eight-cycle trend.
// SVG-based, no chart library. Peak CTC as step-line + dots; offer volume as
// bars beneath. Navy-to-gold gradient under the line.
// ---------------------------------------------------------------------------
function TrendChart({ inView }: { inView: boolean }) {
  const W = 880;
  const H = 340;
  const PAD = { top: 30, right: 30, bottom: 110, left: 30 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const n = trendCycles.length;
  const stepX = innerW / (n - 1);
  const maxPeak = Math.max(...trendCycles.map((c) => c.peak));
  const maxOffers = Math.max(...trendCycles.map((c) => c.offers));

  // Step-line points for peak CTC
  const points = trendCycles.map((c, i) => ({
    x: PAD.left + i * stepX,
    y: PAD.top + innerH - (c.peak / maxPeak) * innerH,
    cycle: c.cycle,
    peak: c.peak,
    offers: c.offers,
  }));

  // Line path
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  // Area path (line + bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`;

  // Bar geometry
  const barWidth = stepX * 0.32;
  const barAreaY = H - 56;
  const barMaxH = 36;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Peak CTC trend across eight cycles">
      <defs>
        <linearGradient id="trend-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1e4e8c" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#1e4e8c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trend-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1e4e8c" />
          <stop offset="50%"  stopColor="#b8893b" />
          <stop offset="100%" stopColor="#b8893b" />
        </linearGradient>
        <linearGradient id="trend-bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1e4e8c" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#b8893b" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + innerH * t}
          y2={PAD.top + innerH * t}
          stroke="rgba(10, 37, 64, 0.06)"
          strokeDasharray="2 4"
        />
      ))}

      {/* Area under line */}
      <motion.path
        d={areaPath}
        fill="url(#trend-area)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      />

      {/* Step-line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="url(#trend-line)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <motion.g
          key={p.cycle}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.08, ease: EASE }}
        >
          <circle cx={p.x} cy={p.y} r={6} fill="#fff" stroke="#1e4e8c" strokeWidth={2.5} />
          {/* Value label above the point */}
          <text
            x={p.x}
            y={p.y - 14}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
            fontSize="14"
            fill="#0a2540"
          >
            {p.peak.toFixed(p.peak >= 100 ? 0 : 2).replace(/\.00$/, '')}
          </text>
        </motion.g>
      ))}

      {/* Bottom bars for offer volume — gradient + soft glow */}
      {points.map((p, i) => {
        const c = trendCycles[i];
        const barH = (c.offers / maxOffers) * barMaxH;
        return (
          <motion.g
            key={`bar-${c.cycle}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease: EASE }}
          >
            <motion.rect
              x={p.x - barWidth / 2}
              y={barAreaY - barH}
              width={barWidth}
              height={barH}
              fill="url(#trend-bar-gradient)"
              rx={3}
              initial={{ scaleY: 0, transformOrigin: `${p.x}px ${barAreaY}px` }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.07, ease: EASE }}
            />
            <text
              x={p.x}
              y={barAreaY + 16}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              fontSize="10.5"
              fill="rgba(10, 37, 64, 0.6)"
              letterSpacing="0.4"
            >
              {c.offers}
            </text>
            <text
              x={p.x}
              y={barAreaY + 28}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="8.5"
              fill="rgba(10, 37, 64, 0.4)"
              letterSpacing="0.8"
            >
              OFFERS
            </text>
            {/* Cycle label */}
            <text
              x={p.x}
              y={barAreaY + 44}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="700"
              fontSize="11"
              fill="rgba(10, 37, 64, 0.85)"
              letterSpacing="0.6"
            >
              {c.cycle}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Segmented arc — half-circle stacked-segment chart for stream split.
// Three brand-colored arcs draw in proportionally to each stream's share.
// ---------------------------------------------------------------------------
function SegmentedArc({
  streams,
  inView,
}: {
  streams: { label: string; pct: number; color: string }[];
  inView: boolean;
}) {
  const W = 520;
  const H = 240;
  const cx = W / 2;
  const cy = H - 20;
  const r = 180;
  const stroke = 36;

  // Half-circle arc length = π * r
  const fullArcLen = Math.PI * r;

  // Build segments
  let cumulative = 0;
  const segments = streams.map((s) => {
    const fraction = s.pct / 100;
    const arcLen = fraction * fullArcLen;
    const startOffset = cumulative * fullArcLen;
    cumulative += fraction;
    return { ...s, arcLen, startOffset };
  });

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Stream split radial chart">
        {/* Background track (full half-circle) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(10, 37, 64, 0.06)"
          strokeWidth={stroke}
          strokeLinecap="butt"
        />

        {/* Three colored segments, draw in via stroke-dasharray */}
        {segments.map((seg, i) => (
          <motion.path
            key={seg.label}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${seg.arcLen} ${fullArcLen}`}
            strokeDashoffset={-seg.startOffset}
            initial={{ strokeDasharray: `0 ${fullArcLen}` }}
            animate={inView ? { strokeDasharray: `${seg.arcLen} ${fullArcLen}` } : { strokeDasharray: `0 ${fullArcLen}` }}
            transition={{ duration: 1.1, delay: 0.4 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Center summary text */}
        <text x={cx} y={cy - 64} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2" fill="rgba(10, 37, 64, 0.5)">
          STREAM SHARE
        </text>
        <text x={cx} y={cy - 24} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="44" letterSpacing="-1.5" fill="#0a2540">
          100<tspan fontSize="20" fontFamily="JetBrains Mono, monospace" dx="2" dy="-12">%</tspan>
        </text>
      </svg>
    </div>
  );
}

export function CycleDashboard() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  // Stream split — navy + two golds so each arc segment stays distinct
  const streams = [
    { label: 'Commerce', pct: cur.streamSplit.commerce, color: '#1e4e8c' },
    { label: 'Arts', pct: cur.streamSplit.arts, color: '#b8893b' },
    { label: 'Science', pct: cur.streamSplit.science, color: '#d4a857' },
  ];

  // Cycle vs previous comparison rows
  const compareRows = [
    {
      label: 'Peak CTC (LPA)',
      cur: cur.peakCtcLPA,
      prev: prev.peakCtcLPA,
      max: Math.max(cur.peakCtcLPA, prev.peakCtcLPA),
    },
    {
      label: 'Top decile avg (LPA)',
      cur: cur.topDecileAverageLPA ?? 0,
      prev: prev.topDecileAverageLPA ?? 0,
      max: Math.max(cur.topDecileAverageLPA ?? 0, prev.topDecileAverageLPA ?? 0),
    },
    {
      label: 'Median (LPA)',
      cur: cur.medianCtcLPA ?? 0,
      prev: prev.medianCtcLPA ?? 0,
      max: Math.max(cur.medianCtcLPA ?? 0, prev.medianCtcLPA ?? 0),
    },
    {
      label: 'Average (LPA)',
      cur: cur.averageCtcLPA,
      prev: prev.averageCtcLPA,
      max: Math.max(cur.averageCtcLPA, prev.averageCtcLPA),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative pb-16 md:pb-24 lg:pb-32 bg-bg"
      id="numbers"
    >
      <div className="container-svc space-y-6 md:space-y-8">
        {/* Stream split — segmented arc + callouts. First sub-heading, no full section header. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="glass rounded-2xl p-6 md:p-10"
        >
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                Stream split
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
                Where the offers landed.
              </h3>
              <p className="text-sm text-ink-3 leading-relaxed max-w-[36ch]">
                Share of {cur.totalPlacementOffers} placement offers by faculty
                stream, cycle {cur.cycle}.
              </p>
            </div>

            {/* Segmented arc — half-circle, three colored arcs proportional to share */}
            <div>
              <SegmentedArc streams={streams} inView={inView} />

              {/* Stream callouts beneath the arc */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {streams.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: EASE }}
                    className="relative pl-3"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                      style={{ background: s.color }}
                    />
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1">
                      {s.label}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-bold text-2xl md:text-3xl text-ink tabular-nums tracking-[-0.025em]">
                        {s.pct}
                      </span>
                      <span className="font-mono text-xs text-ink-3">%</span>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 mt-0.5 tabular-nums">
                      ~{Math.round((s.pct / 100) * cur.totalPlacementOffers)} offers
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Eight-cycle trajectory — editorial step-line chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="glass rounded-2xl p-6 md:p-10"
        >
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              Eight-cycle trajectory
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
              Peak compensation and offer volume, by cycle.
            </h3>
            <p className="text-sm text-ink-3 leading-relaxed max-w-2xl text-pretty">
              The step-line tracks peak CTC. Bars below show offer volume. Every
              point is hand-computed from the cell&apos;s annual reports.
            </p>
          </div>

          {/* The chart */}
          <div className="relative">
            <TrendChart inView={inView} />
          </div>
        </motion.div>

        {/* This cycle vs last */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="glass rounded-2xl p-6 md:p-10"
        >
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              Year on year
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
              Cycle {cur.cycle} compared to cycle {prev.cycle}.
            </h3>
            <p className="text-sm text-ink-3 leading-relaxed max-w-2xl text-pretty">
              Per-cycle compensation rows. Top decile is the average of the top 10%
              of accepted offers. Median is the middle offer. Average is the mean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {compareRows.map((row, i) => {
              const delta = row.prev > 0 ? ((row.cur - row.prev) / row.prev) * 100 : 0;
              const isPositive = delta >= 0;
              const accents = ['#1e4e8c', '#b8893b', '#d4a857', '#123460'];
              const accent = accents[i % accents.length];
              return (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.1, ease: EASE }}
                  className="relative pl-5"
                >
                  {/* Brand-color left rail */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                    style={{ background: accent }}
                  />

                  {/* Metric label */}
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-3 max-w-[18ch]">
                    {row.label}
                  </div>

                  {/* Big current value + delta */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="font-display font-bold text-ink tabular-nums leading-none tracking-[-0.035em]"
                      style={{ fontSize: 'clamp(2rem, 3.4vw, 2.6rem)' }}
                    >
                      {row.cur.toFixed(2)}
                    </span>
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold tabular-nums"
                      style={{ color: isPositive ? '#16a34a' : '#dc2626' }}
                    >
                      {isPositive ? '+' : ''}{delta.toFixed(1)}%
                    </span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent mb-4">
                    Cycle {cur.cycle}
                  </div>

                  {/* Paired vertical bars */}
                  <div className="flex items-end gap-1.5 h-20 mb-2">
                    {/* Current bar */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <motion.div
                        className="w-full rounded-t"
                        style={{ background: accent, transformOrigin: 'bottom' }}
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: EASE }}
                      >
                        <div style={{ height: `${row.max > 0 ? (row.cur / row.max) * 76 : 0}px` }} />
                      </motion.div>
                      <span className="font-mono text-[9px] tabular-nums text-ink-3">
                        {cur.cycle}
                      </span>
                    </div>
                    {/* Previous bar */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <motion.div
                        className="w-full rounded-t"
                        style={{ background: 'rgba(10, 37, 64, 0.18)', transformOrigin: 'bottom' }}
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: EASE }}
                      >
                        <div style={{ height: `${row.max > 0 ? (row.prev / row.max) * 76 : 0}px` }} />
                      </motion.div>
                      <span className="font-mono text-[9px] tabular-nums text-ink-3">
                        {prev.cycle}
                      </span>
                    </div>
                  </div>

                  {/* Previous value row */}
                  <div className="flex items-baseline justify-between pt-2 border-t border-line">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                      Prev
                    </span>
                    <span className="font-display font-semibold text-sm text-ink-2 tabular-nums">
                      {row.prev.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-7 pt-5 border-t border-line flex flex-wrap items-center gap-6 text-xs text-ink-3">
            <span>All values in Lakhs Per Annum (LPA). Positive delta = improvement.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

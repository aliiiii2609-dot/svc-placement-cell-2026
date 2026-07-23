import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { currentCycleStats, previousCycleStats, trendCycles } from '@/lib/data/stats';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cycle dashboard — the unified Numbers story.
 *
 * Replaces the three separate confusing charts (donut, trend line, comp
 * distribution) with one editorial panel that reads like a one-page
 * executive summary:
 *
 *   1. Leading sentence — what this is, in plain English.
 *   2. Five KPI tiles — the headline numbers with captions.
 *   3. Stream split — bar form (not donut), clear percentages.
 *   4. Five-year trend — sparkline + numbers, peak CTC per cycle.
 *   5. This cycle vs last — twin bars per metric with both numbers.
 *
 * No chart-junk. No axes that require math. Every number is labelled with
 * a unit (LPA / Cr / offers) and a one-line caption explaining context.
 */

const cur = currentCycleStats;
const prev = previousCycleStats;

const kpiTiles = [
  {
    label: 'Placement offers',
    value: String(cur.totalPlacementOffers),
    unit: '',
    caption: `Final accepted offers across streams in cycle ${cur.cycle}`,
  },
  {
    label: 'Internship offers',
    value: String(cur.totalInternshipOffers),
    unit: '',
    caption: 'Summer plus PPO-track this cycle',
  },
  {
    label: 'Peak CTC',
    value: cur.peakCtcLPA.toFixed(2),
    unit: 'LPA',
    caption: 'Highest fixed-pay offer this cycle',
  },
  {
    label: 'Average CTC',
    value: cur.averageCtcLPA.toFixed(2),
    unit: 'LPA',
    caption: 'Mean across accepted offers',
  },
  {
    label: 'Gross offer value',
    value: cur.grossOfferValueCr.toFixed(2),
    unit: 'Cr',
    caption: 'Cumulative cash compensation across all offers',
  },
];

// ---------------------------------------------------------------------------
// Editorial step-line chart for the eight-cycle trend.
// SVG-based, no chart library. Peak CTC as step-line + dots; offer volume as
// bars beneath. Brand-color gradient under the line.
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
          <stop offset="0%"   stopColor="#635bff" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trend-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#635bff" />
          <stop offset="50%"  stopColor="#a26bff" />
          <stop offset="100%" stopColor="#ff6b9d" />
        </linearGradient>
        <linearGradient id="trend-bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#635bff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a26bff" stopOpacity="0.55" />
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
          <circle cx={p.x} cy={p.y} r={6} fill="#fff" stroke="#635bff" strokeWidth={2.5} />
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

  // Stream split as horizontal bars
  const streams = [
    { label: 'Commerce', pct: cur.streamSplit.commerce, color: '#635bff' },
    { label: 'Arts', pct: cur.streamSplit.arts, color: '#a26bff' },
    { label: 'Science', pct: cur.streamSplit.science, color: '#ff6b9d' },
  ];

  // Trend cycles — for the sparkline peak line
  const trendMaxPeak = Math.max(...trendCycles.map((c) => c.peak));
  const trendMaxOffers = Math.max(...trendCycles.map((c) => c.offers));

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
      className="relative section-spacing bg-bg border-t border-line"
      id="numbers"
    >
      <div className="container-svc">
        {/* Header — designer treatment */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 md:mb-16"
        >
          {/* Live cycle ribbon */}
          <div className="flex items-center gap-3 mb-5">
            <span className="relative inline-flex w-2 h-2">
              <span
                className="absolute inset-0 rounded-full opacity-70 animate-ping"
                style={{ background: '#7fd9c1' }}
              />
              <span
                className="relative w-2 h-2 rounded-full"
                style={{ background: '#7fd9c1' }}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              Cycle {cur.cycle}
            </span>
            <span aria-hidden="true" className="block h-px w-12 bg-line" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              {cur.totalPlacementOffers + cur.totalInternshipOffers} total offers
            </span>
          </div>

          {/* Two-column header: heading + supporting copy */}
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-16 items-start">
            <h2
              className="font-display font-bold text-ink leading-[1.02] tracking-[-0.032em]"
              style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.2rem)' }}
            >
              The numbers,
              <br />
              <span className="font-serif italic font-normal text-ink-2" style={{ letterSpacing: '-0.01em' }}>
                plainly.
              </span>
            </h2>
            <div className="lg:pt-3">
              <p className="text-ink-2 text-[15px] md:text-base leading-relaxed mb-4">
                Aggregate placement and internship data for the running cycle,
                with year-on-year context.
              </p>
              <p className="text-xs text-ink-3 leading-relaxed">
                Values aggregate only, never paired with student names or
                specific firms. CTC is total fixed compensation in LPA. Gross
                value is cumulative annual compensation across all offers, in
                Crores. Pre-2024 figures computed from the cell&apos;s annual
                placement reports.
              </p>
            </div>
          </div>
        </motion.div>

        {/* KPI tiles — editorial, no heavy box */}
        <div className="relative mb-16">
          {/* Brand-color halo behind the row */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset: -20,
              background: 'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.10), transparent 65%)',
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 md:gap-y-0 md:divide-x md:divide-line">
            {kpiTiles.map((t, i) => {
              const accents = ['#635bff', '#a26bff', '#ff6b9d', '#7fd9c1', '#ffb088'];
              const accent = accents[i % accents.length];
              return (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                  className="relative px-5 md:px-6 first:pl-0"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span aria-hidden="true" className="block w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                      {t.label}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span
                      className="font-display font-bold leading-[0.95] text-ink tracking-[-0.035em] tabular-nums"
                      style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)' }}
                    >
                      {t.value}
                    </span>
                    {t.unit && (
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                        {t.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-ink-3 leading-snug max-w-[180px]">
                    {t.caption}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stream split — segmented arc + callout cards (different from donut and from horizontal bars) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="py-10 md:py-14 border-t border-line mb-4"
        >
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                Stream split
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight">
                Where the offers landed.
              </h3>
              <p className="text-sm text-ink-3 mb-5">
                Share of {cur.totalPlacementOffers} placement offers by faculty
                stream, cycle {cur.cycle}.
              </p>
              {/* Bottom-of-funnel summary */}
              <div className="pt-4 border-t border-line">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-1">
                  Total placement offers
                </div>
                <div className="font-display font-bold text-3xl md:text-4xl text-ink tabular-nums tracking-[-0.03em]">
                  {cur.totalPlacementOffers}
                </div>
              </div>
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

        {/* Five-year trend — editorial step-line chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="py-10 md:py-12 border-t border-line"
        >
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              Eight-cycle trajectory
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight">
              Peak compensation and offer volume, by cycle.
            </h3>
            <p className="text-sm text-ink-3 max-w-2xl">
              Step-line shows peak CTC. Bars below show offer volume. Click
              points are hand-computed from the cell&apos;s annual reports.
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
          className="py-10 md:py-12 border-t border-line"
        >
          <div className="mb-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              Year on year
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight">
              Cycle {cur.cycle} compared to cycle {prev.cycle}.
            </h3>
            <p className="text-sm text-ink-3 max-w-2xl">
              Per-cycle compensation rows. Top decile is the average of the top 10%
              of accepted offers. Median is the middle offer. Average is the mean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {compareRows.map((row, i) => {
              const delta = row.prev > 0 ? ((row.cur - row.prev) / row.prev) * 100 : 0;
              const isPositive = delta >= 0;
              const accents = ['#635bff', '#a26bff', '#7fd9c1', '#ff6b9d'];
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
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-3">
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

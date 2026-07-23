import { motion } from 'framer-motion';
import { currentCycleStats, previousCycleStats, trendCycles } from '@/lib/data/stats';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cycle dashboard — the SUPPORTING DETAIL that flows beneath StatsBar.
 *
 * Three data visualisations, all navy + gold + glass, all theme-aware
 * (colours read from the design tokens so light and dark both hold up):
 *
 *   1. Stream split — a drawn-in donut with total offers at its core and an
 *      editorial legend (share %, approximate offer count, proportion bar).
 *   2. Eight-cycle trajectory — a gold peak-CTC line with area wash over
 *      navy offer-volume bars, faint gridlines, point + cycle labels.
 *   3. Year on year — four refined comparison cards, current vs previous,
 *      with a gold improvement pill and paired proportion bars.
 *
 * Every number is read from stats.ts. No student names. Aggregate only.
 * Motion is transform/opacity + SVG stroke draws, gated on reduced-motion,
 * revealed per element so a missed observer can never strand content unseen.
 */

const cur = currentCycleStats;
const prev = previousCycleStats;

// Navy for the dominant stream, gold for the second, a pale navy tint for the
// third — strictly two brand hues, kept distinct.
const STREAM_COLORS = ['rgb(var(--accent))', 'rgb(var(--gold))', 'rgb(var(--accent) / 0.42)'] as const;

// ---------------------------------------------------------------------------
// 1. Stream split — donut with total-offers core.
// ---------------------------------------------------------------------------
function StreamDonut({
  streams,
  total,
  cycle,
  reduced,
}: {
  streams: { label: string; pct: number; color: string }[];
  total: number;
  cycle: string;
  reduced: boolean;
}) {
  const SIZE = 220;
  const c = SIZE / 2;
  const r = 78;
  const sw = 26;
  const C = 2 * Math.PI * r;
  const GAP = 14; // stroke-length gap between segments

  let cumulative = 0;
  const segments = streams.map((s) => {
    const frac = s.pct / 100;
    const startAngle = cumulative * 360;
    cumulative += frac;
    const visibleLen = Math.max(frac * C - GAP, 2);
    return { ...s, startAngle, visibleLen };
  });

  const segV = {
    hidden: (len: number) => ({ strokeDashoffset: len }),
    show: () => ({
      strokeDashoffset: 0,
      transition: { duration: 1.1, ease: EASE },
    }),
  };

  const parent = reduced
    ? { initial: 'show' as const }
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[220px] h-auto mx-auto"
      role="img"
      aria-label={`Placement offers by stream, cycle ${cycle}`}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
      {...parent}
    >
      {/* Base ring behind the gaps */}
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgb(var(--ink) / 0.07)" strokeWidth={sw} />

      {segments.map((seg) => (
        <motion.circle
          key={seg.label}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${seg.visibleLen} ${C}`}
          transform={`rotate(${seg.startAngle - 90} ${c} ${c})`}
          custom={seg.visibleLen}
          variants={segV}
        />
      ))}

      {/* Core: total offers */}
      <text
        x={c}
        y={c - 2}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="42"
        letterSpacing="-1.5"
        fill="rgb(var(--ink))"
      >
        {total}
      </text>
      <text
        x={c}
        y={c + 22}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8.5"
        letterSpacing="1.6"
        fill="rgb(var(--ink-3))"
      >
        OFFERS · {cycle}
      </text>
    </motion.svg>
  );
}

// ---------------------------------------------------------------------------
// 2. Eight-cycle trajectory — gold peak-CTC line over navy offer bars.
// Compact viewBox so labels stay legible when the SVG scales down on mobile.
// ---------------------------------------------------------------------------
function TrendChart({ reduced }: { reduced: boolean }) {
  const W = 360;
  const H = 284;
  const PADX = 10;
  const PADTOP = 34;
  const PADBOTTOM = 50;
  const innerW = W - PADX * 2;
  const innerH = H - PADTOP - PADBOTTOM;

  const n = trendCycles.length;
  const step = innerW / (n - 1);
  const maxOffers = Math.max(...trendCycles.map((d) => d.offers));
  const maxPeak = Math.max(...trendCycles.map((d) => d.peak));
  const peakCeil = maxPeak * 1.12;

  const baseY = PADTOP + innerH;
  const barMaxH = innerH * 0.46;
  const barW = step * 0.34;

  const x = (i: number) => PADX + i * step;
  const lineY = (peak: number) => baseY - (peak / peakCeil) * innerH;
  const barH = (offers: number) => (offers / maxOffers) * barMaxH;

  const pts = trendCycles.map((d, i) => ({ ...d, cx: x(i), cy: lineY(d.peak) }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].cx} ${baseY} L ${pts[0].cx} ${baseY} Z`;

  const parent = reduced
    ? { initial: 'show' as const }
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.2 },
      };

  const barV = {
    hidden: { scaleY: 0 },
    show: (i: number) => ({
      scaleY: 1,
      transition: { duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 },
    }),
  };
  const lineV = {
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { duration: 1.3, ease: EASE, delay: 0.2 } },
  };
  const areaV = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.5 } },
  };
  const popV = {
    hidden: { opacity: 0 },
    show: (i: number) => ({ opacity: 1, transition: { duration: 0.4, delay: 0.55 + i * 0.05 } }),
  };

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Peak CTC and offer volume across eight cycles"
      variants={{ hidden: {}, show: {} }}
      {...parent}
    >
      <defs>
        <linearGradient id="cd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--gold))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="rgb(var(--gold))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={PADX}
          x2={W - PADX}
          y1={PADTOP + innerH * t}
          y2={PADTOP + innerH * t}
          stroke="rgb(var(--ink) / 0.08)"
          strokeDasharray="2 5"
        />
      ))}
      <line x1={PADX} x2={W - PADX} y1={baseY} y2={baseY} stroke="rgb(var(--ink) / 0.14)" />

      {/* Offer-volume bars */}
      {pts.map((p, i) => {
        const h = barH(p.offers);
        return (
          <motion.rect
            key={`bar-${p.cycle}`}
            x={p.cx - barW / 2}
            y={baseY - h}
            width={barW}
            height={h}
            rx={2.5}
            fill="rgb(var(--accent) / 0.30)"
            style={{ transformOrigin: `${p.cx}px ${baseY}px` }}
            custom={i}
            variants={barV}
          />
        );
      })}

      {/* Area wash under the line */}
      <motion.path d={areaPath} fill="url(#cd-area)" variants={areaV} />

      {/* Peak-CTC line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="rgb(var(--gold))"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={lineV}
      />

      {/* Points + peak labels */}
      {pts.map((p, i) => (
        <motion.g key={`pt-${p.cycle}`} custom={i} variants={popV}>
          <circle cx={p.cx} cy={p.cy} r={3.6} fill="rgb(var(--bg))" stroke="rgb(var(--gold))" strokeWidth={2} />
          <text
            x={p.cx}
            y={p.cy - 10}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
            fontSize="10"
            fill="rgb(var(--gold-deep))"
          >
            {p.peak.toFixed(1)}
          </text>
        </motion.g>
      ))}

      {/* Cycle + offer labels */}
      {pts.map((p) => (
        <g key={`lab-${p.cycle}`}>
          <text
            x={p.cx}
            y={baseY + 16}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8"
            letterSpacing="0.3"
            fill="rgb(var(--ink-3))"
          >
            {p.offers}
          </text>
          <text
            x={p.cx}
            y={baseY + 30}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight="700"
            fontSize="9.5"
            fill="rgb(var(--ink-2))"
          >
            {p.cycle}
          </text>
        </g>
      ))}
    </motion.svg>
  );
}

export function CycleDashboard() {
  const reduced = useReducedMotion();

  const streams = [
    { label: 'Commerce', pct: cur.streamSplit.commerce, color: STREAM_COLORS[0] },
    { label: 'Arts', pct: cur.streamSplit.arts, color: STREAM_COLORS[1] },
    { label: 'Science', pct: cur.streamSplit.science, color: STREAM_COLORS[2] },
  ];

  const compareRows = [
    { label: 'Peak CTC', cur: cur.peakCtcLPA, prev: prev.peakCtcLPA },
    { label: 'Top decile avg', cur: cur.topDecileAverageLPA ?? 0, prev: prev.topDecileAverageLPA ?? 0 },
    { label: 'Median', cur: cur.medianCtcLPA ?? 0, prev: prev.medianCtcLPA ?? 0 },
    { label: 'Average', cur: cur.averageCtcLPA, prev: prev.averageCtcLPA },
  ];

  // Per-element reveal that always ends visible; a no-op under reduced motion.
  const reveal = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.65, ease: EASE, delay },
        };

  return (
    <section className="relative pb-16 md:pb-24 lg:pb-32 bg-bg" id="numbers">
      <div className="container-svc space-y-6 md:space-y-8">
        {/* 1. Stream split ------------------------------------------------- */}
        <motion.div {...reveal()} className="glass rounded-2xl p-6 md:p-10">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-16 items-center">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                Stream split
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
                Where the offers landed.
              </h3>
              <p className="text-sm text-ink-3 leading-relaxed max-w-[34ch]">
                Share of {cur.totalPlacementOffers} placement offers by faculty stream, cycle {cur.cycle}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-12">
              <StreamDonut
                streams={streams}
                total={cur.totalPlacementOffers}
                cycle={cur.cycle}
                reduced={reduced}
              />

              <div className="w-full sm:flex-1 space-y-5">
                {streams.map((s, i) => {
                  const offers = Math.round((s.pct / 100) * cur.totalPlacementOffers);
                  return (
                    <motion.div key={s.label} {...reveal(0.15 + i * 0.1)}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: s.color }}
                          />
                          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
                            {s.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-display font-bold text-xl text-ink tabular-nums tracking-[-0.02em]">
                            {s.pct}
                          </span>
                          <span className="font-mono text-[11px] text-ink-3">%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-line overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: s.color, transformOrigin: 'left' }}
                          initial={reduced ? false : { scaleX: 0 }}
                          whileInView={reduced ? undefined : { scaleX: s.pct / 100 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 }}
                        />
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 mt-1.5 tabular-nums">
                        ~{offers} offers
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Eight-cycle trajectory -------------------------------------- */}
        <motion.div {...reveal()} className="glass rounded-2xl p-6 md:p-10">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                Eight-cycle trajectory
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
                Peak compensation and offer volume, by cycle.
              </h3>
              <p className="text-sm text-ink-3 leading-relaxed max-w-2xl text-pretty">
                The line tracks peak CTC in LPA. Bars below carry offer volume. Every point is computed from the
                cell&apos;s annual reports.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="w-5 h-[2.5px] rounded-full bg-gold" />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">Peak CTC</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-3 rounded-[2px]"
                  style={{ background: 'rgb(var(--accent) / 0.3)' }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">Offers</span>
              </div>
            </div>
          </div>

          <TrendChart reduced={reduced} />
        </motion.div>

        {/* 3. Year on year ------------------------------------------------ */}
        <motion.div {...reveal()} className="glass rounded-2xl p-6 md:p-10">
          <div className="mb-6 md:mb-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              Year on year
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-ink tracking-tight mb-2 leading-tight text-balance">
              Cycle {cur.cycle} compared to cycle {prev.cycle}.
            </h3>
            <p className="text-sm text-ink-3 leading-relaxed max-w-2xl text-pretty">
              Compensation per cycle. Top decile is the average of the top 10% of accepted offers. Median is the
              middle offer. Average is the mean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {compareRows.map((row, i) => {
              const delta = row.prev > 0 ? ((row.cur - row.prev) / row.prev) * 100 : 0;
              const up = delta >= 0;
              const prevPct = row.cur > 0 ? Math.min(row.prev / row.cur, 1) : 0;
              return (
                <motion.div
                  {...reveal(0.1 + i * 0.08)}
                  key={row.label}
                  className="rounded-xl border border-line bg-surface/50 p-5"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 max-w-[12ch] leading-snug">
                      {row.label}
                    </span>
                    <span
                      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums whitespace-nowrap"
                      style={{ background: 'var(--gold-soft)', color: 'rgb(var(--gold))' }}
                    >
                      {up ? '↑' : '↓'} {up ? '+' : ''}
                      {delta.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display font-bold text-ink tabular-nums leading-none tracking-[-0.035em] text-[2.1rem]">
                      {row.cur.toFixed(2)}
                    </span>
                    <span className="font-mono text-[11px] text-ink-3">LPA</span>
                  </div>

                  {/* Current vs previous proportion bars */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] tabular-nums text-ink-3 w-9 shrink-0">{cur.cycle}</span>
                      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'rgb(var(--accent))', transformOrigin: 'left' }}
                          initial={reduced ? false : { scaleX: 0 }}
                          whileInView={reduced ? undefined : { scaleX: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] tabular-nums text-ink-3 w-9 shrink-0">{prev.cycle}</span>
                      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'rgb(var(--ink) / 0.22)', transformOrigin: 'left' }}
                          initial={reduced ? false : { scaleX: 0 }}
                          whileInView={reduced ? undefined : { scaleX: prevPct }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.32 + i * 0.06 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-line">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-3">Prev</span>
                    <span className="font-display font-semibold text-sm text-ink-2 tabular-nums">
                      {row.prev.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-line text-xs text-ink-3">
            All values in Lakhs Per Annum (LPA). Positive delta means year on year growth.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

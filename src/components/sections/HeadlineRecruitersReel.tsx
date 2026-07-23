import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cycleHeadlineRecruiters, type RecruiterTier, type CycleRecruiter } from '@/lib/data/stats';
import { recruiters } from '@/lib/data/partners';
import { brandIconUrl } from '@/lib/data/brand';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;
const CYCLE_DURATION_MS = 6800;

/**
 * Headline Recruiters by Cycle, with prestige-tier hierarchy.
 *
 * Each cycle lists 15-22 real recruiters from the cell's annual reports.
 * Within each cycle, recruiters are rendered in tier order:
 *
 *   - Premium: MBB consulting, Goldman Sachs, D.E. Shaw, Big 4, American
 *     Express, Nomura Research, Barclays, ICICI Prudential Life. Rendered
 *     as bright bg-white chips with ink text, slightly larger, brand-color
 *     accent dot on the left. The visual centerpiece.
 *
 *   - Strong: Accenture, ZS Associates, AON, WTW, Genpact, EXL, HCL Tech,
 *     TresVista, Grant Thornton, BSR, Futures First, Oxane Partners,
 *     Milliman, ICICI Bank, HDFC Bank, etc. Rendered as bright translucent
 *     white chips with hairline border, white text.
 *
 *   - Standard: every other firm. Rendered as subtle translucent chips at
 *     slightly lower opacity to recede.
 *
 * Chips with a matching slug in the partners data link to that company's
 * page. Non-matches render as static spans.
 *
 * Cycle ticker: 240ms outgoing fade, 80ms beat, 320ms character ticker on
 * the giant cycle label, 280ms incoming entrance. Click any year to lock.
 *
 * Reduced motion: 200ms fade swap, no per-chip stagger, no ticker.
 */

// ---------------------------------------------------------------------------
// Slug resolver (fuzzy + alias map)
// ---------------------------------------------------------------------------
function resolveSlug(name: string): string | null {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const target = norm(name);
  for (const r of recruiters) {
    const a = norm(r.name);
    if (a === target) return r.slug;
    if (a.includes(target) || target.includes(a)) return r.slug;
  }
  const aliases: Record<string, string | undefined> = {
    'deloitteusi':              'deloitte',
    'deloitteconsulting':       'deloitte',
    'kpmgindia':                'kpmg',
    'kpmgglobalservices':       'kpmg',
    'eyindia':                  'ey',
    'eygds':                    'ey',
    'pwcindia':                 'pwc',
    'pwcactuarial':             'pwc',
    'bain':                     'bain',
    'baincapabilitynetwork':    'bain',
    'baincompany':              'bain',
    'deshaw':                   'de-shaw',
    'goldmansachs':             'goldman-sachs',
    'hcltechnologies':          'hcl-technologies',
    'futuresfirst':             'futures-first',
    'oxanepartners':            'oxane-partners',
    'icicibank':                'icici-bank',
    'iciciprudentiallife':      'icici-prudential',
    'iciciprudential':          'icici-prudential',
    'bostonconsultinggroup':    'bcg',
    'mckinseyknowledgecenter':  undefined,
    'mckinsey':                 undefined,
    'americanexpress':          undefined,
    'nomuraresearch':           undefined,
    'barclays':                 undefined,
    'arcesium':                 undefined,
    'dspblackrock':             undefined,
    'wtw':                      'wtw',
    'wtwindia':                 'wtw',
    'willistowerswatson':       'wtw',
    'aon':                      'aon',
    'aonconsulting':            'aon',
    'aonservice':               'aon',
    'aonservices':              'aon',
    'tresvista':                undefined,
    'milliman':                 undefined,
    'genpact':                  'genpact',
    'exl':                      'exl',
    'exlservice':               'exl',
    'exlservices':              'exl',
    'zsassociates':             'zs-associates',
    'granthornton':             'grant-thornton',
    'grantthornton':            'grant-thornton',
    'bsrco':                    undefined,
    'hdfcbank':                 'hdfc-bank',
    'mastersunion':             'masters-union',
    'zomato':                   'zomato',
    'glg':                      'glg',
    'gersonlehrmangroup':       'glg',
  };
  const direct = aliases[target];
  return direct ?? null;
}

// Per-name domain lookup so chips can fetch logos via Brandfetch.
// Falls back to a brand-color monogram tile when nothing matches.
const NAME_DOMAIN_MAP: Record<string, string> = {
  'bcg':                   'bcg.com',
  'bain & company':        'bain.com',
  'bain capability network': 'bain.com',
  'bain':                  'bain.com',
  'mckinsey':              'mckinsey.com',
  'mckinsey knowledge center': 'mckinsey.com',
  'goldman sachs':         'goldmansachs.com',
  'd.e. shaw':             'deshaw.com',
  'deshaw':                'deshaw.com',
  'arcesium':              'arcesium.com',
  'deloitte':              'deloitte.com',
  'deloitte usi':          'deloitte.com',
  'deloitte consulting':   'deloitte.com',
  'ey':                    'ey.com',
  'ey india':              'ey.com',
  'ey gds':                'ey.com',
  'kpmg':                  'kpmg.com',
  'kpmg india':            'kpmg.com',
  'kpmg global services':  'kpmg.com',
  'kpmg gdc':              'kpmg.com',
  'pwc india':             'pwc.com',
  'pwc actuarial':         'pwc.com',
  'nomura research':       'nomura.com',
  'american express':      'americanexpress.com',
  'barclays':              'barclays.com',
  'dsp blackrock':         'blackrock.com',
  'icici prudential life': 'iciciprulife.com',
  'icici bank':            'icicibank.com',
  'hdfc bank':             'hdfcbank.com',
  'accenture':             'accenture.com',
  'zs associates':         'zs.com',
  'aon':                   'aon.com',
  'aon services':          'aon.com',
  'aon service':           'aon.com',
  'aon consulting':        'aon.com',
  'wtw':                   'wtwco.com',
  'wtw india':             'wtwco.com',
  'willis towers watson':  'wtwco.com',
  'genpact':               'genpact.com',
  'exl':                   'exlservice.com',
  'exl service':           'exlservice.com',
  'exl services':          'exlservice.com',
  'hcl technologies':      'hcltech.com',
  'tresvista':             'tresvista.com',
  'grant thornton':        'grantthornton.com',
  'bsr & co.':             'kpmg.com',
  'futures first':         'futuresfirst.com',
  'oxane partners':        'oxanepartners.com',
  'milliman':              'milliman.com',
  'bajaj capital':         'bajajcapital.com',
  'zomato':                'zomato.com',
  'masters union':         'mastersunion.org',
  'wells fargo':           'wellsfargo.com',
  'société générale':      'societegenerale.com',
  'wipro':                 'wipro.com',
  'glg':                   'glginsights.com',
  'hubspot':               'hubspot.com',
  'paytm':                 'paytm.com',
  'oyo':                   'oyorooms.com',
  'capgemini':             'capgemini.com',
  'infosys':               'infosys.com',
};

function getDomainForName(name: string): string | undefined {
  return NAME_DOMAIN_MAP[name.toLowerCase()];
}

// ---------------------------------------------------------------------------
// Single chip — logo tile + name. Same height (38px), variable width.
// ---------------------------------------------------------------------------
function RecruiterChip({
  recruiter,
  index: _index,
  reduced,
}: {
  recruiter: CycleRecruiter;
  index: number;
  reduced: boolean;
}) {
  const slug = resolveSlug(recruiter.name);
  const domain = getDomainForName(recruiter.name);
  const [logoFailed, setLogoFailed] = useState(false);
  const useLogo = !!domain && !logoFailed;
  const monogram = recruiter.name
    .split(/[\s&.\-,]+/).filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const innerInitial = reduced ? false : { opacity: 0, y: 6 };
  const innerAnimate = { opacity: 1, y: 0 };
  const innerTransition = {
    duration: 0.28,
    ease: EASE,
    delay: 0,
  };

  const tileClassName =
    'group inline-flex items-center gap-2.5 pr-3.5 rounded-full bg-white/[0.06] border border-white/15 text-white font-display font-medium text-[13.5px] md:text-[14.5px] tracking-tight transition-all duration-300 hover:bg-white/[0.14] hover:border-white/40';

  const inner = (
    <>
      {/* Logo tile */}
      <span
        aria-hidden="true"
        className="flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          width: 30,
          height: 30,
          marginLeft: 4,
          background: '#fff',
          borderRadius: '22%',
          border: '1px solid rgba(255, 255, 255, 0.20)',
        }}
      >
        {useLogo ? (
          <img
            src={brandIconUrl(domain!)}
            alt=""
            className="w-full h-full object-contain"
            style={{ padding: 3 }}
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span
            className="font-display font-bold text-ink"
            style={{ fontSize: monogram.length <= 2 ? 11 : 9, letterSpacing: '-0.02em' }}
          >
            {monogram}
          </span>
        )}
      </span>
      <span>{recruiter.name}</span>
    </>
  );

  if (slug) {
    return (
      <motion.div initial={innerInitial} animate={innerAnimate} transition={innerTransition}>
        <Link to={`/companies/${slug}`} className={tileClassName} style={{ height: 38 }} aria-label={`View ${recruiter.name}`}>
          {inner}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.span
      initial={innerInitial}
      animate={innerAnimate}
      transition={innerTransition}
      className={tileClassName.replace(/ hover:[^ ]+/g, '')}
      style={{ height: 38 }}
    >
      {inner}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Reel
// ---------------------------------------------------------------------------
export function HeadlineRecruitersReel() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = cycleHeadlineRecruiters.length;
  const current = cycleHeadlineRecruiters[index];

  // Auto-advance the cycle. Single timer, no phase machinery.
  // AnimatePresence inside handles the cross-fade animation.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, CYCLE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [index, total]);

  // Sort: premium first, then strong, then standard.
  const sortedRecruiters = useMemo(() => {
    const tierOrder: Record<RecruiterTier, number> = { premium: 0, strong: 1, standard: 2 };
    return [...current.marquee].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  }, [current]);

  const onJumpTo = (i: number) => {
    if (i === index) return;
    setIndex(i);
  };

  return (
    <section
      className="relative py-20 md:py-28 bg-ink border-y border-line overflow-hidden"
      aria-label="Headline recruiters across recent cycles"
    >
      {/* Atmospheric backing */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 25% 30%, rgba(30, 78, 140, 0.28), transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(255, 107, 157, 0.16), transparent 55%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 4px)',
        }}
      />

      <div className="container-svc relative">
        {/* Top row: kicker + cycle picker */}
        <div className="flex items-center justify-between mb-10 md:mb-14 flex-wrap gap-4">
          <div className="flex items-center gap-3">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
              Headline recruiters · by cycle
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-1.5">
            {cycleHeadlineRecruiters.map((c, i) => {
              const isActive = i === index;
              return (
                <button
                  key={c.cycle}
                  type="button"
                  onClick={() => onJumpTo(i)}
                  aria-label={`Show cycle ${c.cycle}`}
                  className="group relative inline-flex flex-col items-center gap-1.5 px-2 py-1"
                >
                  <span
                    className="block h-px transition-all duration-500"
                    style={{
                      width: isActive ? 32 : 16,
                      background: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-300"
                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}
                  >
                    {c.cycle}
                  </span>
                  {isActive && !reduced && (
                    <motion.span
                      layoutId="cycle-active-underline"
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-2 right-2 h-[2px]"
                      style={{ background: '#7fd9c1' }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main composition */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-14 items-start">
          {/* Giant cycle label — smooth cross-fade on change */}
          <div>
            <div
              className="font-display font-bold leading-none text-white tracking-[-0.04em] tabular-nums relative overflow-hidden"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', minHeight: '0.95em' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current.cycle}
                  className="inline-block"
                  initial={{ y: '70%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-70%', opacity: 0 }}
                  transition={{ duration: 0.36, ease: EASE }}
                >
                  {current.cycle}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mt-3">
              Cycle · who hired
            </div>
            <div className="mt-5 h-px w-16 bg-white/30" />
            <p className="mt-5 text-sm text-white/55 leading-relaxed max-w-xs">
              Every firm that ran a drive at SVC during this cycle. Drawn
              from the cell&apos;s offer-level archives.
            </p>

            {/* Total count */}
            <div className="mt-6 flex flex-col gap-1.5 max-w-xs">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: '#1e4e8c' }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 tabular-nums">
                  {sortedRecruiters.length} firms · this cycle
                </span>
              </div>
            </div>
          </div>

          {/* Chip cloud — smooth cross-fade, no per-chip stagger */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`chips-${current.cycle}`}
                className="flex flex-wrap gap-2.5 md:gap-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                {sortedRecruiters.map((r, i) => (
                  <RecruiterChip
                    key={`${current.cycle}-${r.name}-${i}`}
                    recruiter={r}
                    index={i}
                    reduced={reduced}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom hairline */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            Cycles auto-advance · click a year to lock · click a chip to open
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {sortedRecruiters.length} firms
          </span>
        </div>
      </div>
    </section>
  );
}

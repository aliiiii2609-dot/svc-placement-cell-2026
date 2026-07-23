import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SplitFlapCounter } from '@/components/ui/SplitFlapCounter';
import { cn } from '@/lib/utils/cn';
import { ifairEditions } from '@/lib/data/stats';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Internship Fair section.
 *
 * One non-duplicated heading. Four year cards (2023-2026). Clicking any
 * past year opens a modal with photos from that year's fair. Clicking the
 * upcoming year opens a CTA to express recruiter interest.
 *
 * Year cards have a subtle hover lift, broadcast-graphic chips, and the
 * upcoming year is marked with an accent border + live pulse dot.
 */

type Edition = {
  year: string;
  yearShort: string;
  edition: string;
  orgs: number;
  regs: number | null;
  offers: number | null;
  status: 'past' | 'upcoming';
  note: string;
  /** Photos shown in the modal when this year is opened. */
  photos: string[];
};

/**
 * Presentation metadata the component owns per past edition — short labels
 * and the photos shown in the modal. The org / registration / offer counts,
 * years, and chief guests are the single source of truth in
 * `@/lib/data/stats` (`ifairEditions`), which also resolves the historical
 * offer-count discrepancy.
 */
const EDITION_PRESENTATION: Record<string, { yearShort: string; edition: string; photos: string[] }> = {
  '2023': {
    yearShort: '23',
    edition: 'Seventh',
    photos: [
      '/images/gallery/internship-fair-2023.jpg',
      '/images/gallery/internship-fair-banner.jpg',
    ],
  },
  '2024': {
    yearShort: '24',
    edition: 'Eighth',
    photos: ['/images/gallery/internship-fair-banner.jpg'],
  },
  '2025': {
    yearShort: '25',
    edition: 'Ninth',
    photos: ['/images/gallery/ifair-25-group.jpg'],
  },
};

const pastEditions: Edition[] = ifairEditions.map((ed): Edition => {
  const p = EDITION_PRESENTATION[ed.year];
  return {
    year: ed.year,
    yearShort: p.yearShort,
    edition: p.edition,
    orgs: ed.orgs,
    regs: ed.regs,
    offers: ed.offers,
    status: 'past',
    note: `Chief Guest: ${ed.chiefGuest}.`,
    photos: p.photos,
  };
});

/**
 * The upcoming Tenth edition has no final figures yet, so it is not in the
 * stats record; it lives here until it does.
 */
const upcomingEdition: Edition = {
  year: '2026',
  yearShort: '26',
  edition: 'Tenth',
  orgs: 60,
  regs: null,
  offers: null,
  status: 'upcoming',
  note: 'Date: 25 March 2026. Recruiter EOI open.',
  photos: [],
};

const editions: Edition[] = [...pastEditions, upcomingEdition];

function EditionModal({ edition, onClose }: { edition: Edition; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        layoutId={`ifair-${edition.year}`}
        className="relative z-10 bg-surface rounded-2xl shadow-soft-lg border border-line max-w-4xl w-full max-h-[88vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center hover:border-accent transition-colors"
        >
          <X size={16} className="text-ink-2" />
        </button>

        <div className="p-8 md:p-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-2">
            IFair · {edition.edition} Edition
          </div>
          <h3 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-3">
            Internship Fair {edition.year}
          </h3>
          <p className="text-sm text-ink-2 mb-7 max-w-2xl">{edition.note}</p>

          <div className="grid grid-cols-3 gap-3 pb-7 border-b border-line">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1">
                Organizations
              </div>
              <div className="font-display font-bold text-2xl text-ink">{edition.orgs}+</div>
            </div>
            {edition.regs !== null && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1">
                  Registrations
                </div>
                <div className="font-display font-bold text-2xl text-ink">{edition.regs}+</div>
              </div>
            )}
            {edition.offers !== null && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1">
                  Offers
                </div>
                <div className="font-display font-bold text-2xl text-accent">{edition.offers}+</div>
              </div>
            )}
          </div>

          {edition.photos.length > 0 ? (
            <div className="mt-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 mb-4">
                Photos from this edition
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {edition.photos.map((src, i) => (
                  <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden border border-line">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-7 p-6 rounded-xl bg-bg-2 border border-line">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-2">
                Recruiter EOI open
              </div>
              <p className="text-sm text-ink-2 mb-4">
                Express interest in IFair 2026 to receive the recruiter brief and confirm a slot.
              </p>
              <a
                href="mailto:placement@svc.ac.in?subject=IFair%202026%20recruiter%20expression%20of%20interest"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-medium hover:bg-accent-deep transition-colors text-sm"
              >
                Email the cell →
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function IFairSection() {
  const [openYear, setOpenYear] = useState<string | null>(null);
  const open = openYear ? editions.find((e) => e.year === openYear) ?? null : null;

  return (
    <section className="section-spacing border-t border-line" id="ifair">
      <div className="container-svc">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start mb-12"
        >
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent mb-4">
              Tenth Edition · 25 March 2026
            </div>
            <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.04] tracking-[-0.028em] mb-5">
              <span className="text-ink">The Internship Fair.</span>
            </h2>
            <p className="text-ink-2 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Click any edition to open photos from that year. IFair 2026 is open for recruiter expressions of interest.
            </p>
            <a
              href="mailto:placement@svc.ac.in?subject=IFair%202026%20recruiter%20expression%20of%20interest"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-deep transition-colors font-mono text-sm uppercase tracking-widest"
            >
              Express interest for IFair 2026
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="relative aspect-square max-w-md rounded-2xl border border-line overflow-hidden shadow-soft-lg">
            <div
              className="w-full h-full flex items-center justify-center p-8 text-white relative"
              style={{
                background: 'linear-gradient(135deg, #D4A857 0%, #B8893B 50%, #E8D5A8 100%)',
              }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 60%)',
                }}
                aria-hidden="true"
              />
              <div className="text-center relative">
                <div className="font-display font-bold text-8xl tracking-tight mb-2">10</div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] opacity-80">
                  th Edition
                </div>
                <div className="font-display font-semibold text-xl mt-4">Opportunity Calls</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {editions.map((ed, i) => (
            <motion.button
              key={ed.year}
              type="button"
              onClick={() => setOpenYear(ed.year)}
              layoutId={`ifair-${ed.year}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.09,
                ease: EASE,
              }}
              whileHover={{ y: -4 }}
              className={cn(
                'text-left bg-surface border rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow duration-400',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer',
                ed.status === 'upcoming' ? 'border-accent ring-1 ring-accent/30' : 'border-line',
              )}
            >
              <div className="flex items-baseline justify-between mb-4">
                <div className="font-display font-bold text-3xl text-ink tracking-tight">
                  IFair&apos;{ed.yearShort}
                </div>
                <div className="flex items-center gap-1.5">
                  {ed.status === 'upcoming' && (
                    <span className="relative inline-flex w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-70" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-accent" />
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {ed.status === 'upcoming' ? 'Upcoming' : ed.edition}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink-3">Organizations</span>
                  <span className="text-ink font-medium">
                    {ed.orgs ? <SplitFlapCounter value={ed.orgs} suffix="+" /> : 'In planning'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink-3">Registrations</span>
                  <span className="text-ink font-medium">
                    {ed.regs ? <SplitFlapCounter value={ed.regs} suffix="+" /> : 'Open soon'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Offers</span>
                  <span className="text-accent font-semibold">
                    {ed.offers ? <SplitFlapCounter value={ed.offers} suffix="+" /> : '—'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-ink-3 mt-4 leading-relaxed">{ed.note}</p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                {ed.status === 'upcoming' ? 'EOI →' : 'Open photos →'}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <EditionModal edition={open} onClose={() => setOpenYear(null)} />}
      </AnimatePresence>
    </section>
  );
}

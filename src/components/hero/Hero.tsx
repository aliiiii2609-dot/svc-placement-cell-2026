import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { RankingsConstellation } from '@/components/hero/RankingsConstellation';
import { cn } from '@/lib/utils/cn';

/**
 * Hero — modelled on the cell's "CV Vetting Guidelines" cover.
 *
 * A deep navy field is the dominant surface. The SVC building photograph sits at
 * the BOTTOM, heavily faded and desaturated, emerging softly out of the navy via a
 * gradient + mask (near-solid navy at the top, the building only faintly visible
 * toward the bottom). A thin inset hairline frame borders the whole band. Content
 * is centered, editorial: the gold crest lockup, a letter-spaced eyebrow, a calm
 * display heading, a gold divider, then a single subtitle line and the CTAs.
 *
 * Below the photo band: the rankings constellation on its own paper background.
 *
 * Motion: entrances run ONCE on mount then idle, all gated on useReducedMotion
 * (reduced -> final state, no transition). The single ambient motion is a very slow
 * ken-burns drift on the faded building, which holds static when motion is reduced.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const NAVY = '#0a2540';

const wordRevealAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.28 + i * 0.05, duration: 0.7, ease: EASE },
  }),
};

function WordsCascade({
  text,
  className,
  lastWordClassName,
  reduce,
}: {
  text: string;
  className?: string;
  lastWordClassName?: string;
  reduce: boolean;
}) {
  const words = text.split(' ');
  return (
    <span className={cn('inline', className)} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordRevealAnim}
          initial={reduce ? 'visible' : 'hidden'}
          animate="visible"
          className={cn(
            'inline-block will-change-transform',
            i === words.length - 1 && lastWordClassName,
          )}
          // A trailing space inside an inline-block is trimmed, which jams the
          // words together. A right margin gives a reliable, wrap-friendly gap.
          style={{ marginRight: i < words.length - 1 ? '0.28em' : undefined }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion() ?? false;

  // One helper for every entrance so the reduced-motion gate lives in one place.
  const reveal = (delay: number, y = 12) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  return (
    <section id="hero" className="relative overflow-hidden bg-bg" aria-label="Hero">
      {/* The navy photo band. On wide screens the 770/434 ratio drives its height;
          on narrow screens that ratio is far too short for the centered content,
          so a min-height keeps content from spilling onto the next section. */}
      <div
        className="relative w-full min-h-[640px] sm:min-h-[600px] lg:min-h-0 overflow-hidden"
        style={{ aspectRatio: '770 / 434', backgroundColor: NAVY }}
      >
        {/* Faded building — desaturated, low opacity, masked so it only emerges at
            the bottom. Slow ken-burns drift; static when motion is reduced. */}
        <motion.img
          src="/images/campus/svc-building.jpg"
          alt="Sri Venkateswara College main building"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          style={{
            filter: 'saturate(0.92) brightness(0.9)',
            transformOrigin: 'center center',
          }}
          loading="eager"
          initial={{ scale: reduce ? 1.03 : 1.02 }}
          animate={{ scale: reduce ? 1.03 : 1.07 }}
          transition={
            reduce
              ? undefined
              : { duration: 26, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
          }
        />

        {/* Left-heavy scrim: dark where the text sits, clearing to the right so the
            building stays clearly visible. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(100deg, rgba(6,20,42,0.90) 0%, rgba(6,20,42,0.66) 32%, rgba(7,24,48,0.30) 58%, rgba(7,24,48,0.12) 84%, rgba(7,24,48,0.30) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom fade so the band blends into the paper section below. */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(6,20,42,0.70) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Thin inset hairline frame, echoing the cover. */}
        <div
          className="absolute inset-3 sm:inset-5 rounded-[3px] pointer-events-none"
          style={{ border: '1px solid rgba(255,255,255,0.16)' }}
          aria-hidden="true"
        />

        {/* Content — left aligned, minimal. Entrances run once, then idle. */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-svc w-full">
            <div className="max-w-2xl">
              {/* Simple label */}
              <motion.div
                {...reveal(0.1)}
                className="mb-5 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-ribbon-gold"
              >
                The Placement Cell · Sri Venkateswara College
              </motion.div>

              {/* Headline */}
              <h1
                className="font-display font-semibold text-white leading-[1.08] tracking-[-0.02em] mb-8"
                style={{
                  fontSize: 'clamp(2rem, 4.4vw, 3.6rem)',
                  textShadow: '0 1px 26px rgba(3,12,28,0.55)',
                }}
              >
                <WordsCascade
                  text="Where preparation meets opportunity."
                  lastWordClassName="text-ribbon-gold"
                  reduce={reduce}
                />
              </h1>

              {/* CTAs */}
              <motion.div {...reveal(0.9)} className="flex flex-col sm:flex-row gap-3">
                <Button as={Link as never} to="/recruiters#interest" size="lg">
                  Recruit with us
                </Button>
                <Button
                  as="a"
                  href="/Recruitment-Brochure-SVC-2026-27.pdf"
                  target="_blank"
                  rel="noopener"
                  size="lg"
                  variant="secondary"
                >
                  Download brochure
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gold hairline sealing the photo band into the paper section below. */}
        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212,168,87,0.55) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Rankings constellation block sits BELOW the photo on its own background */}
      <div className="bg-bg relative">
        <div className="container-svc py-16 lg:py-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="flex items-baseline justify-between mb-7 flex-wrap gap-3">
              <div>
                <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent mb-2">
                  Recognised by
                </div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight">
                  National rankings and accreditation.
                </h2>
              </div>
              <Link
                to="/rankings-press"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:text-accent-deep transition-colors"
              >
                Methodology and sources →
              </Link>
            </div>
            <RankingsConstellation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

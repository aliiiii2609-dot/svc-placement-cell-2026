import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ParticleField } from '@/components/animations/ParticleField';
import { MathBackdrop } from '@/components/hero/MathBackdrop';
import { RankingsConstellation } from '@/components/hero/RankingsConstellation';
import { currentCycleStats } from '@/lib/data/stats';
import { cn } from '@/lib/utils/cn';

/**
 * Hero — full real building photo, no crop. Editorial navy + gold + glass.
 *
 * Layering (bottom to top):
 *   1. The real SVC College building photo (object-cover, object-center).
 *   2. A navy duotone unifier + directional legibility scrim (left/bottom heavy)
 *      so overlaid text keeps strong contrast in every photo region.
 *   3. Soft gold + navy blooms (screen) and a low-opacity blueprint backdrop
 *      for tasteful depth — all static, no per-frame scroll work.
 *   4. A few floating particles for flair (self-disables on mobile / reduced
 *      motion, pauses off-screen).
 *   5. Content: crest lockup + kicker + headline + lede + CTAs + live pill.
 *
 * Below the photo region: the rankings constellation on its own paper band.
 *
 * Motion: every entrance runs ONCE on mount and then idles. All of it is gated
 * on useReducedMotion — when reduced, content renders in its final state (never
 * left invisible) with no transition.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const wordRevealAnim = {
  hidden: { opacity: 0, y: 20 },
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
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 && ' '}
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
      {/* The photo region. On wide screens the 770/434 ratio drives its height;
          on narrow screens that ratio is far too short for the overlaid content,
          so a min-height keeps content from spilling onto the next section. */}
      <div
        className="relative w-full min-h-[640px] sm:min-h-[600px] lg:min-h-0"
        style={{ aspectRatio: '770 / 434' }}
      >
        {/* Real building photo, cover-fit. Static — no scroll-linked transform. */}
        <img
          src="/images/campus/svc-building.jpg"
          alt="Sri Venkateswara College main building"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Navy duotone unifier — pulls the photo toward the SVC navy palette. */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background:
              'linear-gradient(180deg, rgba(12,34,63,0.34) 0%, rgba(9,26,50,0.58) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Directional legibility scrim — heaviest on the left where text sits. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(100deg, rgba(5,18,40,0.88) 0%, rgba(5,18,40,0.62) 26%, rgba(7,22,46,0.24) 54%, rgba(7,22,46,0.10) 76%, rgba(7,22,46,0.32) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Bottom grounding gradient — anchors the pill and blends into the band below. */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(5,17,38,0.82) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />
        {/* Top haze — keeps the crest lockup legible against sky. */}
        <div
          className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(5,17,38,0.42) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Soft gold + navy blooms for warmth and depth (static, screen blend). */}
        <div
          className="absolute -bottom-28 -left-24 w-[540px] h-[540px] rounded-full pointer-events-none mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(212,168,87,0.22) 0%, transparent 66%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 right-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(60,120,196,0.26) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Light blueprint/math layer over the photo. */}
        <div className="absolute inset-0 opacity-[0.28] pointer-events-none mix-blend-overlay">
          <MathBackdrop />
        </div>

        {/* Floating particles. Count kept low; self-disables on mobile / reduced
            motion and pauses off-screen. */}
        <ParticleField className="z-[4]" count={18} />

        {/* Content overlaid on the photo. Entrances run once, then idle. */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-svc w-full">
            <div className="max-w-2xl">
              {/* Crest lockup */}
              <motion.div
                {...reveal(0, -10)}
                className="mb-6 inline-flex items-center gap-3.5"
              >
                <span className="relative inline-flex items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md p-1.5 shadow-lg">
                  <img
                    src="/logos/svc-crest.png"
                    alt=""
                    className="w-11 h-11 md:w-12 md:h-12 drop-shadow"
                  />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/90 leading-[1.5]">
                  Sri Venkateswara College
                  <br />
                  <span className="text-white/65">University of Delhi</span>
                </span>
              </motion.div>

              {/* Kicker with gold hairline */}
              <motion.div
                {...reveal(0.14)}
                className="mb-4 flex items-center gap-3"
              >
                <span
                  className="h-px w-9"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(212,168,87,0.95) 0%, rgba(212,168,87,0) 100%)',
                  }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ribbon-gold">
                  The Placement Cell
                </span>
              </motion.div>

              {/* Headline — two-line treatment, gold accent on the closing word. */}
              <h1
                className="font-display font-bold leading-[1.03] tracking-[-0.035em] mb-6 text-white"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 5rem)',
                  textShadow: '0 1px 30px rgba(3,12,28,0.45)',
                }}
              >
                <WordsCascade text="Where preparation" reduce={reduce} />
                <br />
                <span className="text-white/90">
                  <WordsCascade
                    text="meets opportunity."
                    lastWordClassName="text-ribbon-gold"
                    reduce={reduce}
                  />
                </span>
              </h1>

              {/* Lede */}
              <motion.p
                {...reveal(0.95)}
                className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed mb-7"
              >
                The single point of coordination for placements, summer internships, and the annual
                Internship Fair at Sri Venkateswara College, University of Delhi.
              </motion.p>

              {/* CTAs */}
              <motion.div {...reveal(1.1)} className="flex flex-wrap gap-3 mb-6">
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

              {/* Live pill */}
              <motion.div
                {...reveal(1.25, 10)}
                className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <span className="relative inline-flex w-2 h-2">
                  {!reduce && (
                    <span className="absolute inset-0 rounded-full bg-ribbon-gold animate-ping opacity-70" />
                  )}
                  <span className="relative rounded-full w-2 h-2 bg-ribbon-gold" />
                </span>
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/95">
                  Cycle {currentCycleStats.cycle}, live
                </span>
                <span className="hidden sm:inline text-white/30" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs text-white/75 font-mono">
                  {currentCycleStats.totalPlacementOffers} offers ·{' '}
                  {currentCycleStats.totalInternshipOffers} internships
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gold hairline sealing the photo region into the band below. */}
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

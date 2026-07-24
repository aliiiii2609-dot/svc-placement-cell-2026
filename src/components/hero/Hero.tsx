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

// The building only appears toward the bottom; the top stays pure navy.
const BUILDING_MASK =
  'linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,1) 100%)';

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
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 && ' '}
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
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
          style={{
            opacity: 0.24,
            filter: 'saturate(0.5) brightness(0.92) contrast(1.02)',
            WebkitMaskImage: BUILDING_MASK,
            maskImage: BUILDING_MASK,
            transformOrigin: 'center 82%',
          }}
          loading="eager"
          initial={{ scale: reduce ? 1.06 : 1.04 }}
          animate={{ scale: reduce ? 1.06 : 1.12 }}
          transition={
            reduce
              ? undefined
              : { duration: 26, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
          }
        />

        {/* Deep-navy tint — pure navy at the top, translucent through the middle so
            the building peeks softly, and a touch denser at the very bottom to keep
            the CTAs legible and to blend into the band below. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #0a2540 0%, rgba(10,37,64,0.80) 44%, rgba(11,42,78,0.34) 78%, rgba(12,46,84,0.58) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Soft gold bloom rising from the bottom center — quiet institutional warmth. */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none mix-blend-screen"
          style={{
            background:
              'radial-gradient(62% 82% at 50% 102%, rgba(212,168,87,0.14) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Thin inset hairline frame, echoing the cover. */}
        <div
          className="absolute inset-3 sm:inset-5 rounded-[3px] pointer-events-none"
          style={{ border: '1px solid rgba(255,255,255,0.16)' }}
          aria-hidden="true"
        />

        {/* Centered editorial content. Entrances run once, then idle. */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="container-svc w-full">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              {/* Crest lockup */}
              <motion.div {...reveal(0, -8)} className="mb-5 flex flex-col items-center gap-3">
                <span className="inline-flex items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/15 backdrop-blur-md p-2 shadow-lg">
                  <img
                    src="/logos/svc-crest.png"
                    alt="Sri Venkateswara College official seal"
                    className="w-12 h-12 md:w-14 md:h-14 drop-shadow"
                  />
                </span>
                <span className="font-mono text-[10.5px] md:text-[11px] uppercase tracking-[0.18em] text-white/85 leading-[1.6]">
                  Sri Venkateswara College
                  <br />
                  <span className="text-white/55">University of Delhi</span>
                </span>
              </motion.div>

              {/* Eyebrow with symmetric gold hairlines */}
              <motion.div
                {...reveal(0.14)}
                className="mb-6 flex items-center justify-center gap-3"
              >
                <span
                  className="h-px w-8"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212,168,87,0) 0%, rgba(212,168,87,0.9) 100%)',
                  }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.28em] text-ribbon-gold">
                  The Placement Cell
                </span>
                <span
                  className="h-px w-8"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212,168,87,0.9) 0%, rgba(212,168,87,0) 100%)',
                  }}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Headline — calmer, smaller, gold accent on the closing word. */}
              <h1
                className="font-display font-semibold text-white leading-[1.12] tracking-[-0.02em] mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 3.6vw, 3.1rem)',
                  textShadow: '0 1px 24px rgba(3,12,28,0.5)',
                }}
              >
                <WordsCascade
                  text="Where preparation meets opportunity."
                  lastWordClassName="text-ribbon-gold"
                  reduce={reduce}
                />
              </h1>

              {/* Gold divider */}
              <motion.span
                {...reveal(0.9)}
                className="mb-6 block h-px w-12"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(212,168,87,0.85) 50%, transparent 100%)',
                }}
                aria-hidden="true"
              />

              {/* Subtitle */}
              <motion.p
                {...reveal(1.0)}
                className="text-sm md:text-base text-white/80 max-w-xl leading-relaxed mb-8"
              >
                The single point of coordination for placements and internships at Sri
                Venkateswara College, University of Delhi.
              </motion.p>

              {/* CTAs */}
              <motion.div
                {...reveal(1.12)}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
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

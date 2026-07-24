import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { RankingsConstellation } from '@/components/hero/RankingsConstellation';
import { cn } from '@/lib/utils/cn';

/**
 * Hero — an editorial navy + gold photo band.
 *
 * A bright, portrait photograph of the SVC building fills the band edge to edge,
 * framed with object-cover and a tuned focal point so the red-brick facade and the
 * "SRI VENKATESWARA COLLEGE" sign read cleanly at both wide (desktop) and tall
 * (mobile) box shapes. A left-heavy navy scrim (warmed by a faint gold bloom at the
 * lower left) keeps the left-aligned copy at strong contrast while the building
 * stays clearly visible on the right. A thin inset hairline frames the whole band.
 *
 * Content is minimal and left aligned: a gold label, a serif editorial headline with
 * one gold italic accent word, and the two CTAs.
 *
 * Below the photo band: the rankings constellation on its own paper background.
 *
 * Motion (all transform/opacity, gated on useReducedMotion; reduced -> final state):
 *   - a very slow ken-burns drift on the photo (the only ambient loop),
 *   - a single one-time diagonal light sweep on entrance,
 *   - a masked, word-by-word slide-up reveal on the headline,
 *   - gold hairlines that draw in (scaleX) at the label tick and below the headline.
 * Entrances run once on mount, then idle.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const NAVY = '#0a2540';

type HeadlinePiece = { text: string; accent?: boolean };

/**
 * MaskedHeadline — each word sits in its own overflow-hidden clip and slides up
 * from below on entrance. Words are individual inline-block clips so the line wraps
 * naturally at any width (important on phones); the mask carries a little bottom
 * padding so italic descenders are never clipped. Accent words render as gold serif
 * italic. Transform-only, so it stays lag-free.
 */
function MaskedHeadline({
  pieces,
  reduce,
}: {
  pieces: HeadlinePiece[];
  reduce: boolean;
}) {
  const full = pieces.map((p) => p.text).join(' ');
  return (
    <span className="inline" aria-label={full}>
      {pieces.map((piece, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{
            paddingBottom: '0.14em',
            marginRight: i < pieces.length - 1 ? '0.26em' : undefined,
          }}
        >
          <motion.span
            className={cn(
              'inline-block will-change-transform',
              piece.accent && 'italic text-ribbon-gold',
            )}
            initial={reduce ? { y: '0%' } : { y: '118%' }}
            animate={{ y: '0%' }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.34 + i * 0.09, duration: 0.85, ease: EASE }
            }
          >
            {piece.text}
          </motion.span>
        </span>
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
        {/* The building — bright and clearly visible, framed with object-cover and a
            focal point tuned so the facade and sign read well at both wide and tall
            box shapes. Slow ken-burns drift; static when motion is reduced. */}
        <motion.img
          src="/images/campus/svc-building-cover.jpg"
          alt="Sri Venkateswara College main building"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: 'center 42%',
            filter: 'saturate(1.02) brightness(0.9) contrast(1.02)',
            transformOrigin: '38% 45%',
          }}
          loading="eager"
          initial={{ scale: reduce ? 1.04 : 1.03 }}
          animate={{ scale: reduce ? 1.04 : 1.09 }}
          transition={
            reduce
              ? undefined
              : { duration: 28, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
          }
        />

        {/* Left-heavy scrim: deep where the text sits, clearing to the right so the
            building stays clearly visible; a faint warm rise on the far edge. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(100deg, rgba(6,18,38,0.94) 0%, rgba(7,21,43,0.80) 26%, rgba(8,25,49,0.44) 52%, rgba(8,25,49,0.16) 78%, rgba(8,25,49,0.34) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Faint gold bloom at the lower-left — warms the navy where the copy sits
            (brand navy + gold) without lifting the scrim's contrast. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 95% at 2% 100%, rgba(212,168,87,0.14) 0%, rgba(212,168,87,0.05) 34%, transparent 58%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom fade so the band blends into the paper section below. */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(6,18,38,0.74) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* One-time diagonal light sweep on entrance. Transform-only, runs once. */}
        {!reduce && (
          <motion.div
            className="absolute inset-0 z-[5] pointer-events-none will-change-transform"
            style={{
              background:
                'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.10) 50%, transparent 58%)',
            }}
            initial={{ x: '-55%', opacity: 0 }}
            animate={{ x: '65%', opacity: [0, 1, 0] }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}

        {/* Thin inset hairline frame. */}
        <div
          className="absolute inset-3 sm:inset-5 rounded-[3px] pointer-events-none z-[6]"
          style={{ border: '1px solid rgba(255,255,255,0.16)' }}
          aria-hidden="true"
        />

        {/* Content — left aligned, minimal. Entrances run once, then idle. */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-svc w-full">
            <div className="max-w-2xl">
              {/* Label with a gold tick that draws in before it */}
              <motion.div {...reveal(0.12)} className="mb-6 flex items-center gap-3">
                <motion.span
                  className="block h-px w-10 origin-left bg-ribbon-gold will-change-transform"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={reduce ? undefined : { delay: 0.28, duration: 0.7, ease: EASE }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-ribbon-gold">
                  The Placement Cell · Sri Venkateswara College
                </span>
              </motion.div>

              {/* Headline — serif editorial, one gold italic accent word */}
              <h1
                className="font-serif font-normal text-white leading-[1.04] tracking-[-0.005em]"
                style={{
                  fontSize: 'clamp(2.4rem, 5.2vw, 4.35rem)',
                  textShadow: '0 1px 30px rgba(3,12,28,0.55)',
                }}
              >
                <MaskedHeadline
                  pieces={[
                    { text: 'Where' },
                    { text: 'preparation' },
                    { text: 'meets' },
                    { text: 'opportunity.', accent: true },
                  ]}
                  reduce={reduce}
                />
              </h1>

              {/* Gold hairline drawing in below the headline */}
              <motion.div
                className="mt-7 mb-8 h-px w-full max-w-[13rem] origin-left will-change-transform"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(212,168,87,0.85) 0%, rgba(212,168,87,0.28) 55%, transparent 100%)',
                }}
                initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={reduce ? undefined : { delay: 0.95, duration: 0.8, ease: EASE }}
                aria-hidden="true"
              />

              {/* CTAs */}
              <motion.div {...reveal(1.12)} className="flex flex-col sm:flex-row gap-3">
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

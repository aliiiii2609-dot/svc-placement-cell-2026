import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ParticleField } from '@/components/animations/ParticleField';
import { MathBackdrop } from '@/components/hero/MathBackdrop';
import { RankingsConstellation } from '@/components/hero/RankingsConstellation';
import { currentCycleStats } from '@/lib/data/stats';
import { cn } from '@/lib/utils/cn';

/**
 * Hero — full real building photo, no crop. Text starts on the photo.
 *
 * Layering (bottom to top):
 *   1. The real SVC College building photo, displayed at its native 770x434
 *      proportions inside an `object-contain` frame. NEVER cropped.
 *   2. A subtle radial gradient wash over the photo for text legibility.
 *   3. Math/blueprint backdrop layered above the photo at low opacity.
 *   4. Floating particles for designer flair.
 *   5. Content: crest lockup + headline + subhead + CTAs + status chip.
 *
 * Below the photo region: the 4-card rankings constellation with the
 * Marvel/DC cinematic number reveal.
 */

const wordRevealAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.045, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

function WordsCascade({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('inline', className)} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordRevealAnim}
          initial="hidden"
          animate="visible"
          className="inline-block will-change-transform"
          aria-hidden="true"
        >
          {word}
          {i < text.split(' ').length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative overflow-hidden bg-bg"
      aria-label="Hero"
    >
      {/* The actual photo region — covers the upper portion of the hero, no crop */}
      <div className="relative w-full" style={{ aspectRatio: '770 / 434' }}>
        {/* Real building photo, contained not cropped */}
        <motion.img
          src="/images/campus/svc-building.jpg"
          alt="Sri Venkateswara College main building"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ scale: photoScale, y: photoY }}
          loading="eager"
        />

        {/* Subtle vignette wash for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(10, 37, 64, 0.55) 0%, rgba(10, 37, 64, 0.35) 35%, rgba(10, 37, 64, 0.20) 65%, rgba(10, 37, 64, 0.30) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Light math layer over the photo */}
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay">
          <MathBackdrop />
        </div>

        {/* Floating particles on top of the photo */}
        <ParticleField className="z-[4]" count={40} />

        {/* Content overlaid on the photo */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-svc w-full">
            <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-5 inline-flex items-center gap-3"
              >
                <img
                  src="/logos/svc-crest.png"
                  alt=""
                  className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg"
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/85 leading-snug">
                  Sri Venkateswara College
                  <br />
                  University of Delhi
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/90 mb-3"
              >
                The Placement Cell
              </motion.div>

              <h1
                className="font-display font-bold leading-[1.02] tracking-[-0.035em] mb-5 text-white drop-shadow-2xl"
                style={{ fontSize: 'clamp(2rem, 5.4vw, 4.8rem)' }}
              >
                <WordsCascade text="Where preparation" />
                <br />
                <span className="text-white/80">
                  <WordsCascade text="meets opportunity." />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed mb-7"
              >
                The single point of coordination for placements, summer internships, and the annual
                Internship Fair at Sri Venkateswara College, University of Delhi.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                <Button as="a" href="/SVC_Brochure_2025-26.pdf" target="_blank" rel="noopener" size="lg">
                  Download brochure
                </Button>
                <Button as={Link as never} to="/recruiters" size="lg" variant="secondary">
                  Recruiter desk
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/15"
              >
                <span className="relative inline-flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-70" />
                  <span className="relative rounded-full w-2 h-2 bg-white" />
                </span>
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-white/90">
                  Cycle {currentCycleStats.cycle}, live
                </span>
                <span className="text-xs text-white/70 font-mono">
                  {currentCycleStats.totalPlacementOffers} offers ·{' '}
                  {currentCycleStats.totalInternshipOffers} internships
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rankings constellation block sits BELOW the photo on its own background */}
      <div className="bg-bg relative">
        <div className="container-svc py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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

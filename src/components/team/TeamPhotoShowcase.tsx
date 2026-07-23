import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Team photo showcase — the closing editorial moment of the home page.
 *
 * Treatment:
 *   - Full-width frame, 16:10-ish proportions (uses photo native 932:704)
 *   - Outer ambient brand glow
 *   - Top sweeping accent gradient line above the photo
 *   - Bottom vignette with overlaid caption + signature line
 *   - Four corner brackets (Apple keynote staging)
 *   - Scroll parallax: photo slides up gently while scale breathes
 *   - 3-column metadata strip beneath: Photo / Cycle / Composition
 */

export function TeamPhotoShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 1]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-bg"
      id="team-photo"
    >
      {/* Atmospheric corner gradients */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '-5%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(30, 78, 140, 0.10), transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%',
          right: '-5%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.08), transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="container-svc relative">
        {/* Cinematic kicker + headline */}
        <motion.div
          style={{ y: reduced ? 0 : headlineY }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-4xl mb-12 lg:mb-16 text-center mx-auto"
        >
          <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4">
            The cell, 2026-27 · Group portrait
          </div>
          <h2
            className="font-display font-bold leading-[1.02] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)' }}
          >
            <span className="text-ink">One team.</span>{' '}
            <span className="text-ink-3">Behind every drive this cycle.</span>
          </h2>
        </motion.div>

        {/* Photo frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative max-w-7xl mx-auto"
        >
          {/* Ambient glow halo */}
          <div
            className="absolute -inset-12 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(30, 78, 140, 0.20), rgba(255, 107, 157, 0.08), transparent 70%)',
              filter: 'blur(60px)',
            }}
            aria-hidden="true"
          />

          {/* Top sweeping accent rule */}
          <motion.div
            className="absolute -top-3 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(30, 78, 140, 0.8) 30%, rgba(255, 107, 157, 0.8) 70%, transparent)',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            aria-hidden="true"
          />

          {/* The frame */}
          <motion.div
            style={{ y: reduced ? 0 : photoY, scale: reduced ? 1 : photoScale }}
            className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-line/60 bg-bg-2"
          >
            <div className="relative aspect-[932/704]">
              <img
                src="/images/gallery/team-photo-2026.jpg"
                alt="The Placement Cell, Cycle 2026-27, on the SVC campus"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Top accent gradient line on the photo edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(30, 78, 140, 0.7) 25%, rgba(255, 107, 157, 0.7) 75%, transparent)',
                }}
                aria-hidden="true"
              />

              {/* Soft bottom vignette for caption legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10, 37, 64, 0.65), rgba(10, 37, 64, 0.18) 60%, transparent)',
                }}
                aria-hidden="true"
              />

              {/* Bottom overlay caption */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12 flex items-end justify-between text-white gap-5">
                <div>
                  <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] opacity-80 mb-2">
                    Cycle 2026-27 · Council, Coordinators, Faculty Convener
                  </div>
                  <div
                    className="font-display font-bold tracking-tight leading-tight"
                    style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)' }}
                  >
                    Together, on campus.
                  </div>
                </div>
                <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.18em] opacity-70 text-right leading-snug">
                  Sri Venkateswara College
                  <br />
                  University of Delhi
                </div>
              </div>
            </div>
          </motion.div>

          {/* Corner bracket flourishes — Apple keynote staging */}
          {!reduced && (
            <>
              <motion.div
                className="absolute -top-4 -left-4 w-14 h-14 border-l-2 border-t-2 border-accent/45 rounded-tl-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute -top-4 -right-4 w-14 h-14 border-r-2 border-t-2 border-accent/45 rounded-tr-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-14 h-14 border-l-2 border-b-2 border-accent/45 rounded-bl-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-14 h-14 border-r-2 border-b-2 border-accent/45 rounded-br-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
                aria-hidden="true"
              />
            </>
          )}
        </motion.div>

        {/* Metadata strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-14 grid sm:grid-cols-3 gap-6 text-sm"
        >
          <div className="pl-4 border-l-2 border-accent/45">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1.5">
              Captured
            </div>
            <div className="text-ink-2 font-medium">On SVC campus, 2026</div>
          </div>
          <div className="pl-4 border-l-2 border-accent/45">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1.5">
              Cycle
            </div>
            <div className="text-ink-2 font-medium">2026-27</div>
          </div>
          <div className="pl-4 border-l-2 border-accent/45">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1.5">
              Composition
            </div>
            <div className="text-ink-2 font-medium">Council, Coordinators, Faculty Convener</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

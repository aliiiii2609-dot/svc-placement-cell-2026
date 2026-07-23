import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { institutionFacts } from '@/lib/data/stats';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Sri Venkateswara College info section — Phase 2.3 redesign.
 *
 * Composition:
 *   Left column:
 *     - Kicker (mono uppercase)
 *     - Split heading: "Sri Venkateswara College." (Line 1, full display, ink)
 *                      "A constituent college of the University of Delhi,
 *                       established 1961." (Line 2, 55-60% size, ink-2, wraps)
 *     - Hairline rule, 80px from left edge of column
 *     - Body paragraph
 *     - Fact strip: ESTABLISHED 1961 · NAAC A+ · NIRF RANKED N
 *
 *   Right column:
 *     - Small mono image kicker above
 *     - Image with hairline border, 8% cream wash overlay
 *     - Editorial caption: bottom hairline rule, caption left mono uppercase,
 *       image index marker right
 *     - Image is clickable (full image, no "VIEW" hotspot in the middle).
 *       Small "CLICK TO ENLARGE" mono label below caption.
 *
 *   Between columns: vertical hairline rule, full section height, 30% opacity.
 *   Background: static warm gradient wash (cream to slightly warmer cream).
 *
 * Entrance: ~1.8s choreography per Phase 2.3 spec.
 *
 * Reduced motion: all elements visible immediately, no progressive reveals.
 */

function WordReveal({
  text,
  active,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={active ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function CampusBlock() {
  const reduced = useReducedMotion();
  const facts = institutionFacts;

  // 25% viewport trigger for entrance; use whileInView once
  return (
    <section
      className="relative section-spacing border-t border-line overflow-hidden"
      id="campus"
      aria-labelledby="campus-heading"
    >
      {/* Static warm gradient wash background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(245, 232, 210, 0.45), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(232, 220, 200, 0.30), transparent 60%)',
        }}
      />

      <motion.div
        className="container-svc relative"
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {},
        }}
      >
        <div className="relative grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          {/* Connecting vertical hairline between columns */}
          <motion.div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 bottom-0 left-[42%] w-px origin-top"
            style={{ background: 'rgba(10, 37, 64, 0.20)' }}
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={reduced ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: EASE, delay: 1.25 }}
          />

          {/* Left column */}
          <motion.div
            initial={reduced ? false : 'hidden'}
            whileInView={reduced ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
          >
            {/* Kicker */}
            <motion.div
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-4"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              The Placement Cell, on campus
            </motion.div>

            {/* Heading Line 1 */}
            <h2
              id="campus-heading"
              className="font-display font-bold text-ink leading-[1.04] tracking-[-0.028em] mb-3"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
            >
              <WordReveal
                text="Sri Venkateswara College."
                active={!reduced}
                delay={0.18}
                stagger={0.035}
              />
            </h2>

            {/* Heading Line 2 — 55-60% of Line 1 size, ink-2 */}
            <motion.div
              className="font-display text-ink-2 leading-[1.18] tracking-[-0.016em] mb-7 max-w-md"
              style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.9rem)' }}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.62 }}
            >
              A constituent college of the University of Delhi, established 1961.
            </motion.div>

            {/* Hairline rule, 80px from left */}
            <motion.div
              className="h-px bg-ink/20 mb-6 origin-left"
              style={{ width: 80 }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={reduced ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.38, ease: EASE, delay: 0.92 }}
              aria-hidden="true"
            />

            {/* Body paragraph */}
            <motion.div
              className="space-y-3 text-ink-2 text-base leading-relaxed mb-7 max-w-md"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: EASE, delay: 1.05 }}
            >
              <p>
                The Placement Cell operates from the Durgabai Deshmukh Block on
                the first floor. Recruiter visits, on-campus drives, mock
                interviews, and the annual Internship Fair are all coordinated
                here.
              </p>
            </motion.div>

            {/* Fact strip */}
            <motion.div
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-7 max-w-md"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, ease: EASE, delay: 1.3 }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
                Established {facts.foundedYear}
              </span>
              <span className="text-ink-3" aria-hidden="true">·</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
                NAAC {facts.rankings.naacGrade}
              </span>
              <span className="text-ink-3" aria-hidden="true">·</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
                NIRF ranked {facts.rankings.nirf}
              </span>
            </motion.div>

            {/* Address block */}
            <motion.div
              className="flex items-start gap-3 max-w-md"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, ease: EASE, delay: 1.45 }}
            >
              <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <address className="not-italic text-sm text-ink-2 leading-relaxed">
                The Placement Cell Room, First Floor, Durgabai Deshmukh Block
                <br />
                Sri Venkateswara College, Dhaula Kuan, Delhi 110021
              </address>
            </motion.div>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            initial={reduced ? false : 'hidden'}
            whileInView={reduced ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.25 }}
          >
            {/* Image kicker */}
            <motion.div
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-3"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.32, ease: EASE, delay: 0.4 }}
            >
              Campus · established 1961
            </motion.div>

            {/* Image frame */}
            <a
              href="/images/campus/svc-building.jpg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open full-size campus photograph"
              className="group block cursor-zoom-in"
            >
              <motion.div
                className="relative aspect-[16/10] overflow-hidden border border-ink/15"
                initial={reduced ? false : { clipPath: 'inset(100% 0 0 0)' }}
                whileInView={reduced ? undefined : { clipPath: 'inset(0% 0 0 0)' }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.35)' }}
              >
                <img
                  src="/images/campus/svc-building.jpg"
                  alt="Sri Venkateswara College, main building, Dhaula Kuan campus"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* 8% cream wash overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'rgba(245, 232, 210, 0.08)' }}
                />
                {/* Hover hairline overshoot */}
                <motion.div
                  aria-hidden="true"
                  className="absolute -bottom-px left-0 right-0 h-[2px] origin-left opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: '#635bff' }}
                />
              </motion.div>
            </a>

            {/* Editorial caption */}
            <motion.div
              className="mt-3 pt-3 border-t border-ink/15 flex items-baseline justify-between gap-4"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.36, ease: EASE, delay: 1.0 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
                Main building · Dhaula Kuan
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 tabular-nums">
                FIG · 01
              </span>
            </motion.div>

            {/* Click-to-enlarge label */}
            <motion.div
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.32, ease: EASE, delay: 1.18 }}
            >
              Click to enlarge
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

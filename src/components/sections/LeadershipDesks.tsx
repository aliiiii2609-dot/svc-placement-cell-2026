import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * From the leadership — two message desks (Principal, Convener) plus a
 * convener profile. Message cards sit as frosted glass panels with an
 * oversized gold quotation mark; the convener profile carries a portrait
 * that falls back to a gold monogram disc if the image fails to load.
 *
 * All content is verbatim from the brief. No em dashes anywhere.
 */

interface DeskMessage {
  kicker: string;
  quote: string;
  attribution: string;
}

const MESSAGES: DeskMessage[] = [
  {
    kicker: "Principal's Desk",
    quote:
      'Sri Venkateswara College has always strived to equip its students not just with academic excellence but also with the skills, confidence, and networks needed to thrive in their professional journeys. The Placement Cell is a proud reflection of that commitment.',
    attribution: 'Principal, Sri Venkateswara College',
  },
  {
    kicker: "Convener's Desk",
    quote:
      'The Placement Cell is more than a conduit to jobs. It is a platform where students discover their potential, build lasting professional relationships, and take their first confident steps into the world of work.',
    attribution: 'Dr. Abhishek Malhotra, Faculty Convener',
  },
];

function DeskCard({ message, index }: { message: DeskMessage; index: number }) {
  const reduced = useReducedMotion();
  const { kicker, quote, attribution } = message;

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="glass relative flex h-full flex-col rounded-3xl p-7 md:p-9"
    >
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        {kicker}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none select-none font-serif leading-[0.7] text-gold"
        style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)' }}
      >
        &ldquo;
      </span>

      <blockquote className="-mt-3 max-w-prose text-pretty font-serif text-lg leading-relaxed text-ink md:text-xl md:leading-relaxed">
        {quote}
      </blockquote>

      <figcaption className="mt-6 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
        {attribution}
      </figcaption>
    </motion.figure>
  );
}

function ConvenerProfile() {
  const reduced = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      className="glass mt-6 flex flex-col items-start gap-6 rounded-3xl p-7 sm:flex-row sm:items-center md:mt-8 md:gap-8 md:p-9"
    >
      <div className="flex-shrink-0">
        {imgFailed ? (
          <div
            aria-label="Dr. Abhishek Malhotra"
            role="img"
            className="flex h-24 w-24 items-center justify-center rounded-2xl font-display text-2xl font-semibold tracking-tight text-gold md:h-28 md:w-28"
            style={{
              background: 'rgb(var(--gold) / 0.12)',
              border: '1px solid rgb(var(--gold) / 0.30)',
            }}
          >
            AM
          </div>
        ) : (
          <img
            src="/images/convener/abhishek-malhotra.jpg"
            alt="Dr. Abhishek Malhotra"
            width={112}
            height={112}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-24 w-24 rounded-2xl object-cover md:h-28 md:w-28"
            style={{ border: '1px solid rgb(var(--gold) / 0.30)' }}
          />
        )}
      </div>

      <div className="max-w-2xl">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
          Dr. Abhishek Malhotra
        </h3>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          Faculty Convener
        </div>
        <div className="mt-1 text-sm text-ink-2">
          Assistant Professor, Department of Economics
        </div>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-2">
          Dr. Malhotra provides faculty oversight and mentorship to the Placement
          Cell, guiding the student leadership in building industry partnerships and
          creating enriching career opportunities for students across all departments.
        </p>
      </div>
    </motion.div>
  );
}

export function LeadershipDesks() {
  const reduced = useReducedMotion();

  return (
    <section className="section-spacing border-t border-line">
      <div className="container-svc">
        <div className="mb-10 max-w-2xl md:mb-12">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-accent"
          >
            From the leadership
          </motion.div>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="display-italic text-balance font-display font-bold leading-tight tracking-tight text-ink"
            style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)' }}
          >
            Two desks, one <em>mandate.</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {MESSAGES.map((m, i) => (
            <DeskCard key={m.kicker} message={m} index={i} />
          ))}
        </div>

        <ConvenerProfile />
      </div>
    </section>
  );
}

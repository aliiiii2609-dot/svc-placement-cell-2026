import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * From the leadership — two refined portrait cards (Principal, Convener).
 * Each is a frosted glass panel carrying a strong portrait, an oversized
 * gold quotation mark, the verbatim message, and the name/role line.
 * Portraits fall back to a gold monogram disc if the image fails to load.
 *
 * All content is verbatim from the brief. No em dashes anywhere.
 */

interface Leader {
  name: string;
  role: string;
  detail?: string;
  quote: string;
  photo: string;
  monogram: string;
}

const LEADERS: Leader[] = [
  {
    name: 'Prof. Vajala Ravi',
    role: 'Principal, Sri Venkateswara College',
    quote:
      'Sri Venkateswara College has always strived to equip its students not just with academic excellence but also with the skills, confidence, and networks needed to thrive in their professional journeys. The Placement Cell is a proud reflection of that commitment.',
    photo: '/images/principal/vajala-ravi.jpg',
    monogram: 'VR',
  },
  {
    name: 'Dr. Abhishek Malhotra',
    role: 'Convener, The Placement Cell',
    detail: 'Assistant Professor, Department of Economics',
    quote:
      'The Placement Cell is more than a conduit to jobs. It is a platform where students discover their potential, build lasting professional relationships, and take their first confident steps into the world of work.',
    photo: '/images/convener/abhishek-malhotra.jpg',
    monogram: 'AM',
  },
];

function Portrait({ src, alt, monogram }: { src: string; alt: string; monogram: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl font-display text-xl font-semibold tracking-tight text-gold sm:h-24 sm:w-24 sm:text-2xl"
        style={{
          background: 'rgb(var(--gold) / 0.12)',
          border: '1px solid rgb(var(--gold) / 0.30)',
        }}
      >
        {monogram}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={96}
      height={96}
     
      onError={() => setFailed(true)}
      className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover object-top sm:h-24 sm:w-24"
      style={{ border: '1px solid rgb(var(--gold) / 0.30)' }}
    />
  );
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const reduced = useReducedMotion();
  const { name, role, detail, quote, photo, monogram } = leader;

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-9"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-3 select-none font-serif leading-none text-gold/25"
        style={{ fontSize: 'clamp(4rem, 7vw, 6rem)' }}
      >
        &rdquo;
      </span>

      <blockquote className="relative max-w-prose text-pretty font-serif text-lg leading-relaxed text-ink md:text-xl md:leading-relaxed">
        {quote}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-4 border-t border-line pt-6 md:gap-5">
        <Portrait src={photo} alt={name} monogram={monogram} />
        <div className="min-w-0">
          <div className="font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
            {name}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {role}
          </div>
          {detail ? (
            <div className="mt-1 text-sm text-ink-2">{detail}</div>
          ) : null}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function LeadershipDesks() {
  const reduced = useReducedMotion();

  return (
    <section className="section-spacing border-t border-line">
      <div className="container-svc">
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mb-8 font-mono text-[12px] uppercase tracking-[0.16em] text-accent md:mb-10"
        >
          From the leadership
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {LEADERS.map((leader, i) => (
            <LeaderCard key={leader.name} leader={leader} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

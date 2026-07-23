import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RecruiterInterestForm } from '@/components/forms/RecruiterInterestForm';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Recruiter interest — glass 3D form panel.
 *
 * The right column is a glass-morphic surface that:
 *   - tracks the pointer with a soft cursor glow,
 *   - tilts subtly in 3D space (rotateX/Y ~6deg max),
 *   - has a brand-gradient sweep across the top edge,
 *   - sits over an ambient particle field.
 *
 * Linear / Stripe / Vercel form pattern, scaled to fit the editorial rhythm
 * of the rest of the page. Form internals are unchanged.
 */

function ParticleField() {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    left: (i * 71) % 100,
    top: (i * 37) % 100,
    size: 2 + (i % 4),
    delay: (i * 0.42) % 8,
    duration: 8 + (i % 5),
    color: ['#1e4e8c', '#b8893b', '#b8893b', '#1e4e8c', '#7fd9c1'][i % 5],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.35,
            boxShadow: `0 0 8px ${p.color}55`,
          }}
          animate={{ y: [0, -28, 0], x: [0, 8, -4, 0], opacity: [0.18, 0.5, 0.18] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function GlassFormPanel({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const ry = ((x - cx) / cx) * 4;
    const rx = -((y - cy) / cy) * 4;
    setTilt({ rx, ry });
    setCursor({ x, y });
  };
  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setCursor(null);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
      style={{
        transformStyle: 'preserve-3d',
        transform: reduced
          ? undefined
          : `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className="relative"
    >
      {/* Outer ambient brand glow */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(30, 78, 140, 0.22), transparent 60%), radial-gradient(ellipse at 70% 100%, rgba(255, 107, 157, 0.18), transparent 60%)',
          filter: 'blur(32px)',
        }}
        aria-hidden="true"
      />

      {/* Glass surface */}
      <div
        className="relative bg-surface/75 backdrop-blur-xl border border-line rounded-3xl overflow-hidden shadow-soft-lg"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Top brand sweep */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, #1e4e8c, #b8893b, #b8893b, transparent)',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3.2, ease: EASE, repeat: Infinity, repeatDelay: 0.5 }}
        />

        {/* Cursor-follow glow */}
        {!reduced && cursor && (
          <div
            aria-hidden="true"
            className="absolute pointer-events-none rounded-full"
            style={{
              left: cursor.x - 160,
              top: cursor.y - 160,
              width: 320,
              height: 320,
              background:
                'radial-gradient(circle, rgba(30, 78, 140, 0.18), transparent 70%)',
              filter: 'blur(24px)',
            }}
          />
        )}

        {/* Inner top accent badge */}
        <div className="relative px-7 md:px-9 pt-7 md:pt-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full animate-ping opacity-70 bg-accent" />
              <span className="relative w-2 h-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
              Live · the cell desk
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            Step 1 of 1
          </div>
        </div>

        {/* The form */}
        <div className="relative p-7 md:p-9 pt-6 md:pt-7">
          <RecruiterInterestForm />
        </div>
      </div>
    </motion.div>
  );
}

export function HomeRecruiterInterest() {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative section-spacing overflow-hidden bg-bg border-t border-line"
      id="recruiter-interest"
    >
      {/* Atmospheric backing */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '-15%',
          width: '50%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(30, 78, 140, 0.10), transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '0%',
          right: '-10%',
          width: '45%',
          height: '65%',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.08), transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      {!reduced && <ParticleField />}

      <div className="container-svc relative">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Editorial copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent mb-4">
              Recruiter interest · zero friction
            </div>
            <h2
              className="font-display font-bold leading-[1.04] tracking-[-0.028em] mb-5"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
            >
              <span className="text-ink">Bring a role to Venky.</span>{' '}
              <span className="text-ink-3">
                A coordinator replies within three working days.
              </span>
            </h2>

            <ul className="space-y-3 text-ink-2 text-[15px] leading-relaxed max-w-md">
              {[
                'Share role, eligibility, location, headcount, and timeline.',
                'The cell assigns a dedicated coordinator for the drive.',
                'Published schedule, verified CVs, drive logistics handled end-to-end.',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="block flex-shrink-0 mt-2 h-px"
                    style={{ width: 16, background: '#1e4e8c' }}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-line max-w-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1.5">
                Or write to us directly
              </div>
              <a
                href="mailto:placement@svc.ac.in"
                className="font-display font-semibold text-lg text-accent hover:text-accent-deep transition-colors"
              >
                placement@svc.ac.in
              </a>
            </div>

            <div className="mt-8">
              <Link
                to="/recruiters"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:text-accent-deep transition-colors"
              >
                Recruiter directory and full brief →
              </Link>
            </div>
          </motion.div>

          {/* Glass form panel */}
          <GlassFormPanel reduced={reduced} />
        </div>
      </div>
    </section>
  );
}

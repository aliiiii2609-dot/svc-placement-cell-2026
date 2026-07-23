import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, GraduationCap, Building2 } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Audience cards — three doors into the cell, one per audience.
 *
 * Each card is a rich, animated tile with:
 *   - Oversized numeral as backdrop graphic
 *   - Lucide icon at top with brand-color halo
 *   - Kicker + title + body
 *   - Three sub-points listed beneath
 *   - "Open" arrow button at bottom-right that animates on hover
 *   - Cursor-follow spotlight gradient
 *   - Magnetic lift on hover
 *
 * All three cards use react-router Link, so navigation works regardless
 * of overlay layers.
 */

interface AudienceCard {
  num: string;
  title: string;
  kicker: string;
  body: string;
  points: string[];
  to: string;
  brandColor: string;
  Icon: typeof Users;
}

const CARDS: AudienceCard[] = [
  {
    num: '01',
    title: 'Recruiters',
    kicker: 'For employers',
    body: 'Published cycle calendar. Stream and CGPA filters. JD to shortlist in 96 hours.',
    points: [
      'Run a campus drive',
      'Brief our coordinators',
      'Track shortlists in dashboard',
    ],
    to: '/recruiters',
    brandColor: '#1e4e8c',
    Icon: Building2,
  },
  {
    num: '02',
    title: 'Students',
    kicker: 'For applicants',
    body: 'Open drives, eligibility filters, stored CV, mock interviews, aptitude practice.',
    points: [
      'Browse live drives',
      'Submit CV for vetting',
      'Book a mock interview',
    ],
    to: '/students/portal',
    brandColor: '#b8893b',
    Icon: GraduationCap,
  },
  {
    num: '03',
    title: 'Alumni',
    kicker: 'For graduates',
    body: 'Update your profile, mentor a student, attend the IFair, contribute to the directory.',
    points: [
      'Update your profile',
      'Mentor a current student',
      'Attend the Internship Fair',
    ],
    to: '/alumni',
    brandColor: '#b8893b',
    Icon: Users,
  },
];

function AudienceCardTile({ card, index }: { card: AudienceCard; index: number }) {
  const { num, title, kicker, body, points, to, brandColor, Icon } = card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
    >
      <Link
        to={to}
        className="group relative block h-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(10, 37, 64, 0.08)',
          borderRadius: 16,
          transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = `0 32px 60px -28px ${brandColor}55, 0 8px 16px -8px rgba(10, 37, 64, 0.12)`;
          e.currentTarget.style.borderColor = `${brandColor}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px -16px rgba(10, 37, 64, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(10, 37, 64, 0.08)';
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
          e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        aria-label={`Open ${title} section`}
      >
        {/* Cursor-follow spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), ${brandColor}1c, transparent 50%)`,
          }}
        />

        {/* Brand-color top stripe (animates wider on hover) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[3px] transition-all duration-700 group-hover:w-full"
          style={{ background: brandColor, width: '32%' }}
        />

        {/* Oversized numeral backdrop */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none select-none font-display font-bold leading-none transition-opacity duration-500 group-hover:opacity-100"
          style={{
            top: -12,
            right: -8,
            fontSize: 'clamp(7rem, 14vw, 11rem)',
            color: brandColor,
            opacity: 0.06,
            letterSpacing: '-0.06em',
          }}
        >
          {num}
        </div>

        <div className="relative p-7 md:p-8 lg:p-9 h-full flex flex-col">
          {/* Icon + kicker row */}
          <div className="flex items-center justify-between mb-6 md:mb-7">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: `${brandColor}14`,
                border: `1px solid ${brandColor}30`,
                color: brandColor,
              }}
            >
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                {num} · {kicker}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-ink leading-tight tracking-tight mb-3"
            style={{ fontSize: 'clamp(1.5rem, 2.4vw, 1.875rem)' }}
          >
            {title}
          </h3>

          {/* Body */}
          <p className="text-sm md:text-[14.5px] text-ink-2 leading-relaxed mb-5 md:mb-6">
            {body}
          </p>

          {/* Sub-points list */}
          <ul className="flex flex-col gap-2 mb-6 md:mb-7 flex-1">
            {points.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[13px] text-ink-2">
                <span
                  aria-hidden="true"
                  className="block w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: brandColor, opacity: 0.7 }}
                />
                {p}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div
            className="flex items-center justify-between pt-4 border-t transition-colors duration-400 group-hover:border-current"
            style={{ borderColor: 'rgba(10, 37, 64, 0.10)' }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-2 transition-colors duration-300 group-hover:text-ink">
              Open
            </span>
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 group-hover:scale-110"
              style={{
                background: `${brandColor}10`,
                color: brandColor,
                border: `1px solid ${brandColor}25`,
              }}
            >
              <ArrowUpRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function AudienceCards() {
  return (
    <section className="section-spacing border-t border-line" id="audiences">
      <div className="container-svc">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent mb-3"
          >
            Three doors
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-display font-bold text-ink leading-tight tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)' }}
          >
            Pick the one that fits.
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CARDS.map((c, i) => (
            <AudienceCardTile key={c.num} card={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

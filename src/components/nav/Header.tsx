import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, Download, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * Floating glass navigation.
 *
 * The bar is `fixed` and inset from the screen edges so it reads as a frosted
 * pane hovering over the paper, not a full-width slab. Its total top footprint
 * (top padding + bar height) is kept under 72px on purpose: <main> uses
 * pt-[72px] and anchor scrolling assumes a 72px header (see SectionSlider's
 * HEADER_OFFSET), so the content must never hide behind the bar.
 *
 * `children` renders as a dropdown on desktop and an expanded list on mobile.
 * A group's `to` is a real page, not a dead parent, so clicking the label
 * always goes somewhere. Children may be internal routes, download links, or
 * external links.
 */
export interface NavChild {
  to?: string;
  href?: string;
  download?: string;
  external?: boolean;
  label: string;
  hint?: string;
}
export interface NavGroup {
  to: string;
  label: string;
  end?: boolean;
  prominent?: boolean;
  children?: NavChild[];
}

const SVC_OFFICIAL_URL = 'https://www.svc.ac.in/';
const BROCHURE_HREF = '/Recruitment-Brochure-SVC-2026-27.pdf';
const BROCHURE_FILE = 'Recruitment Brochure SVC 2026-27.pdf';
const POLICY_HREF = '/Placement-Policy-SVC-2026-27.pdf';
const POLICY_FILE = 'Placement Policy SVC 2026-27.pdf';

const navItems: NavGroup[] = [
  { to: '/', label: 'Home', end: true },
  {
    // Recruit at Venky: the second page of the site, kept most prominent.
    to: '/recruiters',
    label: 'Recruiters',
    prominent: true,
    children: [
      { to: '/recruiters', label: 'Recruiter desk', hint: 'Process, past recruiters, express interest' },
      { to: '/partnerships', label: 'Partnerships', hint: 'Longer-term engagement with the cell' },
      { to: '/recruiters/dashboard', label: 'Partner dashboard', hint: 'For firms already in a cycle' },
    ],
  },
  {
    to: '/students/portal',
    label: 'Students',
    children: [
      { to: '/students/portal', label: 'Student portal', hint: 'Start here' },
      { to: '/resources', label: 'Resources', hint: 'Guides, formats, prep material' },
      { href: POLICY_HREF, download: POLICY_FILE, label: 'Placement policy', hint: 'Download the 2026-27 policy (PDF)' },
    ],
  },
  {
    to: '/alumni',
    label: 'Alumni',
    children: [
      { to: '/alumni', label: 'Alumni directory', hint: 'Search by course, sector, year' },
      { to: '/alumni#register', label: 'Register or update', hint: 'Add yourself to the directory' },
    ],
  },
  {
    to: '/college',
    label: 'The College',
    children: [
      { to: '/college', label: 'About the college', hint: 'Courses, campus, student life' },
      { to: '/team', label: 'The team', hint: 'Convener, core team, coordinators' },
      { to: '/rankings-press', label: 'Rankings and press', hint: 'NIRF, NAAC, and coverage' },
      { href: SVC_OFFICIAL_URL, external: true, label: 'Official college site', hint: 'svc.ac.in' },
    ],
  },
  {
    to: '/events',
    label: 'Happenings',
    children: [
      { to: '/events', label: 'Events', hint: 'Drives, workshops, the Internship Fair' },
      { to: '/news', label: 'News', hint: 'Announcements from the cell' },
    ],
  },
  { to: '/faq', label: 'FAQ' },
];

/** Anchor attributes for a download or external child link. */
function childAnchorProps(c: NavChild) {
  if (c.download) return { href: c.href, download: c.download } as const;
  return { href: c.href, target: '_blank', rel: 'noopener noreferrer' } as const;
}

/** One dropdown row, shared by the desktop panel. */
function DropdownChild({ c, open }: { c: NavChild; open: boolean }) {
  const inner = (
    <>
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink group-hover/item:text-accent transition-colors">
        {c.label}
        {c.download && <Download size={12} className="text-ink-3 group-hover/item:text-accent" aria-hidden="true" />}
        {c.external && <ArrowUpRight size={12} className="text-ink-3 group-hover/item:text-accent" aria-hidden="true" />}
      </div>
      {c.hint && <div className="text-[11px] text-ink-3 mt-0.5 leading-snug">{c.hint}</div>}
    </>
  );
  const className = 'block rounded-xl px-3 py-2.5 hover:bg-accent-soft transition-colors duration-200 group/item';
  if (c.to) {
    return (
      <Link to={c.to} className={className} tabIndex={open ? 0 : -1}>
        {inner}
      </Link>
    );
  }
  return (
    <a {...childAnchorProps(c)} className={className} tabIndex={open ? 0 : -1}>
      {inner}
    </a>
  );
}

/**
 * One top-level nav entry. Renders a dropdown when the group has children.
 *
 * Opens on hover AND on focus, and the panel stays in the DOM while focus is
 * inside it, so the menu is usable by keyboard and not only by mouse.
 */
function NavDesktopItem({ item }: { item: NavGroup }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Small grace period: without it, the diagonal mouse path from the label to
  // the panel crosses dead space and snaps the menu shut.
  const closeSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const label = (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'text-sm transition-colors duration-300 hover:text-accent relative py-1 group inline-flex items-center gap-1.5',
          isActive || item.prominent ? 'text-accent font-medium' : 'text-ink-2',
        )
      }
    >
      {({ isActive }) => (
        <>
          {item.prominent && <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />}
          {item.label}
          {item.children && (
            <ChevronDown
              size={13}
              className={cn('transition-transform duration-300', open && 'rotate-180')}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              'absolute -bottom-0.5 left-0 right-0 h-px bg-accent origin-left transition-transform duration-500',
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
            )}
          />
        </>
      )}
    </NavLink>
  );

  if (!item.children) return label;

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={closeSoon}
    >
      {label}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none',
        )}
      >
        <div className="w-[292px] bg-surface/95 backdrop-blur-xl border border-line rounded-2xl shadow-soft-lg p-2">
          {item.children.map((c, i) => (
            <DropdownChild key={`${c.to ?? c.href}-${i}`} c={c} open={open} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Shared button shells: glass icon, gold-tinged secondary, navy primary. No purple.
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const iconBtn = cn(
  'inline-flex items-center justify-center w-9 h-9 rounded-full border border-line bg-surface/50 text-ink-2',
  'hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300',
  focusRing,
);
const secondaryBtn = cn(
  'inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium text-ink',
  'border border-line bg-surface/50 hover:border-gold hover:text-gold-deep hover:bg-gold-soft',
  'active:scale-[0.98] transition-all duration-300',
  focusRing,
);
const primaryBtn = cn(
  'inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium text-white bg-accent',
  'hover:bg-accent-deep active:scale-[0.98] transition-all duration-300',
  'shadow-[0_6px_18px_-8px_rgba(10,37,64,0.55)]',
  focusRing,
);

type Props = { onSearchOpen: () => void };

export function Header({ onSearchOpen }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    // Wrapper spans the top but stays click-through in its transparent margins;
    // only the bar and menu capture pointer events. pt-2.5 + h-[52px] bar keeps
    // the total footprint (~62px) under the 72px content offset.
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-3 pt-2.5 sm:px-4">
      <div
        className={cn(
          'pointer-events-auto mx-auto max-w-6xl rounded-2xl border transition-all duration-500',
          'bg-surface/70 backdrop-blur-xl',
          scrolled
            ? 'border-line-2 bg-surface/85 shadow-soft-lg'
            : 'border-line shadow-soft',
        )}
      >
        <div className="flex items-center justify-between h-[52px] pl-3 pr-2 sm:pl-4 sm:pr-3">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="The Placement Cell, SVC home">
            <img
              src="/logos/svc-crest-nav.png"
              alt="Sri Venkateswara College crest"
              className="w-9 h-9 transition-transform duration-700 group-hover:rotate-[8deg]"
            />
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-[15px] text-ink whitespace-nowrap">Sri Venkateswara</div>
              <div className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-accent whitespace-nowrap">Placement Cell, DU</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((it) => (
              <NavDesktopItem key={it.label} item={it} />
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <button onClick={onSearchOpen} className={cn(iconBtn, 'hidden sm:inline-flex')} aria-label="Open search">
              <Search size={15} />
            </button>
            <a
              href={BROCHURE_HREF}
              download={BROCHURE_FILE}
              className={cn(secondaryBtn, 'hidden md:inline-flex')}
            >
              <Download size={14} aria-hidden="true" />
              Brochure
            </a>
            <Link to="/recruiters" className={cn(primaryBtn, 'hidden sm:inline-flex')}>
              Recruit with us
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className={cn(iconBtn, 'w-10 h-10 lg:hidden')}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="pointer-events-auto mx-auto max-w-6xl mt-2 lg:hidden">
          <div className="rounded-2xl border border-line bg-surface/90 backdrop-blur-2xl shadow-soft-lg overflow-hidden">
            <nav className="max-h-[calc(100vh-96px)] overflow-y-auto px-3 py-2 flex flex-col">
              {/* Groups render expanded rather than as accordions. There are only
                  six of them, and an accordion here would mean two taps to reach
                  any page plus a guess about which group holds it. */}
              {navItems.map((it) => (
                <div key={it.label} className="border-b border-line/50 py-1.5 last:border-0">
                  <NavLink
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 min-h-[44px] text-[15px] font-medium',
                        isActive || it.prominent ? 'text-accent' : 'text-ink',
                      )
                    }
                  >
                    {it.prominent && <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />}
                    {it.label}
                  </NavLink>
                  {it.children && (
                    <div className="flex flex-col">
                      {it.children.map((c, i) => {
                        const cls = ({ isActive }: { isActive: boolean }) =>
                          cn(
                            'flex items-center gap-1.5 min-h-[44px] text-sm pl-3 border-l',
                            isActive ? 'text-accent border-accent' : 'text-ink-3 border-line',
                          );
                        if (c.to) {
                          return (
                            <NavLink key={`${c.to}-${i}`} to={c.to} className={cls}>
                              {c.label}
                            </NavLink>
                          );
                        }
                        return (
                          <a
                            key={`${c.href}-${i}`}
                            {...childAnchorProps(c)}
                            className="flex items-center gap-1.5 min-h-[44px] text-sm pl-3 border-l border-line text-ink-3"
                          >
                            {c.label}
                            {c.download && <Download size={13} aria-hidden="true" />}
                            {c.external && <ArrowUpRight size={13} aria-hidden="true" />}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 pt-3 pb-2">
                <Link to="/recruiters" className={cn(primaryBtn, 'h-11 w-full')}>
                  Recruit with us
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <a href={BROCHURE_HREF} download={BROCHURE_FILE} className={cn(secondaryBtn, 'h-11 w-full')}>
                    <Download size={14} aria-hidden="true" />
                    Brochure
                  </a>
                  <a href={POLICY_HREF} download={POLICY_FILE} className={cn(secondaryBtn, 'h-11 w-full')}>
                    <Download size={14} aria-hidden="true" />
                    Policy
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={onSearchOpen} className={cn(iconBtn, 'w-11 h-11')} aria-label="Open search">
                    <Search size={16} />
                  </button>
                  <ThemeToggle className="w-11 h-11" />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

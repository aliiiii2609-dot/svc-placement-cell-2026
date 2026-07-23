import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * Navigation.
 *
 * The site has 20 routes. The old flat bar exposed 7 of them, so /partnerships,
 * /resources, /rankings-press, /students/cv-builder, /students/cv-review and
 * /students/mock-interviews were reachable only by luck or by a stray inline
 * link. Meanwhile the home page tried to compensate by putting everything on
 * itself, which is how it ended up 22 sections long.
 *
 * Grouping by audience fixes both ends of that: the pages become findable, so
 * the home page no longer has to carry them.
 *
 * `children` renders as a dropdown on desktop and an expanded list on mobile.
 * A group's `to` is a real page, not a dead parent, so clicking the label
 * always goes somewhere.
 */
export interface NavChild {
  to: string;
  label: string;
  hint?: string;
}
export interface NavGroup {
  to: string;
  label: string;
  end?: boolean;
  children?: NavChild[];
}

const navItems: NavGroup[] = [
  { to: '/', label: 'Home', end: true },
  {
    to: '/recruiters',
    label: 'Recruiters',
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
      { to: '/students/cv-builder', label: 'CV builder', hint: 'Guided form, exports to PDF or Word' },
      { to: '/students/cv-review', label: 'CV review queue', hint: 'Submit for coordinator review' },
      { to: '/students/mock-interviews', label: 'Mock interviews', hint: 'Book a slot with alumni' },
      { to: '/resources', label: 'Resources', hint: 'Guides, formats, prep material' },
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

const SVC_OFFICIAL_URL = 'https://www.svc.ac.in/';

/**
 * One top-level nav entry. Renders a dropdown when the group has children.
 *
 * Opens on hover AND on focus, and the panel stays in the DOM while focus is
 * inside it, so the menu is usable by keyboard and not only by mouse. A
 * hover-only dropdown is a common way to make a third of a site unreachable
 * without a pointing device.
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
          'text-sm transition-colors duration-300 hover:text-accent relative py-1 group inline-flex items-center gap-1',
          isActive ? 'text-accent' : 'text-ink-2',
        )
      }
    >
      {({ isActive }) => (
        <>
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
        <div className="w-[292px] bg-surface border border-line rounded-2xl shadow-soft-lg p-2">
          {item.children.map((c, i) => (
            <Link
              key={`${c.to}-${i}`}
              to={c.to}
              className="block rounded-xl px-3 py-2.5 hover:bg-accent-soft transition-colors duration-200 group/item"
              tabIndex={open ? 0 : -1}
            >
              <div className="text-[13px] font-medium text-ink group-hover/item:text-accent transition-colors">
                {c.label}
              </div>
              {c.hint && <div className="text-[11px] text-ink-3 mt-0.5 leading-snug">{c.hint}</div>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-bg/90 backdrop-blur-xl border-b border-line shadow-[0_1px_20px_-10px_rgba(26,20,16,0.1)]'
          : 'bg-transparent',
      )}
    >
      <div className="container-svc flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-3 group" aria-label="The Placement Cell, SVC home">
          <img
            src="/logos/svc-crest-nav.png"
            alt="Sri Venkateswara College crest"
            className="w-11 h-11 transition-transform duration-700 group-hover:rotate-[8deg]"
          />
          <div className="leading-tight">
            <div className="font-display text-base text-ink">Sri Venkateswara</div>
            <div className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-accent">Placement Cell, DU</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((it) => (
            <NavDesktopItem key={it.label} item={it} />
          ))}
          <a
            href={SVC_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-2 hover:text-accent transition-colors duration-300 inline-flex items-center gap-1"
            aria-label="Visit the official Sri Venkateswara College website"
          >
            College site
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <button
            onClick={onSearchOpen}
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-line hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300"
            aria-label="Open search"
          >
            <Search size={15} />
          </button>
          <Link
            to="/students/cv-builder"
            className="hidden md:inline-flex items-center gap-1.5 px-4 h-10 rounded-full border border-accent/30 bg-accent/8 text-accent text-[13px] font-medium hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
          >
            <FileText size={13} strokeWidth={2} />
            CV Builder
          </Link>
          <Button
            as="a"
            href="/SVC_Brochure_2025-26.pdf"
            target="_blank"
            rel="noopener"
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex"
          >
            Brochure
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full border border-line"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-bg/97 backdrop-blur-xl">
          <nav className="container-svc py-6 flex flex-col gap-1 max-h-[calc(100vh-140px)] overflow-y-auto">
            {/* Groups render expanded rather than as accordions. There are only
                six of them, and an accordion here would mean two taps to reach
                any page plus a guess about which group holds it. */}
            {navItems.map((it) => (
              <div key={it.label} className="border-b border-line/50 py-2">
                <NavLink
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) =>
                    cn(
                      'text-base font-medium block py-1',
                      isActive ? 'text-accent' : 'text-ink',
                    )
                  }
                >
                  {it.label}
                </NavLink>
                {it.children && (
                  <div className="mt-1 flex flex-col">
                    {it.children.map((c, i) => (
                      <NavLink
                        key={`${c.to}-${i}`}
                        to={c.to}
                        className={({ isActive }) =>
                          cn(
                            'text-sm py-1.5 pl-3 border-l border-line',
                            isActive ? 'text-accent border-accent' : 'text-ink-3',
                          )
                        }
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink
              to="/students/cv-builder"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-white text-base font-medium self-start"
            >
              <FileText size={14} strokeWidth={2} />
              CV Builder
            </NavLink>
            <a
              href={SVC_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base py-2 text-ink-2 hover:text-accent inline-flex items-center gap-1.5"
            >
              College site
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

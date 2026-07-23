import { Component, Suspense, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Header } from '@/components/nav/Header';
import { ScrollToTop } from '@/components/utils/ScrollToTop';
import { Footer } from '@/components/footer/Footer';
import { CinematicLoader } from '@/components/ui/CinematicLoader';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { PageTransition } from '@/components/animations/PageTransition';
import { useLenis } from '@/lib/animations/lenis';
import { sound } from '@/lib/audio/sound-controller';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';

// HomePage stays eager: it is the landing route and lazy-loading it would only
// add a network round trip before first paint. Every other route is split out
// via lazyWithRetry, which handles the stale-chunk-after-deploy failure that
// caused the infinite spinner this file previously blamed on lazy loading
// itself. See src/lib/utils/lazyWithRetry.ts for the full explanation.
import { HomePage } from '@/pages/HomePage';

const AlumniListPage = lazyWithRetry(() => import('@/pages/AlumniListPage').then((m) => ({ default: m.AlumniListPage })));
const AlumniDetailPage = lazyWithRetry(() => import('@/pages/AlumniDetailPage').then((m) => ({ default: m.AlumniDetailPage })));
const CollegePage = lazyWithRetry(() => import('@/pages/CollegePage').then((m) => ({ default: m.CollegePage })));
const TeamPage = lazyWithRetry(() => import('@/pages/TeamPage').then((m) => ({ default: m.TeamPage })));
const RecruitersPage = lazyWithRetry(() => import('@/pages/RecruitersPage').then((m) => ({ default: m.RecruitersPage })));
const RecruiterDashboardPage = lazyWithRetry(() => import('@/pages/RecruiterDashboardPage').then((m) => ({ default: m.RecruiterDashboardPage })));
const StudentPortalPage = lazyWithRetry(() => import('@/pages/StudentPortalPage').then((m) => ({ default: m.StudentPortalPage })));
const CvReviewPage = lazyWithRetry(() => import('@/pages/CvReviewPage').then((m) => ({ default: m.CvReviewPage })));
const MockInterviewsPage = lazyWithRetry(() => import('@/pages/MockInterviewsPage').then((m) => ({ default: m.MockInterviewsPage })));
const EventsPage = lazyWithRetry(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const NewsPage = lazyWithRetry(() => import('@/pages/NewsPage').then((m) => ({ default: m.NewsPage })));
const ResourcesPage = lazyWithRetry(() => import('@/pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })));
const CompanyProfilePage = lazyWithRetry(() => import('@/pages/CompanyProfilePage').then((m) => ({ default: m.CompanyProfilePage })));
const FaqPage = lazyWithRetry(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const RankingsPressPage = lazyWithRetry(() => import('@/pages/RankingsPressPage').then((m) => ({ default: m.RankingsPressPage })));
const PartnershipsPage = lazyWithRetry(() => import('@/pages/PartnershipsPage').then((m) => ({ default: m.PartnershipsPage })));
const PrivacyPage = lazyWithRetry(() => import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazyWithRetry(() => import('@/pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const AdminPage = lazyWithRetry(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/**
 * Route-level fallback. Deliberately a quiet skeleton rather than a spinner:
 * split chunks on a warm cache resolve in tens of milliseconds, and a spinner
 * that flashes for 40ms reads as a glitch.
 */
function RouteFallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center" role="status" aria-label="Loading">
      <div className="h-6 w-6 rounded-full border-2 border-line border-t-accent animate-spin motion-reduce:animate-none" />
    </div>
  );
}

/**
 * App-level error boundary. If any route throws during render, instead of
 * a blank white screen the user sees a recoverable message with a refresh
 * action and a link to the official SVC site as an escape hatch.
 */
class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaces to the console for production debugging without breaking the UI.
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-[70vh] grid place-items-center px-6">
        <div className="max-w-md text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
            Something didn&apos;t render
          </div>
          <h2 className="font-display font-bold text-2xl text-ink mb-3 tracking-tight">
            This page hit a snag.
          </h2>
          <p className="text-ink-2 text-sm leading-relaxed mb-6">
            Refresh to try again. If the issue persists, write to the cell at{' '}
            <a href="mailto:placement@svc.ac.in" className="text-accent hover:underline">
              placement@svc.ac.in
            </a>
            , or visit the official college site.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-medium hover:bg-accent-deep transition-colors text-sm"
            >
              Refresh page
            </button>
            <a
              href="https://www.svc.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-ink hover:border-accent hover:text-accent transition-colors text-sm"
            >
              Official college site →
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTriggerRef = useRef<HTMLElement | null>(null);

  useLenis();

  useEffect(() => {
    sound.loadFromStorage();
    try {
      if (localStorage.getItem('svc-reduced-motion') === '1') {
        document.body.classList.add('reduced-motion');
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  // Close the search modal on Escape and restore focus to whatever opened it.
  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      searchTriggerRef.current?.focus?.();
    };
  }, [searchOpen]);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
      <ToastProvider>
      <a href="#main" className="skip-link">Skip to main content</a>
      <CinematicLoader />

      <Header
        onSearchOpen={() => {
          searchTriggerRef.current = document.activeElement as HTMLElement | null;
          setSearchOpen(true);
        }}
      />

      <main id="main" className="pt-[72px]">
        <AppErrorBoundary>
          <PageTransition>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/alumni" element={<AlumniListPage />} />
              <Route path="/alumni/:id" element={<AlumniDetailPage />} />
              <Route path="/college" element={<CollegePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/recruiters" element={<RecruitersPage />} />
              <Route path="/recruiters/dashboard" element={<RecruiterDashboardPage />} />
              <Route path="/students/portal" element={<StudentPortalPage />} />
              <Route path="/students/cv-review" element={<CvReviewPage />} />
              <Route path="/students/mock-interviews" element={<MockInterviewsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/companies/:slug" element={<CompanyProfilePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/rankings-press" element={<RankingsPressPage />} />
              <Route path="/partnerships" element={<PartnershipsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
          </PageTransition>
        </AppErrorBoundary>
      </main>

      <Footer />

      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[7000] bg-bg/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-surface border border-line rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-2">
              Search
            </div>
            <input
              ref={searchInputRef}
              autoFocus
              aria-label="Search"
              placeholder="Type a recruiter, alumnus, or page..."
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
            />
            <p className="text-xs text-ink-3 mt-4">
              Press Escape to close. Search recruiters, alumni, departments, and pages.
            </p>
          </div>
        </div>
      )}
    </ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}

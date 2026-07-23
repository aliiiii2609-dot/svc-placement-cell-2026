import { Link } from 'react-router-dom';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';
import { PageHeader } from '@/components/sections/PageHeader';

/**
 * The Team.
 *
 * New page. Absorbs the three "people" sections from the home page.
 *
 * These are three different groups, not three views of one group, which is
 * why all three survive the consolidation:
 *   - UnifiedCouncil   Faculty Convener + the six-member core team (team.ts)
 *   - CouncilOrbit     Department heads + coordinators (council.ts, coordinators.ts)
 *   - TeamPhotoShowcase  Archive photographs of the cohort
 *
 * Note: a fourth component, ConvenerBlock, was deleted rather than moved. It
 * rendered the Faculty Convener from the same data and the same portrait that
 * UnifiedCouncil already renders. It was orphaned — no page imported it — and
 * restoring it would have put Dr Malhotra on the page twice.
 */
const UnifiedCouncil = lazyWithRetry(() => import('@/components/council/UnifiedCouncil').then((m) => ({ default: m.UnifiedCouncil })));
const CouncilOrbit = lazyWithRetry(() => import('@/components/council/CouncilOrbit').then((m) => ({ default: m.CouncilOrbit })));
const TeamPhotoShowcase = lazyWithRetry(() => import('@/components/team/TeamPhotoShowcase').then((m) => ({ default: m.TeamPhotoShowcase })));

export function TeamPage() {
  return (
    <>
      <PageHeader
        kicker="The People"
        title="Who runs the cell."
        lede="The Faculty Convener, the core team, the department heads, and the coordinators who run every drive. If you are a recruiter, these are the people who will answer your email."
      />

      <DeferLazy minHeight={900}><UnifiedCouncil /></DeferLazy>
      <DeferLazy minHeight={720}><CouncilOrbit /></DeferLazy>
      <DeferLazy minHeight={560}><TeamPhotoShowcase /></DeferLazy>

      <section className="section-spacing bg-bg-2 border-t border-line">
        <div className="container-svc text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4">
            Reach the desk
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6 text-ink tracking-tight">
            One address, always answered.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:placement@svc.ac.in" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-deep transition-colors text-sm">
              placement@svc.ac.in
            </a>
            <Link to="/partnerships" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-ink hover:border-accent hover:text-accent transition-colors text-sm">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { RecruiterGalaxy } from '@/components/partners/RecruiterGalaxy';
import { HeadlineRecruitersReel } from '@/components/sections/HeadlineRecruitersReel';
import { ProcessRoadmap } from '@/components/roadmap/ProcessRoadmap';
import { RecruiterInterestForm } from '@/components/forms/RecruiterInterestForm';
import { institutionFacts } from '@/lib/data/stats';

/**
 * Recruit at Venky — the recruiters page.
 *
 * Tight, top to bottom:
 *   1. Floating-logo hero (RecruiterGalaxy): the flagship, with headline,
 *      honest aggregate stats, CTAs, and the drifting recruiter logos.
 *   2. Why recruit here: four concrete, data-backed value points.
 *   3. How a drive runs: the published process (ProcessRoadmap).
 *   4. Express interest: the recruiter brief form.
 *
 * Removed vs the old page: the second full-height recruiter logo reel
 * (duplicated the hero constellation) and the cycle-compare table (its
 * headline numbers now live as honest chips in the hero). Every claim below
 * traces to stats.ts or the published process; no invented figures.
 */

const WHY: Array<{ kicker: string; title: string; body: string }> = [
  {
    kicker: 'Ranked institution',
    title: 'A nationally ranked pool',
    body: `NIRF #${institutionFacts.rankings.nirf}, NAAC ${institutionFacts.rankings.naacGrade}, and ${institutionFacts.courses}+ undergraduate courses across commerce, humanities, and the sciences. You hire from a wide, screened base, not a single department.`,
  },
  {
    kicker: 'One point of contact',
    title: 'A coordinator, brief to offer',
    body: 'Every drive gets a dedicated coordinator who runs it on a published calendar, from JD to offer roll-out. One thread, no chasing.',
  },
  {
    kicker: 'Clean shortlists',
    title: 'Verified CVs, honest filters',
    body: 'Applications are filtered on the eligibility you set, stream and CGPA included. CVs arrive in one vetted format, with no padding and no off-brief submissions.',
  },
  {
    kicker: 'On campus',
    title: 'Room to run the drive',
    body: `Seminar halls, AV, and interview rooms at the ${institutionFacts.campus} site. Pre-placement talks, tests, and interviews in one place, on one day.`,
  },
];

const WHAT_YOU_GET = [
  'A dedicated coordinator from brief to offer',
  'On-campus seminar hall, AV, and interview rooms',
  'A verified CV pack in one format, no off-brief submissions',
  'Eligibility filtered on your terms, no padding',
];

export function RecruitersPage() {
  return (
    <>
      <RecruiterGalaxy />

      {/* Why recruit here */}
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="eyebrow">Why recruit here</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 display-italic text-balance">
              A pool worth <em>the trip.</em>
            </h2>
            <p className="text-ink-2 mt-4 leading-relaxed text-pretty">
              Sri Venkateswara College is a South Campus institution with a placement cell
              that runs drives like clockwork. Here is what that means for a recruiter.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="glass p-6 md:p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                  {w.kicker}
                </div>
                <h3 className="font-display text-xl text-ink mb-2 tracking-tight">{w.title}</h3>
                <p className="text-ink-2 text-sm leading-relaxed text-pretty">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiters across recent cycles (2017-18 through 2025-26). */}
      <HeadlineRecruitersReel />

      <ProcessRoadmap />

      {/* Express interest */}
      <section id="interest" className="section-spacing border-b border-line scroll-mt-24">
        <div className="container-svc grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div>
            <span className="eyebrow">Express interest</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-4 display-italic text-balance">
              One brief. <em>One reply.</em>
            </h2>
            <p className="text-ink-2 mb-6 leading-relaxed text-pretty">
              Share your hiring brief. A coordinator replies within one working day with a
              calendar slot and the eligible-student pool size. No spam, no list rental.
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
              What you get
            </div>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {WHAT_YOU_GET.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-gold mt-px">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <RecruiterInterestForm />
        </div>
      </section>
    </>
  );
}

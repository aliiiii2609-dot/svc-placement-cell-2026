import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';
import { SectionSlider, type SliderSection } from '@/components/nav/SectionSlider';

// --- Above the fold. Eager. ---
import { Hero } from '@/components/hero/Hero';
import { RecruiterMarqueeBar } from '@/components/partners/RecruiterMarqueeBar';
import { StatsBar } from '@/components/stats/StatsBar';
import { StudentVoices } from '@/components/sections/StudentVoices';
import { AudienceCards } from '@/components/sections/AudienceCards';

/**
 * Home.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS PAGE IS FOR
 * ---------------------------------------------------------------------------
 * Convince a visitor the cell is real and competent, then route them to the
 * page that answers their actual question. That is all. It is a lobby, not a
 * library.
 *
 * It previously ran 22 sections and roughly 7,000 lines of rendered component
 * code, and it duplicated whole pages:
 *
 *   - ProcessRoadmap (440 lines) rendered here AND on /recruiters
 *   - FaqAccordion rendered here AND on /faq
 *   - HomeRecruiterInterest duplicated the form on /recruiters
 *   - The recruiter list from partners.ts was rendered THREE separate times,
 *     by RecruiterMarqueeBar, RecruiterGalaxy and HeadlineRecruitersReel
 *   - NotableAlumniGrid re-rendered the same people /alumni already lists
 *
 * Sections were moved to the page that owns the subject, not deleted:
 *
 *   CoursesOffered, ExtracurricularExposure,
 *   InitiativesByCell, CampusBlock                  -> /college  (new)
 *   UnifiedCouncil, CouncilOrbit, TeamPhotoShowcase -> /team     (new)
 *   RecruiterGalaxy, HeadlineRecruitersReel         -> /recruiters
 *   HigherEducationSection                          -> /alumni
 *   IFairSection, Gallery                           -> /events
 *   ProcessRoadmap                                  -> /recruiters (already there)
 *   FaqAccordion                                    -> /faq        (already there)
 *
 * Two components were deleted rather than moved, because a page already did
 * their job: NotableAlumniGrid (the /alumni directory already renders
 * notableAlumni, with search and filters) and ConvenerBlock (UnifiedCouncil
 * already renders the Faculty Convener from the same data and portrait).
 *
 * What is left is one recruiter-logo moment, the numbers, one student voice,
 * and the routing cards. Everything below the hero is still code-split and
 * mount-deferred; see components/utils/Defer.tsx.
 *
 * The rule for anyone adding to this page: a section earns its place here only
 * if it helps a first-time visitor decide to trust the cell. Everything else
 * belongs on the page for its subject, with a card in AudienceCards pointing
 * at it.
 */

const CycleDashboard = lazyWithRetry(() => import('@/components/charts/CycleDashboard').then((m) => ({ default: m.CycleDashboard })));

/** Chapter targets for the sticky slider. Ids must match the section ids below. */
const SECTIONS: SliderSection[] = [
  { id: 'proof', label: 'The Numbers' },
  { id: 'voices', label: 'Student Voices' },
  { id: 'where', label: 'Where Next' },
  { id: 'contact', label: 'Contact' },
];

export function HomePage() {
  return (
    <>
      <Hero />
      <RecruiterMarqueeBar />

      {/* Sticky chapter nav. Pins under the header once the hero has passed, so
          the page's shape is legible and every section is one tap away. */}
      <SectionSlider sections={SECTIONS} />

      <section id="proof" className="scroll-mt-[120px]">
        <StatsBar />
        <DeferLazy minHeight={900}>
          <CycleDashboard />
        </DeferLazy>
      </section>

      <section id="voices" className="scroll-mt-[120px]">
        <StudentVoices />
      </section>

      <section id="where" className="scroll-mt-[120px]">
        <AudienceCards />
      </section>

      <section
        id="contact"
        className="section-spacing bg-bg-2 border-t border-line scroll-mt-[120px]"
      >
        <div className="container-svc text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl mb-6 text-ink"
          >
            Talk to the <em className="text-accent">cell.</em>
          </motion.h2>
          <p className="text-ink-2 max-w-xl mx-auto mb-9 text-lg">
            Recruiters, write to the Outreach desk. Alumni, register or refresh your profile.
            Students, head to the portal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:placement@svc.ac.in"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-surface font-medium hover:bg-accent-deep transition-colors shadow-md hover:shadow-xl"
            >
              placement@svc.ac.in
            </a>
            <Link
              to="/partnerships"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-line text-ink hover:border-accent hover:text-accent transition-colors"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

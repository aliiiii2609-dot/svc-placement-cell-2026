import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';
import { PageHeader } from '@/components/sections/PageHeader';

/**
 * The College.
 *
 * New page. Absorbs four sections that used to live on the home page:
 * CoursesOffered, ExtracurricularExposure, InitiativesByCell and CampusBlock.
 *
 * They were moved rather than deleted. All four answer the same question —
 * "what is this place?" — which is a question a visitor asks *after* they have
 * decided the cell is worth their time, not during the first screen. Keeping
 * them on the home page meant roughly 1,300 lines of content sitting between
 * the pitch and the proof, and it is a large part of why the home page felt
 * like it never ended.
 */
const CoursesOffered = lazyWithRetry(() => import('@/components/sections/CoursesOffered').then((m) => ({ default: m.CoursesOffered })));
const ExtracurricularExposure = lazyWithRetry(() => import('@/components/sections/ExtracurricularExposure').then((m) => ({ default: m.ExtracurricularExposure })));
const InitiativesByCell = lazyWithRetry(() => import('@/components/sections/InitiativesByCell').then((m) => ({ default: m.InitiativesByCell })));
const CampusBlock = lazyWithRetry(() => import('@/components/sections/CampusBlock').then((m) => ({ default: m.CampusBlock })));

export function CollegePage() {
  return (
    <>
      <PageHeader
        kicker="The College"
        title="Sri Venkateswara College."
        lede="A constituent college of the University of Delhi, ranked in the national top tier, and the ground the cell recruits from. The courses, the campus, and what students do outside the classroom."
      />

      <DeferLazy minHeight={720}><CoursesOffered /></DeferLazy>
      <DeferLazy minHeight={640}><ExtracurricularExposure /></DeferLazy>
      <DeferLazy minHeight={620}><InitiativesByCell /></DeferLazy>
      <DeferLazy minHeight={620}><CampusBlock /></DeferLazy>

      <section className="section-spacing bg-bg-2 border-t border-line">
        <div className="container-svc text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="font-display font-bold text-3xl md:text-4xl mb-5 text-ink tracking-tight"
          >
            See where it leads.
          </motion.h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/rankings-press" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-deep transition-colors text-sm">
              Rankings and press
            </Link>
            <Link to="/alumni" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-ink hover:border-accent hover:text-accent transition-colors text-sm">
              Where alumni go →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RecruiterInterestForm } from '@/components/forms/RecruiterInterestForm';
import { recruitersBySector } from '@/lib/data/partners';

export function PartnershipsPage() {
  const grouped = recruitersBySector();

  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Partnerships</span>
            <h1 className="font-display text-5xl mt-3 mb-5 display-italic">
              Become a <em>partner.</em>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl leading-relaxed">
              Long-term partnership engagements. IFair sponsorships. Sector orientations. Speaker sessions.
              Multi-year case-competition tie-ups. Reach out, share what you have in mind, and a coordinator
              will route the conversation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <h2 className="font-display text-3xl mb-6">Current partners by sector</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([sector, rs]) => (
              <div key={sector} className="bg-surface border border-line rounded-2xl p-6">
                <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-3">{sector} · {rs.length}</div>
                <ul className="flex flex-wrap gap-1.5">
                  {rs.map((r) => (
                    <li key={r.slug}>
                      <Link to={`/companies/${r.slug}`} className="inline-block px-2.5 py-1 rounded-full bg-bg-2 border border-line text-xs hover:border-accent hover:text-accent transition-colors">
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc max-w-3xl">
          <h2 className="font-display text-3xl mb-4">Open the conversation</h2>
          <p className="text-ink-2 mb-8">
            Send a brief. A coordinator gets back within one working day with a suggested partnership shape and timeline.
          </p>
          <RecruiterInterestForm />
        </div>
      </section>
    </>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { resources } from '@/lib/data/resources';
import { events } from '@/lib/data/events';
import { news } from '@/lib/data/news';
import { StudentFeedbackForm } from '@/components/forms/StudentFeedbackForm';

export function StudentPortalPage() {
  const upcoming = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 3);
  const latest = news.slice(0, 4);

  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Student Portal</span>
            <h1 className="font-display text-5xl md:text-6xl mt-3 mb-5 tracking-tight">
              Student portal.
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl leading-relaxed">
              Open drives are circulated by email (placements) and on the official WhatsApp community
              (internships). Use the cell&apos;s CV template, follow the eligibility filters, and
              attend every shortlist round.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing border-b border-line">
        <div className="container-svc grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/students/cv-review', icon: FileText, title: 'CV Review Queue', body: 'Upload your draft. Get coordinator feedback within 48 hours.' },
            { to: '/students/mock-interviews', icon: MessageSquare, title: 'Mock Interviews', body: 'Book a slot with an alumni mentor in your target sector.' },
            { to: '/resources', icon: BookOpen, title: 'Resources', body: 'Templates, prep guides, and the recruitment brochure.' },
          ].map((c, i) => (
            <motion.div key={c.to} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Link to={c.to} className="block bg-surface border border-line rounded-2xl p-6 h-full hover:border-accent transition-colors group">
                <c.icon className="text-accent mb-3" size={22} />
                <h3 className="font-display text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-ink-2 mb-3">{c.body}</p>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-mono uppercase tracking-widest">
                  Open <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-accent" size={18} />
              <h2 className="font-display text-3xl">Upcoming</h2>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="bg-surface border border-line rounded-xl p-5 text-sm text-ink-2 leading-relaxed">
                  No sessions scheduled right now. Check back soon, or watch the placements email and WhatsApp community for the next round.
                </div>
              ) : (
                upcoming.map((e) => (
                  <div key={e.id} className="bg-surface border border-line rounded-xl p-5 hover:border-accent transition-colors">
                    <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-1">{e.category} · {e.date}</div>
                    <div className="font-display text-lg mb-1">{e.title}</div>
                    <p className="text-sm text-ink-2 leading-relaxed mb-2">{e.description}</p>
                    <div className="text-xs text-ink-3">{e.venue} · {e.startTime}{e.endTime ? `–${e.endTime}` : ''}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-6">Latest</h2>
            <ul className="space-y-3">
              {latest.map((n) => (
                <li key={n.id} className="bg-surface border border-line rounded-xl p-5">
                  <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-1">{n.category} · {n.publishedAt}</div>
                  <div className="font-display text-lg mb-1">{n.title}</div>
                  <p className="text-sm text-ink-2">{n.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-bg-2 border-t border-line">
        <div className="container-svc">
          <h2 className="font-display text-3xl mb-6">Top resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.slice(0, 6).map((r) =>
              r.filePath ? (
                <a key={r.id} href={r.filePath} target="_blank" rel="noopener" className="bg-surface border border-line rounded-xl p-5 hover:border-accent transition-colors block">
                  <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-2">{r.category}</div>
                  <div className="font-display text-lg mb-1">{r.title}</div>
                  <p className="text-xs text-ink-2 mb-2">{r.description}</p>
                  <div className="text-xs text-ink-3 font-mono">{r.downloadCount.toLocaleString()} downloads</div>
                </a>
              ) : (
                <div key={r.id} aria-disabled="true" className="bg-surface border border-line rounded-xl p-5 block opacity-60 cursor-not-allowed">
                  <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-2">{r.category}</div>
                  <div className="font-display text-lg mb-1">{r.title}</div>
                  <p className="text-xs text-ink-2 mb-2">{r.description}</p>
                  <div className="text-xs text-ink-3 font-mono">Coming soon</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      <section className="section-spacing bg-bg-2 border-t border-line" id="student-query">
        <div className="container-svc max-w-3xl">
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mb-4">Student query</div>
          <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.028em] mb-4">
            <span className="text-ink">Question for the cell.</span>{' '}
            <span className="text-ink-3">CV templates, eligibility, drive timelines, anything that needs a coordinator. Drop a note and we'll respond on email.</span>
          </h2>
          <div className="mt-8">
            <StudentFeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, FileText, Users } from 'lucide-react';

export function RecruiterDashboardPage() {
  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Recruiter Dashboard</span>
            <h1 className="font-display text-5xl mt-3 mb-5 display-italic">
              Your drives, <em>at a glance.</em>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl leading-relaxed">
              For active recruiters: drive status, shortlist downloads, schedule confirmations, and your dedicated coordinator.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-bg-2 border border-line font-mono text-[0.65rem] uppercase tracking-widest text-ink-2">
            Sample view · Illustrative data, not a live account
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: LayoutDashboard, label: 'Active drives', value: '2', detail: 'IFair 2026 + a closed-loop process' },
            { icon: CalendarCheck, label: 'Next milestone', value: 'Pre-placement talk', detail: '14 Feb · 11:00 IST · Seminar Hall 2' },
            { icon: FileText, label: 'CV pack', value: 'Ready', detail: '42 verified applications' },
            { icon: Users, label: 'Coordinator', value: 'Assigned', detail: 'A council member is on point' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="bg-surface border border-line rounded-2xl p-6">
              <c.icon className="text-accent mb-3" size={20} />
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-3 mb-1">{c.label}</div>
              <div className="font-display text-2xl mb-1">{c.value}</div>
              <div className="text-xs text-ink-2">{c.detail}</div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}

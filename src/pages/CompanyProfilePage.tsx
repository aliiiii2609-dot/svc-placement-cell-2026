import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { recruiters } from '@/lib/data/partners';

export function CompanyProfilePage() {
  const { slug } = useParams();
  const r = recruiters.find((x) => x.slug === slug);
  if (!r) return <Navigate to="/recruiters" replace />;

  return (
    <article className="section-spacing">
      <div className="container-svc max-w-4xl">
        <Link to="/recruiters" className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to recruiters
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-surface border border-line rounded-2xl p-8 md:p-12">
          <div className="relative w-24 h-24 rounded-xl flex items-center justify-center mb-6 border border-line shadow-soft" style={{ background: r.brandColor ?? '#9c7a3a' }}>
            <span className="font-display text-3xl text-white">
              {r.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">{r.sector}</div>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{r.name}</h1>

          <p className="text-ink-2 leading-relaxed mb-6">
            {r.name} has engaged with the Placement Cell across recent cycles. Per the cell&apos;s
            confidentiality policy, no offer counts or CTC values are paired with a named recruiter.
            Aggregate cycle data is available on the homepage and the recruiters page.
          </p>

          <div className="grid sm:grid-cols-2 gap-px bg-line rounded-xl overflow-hidden">
            <div className="bg-bg p-5">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-3 mb-1">Sector</div>
              <div className="text-ink">{r.sector}</div>
            </div>
            <div className="bg-bg p-5">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-3 mb-1">Featured partner</div>
              <div className="text-ink">{r.featured ? 'Yes' : 'No'}</div>
            </div>
          </div>        </motion.div>
      </div>
    </article>
  );
}

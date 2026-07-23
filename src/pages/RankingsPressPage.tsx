import { motion } from 'framer-motion';
import { rankings, achievements } from '@/lib/data/rankings';
import { CycleDashboard } from '@/components/charts/CycleDashboard';

export function RankingsPressPage() {
  return (
    <>
      <section className="pt-6 md:pt-8">
        <div className="container-svc">
          <div className="glass overflow-hidden rounded-2xl">
            <img
              className="w-full h-auto block"
              src="/rankings-banner.gif"
              alt="Sri Venkateswara College rankings banner"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Rankings &amp; Press</span>
            <h1 className="font-display text-5xl mt-3 mb-5 display-italic">
              Recognized, <em>nationally.</em>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl leading-relaxed">
              Sri Venkateswara College&apos;s national rankings, recent press mentions, and student achievements.
              Ranking statements are factual; official badges are reserved for production replacement once
              each authority&apos;s display permission is on file.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing border-b border-line">
        <div className="container-svc grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankings.map((r, i) => (
            <motion.div key={r.authority} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-surface border border-line rounded-2xl p-6 relative">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-2">{r.authority} · {r.year}</div>
              <div className="font-display text-5xl">{r.rank}</div>
              <div className="text-xs text-ink-2 mt-2">{r.category}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="placements" className="section-spacing border-b border-line scroll-mt-[96px]">
        <div className="container-svc mb-8">
          <span className="eyebrow">Placements in detail</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3 display-italic">
            The cycle, <em>by the numbers.</em>
          </h2>
        </div>
        <CycleDashboard />
      </section>

      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <h2 className="font-display text-3xl mb-6">Student achievements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div key={a.title + a.detail} className="bg-surface border border-line rounded-xl p-5">
                <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-2">{a.year}</div>
                <div className="font-display text-lg mb-1">{a.title}</div>
                <p className="text-xs text-ink-2">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

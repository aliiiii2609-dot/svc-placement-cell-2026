import { motion } from 'framer-motion';
import { Download, Clock } from 'lucide-react';
import { resources } from '@/lib/data/resources';

export function ResourcesPage() {
  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Resources</span>
            <h1 className="font-display text-5xl mt-3 mb-5 display-italic">
              Templates, guides, <em>prep.</em>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl">
              The cell&apos;s CV template, sector-specific interview guides, case primers, and the recruitment brochure.
              Files are reviewed each cycle and replaced when out of date.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc grid md:grid-cols-2 gap-4">
          {resources.map((r, i) => {
            const motionProps = {
              initial: { opacity: 0, y: 14 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.2 },
              transition: { duration: 0.4, delay: i * 0.05 },
            } as const;

            if (!r.filePath) {
              return (
                <motion.div key={r.id} {...motionProps} aria-disabled="true" className="card-glow rounded-2xl p-6 flex items-start gap-4 opacity-60 cursor-not-allowed">
                  <Clock className="text-ink-3 shrink-0 mt-1" size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-1">{r.category}</div>
                    <div className="font-display text-xl mb-2">{r.title}</div>
                    <p className="text-sm text-ink-2 mb-2">{r.description}</p>
                    <div className="text-xs text-ink-3 font-mono">Coming soon</div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.a key={r.id} onMouseMove={(ev) => { const rect = ev.currentTarget.getBoundingClientRect(); ev.currentTarget.style.setProperty('--mx', `${((ev.clientX - rect.left) / rect.width) * 100}%`); ev.currentTarget.style.setProperty('--my', `${((ev.clientY - rect.top) / rect.height) * 100}%`); }} href={r.filePath} target="_blank" rel="noopener" {...motionProps} className="card-glow rounded-2xl p-6 flex items-start gap-4 group">
                <Download className="text-accent shrink-0 mt-1 transition-transform group-hover:-translate-y-0.5" size={18} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-1">{r.category}</div>
                  <div className="font-display text-xl mb-2">{r.title}</div>
                  <p className="text-sm text-ink-2 mb-2">{r.description}</p>
                  <div className="text-xs text-ink-3 font-mono">{r.downloadCount.toLocaleString()} downloads</div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>
    </>
  );
}

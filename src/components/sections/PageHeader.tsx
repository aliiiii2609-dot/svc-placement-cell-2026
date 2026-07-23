import { motion } from 'framer-motion';

/**
 * Shared page header.
 *
 * Every route page was hand-rolling its own kicker/title/lede block with
 * slightly different spacing, type sizes and animation timings. That is the
 * quiet kind of duplication: nothing is obviously broken, but the site reads
 * as five different sites, and any change to the header treatment means
 * editing it in a dozen files and missing three.
 *
 * One component, one treatment.
 */
export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  /** Optional actions rendered under the lede. */
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-bg-2/50">
      <div className="container-svc pt-14 pb-12 md:pt-20 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
            {kicker}
          </div>
          <h1 className="font-display font-bold text-ink tracking-[-0.035em] leading-[1.05] text-[clamp(2rem,4.6vw,3.4rem)]">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 text-ink-2 text-base md:text-lg leading-relaxed max-w-2xl">
              {lede}
            </p>
          )}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

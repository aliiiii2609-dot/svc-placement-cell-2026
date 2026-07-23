import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <section className="min-h-[70vh] grid place-items-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center max-w-md px-6">
        <div className="font-display text-[12rem] leading-none text-gold/80">404</div>
        <h1 className="font-display text-3xl mb-3">No page here.</h1>
        <p className="text-ink-2 mb-6">The link is broken or the page has moved. The homepage has everything threaded together.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors">
          Back to the homepage
        </Link>
      </motion.div>
    </section>
  );
}

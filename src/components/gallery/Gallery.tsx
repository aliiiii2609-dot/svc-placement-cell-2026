import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type Tile = { id: string; caption: string; src: string; size?: 'tall' | 'wide' | 'default' };

const tiles: Tile[] = [
  { id: 'ifair-25', caption: 'IFair 2025, group photo', src: '/images/gallery/ifair-25-group.jpg', size: 'wide' },
  { id: 'fair-banner', caption: 'Internship Fair, welcome banner', src: '/images/gallery/internship-fair-banner.jpg', size: 'wide' },
  { id: 'fair-2023', caption: 'Internship Fair 2023', src: '/images/gallery/internship-fair-2023.jpg' },
  { id: 'team', caption: 'The cell, full team', src: '/images/gallery/team-photo.jpg', size: 'tall' },
];

export function Gallery() {
  return (
    <section className="section-spacing" id="gallery">
      <div className="container-svc">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-10"
        >
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mb-4">Gallery</div>
          <h2 className="font-display font-bold text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.028em]">
            <span className="text-ink">From recent cycles.</span>{' '}
            <span className="text-ink-3">Photographs from recent placement drives, workshops, industry talks, and the Internship Fair.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiles.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={cn(
                'relative rounded-xl overflow-hidden border border-line group shadow-soft hover:shadow-soft-lg transition-shadow duration-500',
                t.size === 'tall' && 'md:row-span-2',
                t.size === 'wide' && 'md:col-span-2',
              )}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-bg-2">
                <img
                  src={t.src}
                  alt={t.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white">
                  {t.caption}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

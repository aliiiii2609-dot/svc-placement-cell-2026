import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { events } from '@/lib/data/events';
import { cn } from '@/lib/utils/cn';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';

/**
 * Moved here from the home page. The Internship Fair is an event and the
 * gallery is photographs of events, so both belong on the events page rather
 * than on a lobby that a recruiter is trying to get past.
 */
const IFairSection = lazyWithRetry(() => import('@/components/ifair/IFairSection').then((m) => ({ default: m.IFairSection })));
const Gallery = lazyWithRetry(() => import('@/components/gallery/Gallery').then((m) => ({ default: m.Gallery })));

export function EventsPage() {
  const [view, setView] = useState<'list' | 'month'>('list');

  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Events</span>
            <h1 className="font-display text-5xl mt-3 mb-5 display-italic">
              What&apos;s on, <em>cycle 2025-26.</em>
            </h1>
            <p className="text-lg text-ink-2 max-w-2xl">
              Workshops, drives, mock-interview days, industry talks, and the flagship IFair. Sign-ups
              open on the relevant date.
            </p>
            <div className="flex gap-2 mt-6">
              {['list', 'month'].map((v) => (
                <button key={v} onClick={() => setView(v as 'list' | 'month')} className={cn('px-4 py-2 rounded-full text-sm font-mono uppercase tracking-widest border transition-colors', view === v ? 'bg-accent text-bg border-accent' : 'border-line text-ink-2 hover:border-accent hover:text-accent')}>
                  {v}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc">
          {view === 'list' ? (
            <div className="space-y-4">
              {events.map((e, i) => (
                <motion.article
                  key={e.id}
                  onMouseMove={(ev) => {
                    const r = ev.currentTarget.getBoundingClientRect();
                    ev.currentTarget.style.setProperty('--mx', `${((ev.clientX - r.left) / r.width) * 100}%`);
                    ev.currentTarget.style.setProperty('--my', `${((ev.clientY - r.top) / r.height) * 100}%`);
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card-glow rounded-2xl p-6 grid md:grid-cols-[120px_1fr_auto] gap-6 items-start"
                >
                  <div>
                    <div className="font-display text-3xl text-accent leading-none">
                      {format(parseISO(e.date), 'd')}
                    </div>
                    <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-2 mt-1">
                      {format(parseISO(e.date), 'MMM yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-1">{e.category}</div>
                    <div className="font-display text-xl mb-2">{e.title}</div>
                    <p className="text-sm text-ink-2 leading-relaxed mb-3">{e.description}</p>
                    <div className="text-xs text-ink-3 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1"><Clock size={11} /> {e.startTime}{e.endTime ? `–${e.endTime}` : ''}</span>
                      {e.venue && <span className="flex items-center gap-1"><MapPin size={11} /> {e.venue}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    {e.rsvpOpen ? (
                      <a href={`mailto:placement@svc.ac.in?subject=RSVP: ${encodeURIComponent(e.title)}`} className="inline-block px-5 py-2 rounded-full bg-accent text-bg text-xs font-mono uppercase tracking-widest">
                        RSVP
                      </a>
                    ) : (
                      <span className="text-xs font-mono uppercase tracking-widest text-ink-3">Closed</span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-2xl p-6">
              <div className="grid grid-cols-7 gap-2 text-center font-mono text-[0.65rem] uppercase tracking-widest text-ink-3 mb-3">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 5;
                  const date = day > 0 && day <= 28 ? new Date(2026, 1, day) : null;
                  const event = events.find((e) => date && format(parseISO(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
                  return (
                    <div key={i} className={cn('aspect-square rounded-lg border p-2 text-xs', date ? 'border-line' : 'border-transparent', event && 'border-accent bg-accent-soft')}>
                      {date && <div className="font-mono text-ink-3 mb-1">{day}</div>}
                      {event && <div className="text-[0.6rem] text-accent font-medium leading-tight line-clamp-2">{event.title}</div>}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-ink-3 font-mono mt-4">Showing February 2026. Use list view for the full schedule.</div>
            </div>
          )}
        </div>
      </section>
      <DeferLazy minHeight={680}><IFairSection /></DeferLazy>
      <DeferLazy minHeight={600}><Gallery /></DeferLazy>

    </>
  );
}

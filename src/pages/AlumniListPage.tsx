import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { notableAlumni } from '@/lib/data/notable-alumni';
import { consentedAlumniRegistry } from '@/lib/data/alumni-registry';
import { AlumniRegistrationForm } from '@/components/forms/AlumniRegistrationForm';
import { cn } from '@/lib/utils/cn';
import { lazyWithRetry } from '@/lib/utils/lazyWithRetry';
import { DeferLazy } from '@/components/utils/Defer';

/**
 * Moved here from the home page. "Where alumni go for higher study" is an
 * alumni question, and this is the alumni page.
 *
 * NotableAlumniGrid was NOT moved here. This page already renders
 * `notableAlumni` as a searchable, filterable directory; the grid rendered the
 * same people again in a different layout. See the note in docs/restructure.md.
 */
const HigherEducationSection = lazyWithRetry(() => import('@/components/sections/HigherEducationSection').then((m) => ({ default: m.HigherEducationSection })));

export function AlumniListPage() {
  const all = useMemo(() => [...notableAlumni, ...consentedAlumniRegistry], []);
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState<string>('all');
  const [sector, setSector] = useState<string>('all');

  const courses = useMemo(() => Array.from(new Set(all.map((a) => a.course))).sort(), [all]);
  const sectors = useMemo(() => {
    const s = new Set<string>();
    all.forEach((a) => a.mentoringSectors?.forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [all]);

  const filtered = all.filter((a) => {
    if (course !== 'all' && a.course !== course) return false;
    if (sector !== 'all' && !a.mentoringSectors?.includes(sector as never)) return false;
    if (query && !a.name.toLowerCase().includes(query.toLowerCase()) && !a.currentCompany.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Alumni Directory</span>
            <h1 className="font-display text-5xl md:text-6xl mt-3 mb-5 display-italic">
              The SVC alumni directory.
            </h1>
            <p className="text-lg text-ink-2 leading-relaxed max-w-2xl">
              Alumni who came through SVC and went on to top firms, premier business schools, and public-impact roles.
              Profiles published with consent. SVC-era placement records are never displayed alongside named profiles.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-line py-6 sticky top-[72px] bg-bg/95 backdrop-blur-md z-30">
        <div className="container-svc flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface border border-line rounded-full pl-9 pr-4 py-2 text-sm text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
              placeholder="Search by name or company..."
            />
          </div>
          <select value={course} onChange={(e) => setCourse(e.target.value)} className="bg-surface border border-line rounded-full px-4 py-2 text-sm focus:border-accent focus:outline-none">
            <option value="all">All courses</option>
            {courses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="bg-surface border border-line rounded-full px-4 py-2 text-sm focus:border-accent focus:outline-none">
            <option value="all">All sectors</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-xs text-ink-3 font-mono">{filtered.length} profiles</span>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-svc">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-ink-3 font-mono text-sm">No profiles match those filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: (i % 12) * 0.04 }}
                >
                  <Link to={`/alumni/${a.id}`} className={cn('block bg-surface border border-line rounded-2xl overflow-hidden hover:border-accent transition-colors group')}>
                    <div className="relative h-44 bg-gradient-to-br from-bg-2 to-surface-2 flex items-center justify-center">
                      <span className="font-display text-5xl text-gold/30">
                        {a.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="font-display text-lg">{a.name}</div>
                      <div className="text-sm text-ink-2 mt-1">{a.currentRole}</div>
                      <div className="text-xs text-ink-3">{a.currentCompany}</div>
                      <div className="text-xs font-mono uppercase tracking-widest text-accent mt-3">
                        {a.course} · {a.graduatingYear}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="register" className="section-spacing bg-bg-2 border-t border-line scroll-mt-[72px]">
        <div className="container-svc max-w-3xl">
          <span className="eyebrow">Are you an alumnus?</span>
          <h2 className="font-display text-3xl md:text-4xl mt-2 mb-4 display-italic">
            Add yourself, <em>or update.</em>
          </h2>
          <p className="text-ink-2 mb-8">
            Your profile is reviewed by the Documentation department within five working days. You control
            what is publicly visible and you can pause or remove your profile at any time.
          </p>
          <DeferLazy minHeight={640}><HigherEducationSection /></DeferLazy>

      <AlumniRegistrationForm />
        </div>
      </section>
    </>
  );
}

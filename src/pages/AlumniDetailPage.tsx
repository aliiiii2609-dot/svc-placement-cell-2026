import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, MessageCircle } from 'lucide-react';
import { notableAlumni } from '@/lib/data/notable-alumni';
import { consentedAlumniRegistry } from '@/lib/data/alumni-registry';

export function AlumniDetailPage() {
  const { id } = useParams();
  const profile = [...notableAlumni, ...consentedAlumniRegistry].find((a) => a.id === id);

  if (!profile) return <Navigate to="/alumni" replace />;

  return (
    <article className="section-spacing">
      <div className="container-svc max-w-4xl">
        <Link to="/alumni" className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to directory
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[260px_1fr] gap-8 items-start"
        >
          <div className="relative aspect-[4/5] rounded-2xl border border-line bg-gradient-to-br from-bg-2 to-surface-2 flex items-center justify-center overflow-hidden">
            <span className="font-display text-6xl text-gold/30">
              {profile.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
              {profile.course} · Class of {profile.graduatingYear}
            </div>
            <h1 className="font-display text-4xl md:text-5xl mb-3">{profile.name}</h1>
            <div className="text-lg text-ink-2 mb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-accent" /> {profile.currentRole} at {profile.currentCompany}
            </div>
            {profile.location && (
              <div className="text-sm text-ink-3 flex items-center gap-2 mb-4">
                <MapPin size={14} /> {profile.location}
              </div>
            )}
            {profile.achievement && (
              <div className="bg-accent-soft border-l-2 border-accent pl-4 py-2 mb-6 text-sm text-ink">
                {profile.achievement}
              </div>
            )}
            {profile.mentoringSectors && profile.mentoringSectors.length > 0 && (
              <div className="mb-6">
                <div className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-3 mb-2">Open to mentoring</div>
                <div className="flex flex-wrap gap-2">
                  {profile.mentoringSectors.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-surface border border-line text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <a
              href={`mailto:placement@svc.ac.in?subject=Mentor%20request%3A%20${encodeURIComponent(profile.name)}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors text-sm"
            >
              <MessageCircle size={14} /> Request a mentor chat
            </a>
          </div>
        </motion.div>

        <section className="mt-16">
          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-4">Qualifications</div>
          <ol className="relative flex flex-col gap-5 pl-6 border-l border-gold/30">
            {profile.qualifications.map((q, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[34px] top-2 w-3 h-3 rounded-full bg-accent ring-4 ring-bg" />
                <div className="grid grid-cols-[40px_1fr_auto] gap-4 items-center bg-surface border border-line rounded-xl p-4">
                  <div className="w-10 h-10 rounded-md bg-bg-2 border border-line flex items-center justify-center">
                    <GraduationCap size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-base text-ink font-medium">{q.degree}</div>
                    <div className="text-sm text-ink-2">{q.institution}</div>
                    <div className="text-xs text-ink-3">{q.location}</div>
                  </div>
                  <div className="font-mono text-sm text-accent">{q.year}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}

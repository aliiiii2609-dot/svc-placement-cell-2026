import { useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import type { CVData } from './types';
import { uid, STORAGE_KEY } from './types';
import {
  Field,
  SectionShell,
  inputClass,
  ghostButtonClass,
  dangerButtonClass,
} from './form-primitives';

interface Props {
  data: CVData;
  setData: (next: CVData | ((prev: CVData) => CVData)) => void;
}

/**
 * Main form panel. All sections rendered in one scrollable column.
 * Drag-handle icon shown but reorder isn't wired yet (left as a v2
 * surface area — moving an entry up/down can be added with array
 * splice once a use is observed in user testing).
 */
export function CVBuilderForm({ data, setData }: Props) {
  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* non-fatal */ }
  }, [data]);

  // --- Helpers ---------------------------------------------------------
  const updatePersonal = <K extends keyof CVData['personal']>(field: K, value: CVData['personal'][K]) => {
    setData((d) => ({ ...d, personal: { ...d.personal, [field]: value } }));
  };

  const updateTag = (idx: 0 | 1 | 2, value: string) => {
    setData((d) => {
      const tags: [string, string, string] = [...d.personal.tags] as [string, string, string];
      tags[idx] = value;
      return { ...d, personal: { ...d.personal, tags } };
    });
  };

  // Generic list helpers
  const addRow = <K extends keyof CVData>(key: K, blank: CVData[K] extends Array<infer U> ? U : never) => {
    setData((d) => ({ ...d, [key]: [...(d[key] as unknown as object[]), blank] } as CVData));
  };

  const removeRow = (key: keyof CVData, id: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string }>).filter((r) => r.id !== id),
    } as CVData));
  };

  const updateRow = (key: keyof CVData, id: string, patch: Record<string, unknown>) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string }>).map((r) => (r.id === id ? { ...r, ...patch } : r)),
    } as CVData));
  };

  // Nested bullet helpers (experience / positions / projects)
  type BulletKey = 'experience' | 'positions' | 'projects';
  const addBullet = (key: BulletKey, parentId: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; bullets: Array<{ id: string; text: string }> }>).map((r) =>
        r.id === parentId ? { ...r, bullets: [...r.bullets, { id: uid(), text: '' }] } : r,
      ),
    } as CVData));
  };

  const updateBullet = (key: BulletKey, parentId: string, bulletId: string, text: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; bullets: Array<{ id: string; text: string }> }>).map((r) =>
        r.id === parentId
          ? { ...r, bullets: r.bullets.map((b) => (b.id === bulletId ? { ...b, text } : b)) }
          : r,
      ),
    } as CVData));
  };

  const removeBullet = (key: BulletKey, parentId: string, bulletId: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; bullets: Array<{ id: string; text: string }> }>).map((r) =>
        r.id === parentId ? { ...r, bullets: r.bullets.filter((b) => b.id !== bulletId) } : r,
      ),
    } as CVData));
  };

  // Achievement / extracurricular item helpers
  type CategoryKey = 'achievements' | 'extraCurricular';
  const addCategoryItem = (key: CategoryKey, parentId: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; items: Array<{ id: string; text: string; year: string }> }>).map((g) =>
        g.id === parentId ? { ...g, items: [...g.items, { id: uid(), text: '', year: '' }] } : g,
      ),
    } as CVData));
  };

  const updateCategoryItem = (
    key: CategoryKey,
    parentId: string,
    itemId: string,
    patch: { text?: string; year?: string },
  ) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; items: Array<{ id: string; text: string; year: string }> }>).map((g) =>
        g.id === parentId
          ? { ...g, items: g.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : g,
      ),
    } as CVData));
  };

  const removeCategoryItem = (key: CategoryKey, parentId: string, itemId: string) => {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string; items: Array<{ id: string; text: string; year: string }> }>).map((g) =>
        g.id === parentId ? { ...g, items: g.items.filter((i) => i.id !== itemId) } : g,
      ),
    } as CVData));
  };

  return (
    <div>
      {/* PERSONAL DETAILS */}
      <SectionShell kicker="01" title="Personal details">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Full name" htmlFor="p-name">
            <input
              id="p-name"
              className={inputClass}
              autoComplete="name"
              placeholder="Mohammed Ali"
              value={data.personal.name}
              onChange={(e) => updatePersonal('name', e.target.value)}
            />
          </Field>
          <Field label="Roll number / ID" htmlFor="p-roll">
            <input
              id="p-roll"
              className={inputClass}
              placeholder="SVC/2023/0001"
              value={data.personal.rollNumber}
              onChange={(e) => updatePersonal('rollNumber', e.target.value)}
            />
          </Field>
          <Field label="Email" htmlFor="p-email">
            <input
              id="p-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@svc.ac.in"
              value={data.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
            />
          </Field>
          <Field label="Phone" htmlFor="p-phone">
            <input
              id="p-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass}
              placeholder="+91 ..."
              value={data.personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
            />
          </Field>
          <Field label="Location" htmlFor="p-location">
            <input
              id="p-location"
              className={inputClass}
              placeholder="New Delhi, India"
              value={data.personal.location}
              onChange={(e) => updatePersonal('location', e.target.value)}
            />
          </Field>
          <Field label="LinkedIn" htmlFor="p-linkedin">
            <input
              id="p-linkedin"
              className={inputClass}
              placeholder="linkedin.com/in/your-handle"
              value={data.personal.linkedin}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
            />
          </Field>
          <Field label="Portfolio / GitHub" htmlFor="p-portfolio">
            <input
              id="p-portfolio"
              className={inputClass}
              placeholder="github.com/your-handle"
              value={data.personal.portfolio}
              onChange={(e) => updatePersonal('portfolio', e.target.value)}
            />
          </Field>
          <Field label="Institution" htmlFor="p-inst">
            <input
              id="p-inst"
              className={inputClass}
              value={data.personal.institution}
              onChange={(e) => updatePersonal('institution', e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Programme / specialisation" htmlFor="p-prog">
              <input
                id="p-prog"
                className={inputClass}
                placeholder="B.Com (Hons), Final Year"
                value={data.personal.program}
                onChange={(e) => updatePersonal('program', e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-line dark:border-white/10">
          <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-3 mb-2">
            Header strengths (three short phrases)
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((i) => (
              <input
                key={i}
                className={inputClass}
                placeholder={['Finance', 'Consulting', 'Analytics'][i]}
                value={data.personal.tags[i]}
                onChange={(e) => updateTag(i, e.target.value)}
              />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* EDUCATION */}
      <SectionShell
        kicker="02"
        title="Education"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('education', { id: uid(), degree: '', institution: '', score: '', year: '', remarks: '' })}
          >
            <Plus size={12} /> Add row
          </button>
        }
      >
        <div className="space-y-3">
          {data.education.map((e) => (
            <div key={e.id} className="grid sm:grid-cols-[1fr_1fr_70px_70px_30px] gap-2 items-start">
              <input className={inputClass} placeholder="Degree / Exam" value={e.degree} onChange={(ev) => updateRow('education', e.id, { degree: ev.target.value })} />
              <input className={inputClass} placeholder="Board / Institute" value={e.institution} onChange={(ev) => updateRow('education', e.id, { institution: ev.target.value })} />
              <input className={inputClass} placeholder="%/CGPA" value={e.score} onChange={(ev) => updateRow('education', e.id, { score: ev.target.value })} />
              <input className={inputClass} placeholder="Year" value={e.year} onChange={(ev) => updateRow('education', e.id, { year: ev.target.value })} />
              <button type="button" className={dangerButtonClass} onClick={() => removeRow('education', e.id)} aria-label="Remove row">
                <X size={12} />
              </button>
              <div className="sm:col-span-5">
                <input className={inputClass} placeholder="Remarks (optional)" value={e.remarks} onChange={(ev) => updateRow('education', e.id, { remarks: ev.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ACHIEVEMENTS */}
      <SectionShell
        kicker="03"
        title="Achievements"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('achievements', { id: uid(), category: 'New Category', items: [{ id: uid(), text: '', year: '' }] })}
          >
            <Plus size={12} /> Add category
          </button>
        }
      >
        <div className="space-y-4">
          {data.achievements.map((g) => (
            <div key={g.id} className="border border-line rounded-lg p-3 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <GripVertical size={12} className="text-ink-3" />
                <input
                  className={inputClass}
                  value={g.category}
                  placeholder="Category name"
                  onChange={(e) => updateRow('achievements', g.id, { category: e.target.value })}
                />
                <button type="button" className={dangerButtonClass} onClick={() => removeRow('achievements', g.id)} aria-label="Remove category">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {g.items.map((i) => (
                  <div key={i.id} className="grid grid-cols-[1fr_90px_30px] gap-2 items-start">
                    <input className={inputClass} placeholder="Achievement description" value={i.text} onChange={(e) => updateCategoryItem('achievements', g.id, i.id, { text: e.target.value })} />
                    <input className={inputClass} placeholder="Year" value={i.year} onChange={(e) => updateCategoryItem('achievements', g.id, i.id, { year: e.target.value })} />
                    <button type="button" className={dangerButtonClass} onClick={() => removeCategoryItem('achievements', g.id, i.id)} aria-label="Remove item">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" className={ghostButtonClass} onClick={() => addCategoryItem('achievements', g.id)}>
                  <Plus size={11} /> Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* WORK EXPERIENCE */}
      <SectionShell
        kicker="04"
        title="Work experience"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('experience', { id: uid(), company: '', role: '', duration: '', tag: '', bullets: [{ id: uid(), text: '' }] })}
          >
            <Plus size={12} /> Add experience
          </button>
        }
      >
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.id} className="border border-line rounded-lg p-3 dark:border-white/10">
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <input className={inputClass} placeholder="Company" value={e.company} onChange={(ev) => updateRow('experience', e.id, { company: ev.target.value })} />
                <input className={inputClass} placeholder="Role / position" value={e.role} onChange={(ev) => updateRow('experience', e.id, { role: ev.target.value })} />
                <input className={inputClass} placeholder="Duration (e.g. May - Jul 2024)" value={e.duration} onChange={(ev) => updateRow('experience', e.id, { duration: ev.target.value })} />
                <input className={inputClass} placeholder='Tag (e.g. "Internship")' value={e.tag} onChange={(ev) => updateRow('experience', e.id, { tag: ev.target.value })} />
              </div>
              <div className="space-y-2">
                {e.bullets.map((b) => (
                  <div key={b.id} className="grid grid-cols-[1fr_30px] gap-2 items-start">
                    <textarea
                      className={`${inputClass} min-h-[44px]`}
                      placeholder="Bullet describing impact, scope, or outcome"
                      value={b.text}
                      onChange={(ev) => updateBullet('experience', e.id, b.id, ev.target.value)}
                    />
                    <button type="button" className={dangerButtonClass} onClick={() => removeBullet('experience', e.id, b.id)} aria-label="Remove bullet">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="button" className={ghostButtonClass} onClick={() => addBullet('experience', e.id)}>
                    <Plus size={11} /> Add bullet
                  </button>
                  <button type="button" className={dangerButtonClass} style={{ width: 'auto', paddingLeft: 8, paddingRight: 8 }} onClick={() => removeRow('experience', e.id)}>
                    <X size={11} /> Remove experience
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* PROJECTS */}
      <SectionShell
        kicker="05"
        title="Projects"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('projects', { id: uid(), title: '', context: '', duration: '', bullets: [{ id: uid(), text: '' }] })}
          >
            <Plus size={12} /> Add project
          </button>
        }
      >
        <div className="space-y-4">
          {data.projects.map((pr) => (
            <div key={pr.id} className="border border-line rounded-lg p-3 dark:border-white/10">
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <input className={inputClass} placeholder="Project title" value={pr.title} onChange={(ev) => updateRow('projects', pr.id, { title: ev.target.value })} />
                <input className={inputClass} placeholder="Duration" value={pr.duration} onChange={(ev) => updateRow('projects', pr.id, { duration: ev.target.value })} />
                <div className="sm:col-span-2">
                  <input className={inputClass} placeholder="Context (course, mentor, organisation)" value={pr.context} onChange={(ev) => updateRow('projects', pr.id, { context: ev.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                {pr.bullets.map((b) => (
                  <div key={b.id} className="grid grid-cols-[1fr_30px] gap-2 items-start">
                    <textarea className={`${inputClass} min-h-[44px]`} placeholder="What you built, what was hard, what shipped" value={b.text} onChange={(ev) => updateBullet('projects', pr.id, b.id, ev.target.value)} />
                    <button type="button" className={dangerButtonClass} onClick={() => removeBullet('projects', pr.id, b.id)} aria-label="Remove">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="button" className={ghostButtonClass} onClick={() => addBullet('projects', pr.id)}>
                    <Plus size={11} /> Add bullet
                  </button>
                  <button type="button" className={dangerButtonClass} style={{ width: 'auto', paddingLeft: 8, paddingRight: 8 }} onClick={() => removeRow('projects', pr.id)}>
                    <X size={11} /> Remove project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* POSITIONS OF RESPONSIBILITY */}
      <SectionShell
        kicker="06"
        title="Positions of responsibility"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('positions', { id: uid(), role: '', organization: '', year: '', bullets: [{ id: uid(), text: '' }] })}
          >
            <Plus size={12} /> Add position
          </button>
        }
      >
        <div className="space-y-4">
          {data.positions.map((po) => (
            <div key={po.id} className="border border-line rounded-lg p-3 dark:border-white/10">
              <div className="grid sm:grid-cols-3 gap-2 mb-2">
                <input className={inputClass} placeholder="Role" value={po.role} onChange={(ev) => updateRow('positions', po.id, { role: ev.target.value })} />
                <input className={inputClass} placeholder="Organisation / society" value={po.organization} onChange={(ev) => updateRow('positions', po.id, { organization: ev.target.value })} />
                <input className={inputClass} placeholder="Year" value={po.year} onChange={(ev) => updateRow('positions', po.id, { year: ev.target.value })} />
              </div>
              <div className="space-y-2">
                {po.bullets.map((b) => (
                  <div key={b.id} className="grid grid-cols-[1fr_30px] gap-2 items-start">
                    <textarea className={`${inputClass} min-h-[44px]`} placeholder="Initiative, outcome, scale" value={b.text} onChange={(ev) => updateBullet('positions', po.id, b.id, ev.target.value)} />
                    <button type="button" className={dangerButtonClass} onClick={() => removeBullet('positions', po.id, b.id)} aria-label="Remove">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="button" className={ghostButtonClass} onClick={() => addBullet('positions', po.id)}>
                    <Plus size={11} /> Add bullet
                  </button>
                  <button type="button" className={dangerButtonClass} style={{ width: 'auto', paddingLeft: 8, paddingRight: 8 }} onClick={() => removeRow('positions', po.id)}>
                    <X size={11} /> Remove position
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* EXTRACURRICULAR */}
      <SectionShell
        kicker="07"
        title="Extracurricular"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('extraCurricular', { id: uid(), category: 'New Category', items: [{ id: uid(), text: '', year: '' }] })}
          >
            <Plus size={12} /> Add category
          </button>
        }
      >
        <div className="space-y-4">
          {data.extraCurricular.map((g) => (
            <div key={g.id} className="border border-line rounded-lg p-3 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <GripVertical size={12} className="text-ink-3" />
                <input className={inputClass} placeholder="Category" value={g.category} onChange={(e) => updateRow('extraCurricular', g.id, { category: e.target.value })} />
                <button type="button" className={dangerButtonClass} onClick={() => removeRow('extraCurricular', g.id)} aria-label="Remove">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {g.items.map((i) => (
                  <div key={i.id} className="grid grid-cols-[1fr_90px_30px] gap-2 items-start">
                    <input className={inputClass} placeholder="Description" value={i.text} onChange={(e) => updateCategoryItem('extraCurricular', g.id, i.id, { text: e.target.value })} />
                    <input className={inputClass} placeholder="Year" value={i.year} onChange={(e) => updateCategoryItem('extraCurricular', g.id, i.id, { year: e.target.value })} />
                    <button type="button" className={dangerButtonClass} onClick={() => removeCategoryItem('extraCurricular', g.id, i.id)} aria-label="Remove">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" className={ghostButtonClass} onClick={() => addCategoryItem('extraCurricular', g.id)}>
                  <Plus size={11} /> Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* COMPETITIONS */}
      <SectionShell
        kicker="08"
        title="Competitions"
        actions={
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => addRow('competitions', { id: uid(), rank: '', detail: '', year: '' })}
          >
            <Plus size={12} /> Add competition
          </button>
        }
      >
        <div className="space-y-2">
          {data.competitions.map((c) => (
            <div key={c.id} className="grid grid-cols-[120px_1fr_90px_30px] gap-2 items-start">
              <input className={inputClass} placeholder="Rank" value={c.rank} onChange={(e) => updateRow('competitions', c.id, { rank: e.target.value })} />
              <input className={inputClass} placeholder="Competition detail" value={c.detail} onChange={(e) => updateRow('competitions', c.id, { detail: e.target.value })} />
              <input className={inputClass} placeholder="Year" value={c.year} onChange={(e) => updateRow('competitions', c.id, { year: e.target.value })} />
              <button type="button" className={dangerButtonClass} onClick={() => removeRow('competitions', c.id)} aria-label="Remove">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* SKILLS / CERTIFICATIONS / LANGUAGES */}
      <SectionShell kicker="09" title="Skills, certifications, languages">
        <div className="grid sm:grid-cols-3 gap-4">
          <SimpleList
            label="Skills"
            items={data.skills}
            onAdd={() => addRow('skills', { id: uid(), text: '' })}
            onChange={(id, text) => updateRow('skills', id, { text })}
            onRemove={(id) => removeRow('skills', id)}
          />
          <SimpleList
            label="Certifications"
            items={data.certifications}
            onAdd={() => addRow('certifications', { id: uid(), text: '' })}
            onChange={(id, text) => updateRow('certifications', id, { text })}
            onRemove={(id) => removeRow('certifications', id)}
          />
          <SimpleList
            label="Languages"
            items={data.languages}
            onAdd={() => addRow('languages', { id: uid(), text: '' })}
            onChange={(id, text) => updateRow('languages', id, { text })}
            onRemove={(id) => removeRow('languages', id)}
          />
        </div>
      </SectionShell>
    </div>
  );
}

function SimpleList({
  label,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  label: string;
  items: Array<{ id: string; text: string }>;
  onAdd: () => void;
  onChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-3 mb-2">
        {label}
      </div>
      <div className="space-y-2 mb-2">
        {items.map((i) => (
          <div key={i.id} className="grid grid-cols-[1fr_30px] gap-2 items-start">
            <input className={inputClass} placeholder={label.slice(0, -1)} value={i.text} onChange={(e) => onChange(i.id, e.target.value)} />
            <button type="button" className={dangerButtonClass} onClick={() => onRemove(i.id)} aria-label="Remove">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={ghostButtonClass} onClick={onAdd}>
        <Plus size={11} /> Add
      </button>
    </div>
  );
}

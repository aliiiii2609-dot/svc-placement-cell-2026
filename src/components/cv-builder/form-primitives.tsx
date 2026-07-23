import { type ReactNode } from 'react';

export const inputClass =
  'w-full bg-bg-2 border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 dark:bg-white/5 dark:border-white/15 dark:text-white dark:placeholder-white/40';

export const labelClass =
  'block text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-3 mb-1';

export const sectionClass =
  'bg-surface border border-line rounded-xl p-4 md:p-5 mb-4 dark:bg-white/[0.03] dark:border-white/10';

export const sectionTitleClass =
  'font-display font-bold text-ink text-base md:text-lg tracking-tight dark:text-white';

export const sectionKickerClass =
  'font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-1';

export const ghostButtonClass =
  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-line text-[12px] text-ink-2 hover:border-accent hover:text-accent transition-colors dark:border-white/15 dark:text-white/65 dark:hover:border-accent dark:hover:text-accent';

export const dangerButtonClass =
  'inline-flex items-center justify-center w-7 h-7 rounded-md border border-line text-ink-3 hover:border-red hover:text-red transition-colors dark:border-white/15 dark:text-white/50';

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function SectionShell({
  kicker,
  title,
  children,
  actions,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className={sectionClass}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {kicker && <div className={sectionKickerClass}>{kicker}</div>}
          <h3 className={sectionTitleClass}>{title}</h3>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Shared field styling for the Placement Cell forms.
 *
 * One refined glass system so the recruiter, student-feedback, and alumni forms
 * read as a single family: frosted panels over paper, navy focus rings, gold-
 * touched submit, mono kicker labels, and danger errors on the `red` token.
 * These are class-name constants and tiny helpers only — no submission logic.
 */

/** Frosted glass panel that wraps a whole form (uses the .glass-strong utility). */
export const glassPanel = 'glass-strong p-5 sm:p-7 md:p-8';

/** Base input / textarea styling. Comfortable padding, 44px min tap target. */
export const fieldBase =
  'w-full min-h-[44px] rounded-xl border border-line bg-surface/55 px-4 py-3 text-[15px] text-ink placeholder:text-ink-3 shadow-sm backdrop-blur-sm transition duration-200 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/25';

/** Select variant — same field look, room for the chevron. */
export const selectBase = cn(fieldBase, 'appearance-none pr-11 cursor-pointer');

/** Mono kicker label above a field. */
export const labelBase =
  'mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-2';

/** Inline danger error text. */
export const errorText = 'mt-1.5 text-xs font-medium text-red';

/** Primary submit — navy, glass-friendly, gold-ringed, clear disabled state. */
export const submitBtn =
  'inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-accent px-7 py-3 text-sm font-semibold text-surface shadow-lg shadow-accent/30 ring-1 ring-inset ring-gold/20 transition duration-300 hover:bg-accent-deep hover:shadow-xl hover:shadow-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-60';

/** Secondary / ghost button, glass-tinted. */
export const ghostBtn =
  'inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full border border-line bg-surface/50 px-6 py-3 text-sm font-medium text-ink-2 backdrop-blur-sm transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

/** Small mono helper text next to the submit row. */
export const helperText = 'text-xs font-mono text-ink-3';

/** Selectable chip built around a hidden checkbox/radio input. */
export const chipBase =
  'inline-flex items-center gap-1.5 min-h-[40px] rounded-full border border-line bg-surface/50 px-4 py-2 text-xs text-ink-2 backdrop-blur-sm cursor-pointer transition hover:border-accent hover:text-ink has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-surface has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40';

/** Consent checkbox row wrapper — generous tap target, glass surface. */
export const consentRow =
  'flex items-start gap-3 rounded-xl border border-line bg-surface/40 p-4 text-sm text-ink-2 backdrop-blur-sm';

/** Native checkbox styled to the navy accent. */
export const checkboxBase =
  'mt-0.5 h-[18px] w-[18px] flex-shrink-0 cursor-pointer accent-accent';

/** aria props linking a field to its error message. Spread onto the input. */
export function fieldAria(id: string, hasError: boolean) {
  return hasError
    ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` }
    : {};
}

/** Inline field error, id-linked for aria-describedby. Renders nothing if clean. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className={errorText}>
      {message}
    </p>
  );
}

/** Wraps a native <select> and overlays a non-interactive chevron. */
export function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
      />
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils/cn';
import type { RecruiterSector } from '@/types';
import { openMailto, submitForm, type SubmitChannel } from './submit';

/**
 * Recruiter interest form.
 *
 * Submission goes through the shared host-agnostic path (see ./submit):
 * if VITE_FORM_ENDPOINT is set the brief is POSTed as JSON and a 2xx means
 * it genuinely reached the cell; otherwise (or on failure) we open a
 * pre-filled mailto to placement@svc.ac.in without navigating away.
 *
 * The confirmation panel adapts its copy to whichever channel handled the
 * submission, so it never claims "received" when it only opened a mail
 * client. Form stays on the page; the user can submit another or re-open
 * the mail client.
 */

const SECTORS: RecruiterSector[] = [
  'Audit & Assurance',
  'Consulting & Strategy',
  'Finance & Markets',
  'Banking & Insurance',
  'Analytics & Research',
  'Product & Tech',
  'Consumer & BD',
  'EdTech & Operations',
  'Hospitality & Aviation',
  'Policy & Public',
];

const schema = z.object({
  name: z.string().min(2, 'Please share your full name'),
  organization: z.string().min(2, 'Organization name is required'),
  email: z.string().email('A valid work email is required'),
  phone: z.string().optional(),
  hiringBrief: z.string().min(20, 'Tell us a little about the role (at least 20 characters)'),
  preferredSectors: z.array(z.string()).optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'Consent is required to submit' }),
});

// `_hp` is a framework-agnostic honeypot: hidden from real users, left blank
// by them, and only ever filled by bots. It is not part of the Zod schema.
type FormValues = z.input<typeof schema> & { _hp?: string };

const DRAFT_KEY = 'svc-form-recruiter-interest';

function buildBrief(data: z.infer<typeof schema>): { subject: string; body: string } {
  const subject = `Recruiter interest from ${data.organization}`;
  const body =
    `Name: ${data.name}\n` +
    `Organization: ${data.organization}\n` +
    `Email: ${data.email}\n` +
    `Phone: ${data.phone ?? ''}\n` +
    `Preferred sectors: ${(data.preferredSectors ?? []).join(', ')}\n\n` +
    `Hiring brief:\n${data.hiringBrief}`;
  return { subject, body };
}

export function RecruiterInterestForm() {
  const toast = useToast();
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submittedData, setSubmittedData] = useState<z.infer<typeof schema> | null>(null);
  const [channel, setChannel] = useState<SubmitChannel>('endpoint');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: (() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : { consent: false };
      } catch {
        return { consent: false };
      }
    })(),
  });

  const values = watch();
  useEffect(() => {
    if (submitState === 'success') return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(values)); } catch { /* non-fatal */ }
  }, [values, submitState]);

  const onSubmit = async (raw: FormValues) => {
    // Honeypot: a real user never fills this. Abort silently for bots.
    if (raw._hp) return;

    const result = schema.safeParse(raw);
    if (!result.success) {
      toast('Please check the highlighted fields', 'error');
      return;
    }
    const data = result.data;
    setSubmitState('submitting');

    const { subject, body } = buildBrief(data);
    const usedChannel = await submitForm({
      payload: {
        name: data.name,
        organization: data.organization,
        email: data.email,
        phone: data.phone ?? '',
        preferredSectors: data.preferredSectors ?? [],
        hiringBrief: data.hiringBrief,
      },
      subject,
      body,
    });

    setChannel(usedChannel);
    setSubmittedData(data);
    setSubmitState('success');
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* non-fatal */ }
  };

  const openInMailClient = () => {
    if (!submittedData) return;
    const { subject, body } = buildBrief(submittedData);
    openMailto(subject, body);
  };

  const startAnother = () => {
    setSubmittedData(null);
    setSubmitState('idle');
    reset({ consent: false });
  };

  const field = 'w-full bg-bg-2 border border-line rounded-lg px-4 py-2.5 text-ink placeholder-ink-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200';
  const label = 'block text-xs font-mono uppercase tracking-widest text-ink-3 mb-1.5';
  const error = 'text-xs text-red mt-1';

  // SUCCESS STATE
  if (submitState === 'success' && submittedData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-surface border border-line rounded-2xl p-6 md:p-8 relative overflow-hidden"
        role="status"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, #7fd9c1, #1e4e8c, #b8893b)' }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{
            background: 'rgba(127, 217, 193, 0.14)',
            border: '1px solid rgba(127, 217, 193, 0.4)',
            color: '#0a8159',
          }}
        >
          <CheckCircle2 size={28} strokeWidth={1.75} />
        </motion.div>

        <h3 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight mb-2">
          {channel === 'endpoint' ? 'Brief received.' : 'Opening your email client.'}
        </h3>
        <p className="text-ink-2 text-sm md:text-base mb-5 max-w-md">
          {channel === 'endpoint' ? (
            <>
              Thanks, {submittedData.name.split(' ')[0]}. The cell has your enquiry for{' '}
              <span className="font-semibold text-ink">{submittedData.organization}</span>.
              A coordinator will be in touch from{' '}
              <span className="font-mono text-accent">placement@svc.ac.in</span>{' '}
              within one working day.
            </>
          ) : (
            <>
              Thanks, {submittedData.name.split(' ')[0]}. We have opened your email client with this
              brief for <span className="font-semibold text-ink">{submittedData.organization}</span>{' '}
              pre-filled. Please press send. If nothing opened, email us directly at{' '}
              <span className="font-mono text-accent">placement@svc.ac.in</span>.
            </>
          )}
        </p>

        <div className="bg-bg-2 rounded-lg p-4 mb-5 space-y-1.5 text-sm">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            {channel === 'endpoint' ? 'What we have on file' : 'In this brief'}
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-ink-3">Contact</span>
            <span className="text-ink truncate">{submittedData.email}</span>
          </div>
          {submittedData.phone && (
            <div className="flex justify-between gap-3">
              <span className="text-ink-3">Phone</span>
              <span className="text-ink">{submittedData.phone}</span>
            </div>
          )}
          {submittedData.preferredSectors && submittedData.preferredSectors.length > 0 && (
            <div className="flex justify-between gap-3">
              <span className="text-ink-3 flex-shrink-0">Sectors</span>
              <span className="text-ink text-right">{submittedData.preferredSectors.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startAnother}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-surface text-sm font-medium hover:bg-[#5048e0] transition-colors"
          >
            Submit another brief
          </button>
          <button
            type="button"
            onClick={openInMailClient}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-ink-2 text-sm hover:border-accent hover:text-accent transition-colors"
          >
            <Mail size={14} strokeWidth={2} />
            Open in mail client
          </button>
        </div>
      </motion.div>
    );
  }

  // FORM STATE
  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface border border-line rounded-2xl p-5 md:p-8 space-y-5"
        noValidate
      >
        {/* Honeypot: visually hidden, off-screen, and skipped by keyboard/AT.
            Real users leave it empty; a filled value marks a bot. */}
        <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
          <label>
            Leave this field empty
            <input type="text" tabIndex={-1} autoComplete="off" {...register('_hp')} />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          <div>
            <label className={label} htmlFor="r-name">Your name</label>
            <input
              id="r-name"
              autoComplete="name"
              className={field}
              placeholder="Jane Doe"
              {...register('name')}
            />
            {errors.name && <p className={error}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="r-org">Organization</label>
            <input
              id="r-org"
              autoComplete="organization"
              className={field}
              placeholder="Acme Inc."
              {...register('organization')}
            />
            {errors.organization && <p className={error}>{errors.organization.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          <div>
            <label className={label} htmlFor="r-email">Work email</label>
            <input
              id="r-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className={field}
              placeholder="you@company.com"
              {...register('email')}
            />
            {errors.email && <p className={error}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="r-phone">Phone (optional)</label>
            <input
              id="r-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className={field}
              placeholder="+91 ..."
              {...register('phone')}
            />
          </div>
        </div>

        <div>
          <label className={label}>Preferred sectors (optional)</label>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <label
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-2 border border-line text-xs text-ink-2 cursor-pointer hover:border-accent hover:text-ink transition-colors has-[:checked]:bg-accent has-[:checked]:border-accent has-[:checked]:text-surface"
              >
                <input
                  type="checkbox"
                  value={s}
                  {...register('preferredSectors')}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={label} htmlFor="r-brief">Hiring brief</label>
          <textarea
            id="r-brief"
            className={cn(field, 'min-h-[120px] md:min-h-[140px] resize-y')}
            placeholder="Role, eligibility, location, headcount, target timeline..."
            {...register('hiringBrief')}
          />
          {errors.hiringBrief && <p className={error}>{errors.hiringBrief.message}</p>}
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-2">
          <input type="checkbox" {...register('consent')} className="mt-1 accent-accent" />
          <span>
            I agree to the cell&apos;s recruiter privacy notice and consent to being contacted regarding this brief.
          </span>
        </label>
        {errors.consent && <p className={error}>{errors.consent.message}</p>}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-surface text-sm font-medium hover:bg-[#5048e0] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] shadow-[0_4px_14px_-4px_rgba(30, 78, 140,0.4)] hover:shadow-[0_8px_20px_-6px_rgba(30, 78, 140,0.55)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {submitState === 'submitting' ? (
                <motion.span
                  key="loading"
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  Send to the cell
                  <Send size={14} strokeWidth={2.25} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <span className="text-xs text-ink-3 font-mono">
            Draft auto-saves. Reply within one working day.
          </span>
        </div>
      </motion.form>
    </>
  );
}

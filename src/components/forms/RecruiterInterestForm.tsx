import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils/cn';
import type { RecruiterSector } from '@/types';
import { openMailto, submitForm, type SubmitChannel } from './submit';
import {
  glassPanel,
  fieldBase,
  labelBase,
  submitBtn,
  ghostBtn,
  helperText,
  chipBase,
  consentRow,
  checkboxBase,
  fieldAria,
  FieldError,
} from './fields';

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

  // SUCCESS STATE
  if (submitState === 'success' && submittedData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(glassPanel, 'relative overflow-hidden')}
        role="status"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, rgb(var(--accent)), rgb(var(--gold)))' }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold"
        >
          <CheckCircle2 size={28} strokeWidth={1.75} />
        </motion.div>

        <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {channel === 'endpoint' ? 'Brief received.' : 'Opening your email client.'}
        </h3>
        <p className="mb-5 max-w-md text-sm text-ink-2 md:text-base">
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

        <div className="mb-6 space-y-1.5 rounded-xl border border-line bg-surface/50 p-4 text-sm backdrop-blur-sm">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            {channel === 'endpoint' ? 'What we have on file' : 'In this brief'}
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-ink-3">Contact</span>
            <span className="truncate text-ink">{submittedData.email}</span>
          </div>
          {submittedData.phone && (
            <div className="flex justify-between gap-3">
              <span className="text-ink-3">Phone</span>
              <span className="text-ink">{submittedData.phone}</span>
            </div>
          )}
          {submittedData.preferredSectors && submittedData.preferredSectors.length > 0 && (
            <div className="flex justify-between gap-3">
              <span className="flex-shrink-0 text-ink-3">Sectors</span>
              <span className="text-right text-ink">{submittedData.preferredSectors.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={startAnother} className={submitBtn}>
            Submit another brief
          </button>
          <button type="button" onClick={openInMailClient} className={ghostBtn}>
            <Mail size={15} strokeWidth={2} />
            Open in mail client
          </button>
        </div>
      </motion.div>
    );
  }

  // FORM STATE
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(onSubmit)}
      className={cn(glassPanel, 'space-y-5')}
      noValidate
    >
      {/* Honeypot: visually hidden, off-screen, and skipped by keyboard/AT.
          Real users leave it empty; a filled value marks a bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" className={fieldBase} {...register('_hp')} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="r-name">Your name</label>
          <input
            id="r-name"
            autoComplete="name"
            className={fieldBase}
            placeholder="Full name"
            {...fieldAria('r-name', !!errors.name)}
            {...register('name')}
          />
          <FieldError id="r-name" message={errors.name?.message} />
        </div>
        <div>
          <label className={labelBase} htmlFor="r-org">Organization</label>
          <input
            id="r-org"
            autoComplete="organization"
            className={fieldBase}
            placeholder="Company or firm"
            {...fieldAria('r-org', !!errors.organization)}
            {...register('organization')}
          />
          <FieldError id="r-org" message={errors.organization?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="r-email">Work email</label>
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={fieldBase}
            placeholder="name@company.com"
            {...fieldAria('r-email', !!errors.email)}
            {...register('email')}
          />
          <FieldError id="r-email" message={errors.email?.message} />
        </div>
        <div>
          <label className={labelBase} htmlFor="r-phone">Phone (optional)</label>
          <input
            id="r-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={fieldBase}
            placeholder="+91"
            {...register('phone')}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelBase}>Preferred sectors (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <label key={s} className={chipBase}>
              <input type="checkbox" value={s} {...register('preferredSectors')} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelBase} htmlFor="r-brief">Hiring brief</label>
        <textarea
          id="r-brief"
          className={cn(fieldBase, 'min-h-[120px] resize-y md:min-h-[140px]')}
          placeholder="Role, eligibility, location, headcount, target timeline..."
          {...fieldAria('r-brief', !!errors.hiringBrief)}
          {...register('hiringBrief')}
        />
        <FieldError id="r-brief" message={errors.hiringBrief?.message} />
      </div>

      <div>
        <label className={consentRow}>
          <input type="checkbox" className={checkboxBase} {...fieldAria('r-consent', !!errors.consent)} {...register('consent')} />
          <span>
            I agree to the cell&apos;s recruiter privacy notice and consent to being contacted regarding this brief.
          </span>
        </label>
        <FieldError id="r-consent" message={errors.consent?.message} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={submitState === 'submitting'} className={submitBtn}>
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
                <Loader2 size={15} className="animate-spin" />
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
                <Send size={15} strokeWidth={2.25} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <span className={helperText}>
          Draft auto-saves. Reply within one working day.
        </span>
      </div>
    </motion.form>
  );
}

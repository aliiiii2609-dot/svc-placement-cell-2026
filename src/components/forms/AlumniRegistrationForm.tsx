import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils/cn';
import { openMailto, submitForm, type SubmitChannel } from './submit';
import {
  glassPanel,
  fieldBase,
  selectBase,
  labelBase,
  submitBtn,
  ghostBtn,
  helperText,
  consentRow,
  checkboxBase,
  fieldAria,
  FieldError,
  SelectShell,
} from './fields';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  course: z.string().min(2, 'Your SVC course is required'),
  graduatingYear: z.coerce.number().int().min(1961).max(new Date().getFullYear()),
  currentRole: z.string().min(2, 'Current role required'),
  currentCompany: z.string().min(1, 'Current company required'),
  email: z.string().email('A valid email is required'),
  city: z.string().optional(),
  openToMentoring: z.enum(['open', 'limited', 'paused']),
  consent: z.boolean().refine((v) => v === true, { message: 'Public-listing consent is required' }),
});

// `_hp` is a framework-agnostic honeypot, not part of the Zod schema.
type FormValues = z.input<typeof schema> & { _hp?: string };

const DRAFT_KEY = 'svc-form-alumni-registration';

function buildRegistration(data: z.infer<typeof schema>): { subject: string; body: string } {
  const subject = `Alumni registration: ${data.fullName} (${data.graduatingYear})`;
  const body =
    `Name: ${data.fullName}\nSVC Course: ${data.course}\nGraduating Year: ${data.graduatingYear}\n` +
    `Current Role: ${data.currentRole}\nCurrent Company: ${data.currentCompany}\nEmail: ${data.email}\n` +
    `City: ${data.city ?? ''}\nMentoring availability: ${data.openToMentoring}\n\n` +
    `Note: profile will enter the verification queue. The cell will confirm publication within 5 working days.`;
  return { subject, body };
}

export function AlumniRegistrationForm() {
  const toast = useToast();
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [channel, setChannel] = useState<SubmitChannel>('endpoint');
  const [submittedData, setSubmittedData] = useState<z.infer<typeof schema> | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: (() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : { openToMentoring: 'open', consent: false };
      } catch { return { openToMentoring: 'open', consent: false }; }
    })(),
  });

  const values = watch();
  useEffect(() => {
    if (submitState === 'success') return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(values)); } catch { /* non-fatal */ }
  }, [values, submitState]);

  const onSubmit = async (raw: FormValues) => {
    // Honeypot: real users never fill this. Abort silently for bots.
    if (raw._hp) return;

    const result = schema.safeParse(raw);
    if (!result.success) {
      toast('Please check the highlighted fields', 'error');
      return;
    }
    const data = result.data;
    setSubmitState('submitting');

    const { subject, body } = buildRegistration(data);
    const usedChannel = await submitForm({
      payload: {
        fullName: data.fullName,
        course: data.course,
        graduatingYear: data.graduatingYear,
        currentRole: data.currentRole,
        currentCompany: data.currentCompany,
        email: data.email,
        city: data.city ?? '',
        openToMentoring: data.openToMentoring,
      },
      subject,
      body,
    });

    setChannel(usedChannel);
    setSubmittedData(data);
    setSubmitState('success');
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* non-fatal */ }
  };

  const startAnother = () => {
    setSubmittedData(null);
    setSubmitState('idle');
    reset({ openToMentoring: 'open', consent: false });
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

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <CheckCircle2 size={28} strokeWidth={1.75} />
        </div>

        <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {channel === 'endpoint' ? 'Registration received.' : 'Opening your email client.'}
        </h3>
        <p className="mb-6 max-w-md text-sm text-ink-2 md:text-base">
          {channel === 'endpoint' ? (
            <>
              Thanks, {submittedData.fullName.split(' ')[0]}. Your profile enters the verification
              queue and the cell will confirm publication within 5 working days from{' '}
              <span className="font-mono text-accent">placement@svc.ac.in</span>.
            </>
          ) : (
            <>
              We have opened your email client with your registration pre-filled. Please press send;
              your profile enters the verification queue once we receive it. If nothing opened, email
              us directly at <span className="font-mono text-accent">placement@svc.ac.in</span>.
            </>
          )}
        </p>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={startAnother} className={submitBtn}>
            Register another profile
          </button>
          {channel === 'mailto' && (
            <button
              type="button"
              onClick={() => {
                const { subject, body } = buildRegistration(submittedData);
                openMailto(subject, body);
              }}
              className={ghostBtn}
            >
              Open in mail client
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(onSubmit)}
      className={cn(glassPanel, 'space-y-5')}
      noValidate
    >
      {/* Honeypot: visually hidden, off-screen, skipped by keyboard/AT. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" className={fieldBase} {...register('_hp')} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="a-name">Full name</label>
          <input
            id="a-name"
            className={fieldBase}
            placeholder="As it appears in your degree"
            {...fieldAria('a-name', !!errors.fullName)}
            {...register('fullName')}
          />
          <FieldError id="a-name" message={errors.fullName?.message} />
        </div>
        <div>
          <label className={labelBase} htmlFor="a-email">Email</label>
          <input
            id="a-email"
            type="email"
            className={fieldBase}
            placeholder="name@email.com"
            {...fieldAria('a-email', !!errors.email)}
            {...register('email')}
          />
          <FieldError id="a-email" message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="a-course">SVC course</label>
          <input
            id="a-course"
            className={fieldBase}
            placeholder="B.Com (H), B.A. (H) Economics, etc."
            {...fieldAria('a-course', !!errors.course)}
            {...register('course')}
          />
          <FieldError id="a-course" message={errors.course?.message} />
        </div>
        <div>
          <label className={labelBase} htmlFor="a-year">Graduating year</label>
          <input
            id="a-year"
            type="number"
            inputMode="numeric"
            className={fieldBase}
            placeholder="e.g. 2015"
            {...fieldAria('a-year', !!errors.graduatingYear)}
            {...register('graduatingYear')}
          />
          <FieldError id="a-year" message={errors.graduatingYear?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="a-role">Current role</label>
          <input
            id="a-role"
            className={fieldBase}
            placeholder="Title at your current organization"
            {...fieldAria('a-role', !!errors.currentRole)}
            {...register('currentRole')}
          />
          <FieldError id="a-role" message={errors.currentRole?.message} />
        </div>
        <div>
          <label className={labelBase} htmlFor="a-company">Current organization</label>
          <input
            id="a-company"
            className={fieldBase}
            placeholder="Where you work now"
            {...fieldAria('a-company', !!errors.currentCompany)}
            {...register('currentCompany')}
          />
          <FieldError id="a-company" message={errors.currentCompany?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        <div>
          <label className={labelBase} htmlFor="a-city">City (optional)</label>
          <input id="a-city" className={fieldBase} placeholder="Where you are based" {...register('city')} />
        </div>
        <div>
          <label className={labelBase} htmlFor="a-mentor">Mentoring availability</label>
          <SelectShell>
            <select id="a-mentor" className={selectBase} {...register('openToMentoring')}>
              <option value="open">Open (multiple students per cycle)</option>
              <option value="limited">Limited (one or two per cycle)</option>
              <option value="paused">Paused (not available now)</option>
            </select>
          </SelectShell>
        </div>
      </div>

      <div>
        <label className={consentRow}>
          <input type="checkbox" className={checkboxBase} {...fieldAria('a-consent', !!errors.consent)} {...register('consent')} />
          <span>
            I consent to my profile being publicly listed in the alumni directory after verification. I understand that no SVC-era placement record will be paired with my profile.
          </span>
        </label>
        <FieldError id="a-consent" message={errors.consent?.message} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={submitState === 'submitting'} className={submitBtn}>
          {submitState === 'submitting' ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for verification'
          )}
        </button>
        <span className={helperText}>
          Draft auto-saves. The cell will confirm publication within 5 working days.
        </span>
      </div>
    </motion.form>
  );
}

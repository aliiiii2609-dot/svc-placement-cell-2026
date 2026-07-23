import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils/cn';
import { openMailto, submitForm, type SubmitChannel } from './submit';

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

  const field = 'w-full bg-bg-2 border border-line rounded-lg px-4 py-2.5 text-ink placeholder-ink-3 focus:border-accent focus:outline-none transition-colors';
  const label = 'block text-xs font-mono uppercase tracking-widest text-ink-3 mb-1.5';
  const error = 'text-xs text-red mt-1';

  // SUCCESS STATE
  if (submitState === 'success' && submittedData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-surface border border-line rounded-2xl p-6 md:p-8"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{
            background: 'rgba(127, 217, 193, 0.14)',
            border: '1px solid rgba(127, 217, 193, 0.4)',
            color: '#0a8159',
          }}
        >
          <CheckCircle2 size={28} strokeWidth={1.75} />
        </div>

        <h3 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight mb-2">
          {channel === 'endpoint' ? 'Registration received.' : 'Opening your email client.'}
        </h3>
        <p className="text-ink-2 text-sm md:text-base mb-5 max-w-md">
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
          <button
            type="button"
            onClick={startAnother}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors"
          >
            Register another profile
          </button>
          {channel === 'mailto' && (
            <button
              type="button"
              onClick={() => {
                const { subject, body } = buildRegistration(submittedData);
                openMailto(subject, body);
              }}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-line text-ink-2 hover:border-accent hover:text-accent transition-colors"
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
      className="bg-surface border border-line rounded-2xl p-6 md:p-8 space-y-5"
      noValidate
    >
      {/* Honeypot: visually hidden, off-screen, skipped by keyboard/AT. */}
      <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register('_hp')} />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="a-name">Full name</label>
          <input id="a-name" className={field} placeholder="As it appears in your degree" {...register('fullName')} />
          {errors.fullName && <p className={error}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="a-email">Email</label>
          <input id="a-email" type="email" className={field} placeholder="your@email.com" {...register('email')} />
          {errors.email && <p className={error}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="a-course">SVC course</label>
          <input id="a-course" className={field} placeholder="B.Com (H), B.A. (H) Economics, etc." {...register('course')} />
          {errors.course && <p className={error}>{errors.course.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="a-year">Graduating year</label>
          <input id="a-year" type="number" className={field} placeholder="e.g. 2015" {...register('graduatingYear')} />
          {errors.graduatingYear && <p className={error}>{errors.graduatingYear.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="a-role">Current role</label>
          <input id="a-role" className={field} placeholder="Title at your current organization" {...register('currentRole')} />
          {errors.currentRole && <p className={error}>{errors.currentRole.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="a-company">Current organization</label>
          <input id="a-company" className={field} placeholder="Where you work now" {...register('currentCompany')} />
          {errors.currentCompany && <p className={error}>{errors.currentCompany.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="a-city">City (optional)</label>
          <input id="a-city" className={field} placeholder="Where you are based" {...register('city')} />
        </div>
        <div>
          <label className={label} htmlFor="a-mentor">Mentoring availability</label>
          <select id="a-mentor" className={cn(field, 'appearance-none')} {...register('openToMentoring')}>
            <option value="open">Open (multiple students per cycle)</option>
            <option value="limited">Limited (one or two per cycle)</option>
            <option value="paused">Paused (not available now)</option>
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-2">
        <input type="checkbox" {...register('consent')} className="mt-1 accent-gold" />
        <span>
          I consent to my profile being publicly listed in the alumni directory after verification. I understand that no SVC-era placement record will be paired with my profile.
        </span>
      </label>
      {errors.consent && <p className={error}>{errors.consent.message}</p>}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitState === 'submitting' ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for verification'
          )}
        </button>
        <span className="text-xs text-ink-3 font-mono">
          Draft auto-saves. The cell will confirm publication within 5 working days.
        </span>
      </div>
    </motion.form>
  );
}

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
  fieldAria,
  FieldError,
  SelectShell,
} from './fields';

const schema = z.object({
  name: z.string().optional(),
  course: z.string().min(2, 'Course is required'),
  topic: z.enum(['process', 'drive', 'mentor', 'suggestion']),
  message: z.string().min(20, 'Please share a little more detail (20+ characters)'),
});

// `_hp` is a framework-agnostic honeypot, not part of the Zod schema.
type FormValues = z.input<typeof schema> & { _hp?: string };

const DRAFT_KEY = 'svc-form-student-feedback';

function buildFeedback(data: z.infer<typeof schema>): { subject: string; body: string } {
  const subject = `Student feedback: ${data.topic}`;
  const body = `From: ${data.name?.trim() ? data.name : '(anonymous)'}\nCourse: ${data.course}\nTopic: ${data.topic}\n\n${data.message}`;
  return { subject, body };
}

export function StudentFeedbackForm() {
  const toast = useToast();
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [channel, setChannel] = useState<SubmitChannel>('endpoint');
  const [lastFeedback, setLastFeedback] = useState<z.infer<typeof schema> | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: (() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : { topic: 'process' };
      } catch { return { topic: 'process' }; }
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

    const { subject, body } = buildFeedback(data);
    const usedChannel = await submitForm({
      payload: {
        name: data.name?.trim() ? data.name : '(anonymous)',
        course: data.course,
        topic: data.topic,
        message: data.message,
      },
      subject,
      body,
    });

    setChannel(usedChannel);
    setLastFeedback(data);
    setSubmitState('success');
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* non-fatal */ }
  };

  const startAnother = () => {
    setLastFeedback(null);
    setSubmitState('idle');
    reset({ topic: 'process' });
  };

  // SUCCESS STATE
  if (submitState === 'success' && lastFeedback) {
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
          {channel === 'endpoint' ? 'Feedback received.' : 'Opening your email client.'}
        </h3>
        <p className="mb-6 max-w-md text-sm text-ink-2 md:text-base">
          {channel === 'endpoint'
            ? 'Thank you. The cell reviews every piece of feedback in its weekly review.'
            : (
              <>
                We have opened your email client with this feedback pre-filled. Please press send. If
                nothing opened, email us directly at{' '}
                <span className="font-mono text-accent">placement@svc.ac.in</span>.
              </>
            )}
        </p>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={startAnother} className={submitBtn}>
            Send more feedback
          </button>
          {channel === 'mailto' && (
            <button
              type="button"
              onClick={() => {
                const { subject, body } = buildFeedback(lastFeedback);
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
          <label className={labelBase} htmlFor="s-name">Name (optional, anonymous if blank)</label>
          <input id="s-name" className={fieldBase} placeholder="Your name or leave blank" {...register('name')} />
        </div>
        <div>
          <label className={labelBase} htmlFor="s-course">Course</label>
          <input
            id="s-course"
            className={fieldBase}
            placeholder="B.Com (H), B.A. (H) English..."
            {...fieldAria('s-course', !!errors.course)}
            {...register('course')}
          />
          <FieldError id="s-course" message={errors.course?.message} />
        </div>
      </div>

      <div>
        <label className={labelBase} htmlFor="s-topic">Topic</label>
        <SelectShell>
          <select id="s-topic" className={selectBase} {...register('topic')}>
            <option value="process">Cell process feedback</option>
            <option value="drive">Drive-specific feedback</option>
            <option value="mentor">Mentor or alumnus feedback</option>
            <option value="suggestion">A general suggestion</option>
          </select>
        </SelectShell>
      </div>

      <div>
        <label className={labelBase} htmlFor="s-msg">Your feedback</label>
        <textarea
          id="s-msg"
          className={cn(fieldBase, 'min-h-[160px] resize-y')}
          placeholder="What worked, what didn't, what we should change..."
          {...fieldAria('s-msg', !!errors.message)}
          {...register('message')}
        />
        <FieldError id="s-msg" message={errors.message?.message} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={submitState === 'submitting'} className={submitBtn}>
          {submitState === 'submitting' ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Sending...
            </>
          ) : (
            'Send to the cell'
          )}
        </button>
        <span className={helperText}>
          The cell reviews every piece of feedback in its weekly meeting.
        </span>
      </div>
    </motion.form>
  );
}

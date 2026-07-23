import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils/cn';
import { openMailto, submitForm, type SubmitChannel } from './submit';

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

  const field = 'w-full bg-bg-2 border border-line rounded-lg px-4 py-2.5 text-ink placeholder-ink-3 focus:border-accent focus:outline-none transition-colors';
  const label = 'block text-xs font-mono uppercase tracking-widest text-ink-3 mb-1.5';
  const error = 'text-xs text-red mt-1';

  // SUCCESS STATE
  if (submitState === 'success' && lastFeedback) {
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
          {channel === 'endpoint' ? 'Feedback received.' : 'Opening your email client.'}
        </h3>
        <p className="text-ink-2 text-sm md:text-base mb-5 max-w-md">
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
          <button
            type="button"
            onClick={startAnother}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors"
          >
            Send more feedback
          </button>
          {channel === 'mailto' && (
            <button
              type="button"
              onClick={() => {
                const { subject, body } = buildFeedback(lastFeedback);
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
          <label className={label} htmlFor="s-name">Name (optional, anonymous if blank)</label>
          <input id="s-name" className={field} placeholder="Your name or leave blank" {...register('name')} />
        </div>
        <div>
          <label className={label} htmlFor="s-course">Course</label>
          <input id="s-course" className={field} placeholder="B.Com (H), B.A. (H) English..." {...register('course')} />
          {errors.course && <p className={error}>{errors.course.message}</p>}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="s-topic">Topic</label>
        <select id="s-topic" className={cn(field, 'appearance-none')} {...register('topic')}>
          <option value="process">Cell process feedback</option>
          <option value="drive">Drive-specific feedback</option>
          <option value="mentor">Mentor or alumnus feedback</option>
          <option value="suggestion">A general suggestion</option>
        </select>
      </div>

      <div>
        <label className={label} htmlFor="s-msg">Your feedback</label>
        <textarea
          id="s-msg"
          className={cn(field, 'min-h-[160px] resize-y')}
          placeholder="What worked, what didn't, what we should change..."
          {...register('message')}
        />
        {errors.message && <p className={error}>{errors.message.message}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-accent text-bg font-medium hover:bg-[#e8b85d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitState === 'submitting' ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : (
            'Send to the cell'
          )}
        </button>
        <span className="text-xs text-ink-3 font-mono">
          The cell reviews every piece of feedback in its weekly meeting.
        </span>
      </div>
    </motion.form>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronDown } from 'lucide-react';
import { faq } from '@/lib/data/faq';
import type { FaqAudience } from '@/types';
import { cn } from '@/lib/utils/cn';

const audiences: Array<{ id: FaqAudience; label: string }> = [
  { id: 'recruiters', label: 'Recruiters' },
  { id: 'students', label: 'Students' },
  { id: 'alumni', label: 'Alumni' },
];

export function FaqAccordion() {
  const [active, setActive] = useState<FaqAudience>('recruiters');

  return (
    <section className="section-spacing bg-bg-2 border-t border-line" id="faq">
      <div className="container-svc">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-4 display-italic">
            Frequently asked questions.
          </h2>
          <p className="text-ink-2 text-lg">
            Recruiters, students, and alumni.
          </p>
        </motion.div>

        <Tabs.Root value={active} onValueChange={(v) => setActive(v as FaqAudience)}>
          <Tabs.List className="flex flex-wrap gap-2 mb-8">
            {audiences.map((a) => (
              <Tabs.Trigger
                key={a.id}
                value={a.id}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-mono uppercase tracking-widest border transition-all duration-300',
                  active === a.id
                    ? 'bg-accent text-surface border-accent shadow-md'
                    : 'bg-surface text-ink-2 border-line hover:border-accent hover:text-accent',
                )}
              >
                {a.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {audiences.map((a) => (
            <Tabs.Content key={a.id} value={a.id} className="focus:outline-none">
              <Accordion.Root type="single" collapsible className="space-y-2">
                {faq[a.id].map((entry, i) => (
                  <Accordion.Item
                    key={i}
                    value={`item-${i}`}
                    className="bg-surface border border-line rounded-xl overflow-hidden data-[state=open]:border-accent data-[state=open]:shadow-md transition-all duration-400"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group w-full flex items-center justify-between text-left p-5 text-ink hover:bg-bg-2 transition-colors">
                        <span className="font-display text-lg pr-6">{entry.question}</span>
                        <ChevronDown
                          size={18}
                          className="text-accent transition-transform duration-400 group-data-[state=open]:rotate-180 shrink-0"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                      <div className="px-5 pb-5 text-ink-2 leading-relaxed">{entry.answer}</div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}

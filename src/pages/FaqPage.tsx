import { FaqAccordion } from '@/components/faq/FaqAccordion';

export function FaqPage() {
  return (
    <>
      <section className="section-spacing border-b border-line">
        <div className="container-svc">
          <span className="eyebrow">FAQ</span>
          <h1 className="font-display text-5xl mt-3 display-italic">
            Frequently asked questions.
          </h1>
        </div>
      </section>
      <FaqAccordion />
    </>
  );
}

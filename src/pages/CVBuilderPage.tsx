import { useEffect, useRef, useState } from 'react';
import { Download, FileDown, FileText, Eye, Pencil, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVBuilderForm } from '@/components/cv-builder/CVBuilderForm';
import { IIMCalTemplate } from '@/components/cv-builder/IIMCalTemplate';
import { initData, STORAGE_KEY, TEMPLATES, type CVData, type TemplateId } from '@/components/cv-builder/types';
import { exportPDF, exportDocx } from '@/components/cv-builder/export';
import { useToast } from '@/components/ui/ToastProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

export function CVBuilderPage() {
  const toast = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CVData>(() => {
    if (typeof window === 'undefined') return initData();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with initData so any newly added fields get defaults.
        const fresh = initData();
        return {
          ...fresh,
          ...parsed,
          personal: { ...fresh.personal, ...parsed.personal },
        };
      }
    } catch { /* non-fatal */ }
    return initData();
  });
  const [templateId, setTemplateId] = useState<TemplateId>('iim-calcutta');
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);

  useEffect(() => {
    document.title = 'CV Builder · The Placement Cell · SVC';
  }, []);

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting('pdf');
    try {
      const filename = `${(data.personal.name || 'cv').toLowerCase().replace(/\s+/g, '-')}.pdf`;
      await exportPDF(previewRef.current, filename);
      toast('PDF generated. Check your downloads.', 'success');
    } catch (err) {
      console.error(err);
      toast('PDF export failed. Try again or refresh the page.', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleExportDocx = async () => {
    setExporting('docx');
    try {
      const filename = `${(data.personal.name || 'cv').toLowerCase().replace(/\s+/g, '-')}.docx`;
      await exportDocx(data, filename);
      toast('Word document generated. Check your downloads.', 'success');
    } catch (err) {
      console.error(err);
      toast('Word export failed. Try again or refresh the page.', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleClear = () => {
    if (!window.confirm('Clear the draft and start over? Your auto-saved CV will be erased.')) return;
    setData(initData());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* non-fatal */ }
    toast('Draft cleared.', 'success');
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'iim-calcutta':
      default:
        return <IIMCalTemplate data={data} />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      {/* Top bar */}
      <div className="container-svc">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-accent" strokeWidth={2} />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              CV Builder · auto-saved
            </span>
          </div>
          <h1
            className="font-display font-bold text-ink leading-[1.04] tracking-[-0.032em] mb-3 dark:text-white"
            style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}
          >
            Build a CV the cell signs off on.
          </h1>
          <p className="text-ink-2 text-sm md:text-base max-w-2xl dark:text-white/70">
            Fill the form. The preview on the right updates as you type. Export
            to PDF for a recruiter-ready file, or Word if you want to keep
            editing in another tool. Drafts auto-save locally.
          </p>
        </motion.div>

        {/* Template selector + actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                disabled={t.id !== 'iim-calcutta'}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-[12.5px] font-medium transition-all duration-300 ${
                  templateId === t.id
                    ? 'bg-accent border-accent text-white'
                    : 'border-line text-ink-2 hover:border-accent hover:text-accent dark:border-white/15 dark:text-white/65 dark:hover:text-accent'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={t.id !== 'iim-calcutta' ? 'Coming soon' : t.description}
              >
                {t.name}
                {t.id !== 'iim-calcutta' && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-60">soon</span>
                )}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line text-ink-2 text-[12.5px] hover:border-red hover:text-red transition-colors dark:border-white/15 dark:text-white/65"
            >
              <RotateCcw size={13} /> Clear
            </button>
            <button
              type="button"
              onClick={handleExportDocx}
              disabled={!!exporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-line text-ink text-[12.5px] hover:border-accent hover:text-accent transition-colors disabled:opacity-60 dark:border-white/15 dark:text-white/85"
            >
              <FileText size={13} />
              {exporting === 'docx' ? 'Generating...' : 'Word (.docx)'}
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={!!exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-[12.5px] font-medium hover:bg-accent-deep transition-all duration-300 disabled:opacity-60 shadow-[0_4px_14px_-4px_rgba(99,91,255,0.4)]"
            >
              <FileDown size={13} />
              {exporting === 'pdf' ? 'Generating...' : 'PDF'}
            </button>
          </div>
        </motion.div>

        {/* Mobile view toggle */}
        <div className="lg:hidden mb-5">
          <div className="inline-flex p-1 bg-bg-2 border border-line rounded-full dark:bg-white/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setMobileView('form')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] transition-all ${
                mobileView === 'form' ? 'bg-surface text-ink dark:bg-white/10 dark:text-white' : 'text-ink-3'
              }`}
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] transition-all ${
                mobileView === 'preview' ? 'bg-surface text-ink dark:bg-white/10 dark:text-white' : 'text-ink-3'
              }`}
            >
              <Eye size={12} /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Two-column workspace */}
      <div className="container-svc">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 lg:gap-8 items-start">
          {/* Form column */}
          <div className={mobileView === 'form' ? 'block' : 'hidden lg:block'}>
            <CVBuilderForm data={data} setData={setData} />
          </div>

          {/* Preview column — sticky on desktop */}
          <div className={mobileView === 'preview' ? 'block' : 'hidden lg:block'}>
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                  Live preview · A4
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                  {TEMPLATES.find((t) => t.id === templateId)?.name}
                </div>
              </div>
              <div
                className="bg-white rounded-md shadow-lg border border-line overflow-hidden mx-auto"
                style={{ maxWidth: 720, aspectRatio: '210 / 297' }}
              >
                <div
                  ref={previewRef}
                  className="w-full h-full overflow-auto"
                  style={{ background: 'white' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={templateId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {renderTemplate()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-3 px-1 flex items-center gap-2 text-[11px] text-ink-3">
                <Download size={11} />
                <span>Use the buttons above to export PDF or Word.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

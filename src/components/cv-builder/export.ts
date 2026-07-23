import type { CVData } from './types';
import type { Paragraph as DocxParagraph, Table as DocxTable } from 'docx';

// Heavy libraries (jspdf, html2canvas, docx, file-saver) are dynamically
// imported inside the export functions below. This keeps them out of the
// main bundle: a user who never opens the CV builder never downloads them.

/**
 * Export the visible CV preview as a PDF.
 *
 * Strategy: rasterise the preview DOM node to canvas via html2canvas at
 * 2× device pixel ratio, then place onto an A4 jsPDF page sized to fit.
 * Multi-page splitting is handled by checking total image height against
 * the A4 page height and pushing additional pages as needed.
 *
 * Caveat: the output is a raster image, so text isn't searchable. This
 * is the trade-off for guaranteeing 1:1 visual fidelity across templates
 * with complex CSS. For text-searchable output, see exportDocx().
 */
export async function exportPDF(previewElement: HTMLElement, filename = 'cv.pdf'): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  // Force white background and dark text during capture even if the
  // surrounding page is in dark mode.
  const original = {
    background: previewElement.style.background,
    color: previewElement.style.color,
  };
  previewElement.style.background = '#ffffff';
  previewElement.style.color = '#111111';

  try {
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    previewElement.style.background = original.background;
    previewElement.style.color = original.color;
  }
}

/**
 * Export the CV data as a Word (.docx) file.
 *
 * Strategy: build a Document programmatically using the docx library so
 * the output is fully editable, ATS-friendly, and searchable. Visual
 * styling is approximated (Times New Roman, narrow margins, banded
 * section headers in navy) but won't be a pixel match — it's a Word
 * document, not a screenshot.
 */
export async function exportDocx(data: CVData, filename = 'cv.docx'): Promise<void> {
  // Lazy-load heavy deps; only paid for when user actually exports.
  const [{ saveAs }, docxLib] = await Promise.all([
    import('file-saver'),
    import('docx'),
  ]);
  const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = docxLib;

  const NAVY = '1B2A4A';
  const FONT = 'Times New Roman';

  const sectionHeader = (text: string) =>
    new Paragraph({
      shading: { type: 'clear', fill: NAVY, color: 'auto' },
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          color: 'FFFFFF',
          size: 22,
          font: FONT,
        }),
      ],
    });

  const para = (text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; align?: typeof AlignmentType[keyof typeof AlignmentType] }) =>
    new Paragraph({
      alignment: opts?.align,
      children: [new TextRun({ text, bold: opts?.bold, italics: opts?.italic, size: opts?.size ?? 20, font: FONT })],
    });

  const bullet = (text: string) =>
    new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun({ text, size: 20, font: FONT })],
    });

  const p = data.personal;
  const blocks: (DocxParagraph | DocxTable)[] = [];

  // Header
  blocks.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: p.name.toUpperCase() || 'YOUR NAME', bold: true, color: NAVY, size: 32, font: FONT }),
      ],
    }),
  );

  if (p.program) blocks.push(para(p.program, { italic: true, align: AlignmentType.CENTER, size: 18 }));
  blocks.push(para(p.institution, { align: AlignmentType.CENTER, size: 18 }));

  const contactBits = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' | ');
  if (contactBits) {
    blocks.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: contactBits, size: 18, font: FONT, color: '666666' })],
      }),
    );
  }

  if (p.tags.some(Boolean)) {
    blocks.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        shading: { type: 'clear', fill: NAVY, color: 'auto' },
        children: [
          new TextRun({
            text: p.tags.filter(Boolean).join('   ·   '),
            bold: true,
            color: 'FFFFFF',
            size: 18,
            font: FONT,
          }),
        ],
      }),
    );
  }

  // EDUCATION as a table
  const edu = data.education.filter((e) => e.degree);
  if (edu.length > 0) {
    blocks.push(sectionHeader('Academic Qualifications'));

    const eduTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: ['Degree/Exam', 'Board/Institute', '%/CGPA', 'Year', 'Remarks'].map(
            (h) =>
              new TableCell({
                shading: { type: 'clear', fill: 'E4E8F0', color: 'auto' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: h, bold: true, size: 18, font: FONT })],
                  }),
                ],
              }),
          ),
        }),
        ...edu.map(
          (e) =>
            new TableRow({
              children: [e.degree, e.institution, e.score, e.year, e.remarks].map(
                (v) => new TableCell({ children: [para(v || '', { size: 18 })] }),
              ),
            }),
        ),
      ],
    });
    blocks.push(new Paragraph({ children: [], spacing: { after: 40 } }));
    blocks.push(eduTable);
    blocks.push(new Paragraph({ children: [], spacing: { after: 80 } }));
  }

  // ACHIEVEMENTS
  const ach = data.achievements.filter((a) => a.items.some((i) => i.text));
  if (ach.length > 0) {
    blocks.push(sectionHeader('Academic and Professional Achievements'));
    for (const group of ach) {
      blocks.push(para(group.category, { bold: true, size: 20 }));
      for (const item of group.items.filter((i) => i.text)) {
        blocks.push(bullet(`${item.text}${item.year ? ` (${item.year})` : ''}`));
      }
    }
  }

  // WORK EXPERIENCE
  const exp = data.experience.filter((e) => e.company);
  if (exp.length > 0) {
    blocks.push(sectionHeader('Work Experience'));
    for (const e of exp) {
      blocks.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.company, bold: true, size: 22, font: FONT }),
            ...(e.tag ? [new TextRun({ text: `  [${e.tag}]`, italics: true, size: 18, font: FONT, color: '666666' })] : []),
            new TextRun({ text: `\t${e.duration}`, size: 18, font: FONT }),
          ],
        }),
      );
      if (e.role) blocks.push(para(e.role, { italic: true, size: 20 }));
      for (const b of e.bullets.filter((bb) => bb.text)) blocks.push(bullet(b.text));
    }
  }

  // PROJECTS
  const projects = data.projects.filter((pr) => pr.title);
  if (projects.length > 0) {
    blocks.push(sectionHeader('Projects'));
    for (const pr of projects) {
      blocks.push(
        new Paragraph({
          children: [
            new TextRun({ text: pr.title, bold: true, size: 22, font: FONT }),
            new TextRun({ text: `\t${pr.duration}`, size: 18, font: FONT }),
          ],
        }),
      );
      if (pr.context) blocks.push(para(pr.context, { italic: true, size: 18 }));
      for (const b of pr.bullets.filter((bb) => bb.text)) blocks.push(bullet(b.text));
    }
  }

  // POSITIONS
  const pos = data.positions.filter((po) => po.role);
  if (pos.length > 0) {
    blocks.push(sectionHeader('Positions of Responsibility'));
    for (const po of pos) {
      blocks.push(
        new Paragraph({
          children: [
            new TextRun({ text: po.role, bold: true, size: 22, font: FONT }),
            new TextRun({ text: `\t${po.year}`, size: 18, font: FONT }),
          ],
        }),
      );
      if (po.organization) blocks.push(para(po.organization, { italic: true, size: 18 }));
      for (const b of po.bullets.filter((bb) => bb.text)) blocks.push(bullet(b.text));
    }
  }

  // EXTRACURRICULAR
  const ec = data.extraCurricular.filter((e) => e.items.some((i) => i.text));
  if (ec.length > 0) {
    blocks.push(sectionHeader('Extracurricular Activities'));
    for (const group of ec) {
      blocks.push(para(group.category, { bold: true, size: 20 }));
      for (const item of group.items.filter((i) => i.text)) {
        blocks.push(bullet(`${item.text}${item.year ? ` (${item.year})` : ''}`));
      }
    }
  }

  // COMPETITIONS
  const comps = data.competitions.filter((c) => c.detail);
  if (comps.length > 0) {
    blocks.push(sectionHeader('Competitions'));
    for (const c of comps) {
      blocks.push(bullet(`${c.rank ? c.rank + ': ' : ''}${c.detail}${c.year ? ` (${c.year})` : ''}`));
    }
  }

  // SKILLS / CERTS / LANGUAGES
  const skills = data.skills.filter((s) => s.text);
  const certs = data.certifications.filter((c) => c.text);
  const langs = data.languages.filter((l) => l.text);
  if (skills.length || certs.length || langs.length) {
    blocks.push(sectionHeader('Skills, Certifications, Languages'));
    if (skills.length) blocks.push(para(`Skills: ${skills.map((s) => s.text).join(', ')}`));
    if (certs.length) blocks.push(para(`Certifications: ${certs.map((c) => c.text).join(', ')}`));
    if (langs.length) blocks.push(para(`Languages: ${langs.map((l) => l.text).join(', ')}`));
  }

  const doc = new Document({
    creator: 'The Placement Cell, Sri Venkateswara College',
    description: 'CV generated by the SVC Placement Cell CV builder',
    title: `${p.name || 'CV'}`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: blocks,
      },
    ],
    styles: {
      default: {
        document: { run: { font: FONT, size: 20 } },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

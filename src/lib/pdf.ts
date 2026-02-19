import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AssessmentDraft, FormDef, QuestionDef, ResponseValue, ScoreResult } from "@/domain/forms";

const MARGIN = 14;
const PAGE_HEIGHT_BOTTOM = 282;
const PDF_FONT_FILE = "Arial.ttf";
const PDF_FONT_NAME = "ArialUnicode";
let pdfFontBase64: string | null = null;
let fontReadyPromise: Promise<void> | null = null;

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const ensurePdfFont = async (doc: jsPDF): Promise<void> => {
  if (!fontReadyPromise && !pdfFontBase64) {
    fontReadyPromise = fetch("/fonts/Arial.ttf")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Nu am putut încărca fontul PDF: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        pdfFontBase64 = arrayBufferToBase64(buffer);
      })
      .catch(() => {
        // fallback silently to default font if loading fails
      });
  }
  if (fontReadyPromise) {
    await fontReadyPromise;
  }

  if (pdfFontBase64) {
    doc.addFileToVFS(PDF_FONT_FILE, pdfFontBase64);
    doc.addFont(PDF_FONT_FILE, PDF_FONT_NAME, "normal");
  }

  try {
    doc.setFont(PDF_FONT_NAME, "normal");
  } catch {
    // fallback silently to default font if registration failed
  }
};

const splitAndDraw = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * 5;
};

const sectionTitleById = (form: FormDef, sectionId: string): string =>
  form.sections.find((s) => s.id === sectionId)?.title ?? sectionId;

const formatAnswer = (question: QuestionDef, response: ResponseValue | undefined, form: FormDef): string => {
  if (!response) return "—";
  if (question.type === "sentence_completion") {
    return response.textValue?.trim() || "—";
  }

  if (typeof response.numericValue !== "number") return "—";
  const section = form.sections.find((s) => s.id === question.sectionId);

  if (section?.answerDisplay === "number_only") {
    return String(response.numericValue);
  }

  if (!question.options || question.options.length === 0) {
    return String(response.numericValue);
  }

  if (question.type === "mcq_grouped" && response.selectedOptionId) {
    const match = question.options.find((o, idx) => {
      const key = o.id ?? `${question.id}_${o.value}_${idx}`;
      return key === response.selectedOptionId;
    });
    if (match) return `${match.value}. ${match.label}`;
  }

  const byValue = question.options.find((o) => o.value === response.numericValue);
  return byValue ? `${byValue.value}. ${byValue.label}` : String(response.numericValue);
};

export const exportAssessmentPdf = async (
  draft: AssessmentDraft,
  scores: ScoreResult[],
  forms: FormDef[],
): Promise<void> => {
  const doc = new jsPDF();
  await ensurePdfFont(doc);

  doc.setFillColor(18, 74, 122);
  doc.rect(0, 0, 210, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Raport evaluare psihologică", MARGIN, 15);
  doc.setFontSize(10);
  doc.text(`Data generării: ${new Date().toLocaleString("ro-RO")}`, MARGIN, 21);
  doc.setTextColor(20, 25, 33);

  const metaRows = [
    ["Nume", draft.respondent.nume ?? ""],
    ["Prenume", draft.respondent.prenume ?? ""],
    ["Vârstă", String(draft.respondent.varsta ?? "")],
    ["Sex", draft.respondent.sex ?? ""],
    ["Domiciliu", draft.respondent.domiciliu ?? ""],
    ["Statut marital", draft.respondent.statutMarital ?? ""],
  ];

  doc.setFontSize(12);
  doc.text("Date respondent", MARGIN, 32);
  autoTable(doc, {
    startY: 35,
    head: [["Câmp", "Valoare"]],
    body: metaRows,
    theme: "grid",
    headStyles: { fillColor: [230, 238, 248], textColor: [20, 25, 33] },
    styles: { font: PDF_FONT_NAME, fontSize: 10, overflow: "linebreak", cellPadding: 2.4 },
  });

  const scoresRows = scores.flatMap((score) => {
    const form = forms.find((f) => f.id === score.formId);
    const title = form?.title ?? score.formId;
    return Object.entries(score.totals).map(([bucket, value]) => [
      title,
      bucket === "global" ? "Global" : sectionTitleById(form ?? { id: score.formId, title, sections: [], questions: [] }, bucket),
      String(value),
      score.severityLabels[bucket] ?? "Nedefinit",
    ]);
  });

  const scoresStartY =
    (((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 45) + 10);
  doc.setFontSize(12);
  doc.text("Scoruri sintetice", MARGIN, scoresStartY - 3);
  autoTable(doc, {
    startY: scoresStartY,
    head: [["Formular", "Secțiune", "Scor", "Nivel"]],
    body: scoresRows,
    theme: "grid",
    headStyles: { fillColor: [230, 238, 248], textColor: [20, 25, 33] },
    styles: { font: PDF_FONT_NAME, fontSize: 10, overflow: "linebreak", cellPadding: 2.4 },
  });

  forms.forEach((form) => {
    doc.addPage();
    let y = 16;
    doc.setFillColor(239, 246, 255);
    doc.rect(MARGIN, y - 6, 182, 10, "F");
    doc.setFontSize(13);
    doc.text(`Răspunsuri - ${form.title}`, MARGIN + 2, y);
    y += 8;

    const responseMap = new Map((draft.responses[form.id] ?? []).map((r) => [r.questionId, r]));

    form.sections.forEach((section) => {
      if (y > PAGE_HEIGHT_BOTTOM - 40) {
        doc.addPage();
        y = 16;
      }

      doc.setFillColor(246, 250, 255);
      doc.rect(MARGIN, y - 5, 182, 8, "F");
      doc.setFontSize(11);
      doc.text(section.title, MARGIN + 2, y);
      y += 7;

      if (section.intro?.length) {
        doc.setFontSize(9);
        section.intro.forEach((line) => {
          y = splitAndDraw(doc, line, MARGIN + 2, y, 176) + 1;
          if (y > PAGE_HEIGHT_BOTTOM - 16) {
            doc.addPage();
            y = 16;
          }
        });
      }

      if (section.legend?.length) {
        doc.setFontSize(9);
        y = splitAndDraw(doc, "Legendă răspuns:", MARGIN + 2, y, 176) + 1;
        section.legend.forEach((line) => {
          y = splitAndDraw(doc, line, MARGIN + 4, y, 174) + 1;
          if (y > PAGE_HEIGHT_BOTTOM - 16) {
            doc.addPage();
            y = 16;
          }
        });
      }

      const sectionQuestions = form.questions.filter((q) => q.sectionId === section.id);
      const rows = sectionQuestions.map((q, idx) => [
        String(idx + 1),
        q.prompt,
        formatAnswer(q, responseMap.get(q.id), form),
      ]);

      autoTable(doc, {
        startY: y + 2,
        head: [["Nr.", "Item", "Răspuns"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [230, 238, 248], textColor: [20, 25, 33] },
        styles: { font: PDF_FONT_NAME, fontSize: 8.7, overflow: "linebreak", cellPadding: 2.2, valign: "top" },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 112 },
          2: { cellWidth: 58 },
        },
      });

      y = (((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 8);
    });
  });

  const safeName = `${draft.respondent.nume ?? "anonim"}-${draft.respondent.prenume ?? ""}`
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  const datePart = new Date().toISOString().slice(0, 10);
  doc.save(`evaluare-${safeName}-${datePart}.pdf`);
};

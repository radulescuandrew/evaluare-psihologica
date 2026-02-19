import { FormDef, FormId, QuestionDef, ResponseValue, ScoreResult } from "./forms";

export interface RangeLabel {
  min: number;
  max: number;
  label: string;
}

export type SeverityConfig = Record<FormId, Record<string, RangeLabel[]>>;

const defaultMaxForQuestion = (q: QuestionDef): number => {
  if (!q.options || q.options.length === 0) return 0;
  return Math.max(...q.options.map((o) => o.value));
};

const getNumericValue = (q: QuestionDef, r?: ResponseValue): number => {
  if (!r || typeof r.numericValue !== "number") return 0;
  if (!q.reverseScoring) return r.numericValue;
  const max = defaultMaxForQuestion(q);
  return max - r.numericValue + 1;
};

export const resolveSeverityLabel = (score: number, ranges: RangeLabel[] = []): string => {
  const found = ranges.find((r) => score >= r.min && score <= r.max);
  return found ? found.label : "Nedefinit";
};

export const computeFormScore = (
  formDef: FormDef,
  responses: ResponseValue[],
  severityConfig: SeverityConfig,
): ScoreResult => {
  const byId = new Map(responses.map((r) => [r.questionId, r]));
  const totals: Record<string, number> = { global: 0 };

  for (const q of formDef.questions) {
    if (q.type === "sentence_completion") continue;

    const v = getNumericValue(q, byId.get(q.id));
    totals.global += v;

    if (!totals[q.sectionId]) totals[q.sectionId] = 0;
    totals[q.sectionId] += v;
  }

  const severityLabels: Record<string, string> = {};
  const config = severityConfig[formDef.id] ?? {};
  for (const [bucket, score] of Object.entries(totals)) {
    severityLabels[bucket] = resolveSeverityLabel(score, config[bucket]);
  }

  return {
    formId: formDef.id,
    totals,
    severityLabels,
  };
};

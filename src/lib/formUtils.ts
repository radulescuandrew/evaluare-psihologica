import { AssessmentDraft, FormDef, FormId, QuestionDef, ResponseValue } from "@/domain/forms";

export const emptyDraft = (): AssessmentDraft => ({
  respondent: {
    dataCompletare: new Date().toISOString().slice(0, 10),
  },
  responses: {
    form1: [],
    form2: [],
    form3: [],
  },
  updatedAt: new Date().toISOString(),
});

export const getResponse = (responses: ResponseValue[], questionId: string): ResponseValue | undefined =>
  responses.find((r) => r.questionId === questionId);

export const upsertResponse = (
  list: ResponseValue[],
  payload: ResponseValue,
): ResponseValue[] => {
  const idx = list.findIndex((r) => r.questionId === payload.questionId);
  if (idx === -1) return [...list, payload];
  const next = [...list];
  next[idx] = payload;
  return next;
};

export const countMissingRequired = (form: FormDef, responses: ResponseValue[]): number => {
  const map = new Map(responses.map((r) => [r.questionId, r]));
  return form.questions.filter((q) => {
    if (!q.required) return false;
    const r = map.get(q.id);
    if (!r) return true;
    if (q.type === "sentence_completion") return !r.textValue || r.textValue.trim().length === 0;
    return typeof r.numericValue !== "number";
  }).length;
};

export const progressPercent = (form: FormDef, responses: ResponseValue[]): number => {
  const total = form.questions.length;
  if (total === 0) return 0;
  const map = new Map(responses.map((r) => [r.questionId, r]));
  const answered = form.questions.filter((q) => {
    const r = map.get(q.id);
    if (!r) return false;
    if (q.type === "sentence_completion") return Boolean(r.textValue && r.textValue.trim().length > 0);
    return typeof r.numericValue === "number";
  }).length;
  return Math.round((answered / total) * 100);
};

export const updateFormResponses = (
  draft: AssessmentDraft,
  formId: FormId,
  nextResponses: ResponseValue[],
): AssessmentDraft => ({
  ...draft,
  responses: {
    ...draft.responses,
    [formId]: nextResponses,
  },
  updatedAt: new Date().toISOString(),
});

export const updateRespondent = (
  draft: AssessmentDraft,
  partial: Partial<AssessmentDraft["respondent"]>,
): AssessmentDraft => ({
  ...draft,
  respondent: {
    ...draft.respondent,
    ...partial,
  },
  updatedAt: new Date().toISOString(),
});

export const groupQuestionsBySection = (form: FormDef): Record<string, QuestionDef[]> => {
  return form.questions.reduce<Record<string, QuestionDef[]>>((acc, q) => {
    if (!acc[q.sectionId]) acc[q.sectionId] = [];
    acc[q.sectionId].push(q);
    return acc;
  }, {});
};

export type FormId = "form1" | "form2" | "form3";

export type QuestionType =
  | "sentence_completion"
  | "likert_uniform"
  | "likert_reverse_keyed"
  | "mcq_grouped";

export interface ScaleOption {
  id?: string;
  value: number;
  label: string;
}

export interface QuestionDef {
  id: string;
  formId: FormId;
  sectionId: string;
  prompt: string;
  type: QuestionType;
  required: boolean;
  options?: ScaleOption[];
  reverseScoring?: boolean;
  groupId?: string;
}

export interface FormDef {
  id: FormId;
  title: string;
  sections: FormSectionDef[];
  questions: QuestionDef[];
}

export interface FormSectionDef {
  id: string;
  title: string;
  intro?: string[];
  legend?: string[];
  answerDisplay?: "full" | "number_only";
  sentenceStyle?: "block" | "inline";
}

export interface ResponseValue {
  questionId: string;
  textValue?: string;
  numericValue?: number;
  selectedOptionId?: string;
}

export interface AssessmentDraft {
  respondent: {
    nume?: string;
    prenume?: string;
    varsta?: number;
    sex?: "M" | "F" | "Altul";
    domiciliu?: string;
    statutMarital?: string;
    dataCompletare?: string;
  };
  responses: Record<FormId, ResponseValue[]>;
  updatedAt: string;
}

export interface ScoreResult {
  formId: FormId;
  totals: Record<string, number>;
  severityLabels: Record<string, string>;
}

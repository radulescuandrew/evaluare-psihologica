import { AssessmentDraft } from "@/domain/forms";

export const DRAFT_KEY = "epa:draft:v1";
export const SUBMISSIONS_KEY = "epa:submissions:v1";

interface VersionedPayload<T> {
  version: 1;
  data: T;
}

export interface StoredSubmission {
  id: string;
  draft: AssessmentDraft;
  createdAt: string;
}

const parseVersioned = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as VersionedPayload<T>;
    if (parsed.version !== 1) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeVersioned = <T>(key: string, data: T): void => {
  const payload: VersionedPayload<T> = { version: 1, data };
  localStorage.setItem(key, JSON.stringify(payload));
};

export const loadDraft = (): AssessmentDraft | null => parseVersioned<AssessmentDraft>(localStorage.getItem(DRAFT_KEY));

export const saveDraft = (draft: AssessmentDraft): void => {
  writeVersioned(DRAFT_KEY, draft);
};

export const clearDraft = (): void => {
  localStorage.removeItem(DRAFT_KEY);
};

export const loadSubmissions = (): StoredSubmission[] =>
  parseVersioned<StoredSubmission[]>(localStorage.getItem(SUBMISSIONS_KEY)) ?? [];

export const saveSubmission = (submission: StoredSubmission): void => {
  const existing = loadSubmissions();
  existing.unshift(submission);
  writeVersioned(SUBMISSIONS_KEY, existing);
};

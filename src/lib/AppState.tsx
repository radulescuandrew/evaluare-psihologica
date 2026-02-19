import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { AssessmentDraft, FormId, ResponseValue, ScoreResult } from "@/domain/forms";
import { clearDraft, loadDraft, saveDraft, saveSubmission } from "./storage";
import { emptyDraft, updateFormResponses, updateRespondent, upsertResponse } from "./formUtils";
import { forms, severityConfig } from "@/data/forms";
import { computeFormScore } from "@/domain/scoring";

type State = {
  draft: AssessmentDraft;
  savedAt: string | null;
};

type Action =
  | { type: "set_respondent"; payload: Partial<AssessmentDraft["respondent"]> }
  | { type: "set_response"; payload: { formId: FormId; response: ResponseValue } }
  | { type: "restore"; payload: AssessmentDraft }
  | { type: "reset" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set_respondent":
      return { ...state, draft: updateRespondent(state.draft, action.payload) };
    case "set_response": {
      const list = state.draft.responses[action.payload.formId] ?? [];
      const next = upsertResponse(list, action.payload.response);
      return { ...state, draft: updateFormResponses(state.draft, action.payload.formId, next) };
    }
    case "restore":
      return { ...state, draft: action.payload };
    case "reset":
      return { ...state, draft: emptyDraft() };
    default:
      return state;
  }
};

interface AppStateValue {
  state: State;
  setRespondent: (payload: Partial<AssessmentDraft["respondent"]>) => void;
  setResponse: (formId: FormId, response: ResponseValue) => void;
  computeScores: () => ScoreResult[];
  submitCurrent: () => ScoreResult[];
  resetDraft: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    draft: emptyDraft(),
    savedAt: null,
  });

  useEffect(() => {
    const restored = loadDraft();
    if (restored) dispatch({ type: "restore", payload: restored });
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      saveDraft(state.draft);
    }, 300);
    return () => window.clearTimeout(id);
  }, [state.draft]);

  const value = useMemo<AppStateValue>(() => {
    const computeScores = () =>
      forms.map((f) => computeFormScore(f, state.draft.responses[f.id], severityConfig));

    const submitCurrent = () => {
      const scores = computeScores();
      saveSubmission({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        draft: state.draft,
      });
      clearDraft();
      return scores;
    };

    return {
      state,
      setRespondent: (payload) => dispatch({ type: "set_respondent", payload }),
      setResponse: (formId, response) => dispatch({ type: "set_response", payload: { formId, response } }),
      computeScores,
      submitCurrent,
      resetDraft: () => dispatch({ type: "reset" }),
    };
  }, [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = (): AppStateValue => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};

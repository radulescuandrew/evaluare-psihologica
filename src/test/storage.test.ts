import { describe, expect, it, beforeEach } from "vitest";
import {
  DRAFT_KEY,
  SUBMISSIONS_KEY,
  clearDraft,
  loadDraft,
  loadSubmissions,
  saveDraft,
  saveSubmission,
} from "@/lib/storage";
import { emptyDraft } from "@/lib/formUtils";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("saves and loads draft", () => {
    const draft = emptyDraft();
    draft.respondent.nume = "Popescu";
    saveDraft(draft);

    const loaded = loadDraft();
    expect(loaded?.respondent.nume).toBe("Popescu");

    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it("handles corrupted payload fallback", () => {
    localStorage.setItem(DRAFT_KEY, "{not-json");
    expect(loadDraft()).toBeNull();

    localStorage.setItem(SUBMISSIONS_KEY, "bad");
    expect(loadSubmissions()).toEqual([]);
  });

  it("stores submissions list", () => {
    const draft = emptyDraft();
    saveSubmission({ id: "1", createdAt: new Date().toISOString(), draft });
    const list = loadSubmissions();
    expect(list).toHaveLength(1);
  });
});

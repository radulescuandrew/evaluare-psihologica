import { describe, expect, it } from "vitest";
import { countMissingRequired } from "@/lib/formUtils";
import { FormDef } from "@/domain/forms";

const form: FormDef = {
  id: "form1",
  title: "f",
  sections: [{ id: "a", title: "a" }],
  questions: [
    {
      id: "q1",
      formId: "form1",
      sectionId: "a",
      prompt: "q1",
      type: "sentence_completion",
      required: true,
    },
    {
      id: "q2",
      formId: "form1",
      sectionId: "a",
      prompt: "q2",
      type: "likert_uniform",
      required: true,
      options: [
        { value: 1, label: "x" },
        { value: 2, label: "y" },
      ],
    },
  ],
};

describe("countMissingRequired", () => {
  it("counts unanswered required questions", () => {
    const missing = countMissingRequired(form, [{ questionId: "q1", textValue: "ok" }]);
    expect(missing).toBe(1);
  });
});

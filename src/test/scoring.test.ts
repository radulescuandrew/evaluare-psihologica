import { describe, expect, it } from "vitest";
import { computeFormScore, resolveSeverityLabel } from "@/domain/scoring";
import { FormDef } from "@/domain/forms";

const form: FormDef = {
  id: "form2",
  title: "t",
  sections: [{ id: "sec", title: "sec" }],
  questions: [
    {
      id: "q1",
      formId: "form2",
      sectionId: "sec",
      prompt: "q1",
      type: "likert_uniform",
      required: true,
      options: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
      ],
    },
    {
      id: "q2",
      formId: "form2",
      sectionId: "sec",
      prompt: "q2",
      type: "likert_reverse_keyed",
      required: true,
      reverseScoring: true,
      options: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
      ],
    },
    {
      id: "q3",
      formId: "form2",
      sectionId: "sec",
      prompt: "q3",
      type: "mcq_grouped",
      required: true,
      options: [
        { value: 0, label: "0" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
      ],
      groupId: "g1",
    },
  ],
};

describe("scoring", () => {
  it("computes normal + reverse + grouped", () => {
    const res = computeFormScore(
      form,
      [
        { questionId: "q1", numericValue: 4 },
        { questionId: "q2", numericValue: 1 },
        { questionId: "q3", numericValue: 2 },
      ],
      {
        form1: {},
        form2: {
          global: [{ min: 0, max: 10, label: "ok" }],
          sec: [{ min: 0, max: 10, label: "ok" }],
        },
        form3: {},
      },
    );

    // q2 reversed with max=4, value=1 -> 4
    expect(res.totals.global).toBe(10);
    expect(res.totals.sec).toBe(10);
    expect(res.severityLabels.global).toBe("ok");
  });

  it("resolves inclusive boundaries", () => {
    const ranges = [
      { min: 0, max: 13, label: "A" },
      { min: 14, max: 19, label: "B" },
    ];
    expect(resolveSeverityLabel(13, ranges)).toBe("A");
    expect(resolveSeverityLabel(14, ranges)).toBe("B");
  });
});

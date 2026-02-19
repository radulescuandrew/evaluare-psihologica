import { FormDef } from "@/domain/forms";
import { form1Def } from "./form1";
import { form2Def } from "./form2";
import { form3Def } from "./form3_bdi2";
import { SeverityConfig } from "@/domain/scoring";

export const forms: FormDef[] = [form1Def, form2Def, form3Def];

export const severityConfig: SeverityConfig = {
  form1: {
    global: [
      { min: 0, max: 249, label: "Scăzut" },
      { min: 250, max: 449, label: "Mediu" },
      { min: 450, max: 9999, label: "Ridicat" },
    ],
    ysq: [
      { min: 0, max: 199, label: "Scăzut" },
      { min: 200, max: 399, label: "Mediu" },
      { min: 400, max: 9999, label: "Ridicat" },
    ],
    scl: [
      { min: 0, max: 12, label: "Scăzut" },
      { min: 13, max: 30, label: "Mediu" },
      { min: 31, max: 9999, label: "Ridicat" },
    ],
  },
  form2: {
    global: [
      { min: 0, max: 89, label: "Scăzut" },
      { min: 90, max: 169, label: "Mediu" },
      { min: 170, max: 9999, label: "Ridicat" },
    ],
    depr: [
      { min: 20, max: 44, label: "Scăzut" },
      { min: 45, max: 59, label: "Mediu" },
      { min: 60, max: 80, label: "Ridicat" },
    ],
    x1: [
      { min: 20, max: 37, label: "Scăzut" },
      { min: 38, max: 44, label: "Moderat" },
      { min: 45, max: 80, label: "Ridicat" },
    ],
    x2: [
      { min: 20, max: 37, label: "Scăzut" },
      { min: 38, max: 44, label: "Moderat" },
      { min: 45, max: 80, label: "Ridicat" },
    ],
  },
  form3: {
    global: [
      { min: 0, max: 13, label: "Minim" },
      { min: 14, max: 19, label: "Ușor" },
      { min: 20, max: 28, label: "Moderat" },
      { min: 29, max: 63, label: "Sever" },
    ],
    bdi2: [
      { min: 0, max: 13, label: "Minim" },
      { min: 14, max: 19, label: "Ușor" },
      { min: 20, max: 28, label: "Moderat" },
      { min: 29, max: 63, label: "Sever" },
    ],
  },
};

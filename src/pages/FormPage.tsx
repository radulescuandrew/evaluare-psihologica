import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { forms } from "@/data/forms";
import { useAppState } from "@/lib/AppState";
import { countMissingRequired, progressPercent } from "@/lib/formUtils";
import { FormSection } from "@/components/FormSection";

const pathByFormId = {
  form1: "/form/form1",
  form2: "/form/form2",
  form3: "/form/form3",
};

export function FormPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { state, setResponse } = useAppState();

  const form = useMemo(() => forms.find((f) => f.id === formId), [formId]);
  if (!form) return <p>Formular inexistent.</p>;

  const responses = state.draft.responses[form.id];
  const missing = countMissingRequired(form, responses);
  const progress = progressPercent(form, responses);

  const goNext = () => {
    if (missing > 0) return;
    if (form.id === "form1") navigate(pathByFormId.form2);
    else if (form.id === "form2") navigate(pathByFormId.form3);
    else navigate("/results");
  };

  return (
    <section className="page">
      <h1>{form.title}</h1>
      <p className="muted">Progres: {progress}% | Necompletate: {missing}</p>

      {form.sections.map((section) => (
        <FormSection
          key={section.id}
          form={form}
          sectionId={section.id}
          responses={responses}
          onChange={(response) => setResponse(form.id, response)}
        />
      ))}

      <div className="actions">
        <button type="button" onClick={() => navigate(-1)}>Înapoi</button>
        <button type="button" onClick={goNext} disabled={missing > 0}>Continuă</button>
      </div>
    </section>
  );
}

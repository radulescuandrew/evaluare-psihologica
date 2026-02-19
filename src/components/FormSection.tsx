import { FormDef, ResponseValue } from "@/domain/forms";
import { QuestionRenderer } from "./QuestionRenderer";

interface FormSectionProps {
  form: FormDef;
  sectionId: string;
  responses: ResponseValue[];
  onChange: (next: ResponseValue) => void;
}

export function FormSection({ form, sectionId, responses, onChange }: FormSectionProps) {
  const section = form.sections.find((s) => s.id === sectionId);
  const items = form.questions.filter((q) => q.sectionId === sectionId);
  const responseMap = new Map(responses.map((r) => [r.questionId, r]));

  return (
    <section className="form-section">
      <h2>{section?.title ?? sectionId}</h2>
      {section?.intro && section.intro.length > 0 && (
        <div className="section-intro">
          {section.intro.map((line) => (
            <p key={line} className="intro-line">
              {line}
            </p>
          ))}
        </div>
      )}
      {section?.legend && section.legend.length > 0 && (
        <div className="section-legend">
          <p className="legend-title">Legendă răspuns:</p>
          {section.legend.map((line) => (
            <p key={line} className="legend-line">
              {line}
            </p>
          ))}
        </div>
      )}
      {items.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          response={responseMap.get(q.id)}
          onChange={onChange}
          answerDisplay={section?.answerDisplay}
          sentenceStyle={section?.sentenceStyle}
        />
      ))}
    </section>
  );
}

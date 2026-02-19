import { QuestionDef, ResponseValue } from "@/domain/forms";

interface QuestionRendererProps {
  question: QuestionDef;
  response?: ResponseValue;
  onChange: (next: ResponseValue) => void;
  answerDisplay?: "full" | "number_only";
  sentenceStyle?: "block" | "inline";
}

export function QuestionRenderer({
  question,
  response,
  onChange,
  answerDisplay = "full",
  sentenceStyle = "block",
}: QuestionRendererProps) {
  const qid = `q-${question.id}`;

  if (question.type === "sentence_completion") {
    if (sentenceStyle === "inline") {
      return (
        <div className="question sentence-inline">
          <label htmlFor={qid}>{question.prompt}</label>
          <input
            id={qid}
            value={response?.textValue ?? ""}
            onChange={(e) =>
              onChange({
                questionId: question.id,
                textValue: e.target.value,
              })
            }
            placeholder="Completați propoziția..."
          />
        </div>
      );
    }

    return (
      <div className="question">
        <label htmlFor={qid}>{question.prompt}</label>
        <textarea
          id={qid}
          value={response?.textValue ?? ""}
          onChange={(e) =>
            onChange({
              questionId: question.id,
              textValue: e.target.value,
            })
          }
          rows={2}
        />
      </div>
    );
  }

  return (
    <fieldset className="question">
      <legend>{question.prompt}</legend>
      <div className="options-row">
        {question.options?.map((o, idx) => {
          const optionKey = o.id ?? `${question.id}_${o.value}_${idx}`;
          const isChecked =
            question.type === "mcq_grouped"
              ? response?.selectedOptionId === optionKey
              : response?.numericValue === o.value;

          return (
          <label key={optionKey} className="option-item">
            <input
              type="radio"
              name={qid}
              value={o.value}
              checked={isChecked}
              onChange={() =>
                onChange({
                  questionId: question.id,
                  numericValue: o.value,
                  selectedOptionId: optionKey,
                })
              }
            />
            <span>{answerDisplay === "number_only" ? o.value : `${o.value}. ${o.label}`}</span>
          </label>
        );
        })}
      </div>
    </fieldset>
  );
}

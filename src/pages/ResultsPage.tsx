import { forms } from "@/data/forms";
import { useAppState } from "@/lib/AppState";
import { exportAssessmentPdf } from "@/lib/pdf";
import { countMissingRequired } from "@/lib/formUtils";

export function ResultsPage() {
  const { state, computeScores, submitCurrent, resetDraft } = useAppState();
  const scores = computeScores();

  const totalMissing = forms.reduce((acc, form) => acc + countMissingRequired(form, state.draft.responses[form.id]), 0);
  const canFinalize = totalMissing === 0;

  const onExport = () => {
    void exportAssessmentPdf(state.draft, scores, forms);
  };

  const onFinalize = () => {
    if (!canFinalize) return;
    submitCurrent();
    resetDraft();
    alert("Evaluarea a fost salvată local și draftul a fost resetat.");
  };

  return (
    <section className="page">
      <h1>Rezultate și export</h1>
      <p className="muted warning">Atenție: datele sunt stocate doar local, în acest browser.</p>
      <p className="muted">Itemi necompletați în total: {totalMissing}</p>

      <div className="results-grid">
        {scores.map((score) => (
          <article key={score.formId} className="result-card">
            <h2>{forms.find((f) => f.id === score.formId)?.title}</h2>
            {Object.entries(score.totals).map(([bucket, val]) => (
              <p key={bucket}>
                <strong>{bucket}</strong>: {val} ({score.severityLabels[bucket]})
              </p>
            ))}
          </article>
        ))}
      </div>

      <div className="actions">
        <button type="button" onClick={onExport}>Descarcă PDF</button>
        <button type="button" onClick={onFinalize} disabled={!canFinalize}>Finalizează evaluarea</button>
      </div>
    </section>
  );
}

import { useAppState } from "@/lib/AppState";

export function RespondentPage() {
  const { state, setRespondent } = useAppState();
  const r = state.draft.respondent;

  return (
    <section className="page">
      <h1>Date respondent</h1>
      <p className="muted">Datele sunt stocate local în browserul curent.</p>

      <div className="grid-2">
        <label>
          Nume
          <input value={r.nume ?? ""} onChange={(e) => setRespondent({ nume: e.target.value })} />
        </label>
        <label>
          Prenume
          <input value={r.prenume ?? ""} onChange={(e) => setRespondent({ prenume: e.target.value })} />
        </label>
        <label>
          Vârstă
          <input
            type="number"
            value={r.varsta ?? ""}
            onChange={(e) => setRespondent({ varsta: e.target.value ? Number(e.target.value) : undefined })}
          />
        </label>
        <label>
          Sex
          <select value={r.sex ?? ""} onChange={(e) => setRespondent({ sex: (e.target.value || undefined) as typeof r.sex })}>
            <option value="">Selectează</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="Altul">Altul</option>
          </select>
        </label>
        <label>
          Domiciliu
          <input value={r.domiciliu ?? ""} onChange={(e) => setRespondent({ domiciliu: e.target.value })} />
        </label>
        <label>
          Statut marital
          <input value={r.statutMarital ?? ""} onChange={(e) => setRespondent({ statutMarital: e.target.value })} />
        </label>
      </div>
    </section>
  );
}

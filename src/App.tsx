import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Stepper } from "@/components/Stepper";
import { RespondentPage } from "@/pages/RespondentPage";
import { FormPage } from "@/pages/FormPage";
import { ResultsPage } from "@/pages/ResultsPage";

const steps = ["Date respondent", "Formular 1", "Formular 2", "Formular 3", "Rezultate"];

const stepIndex = (pathname: string): number => {
  if (pathname === "/") return 0;
  if (pathname === "/form/form1") return 1;
  if (pathname === "/form/form2") return 2;
  if (pathname === "/form/form3") return 3;
  return 4;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header>
        <h1>Evaluare Psihologică</h1>
        <Stepper steps={steps} current={stepIndex(location.pathname)} />
        <nav className="quick-nav">
          <button onClick={() => navigate("/")}>Date</button>
          <button onClick={() => navigate("/form/form1")}>Form 1</button>
          <button onClick={() => navigate("/form/form2")}>Form 2</button>
          <button onClick={() => navigate("/form/form3")}>Form 3</button>
          <button onClick={() => navigate("/results")}>Rezultate</button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<RespondentPage />} />
          <Route path="/form/:formId" element={<FormPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

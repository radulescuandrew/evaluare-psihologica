interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Progres completare">
      {steps.map((step, idx) => (
        <li key={step} className={idx <= current ? "active" : "inactive"}>
          <span className="index">{idx + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

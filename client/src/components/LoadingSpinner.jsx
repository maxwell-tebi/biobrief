import { useEffect, useState } from "react";

export default function LoadingSpinner() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStep(1), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="loading-state">
      <div className="loading-anim-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      <h2>Analyzing your results…</h2>
      <p>Our AI is cross-referencing your data with clinical standards to provide an empathetic, easy-to-understand translation.</p>

      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: step === 0 ? "38%" : "78%" }}
        />
      </div>

      <div className="loading-steps">
        <span className={`step-pill ${step >= 0 ? "done" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Parsing Lab Values
        </span>
        <span className={`step-pill ${step >= 1 ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Generating Explanations
        </span>
      </div>
    </div>
  );
}

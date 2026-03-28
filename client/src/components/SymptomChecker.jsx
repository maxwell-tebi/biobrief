import { useState } from "react";
import { analyzeSymptoms } from "../services/analyzeService";

function clean(str) {
  return str?.replace(/\*\*(.*?)\*\*/g, "$1").trim() ?? "";
}

export default function SymptomChecker({ flagged }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeSymptoms({ symptoms, flagged });
      setResult(data);
    } catch {
      setError("Request unavailable currently. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  const isTwi = language === "tw";
  const connection = isTwi ? result?.twi?.connection : result?.connection;
  const recommendation = isTwi ? result?.twi?.recommendation : result?.recommendation;

  return (
    <div className="symptom-checker">
      <div className="symptom-checker-header">
        <div className="section-title" style={{ marginBottom: "0.35rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.703-1.135 2.775l-8.078.406a2.25 2.25 0 01-2.276-1.76L9.12 18.5" />
          </svg>
          Symptom Check
        </div>
        <p className="symptom-checker-sub">
          Are you experiencing any symptoms? Describe them and we&apos;ll explain how they may connect to your flagged values.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="symptom-form">
        <textarea
          className="text-input"
          placeholder="e.g. I feel tired, have headaches, and sometimes feel dizzy..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
        />
        <button className="submit-btn" type="submit" disabled={loading || !symptoms.trim()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {loading ? "Analyzing symptoms…" : "Check My Symptoms"}
        </button>
      </form>

      {error && <div className="error-box" style={{ marginTop: "0.75rem" }}>{error}</div>}

      {result && (
        <div className="symptom-result">
          <div className="symptom-result-header">
            <span className="section-title" style={{ margin: 0 }}>Symptom Analysis</span>
            <div className="lang-toggle">
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button>
              <button type="button" className={language === "tw" ? "active" : ""} onClick={() => setLanguage("tw")}>Twi</button>
            </div>
          </div>

          <div className="symptom-result-body">
            <div className="symptom-card connection">
              <div className="symptom-card-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                {isTwi ? "Nsusuwii" : "How It Connects"}
              </div>
              <p>{clean(connection)}</p>
            </div>

            <div className="symptom-card recommendation">
              <div className="symptom-card-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                {isTwi ? "Nhyehyɛe" : "What To Do"}
              </div>
              <p>{clean(recommendation)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ResultPanel from "./components/ResultPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import SymptomChecker from "./components/SymptomChecker";
import ClinicFinder from "./pages/ClinicFinder";
import { analyzeImage, analyzeText } from "./services/analyzeService";
import "./App.css";

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-top">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2>Your results will appear here</h2>
        <p>Upload a document or paste text to receive a human-friendly explanation of your clinical data.</p>
        <div className="empty-badges">
          <span className="empty-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            AI-Powered Insights
          </span>
          <span className="empty-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
            </svg>
            Twi Translation
          </span>
        </div>
      </div>
      <div className="empty-disclaimer">
        <strong>Medical Disclaimer: </strong>
        This is not a medical diagnosis. This AI-powered tool provides translations and suggestions for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(input) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data =
        input.type === "image"
          ? await analyzeImage(input.file)
          : await analyzeText(input.text);
      setResult(data);
    } catch {
      setError("Request unavailable currently. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <span className="nav-logo">BioBrief</span>
        <div className="nav-links">
          <span
            className={`nav-link ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </span>
          <span
            className={`nav-link ${page === "clinics" ? "active" : ""}`}
            onClick={() => setPage("clinics")}
          >
            Clinics
          </span>
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" title="Help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r=".5" fill="currentColor" />
            </svg>
          </button>
          <button className="nav-icon-btn" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="nav-icon-btn" title="Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>
        </div>
      </nav>

      {page === "dashboard" && (
        <>
          <div className="layout">
            <aside className="left-panel">
              <h1 className="hero-title">Decode your health.</h1>
              <p className="hero-sub">
                Upload or paste your medical laboratory reports to receive a clear, human-centered explanation of your data.
              </p>
              <UploadPanel onSubmit={handleSubmit} loading={loading} />
            </aside>

            <main className="right-panel">
              {loading && <LoadingSpinner />}
              {error && <div className="error-box">{error}</div>}
              {!loading && !result && !error && <EmptyState />}
              {result && <ResultPanel result={result} />}
            </main>
          </div>

          {result && (
            <div className="symptom-section">
              <SymptomChecker flagged={result.english?.flagged ?? []} />
            </div>
          )}
        </>
      )}

      {page === "clinics" && <ClinicFinder />}

      <footer className="app-footer">
        <div className="footer-links">
          <a>Privacy Policy</a>
          <a>Terms of Service</a>
          <a>Medical Disclaimer</a>
          <a>Contact Support</a>
        </div>
        <p className="footer-copy">
          © 2026 BioBrief. Disclaimer: This AI-powered tool provides translations and suggestions for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </footer>
    </div>
  );
}

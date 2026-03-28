import { useState } from "react";
import LanguageToggle from "./LanguageToggle";

// Strip markdown bold markers the API sometimes includes
function clean(str) {
  return str?.replace(/\*\*(.*?)\*\*/g, "$1").trim() ?? "";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function randomId() {
  return Math.floor(10000 + Math.random() * 90000);
}

export default function ResultPanel({ result }) {
  const [language, setLanguage] = useState("en");
  const [reportId] = useState(randomId);
  const [reportDate] = useState(formatDate);

  const isTwi = language === "tw";
  const { english, twi, diet } = result;

  const summary = clean(isTwi ? twi.summary : english.summary);
  const flagged = (isTwi ? twi.flagged : english.flagged) ?? [];
  const normal = (isTwi ? twi.normal : english.normal) ?? [];

  const dietData = isTwi ? diet?.twi : diet?.english;
  const recommended = dietData?.recommended ?? [];
  const limit = dietData?.limit ?? [];
  const tip = dietData?.tip ?? "";

  return (
    <div className="result-panel">
      <div className="result-header">
        <div className="result-header-left">
          <h2>Analysis Report</h2>
          <span className="result-meta">Generated on {reportDate} &bull; ID: {reportId}</span>
        </div>
        <LanguageToggle language={language} onChange={setLanguage} />
      </div>

      <div className="result-body">
        {/* Summary */}
        <div className="result-section">
          <div className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            {isTwi ? "Nsusuwii" : "What Your Results Mean"}
          </div>
          <p>{summary}</p>
        </div>

        {/* Flagged */}
        {flagged.length > 0 && (
          <div className="result-section">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {isTwi ? "Adeɛ a Ɛnyɛ Pɛ" : "Abnormal Values"}
            </div>
            <div className="value-list">
              {flagged.map((item, i) => (
                <div key={i} className="value-item flagged">
                  <span className="value-badge">Flagged</span>
                  <span className="value-text">{clean(item)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal */}
        {normal.length > 0 && (
          <div className="result-section">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isTwi ? "Adeɛ a Ɛyɛ Pɛ" : "Normal Values"}
            </div>
            <div className="value-list">
              {normal.map((item, i) => (
                <div key={i} className="value-item normal">
                  <span className="value-badge">Normal</span>
                  <span className="value-text">{clean(item)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diet */}
        {(recommended.length > 0 || limit.length > 0 || tip) && (
          <div className="result-section">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-1.5-.75" />
              </svg>
              {isTwi ? "Aduane Nhyehyɛe" : "Diet Suggestions"}
            </div>

            <div className="diet-grid">
              {recommended.length > 0 && (
                <div className="diet-card recommended">
                  <div className="diet-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isTwi ? "Nnuan a Ɛyɛ" : "Recommended Foods"}
                  </div>
                  <ul>
                    {recommended.map((item, i) => <li key={i}>{clean(item)}</li>)}
                  </ul>
                </div>
              )}
              {limit.length > 0 && (
                <div className="diet-card limit">
                  <div className="diet-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    {isTwi ? "Nnuan a Wohia" : "Foods to Limit"}
                  </div>
                  <ul>
                    {limit.map((item, i) => <li key={i}>{clean(item)}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {tip && (
              <div className="diet-tip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span><strong>Pro Tip: </strong>{clean(tip)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="result-disclaimer">
        {isTwi
          ? "Eyi yɛ mmoa kasa ho nkyerɛkyerɛ — ɛnyɛ ayaresafoɔ adanse. Yɛsrɛ wo kɔ hu onipa wura pa."
          : "This is a translation aid only — not a medical diagnosis. Please consult a qualified healthcare professional."}
      </div>
    </div>
  );
}

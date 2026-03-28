export default function LanguageToggle({ language, onChange }) {
  return (
    <div className="lang-toggle">
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        English
      </button>
      <button
        type="button"
        className={language === "tw" ? "active" : ""}
        onClick={() => onChange("tw")}
      >
        Twi
      </button>
    </div>
  );
}

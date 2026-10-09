import { Languages } from "lucide-react";

export default function LanguageSwitcher({
  language = "English",
  onLanguageChange
}) {
  return (
    <label className="language-control">
      <Languages size={16} />

      <select
        value={language}
        onChange={(event) => onLanguageChange?.(event.target.value)}
        aria-label="Choose language"
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Marathi">Marathi</option>
      </select>
    </label>
  );
}
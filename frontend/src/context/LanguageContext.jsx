import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const supportedLanguages = ["English", "Hindi", "Marathi"];

export function LanguageProvider({ children }) {
const [language, setLanguage] = useState("English");

function changeLanguage(nextLanguage) {
if (supportedLanguages.includes(nextLanguage)) {
setLanguage(nextLanguage);
}
}

const value = useMemo(
() => ({
language,
setLanguage: changeLanguage,
supportedLanguages
}),
[language]
);

return (
<LanguageContext.Provider value={value}>
{children}
</LanguageContext.Provider>
);
}

export function useLanguage() {
const context = useContext(LanguageContext);

if (!context) {
throw new Error("useLanguage must be used inside LanguageProvider");
}

return context;
}

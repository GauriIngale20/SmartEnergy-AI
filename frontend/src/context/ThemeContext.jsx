import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
document.documentElement.dataset.theme = darkMode ? "dark" : "light";
}, [darkMode]);

const value = useMemo(
() => ({
darkMode,
setDarkMode,
toggleTheme: () => setDarkMode((previous) => !previous)
}),
[darkMode]
);

return (
<ThemeContext.Provider value={value}>
{children}
</ThemeContext.Provider>
);
}

export function useTheme() {
const context = useContext(ThemeContext);

if (!context) {
throw new Error("useTheme must be used inside ThemeProvider");
}

return context;
}

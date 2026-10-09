import {
createContext,
useContext,
useEffect,
useMemo,
useState
} from "react";

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
monthlyBudget: 2500,
notificationsEnabled: true,
unusualUsageAlerts: true,
billDueReminders: true,
savingsTips: true
};

export function SettingsProvider({ children }) {
const [settings, setSettings] = useState(() => {
try {
const savedSettings = localStorage.getItem("smartenergy-settings");

```
  return savedSettings
    ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
    : DEFAULT_SETTINGS;
} catch {
  return DEFAULT_SETTINGS;
}
```

});

useEffect(() => {
try {
localStorage.setItem("smartenergy-settings", JSON.stringify(settings));
} catch {
// Settings remain available for the current session.
}
}, [settings]);

function updateSetting(key, value) {
setSettings((previous) => ({
...previous,
[key]: value
}));
}

function resetSettings() {
setSettings(DEFAULT_SETTINGS);
}

const contextValue = useMemo(
() => ({
settings,
updateSetting,
resetSettings
}),
[settings]
);

return (
<SettingsContext.Provider value={contextValue}>
{children}
</SettingsContext.Provider>
);
}

export function useSettings() {
const context = useContext(SettingsContext);

if (!context) {
throw new Error("useSettings must be used inside SettingsProvider");
}

return context;
}

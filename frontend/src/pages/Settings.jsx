import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings as SettingsIcon, Bell, Moon, IndianRupee } from "lucide-react";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

export default function Settings() {
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(
    document.documentElement.dataset.theme === "dark"
  );
  const [notifications, setNotifications] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);
  const [dueReminders, setDueReminders] = useState(true);
  const [budget, setBudget] = useState(() => {
    try {
      return localStorage.getItem("smartenergy_monthly_budget") || "2500";
    } catch {
      return "2500";
    }
  });
  const [saved, setSaved] = useState(false);

  function toggleTheme(checked) {
    setDarkMode(checked);
    document.documentElement.dataset.theme = checked ? "dark" : "light";

    try {
      localStorage.setItem("smartenergy_theme", checked ? "dark" : "light");
    } catch {
      // Theme remains active for the current page.
    }
  }

  function saveSettings(event) {
    event.preventDefault();

    const amount = Number(budget);
    if (!Number.isFinite(amount) || amount <= 0) {
      setSaved(false);
      return;
    }

    try {
      localStorage.setItem("smartenergy_monthly_budget", String(amount));
      localStorage.setItem("smartenergy_notifications", String(notifications));
      localStorage.setItem("smartenergy_usage_alerts", String(usageAlerts));
      localStorage.setItem("smartenergy_due_reminders", String(dueReminders));
      localStorage.setItem("smartenergy_theme", darkMode ? "dark" : "light");
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("settings")}</h1>
          <p className="muted">
            Manage your language, appearance, and local preferences.
          </p>
        </div>
      </div>

      <form onSubmit={saveSettings}>
        <section className="content-card">
          <div className="section-title">
            <SettingsIcon size={22} />
            <h2>General settings</h2>
          </div>

          <div className="form-group">
            <label>{t("language")}</label>
            <LanguageSwitcher />
          </div>

          <label className="setting-row">
            <span className="setting-row-icon">
              <Moon size={20} />
            </span>
            <span className="setting-row-text">
              <strong>{t("darkMode")}</strong>
              <small className="muted">
                Switch between light and dark appearance.
              </small>
            </span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) => toggleTheme(event.target.checked)}
            />
          </label>
        </section>

        <section className="content-card">
          <div className="section-title">
            <Bell size={22} />
            <h2>{t("notifications")}</h2>
          </div>

          {[
            {
              label: t("enableNotifications"),
              description: "Enable or disable notification preferences.",
              value: notifications,
              setter: setNotifications
            },
            {
              label: t("unusualUsageAlerts"),
              description: "Preference for unusual usage alerts.",
              value: usageAlerts,
              setter: setUsageAlerts
            },
            {
              label: t("billDueReminders"),
              description: "Preference for bill due-date reminders.",
              value: dueReminders,
              setter: setDueReminders
            }
          ].map((item) => (
            <label className="setting-row" key={item.label}>
              <span className="setting-row-text">
                <strong>{item.label}</strong>
                <small className="muted">{item.description}</small>
              </span>
              <input
                type="checkbox"
                checked={item.value}
                onChange={(event) => {
                  item.setter(event.target.checked);
                  setSaved(false);
                }}
              />
            </label>
          ))}
        </section>

        <section className="content-card">
          <div className="section-title">
            <IndianRupee size={22} />
            <h2>{t("monthlyBudget")}</h2>
          </div>

          <div className="form-group">
            <label htmlFor="settingsBudget">
              Monthly electricity budget (₹)
            </label>
            <input
              id="settingsBudget"
              type="number"
              min="1"
              step="1"
              value={budget}
              onChange={(event) => {
                setBudget(event.target.value);
                setSaved(false);
              }}
              required
            />
          </div>
        </section>

        <button type="submit" className="primary-button">
          {t("save")}
        </button>

        {saved && (
          <p className="notice notice-success" role="status">
            {t("saved")} Your preferences are saved in this browser.
          </p>
        )}
      </form>

      <p className="muted">
        Notification settings currently store preferences only. Browser push
        notifications and automatic reminders are not connected yet.
      </p>
    </main>
  );
}

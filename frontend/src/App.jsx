
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesCombined,
  BrainCircuit,
  Bell,
  Lightbulb,
  Settings as SettingsIcon,
  Menu,
  X,
  Zap,
  Download,
  House,
  Sun,
  Moon,
  Languages,
  Leaf,
  Target
} from "lucide-react";

import i18n from "./i18n/i18n";
import billService from "./services/billService";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadBill from "./pages/UploadBill";
import ConsumptionAnalysis from "./pages/ConsumptionAnalysis";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import Recommendations from "./pages/Recommendations";
import ApplianceAnalyzer from "./pages/ApplianceAnalyzer";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Upload Bill", icon: Receipt },
  { label: "Consumption", icon: ChartNoAxesCombined },
  { label: "AI Prediction", icon: BrainCircuit },
  { label: "Alerts", icon: Bell },
  { label: "Recommendations", icon: Lightbulb },
  { label: "Appliances", icon: House },
  { label: "Reports", icon: Download },
  { label: "Goals", icon: Target },
  { label: "Settings", icon: SettingsIcon }
];

export default function App() {
  const [activePage, setActivePage] = useState("Overview");

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("smartenergy_theme") === "dark";
    } catch {
      return false;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBills() {
      try {
        const data = await billService.getBills();
        if (!cancelled) {
          setBills(Array.isArray(data) ? data : []);
          setApiError("");
        }
      } catch (error) {
        if (!cancelled) {
          setApiError(
            error.response?.data?.error ||
            "Could not load bills. Please check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) setBillsLoading(false);
      }
    }

    loadBills();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addBill(newBill) {
    try {
      setApiError("");
      const savedBill = await billService.createBill(newBill);

      setBills((previousBills) => {
        const updated = [
          ...previousBills.filter((bill) => bill.id !== savedBill.id),
          savedBill
        ];
        return updated.sort((a, b) =>
          String(b.month).localeCompare(String(a.month))
        );
      });

      setActivePage("Overview");
    } catch (error) {
      setApiError(
        error.response?.data?.error ||
        "Could not save the bill. Please check the backend connection."
      );
    }
  }

  async function deleteBill(id) {
    try {
      setApiError("");
      await billService.deleteBill(id);
      setBills((previousBills) =>
        previousBills.filter((bill) => bill.id !== id)
      );
    } catch (error) {
      setApiError(
        error.response?.data?.error ||
        "Could not delete the bill. Please try again."
      );
    }
  }

  function toggleTheme() {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme
      ? "dark"
      : "light";

    try {
      localStorage.setItem(
        "smartenergy_theme",
        nextTheme ? "dark" : "light"
      );
    } catch {
      // Theme remains available for the current session.
    }
  }

  function changeLanguage(event) {
    i18n.changeLanguage(event.target.value);
  }

  function renderPage() {
    switch (activePage) {
      case "Home":
        return (
          <Home
            onNavigate={(page) => setActivePage(page)}
          />
        );

      case "Overview":
        return <Dashboard bills={bills} />;

      case "Upload Bill":
        return (
          <UploadBill
            bills={bills}
            onAddBill={addBill}
            onDeleteBill={deleteBill}
          />
        );

      case "Consumption":
        return <ConsumptionAnalysis bills={bills} />;

      case "AI Prediction":
        return <Prediction bills={bills} />;

      case "Alerts":
        return <Alerts bills={bills} />;

      case "Recommendations":
        return <Recommendations bills={bills} />;

      case "Appliances":
        return <ApplianceAnalyzer />;

      case "Reports":
        return <Reports bills={bills} />;

      case "Goals":
        return <Goals bills={bills} />;

      case "Settings":
        return <SettingsPage />;

      default:
        return <NotFound />;
    }
  }

  return (
    <div className={`app-shell ${darkMode ? "dark-theme" : ""}`}>
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="brand">
          <button
            type="button"
            className="brand-mark"
            onClick={() => {
              setActivePage("Home");
              setSidebarOpen(false);
            }}
            aria-label="Open home"
          >
            <Zap size={23} fill="currentColor" />
          </button>

          <button
            type="button"
            className="brand-name"
            onClick={() => {
              setActivePage("Home");
              setSidebarOpen(false);
            }}
          >
            SmartEnergy<span className="brand-ai"> AI</span>
            <small>SMART ENERGY PLATFORM</small>
          </button>

          <button
            type="button"
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(label);
                setSidebarOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>

              {label === "Alerts" && (
                <span className="nav-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="eco-card">
            <span>
              <Leaf size={20} />
            </span>
            <strong>Live greener.</strong>
            <p>Better insights for smarter energy habits.</p>
          </div>

          <div className="profile">
            <div className="profile-avatar">SE</div>
            <div>
              <strong>Home User</strong>
              <small>Personal workspace</small>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span>{" "}
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="language-control">
              <Languages size={16} />
              <select
                value={(i18n.resolvedLanguage || i18n.language).split("-")[0]}
                onChange={changeLanguage}
                aria-label="Choose language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                 <option value="mr">मराठी</option>
              </select>
            </label>

            <button
              type="button"
              className="icon-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <button
              type="button"
              className="icon-button notification-button"
              onClick={() => setActivePage("Alerts")}
              aria-label="View alerts"
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="top-avatar">SE</div>
          </div>
        </header>

        {apiError && (
          <div role="alert" className="content-card" style={{ margin: "16px 24px", color: "#b91c1c" }}>
            {apiError}
          </div>
        )}

        {billsLoading && (
          <p className="muted" style={{ margin: "16px 24px" }}>
            Loading saved bills...
          </p>
        )}

        {renderPage()}

        <footer className="footer">
          <span>Â© 2026 SmartEnergy AI</span>
          <span>
            Smarter energy. Better tomorrow. <Leaf size={14} />
          </span>
        </footer>
      </main>
    </div>
  );
}


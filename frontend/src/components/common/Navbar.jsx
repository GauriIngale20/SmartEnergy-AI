import { Zap, Menu, Bell, Sun, Moon } from "lucide-react";

export default function Navbar({
  onMenuClick,
  darkMode = false,
  onThemeToggle,
  onAlertsClick
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="breadcrumb">
          <Zap size={16} /> <strong>SmartEnergy AI</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          className="icon-button"
          onClick={onAlertsClick}
          aria-label="View alerts"
        >
          <Bell size={19} />
        </button>

        <div className="top-avatar">SE</div>
      </div>
    </header>
  );
}
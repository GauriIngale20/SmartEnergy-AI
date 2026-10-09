import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesCombined,
  BrainCircuit,
  Bell,
  Lightbulb,
  Settings,
  House,
  Download,
  Zap
} from "lucide-react";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Upload Bill", icon: Receipt },
  { label: "Consumption", icon: ChartNoAxesCombined },
  { label: "AI Prediction", icon: BrainCircuit },
  { label: "Alerts", icon: Bell },
  { label: "Recommendations", icon: Lightbulb },
  { label: "Appliances", icon: House },
  { label: "Reports", icon: Download },
  { label: "Settings", icon: Settings }
];

export default function Sidebar({
  activePage = "Overview",
  onNavigate,
  isOpen = false,
  onClose
}) {
  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Zap size={23} fill="currentColor" />
          </span>

          <span>
            SmartEnergy <span className="brand-ai">AI</span>
            <small>SMART ENERGY PLATFORM</small>
          </span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav">
          {menuItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => {
                onNavigate?.(label);
                onClose?.();
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        ```jsx
<div className="sidebar-bottom">
  <div className="eco-card">
    <strong>🌿 Smart Energy Tip</strong>
    <p>Save electricity today for a greener tomorrow!</p>
  </div>

  <div className="profile">
    <div className="profile-avatar">SE</div>
    <div>
      <strong>Home User</strong>
      <small>Personal Workspace</small>
    </div>
  </div>
</div>

      </aside>
    </>
  );
}
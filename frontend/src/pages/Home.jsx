
import { useTranslation } from "react-i18next";
import {
  Zap,
  TrendingDown,
  ChartNoAxesCombined,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Sun,
  Home as HomeIcon,
  BrainCircuit,
  Activity,
  Sparkles,
  Lightbulb,
  CircleCheck,
  ArrowUpRight
} from "lucide-react";
import "./Home.css";

export default function Home({ onNavigate }) {
  const { t } = useTranslation();

  const features = [
    {
      icon: ChartNoAxesCombined,
      number: "01",
      title: t("monthlyConsumption"),
      description: "Understand your electricity usage through clear visual insights and consumption trends.",
      color: "blue",
      page: "Consumption"
    },
    {
      icon: TrendingDown,
      number: "02",
      title: t("savingTips"),
      description: "Discover smarter energy habits and practical ways to reduce your monthly bills.",
      color: "green",
      page: "Recommendations"
    },
    {
      icon: ShieldCheck,
      number: "03",
      title: t("energyAlerts"),
      description: "Identify unusual consumption patterns and keep track of energy alerts.",
      color: "purple",
      page: "Alerts"
    }
  ];

  const flowSteps = [
    { icon: HomeIcon, title: "Your Home", text: "Energy usage", color: "home" },
    { icon: Activity, title: "Smart Meter", text: "Usage tracking", color: "meter" },
    { icon: BrainCircuit, title: "AI Analysis", text: "Pattern insights", color: "brain" },
    { icon: Leaf, title: "Save Energy", text: "Smarter choices", color: "save" }
  ];

  return (
    <main className="page-content home-page">
      <section className="energy-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="energy-hero-content">
          <span className="hero-label">
            <Sparkles size={15} />
            INTELLIGENT ENERGY MANAGEMENT
          </span>

          <h1>
            {t("welcome")}
            <span className="hero-title-accent"> Power a greener future.</span>
          </h1>

          <p>{t("subtitle")}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button home-cta"
              onClick={() => onNavigate?.("Upload Bill")}
            >
              {t("addBill")}
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={() => onNavigate?.("Overview")}
            >
              Explore dashboard
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="hero-trust-line">
            <span><CircleCheck size={15} /> Smarter insights</span>
            <span><Leaf size={15} /> Energy conscious</span>
          </div>
        </div>

        <div className="energy-hero-art" aria-label="Animated energy illustration">
          <div className="energy-art-glow" />
          <div className="energy-orbit energy-orbit-a" />
          <div className="energy-orbit energy-orbit-b" />
          <div className="energy-orbit energy-orbit-c" />

          <div className="energy-core">
            <div className="energy-core-inner">
              <Zap size={48} fill="currentColor" />
            </div>
          </div>

          <div className="floating-energy-chip chip-sun">
            <Sun size={22} />
          </div>
          <div className="floating-energy-chip chip-leaf">
            <Leaf size={22} />
          </div>
          <div className="floating-energy-chip chip-home">
            <HomeIcon size={21} />
          </div>

          <div className="energy-live-label">
            <span className="live-indicator" />
            Smart energy ecosystem
          </div>
        </div>

        <div className="hero-bottom-decoration" />
      </section>

      <section className="home-intro">
        <div>
          <span className="home-eyebrow">HOW IT WORKS</span>
          <h2>From energy data to smarter decisions</h2>
          <p className="muted">
            One connected journey to help you understand and manage your energy.
          </p>
        </div>
        <span className="home-section-icon"><Zap size={21} /></span>
      </section>

      <section className="energy-flow" aria-label="Smart energy workflow">
        <div className="flow-line" />

        {flowSteps.map(({ icon: Icon, title, text, color }, index) => (
          <div className="flow-step" key={title}>
            <div className={`flow-icon flow-${color}`}>
              <Icon size={25} />
              <span className="flow-number">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            {index < flowSteps.length - 1 && (
              <div className="flow-arrow">
                <ArrowRight size={17} />
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="home-highlight">
        <div className="highlight-icon">
          <BrainCircuit size={25} />
        </div>
        <div className="highlight-copy">
          <span>SMART ENERGY INSIGHTS</span>
          <h3>Your energy, made easier to understand.</h3>
          <p>
            Upload your electricity bill to begin exploring your usage,
            track trends and discover opportunities to save.
          </p>
        </div>
        <button
          type="button"
          className="highlight-action"
          onClick={() => onNavigate?.("Upload Bill")}
          aria-label="Upload an electricity bill"
        >
          <ArrowRight size={21} />
        </button>
      </section>

      <section className="home-features-section">
        <div className="home-intro feature-intro">
          <div>
            <span className="home-eyebrow">YOUR ENERGY TOOLKIT</span>
            <h2>Everything you need, in one place</h2>
            <p className="muted">
              Explore the tools that help you make more informed energy decisions.
            </p>
          </div>
        </div>

        <div className="feature-grid">
          {features.map(({ icon: Icon, number, title, description, color, page }) => (
            <button
              type="button"
              className={`content-card feature-card feature-${color}`}
              key={number}
              onClick={() => onNavigate?.(page)}
            >
              <div className="feature-card-top">
                <span className="feature-icon">
                  <Icon size={24} />
                </span>
                <span className="feature-number">{number}</span>
              </div>

              <h3>{title}</h3>
              <p>{description}</p>

              <span className="feature-link">
                Explore feature <ArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-note">
        <span className="note-icon"><Lightbulb size={21} /></span>
        <div>
          <strong>A smarter start begins with your bill</strong>
          <p>
            Dashboard values and predictions may use sample data until bills
            are added and any required backend integration is connected.
          </p>
        </div>
      </section>
    </main>
  );
}
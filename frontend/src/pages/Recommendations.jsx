import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Lightbulb,
  Snowflake,
  Sun,
  Plug,
  Clock,
  IndianRupee,
  Leaf
} from "lucide-react";

export default function Recommendations({ bills = [] }) {
  const { t } = useTranslation();

  const recommendations = useMemo(() => {
    const totalUnits = bills.reduce(
      (sum, bill) => sum + (Number(bill.units) || 0),
      0
    );

    const averageUnits = bills.length ? totalUnits / bills.length : 0;

    const tips = [
      {
        icon: Lightbulb,
        title: "Use energy-efficient lighting",
        description:
          "Replace frequently used traditional bulbs with suitable LED bulbs.",
        category: "Lighting"
      },
      {
        icon: Plug,
        title: "Reduce standby power",
        description:
          "Switch off devices and chargers when they are not needed.",
        category: "Daily habits"
      },
      {
        icon: Snowflake,
        title: "Use cooling appliances wisely",
        description:
          "Keep air-conditioner filters clean, close doors and windows, and choose a comfortable temperature.",
        category: "Cooling"
      },
      {
        icon: Sun,
        title: "Make use of daylight",
        description:
          "Use natural daylight when practical to reduce unnecessary lighting.",
        category: "Lighting"
      },
      {
        icon: Clock,
        title: "Review high-usage periods",
        description:
          "Compare your bills regularly and investigate unexpected increases in consumption.",
        category: "Monitoring"
      }
    ];

    if (averageUnits > 250) {
      tips.unshift({
        icon: Leaf,
        title: "Review your electricity usage",
        description:
          "Your average recorded consumption is above 250 kWh per bill. Review major appliances and daily usage to identify possible savings.",
        category: "Usage review"
      });
    }

    return {
      tips,
      totalUnits,
      averageUnits
    };
  }, [bills]);

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("recommendations")}</h1>
          <p className="muted">
            Practical ideas to help manage electricity consumption.
          </p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon green">
            <Leaf size={21} />
          </span>
          <p className="stat-title">Recorded bills</p>
          <h2>{bills.length}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon blue">
            <Plug size={21} />
          </span>
          <p className="stat-title">Average recorded usage</p>
          <h2>{recommendations.averageUnits.toFixed(1)} kWh</h2>
        </article>
      </section>

      <section className="content-card">
        <div className="section-title">
          <Lightbulb size={22} />
          <h2>{t("savingTips")}</h2>
        </div>

        <p className="muted">
          These general suggestions are not guaranteed savings estimates.
          Actual results depend on your home, appliances, and electricity tariff.
        </p>

        <div className="recommendation-grid">
          {recommendations.tips.map(({ icon: Icon, title, description, category }) => (
            <article className="content-card recommendation-card" key={title}>
              <span className="stat-icon green">
                <Icon size={22} />
              </span>
              <span className="recommendation-category">{category}</span>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>

        {bills.length === 0 && (
          <p className="muted">
            Add your electricity bills to include your recorded usage in future
            recommendations.
          </p>
        )}
      </section>
    </main>
  );
}

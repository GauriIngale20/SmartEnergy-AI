
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CheckCircle,
  Zap,
  IndianRupee,
  Info
} from "lucide-react";

export default function Alerts({ bills = [] }) {
  const { t } = useTranslation();

  const alerts = useMemo(() => {
    if (bills.length === 0) {
      return [];
    }

    const normalizedBills = bills.map((bill) => ({
      month: bill.month || "Unknown month",
      units: Number(bill.units) || 0,
      amount: Number(bill.amount) || 0
    }));

    const latest = normalizedBills[0];
    const previous = normalizedBills[1];
    const generatedAlerts = [];

    if (latest.units <= 0 || latest.amount <= 0) {
      generatedAlerts.push({
        type: "warning",
        title: "Check bill details",
        message: `The bill for ${latest.month} has zero or invalid usage or amount. Please verify the entered values.`,
        icon: AlertTriangle
      });
    }

    if (previous && previous.units > 0 && latest.units > previous.units * 1.2) {
      generatedAlerts.push({
        type: "warning",
        title: "Consumption increased",
        message: `Recorded usage for ${latest.month} is more than 20% higher than the previous bill. Check your appliances and usage patterns.`,
        icon: Zap
      });
    }

    if (previous && previous.amount > 0 && latest.amount > previous.amount * 1.2) {
      generatedAlerts.push({
        type: "warning",
        title: "Bill amount increased",
        message: `The recorded bill amount for ${latest.month} is more than 20% higher than the previous bill.`,
        icon: IndianRupee
      });
    }

    if (generatedAlerts.length === 0) {
      generatedAlerts.push({
        type: "success",
        title: "No unusual changes detected",
        message:
          "No basic usage or bill increase rule was triggered by the available records. This does not guarantee that the bill is correct.",
        icon: CheckCircle
      });
    }

    return generatedAlerts;
  }, [bills]);

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("alerts")}</h1>
          <p className="muted">
            Review basic checks based on your recorded electricity bills.
          </p>
        </div>
      </div>

      <div className="content-card">
        <div className="section-title">
          <AlertTriangle size={22} />
          <h2>{t("energyAlerts")}</h2>
        </div>

        <div className="notice notice-info">
          <Info size={19} />
          <p>
            These are simple rule-based alerts, not AI-generated diagnoses.
            Comparisons depend on the order of your bill records.
          </p>
        </div>

        {bills.length === 0 ? (
          <div className="empty-state">
            <Info size={28} />
            <h3>{t("noAlerts")}</h3>
            <p className="muted">
              Add at least one bill to check for basic data issues.
            </p>
          </div>
        ) : (
          <div className="alert-list">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;

              return (
                <article
                  className={`alert-card alert-${alert.type}`}
                  key={`${alert.title}-${index}`}
                >
                  <span className="alert-icon">
                    <Icon size={22} />
                  </span>

                  <div>
                    <h3>{alert.title}</h3>
                    <p>{alert.message}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}


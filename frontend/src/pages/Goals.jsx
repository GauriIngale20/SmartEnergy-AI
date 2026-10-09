
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, IndianRupee, TrendingDown } from "lucide-react";

export default function Goals({ bills = [] }) {
  const { t } = useTranslation();

  const [budget, setBudget] = useState(() => {
    try {
      return localStorage.getItem("smartenergy_monthly_budget") || "2500";
    } catch {
      return "2500";
    }
  });

  const [savedGoal, setSavedGoal] = useState(false);

  const totalAmount = bills.reduce(
    (sum, bill) => sum + (Number(bill.amount) || 0),
    0
  );

  const budgetValue = Number(budget);
  const validBudget = Number.isFinite(budgetValue) && budgetValue > 0;
  const remaining = validBudget ? budgetValue - totalAmount : 0;

  const progress = validBudget
    ? Math.min((totalAmount / budgetValue) * 100, 100)
    : 0;

  function formatRupees(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-IN");
  }

  function handleSave(event) {
    event.preventDefault();

    if (!validBudget) {
      setSavedGoal(false);
      return;
    }

    try {
      localStorage.setItem(
        "smartenergy_monthly_budget",
        String(budgetValue)
      );
      setSavedGoal(true);
    } catch {
      setSavedGoal(false);
    }
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("goal")}</h1>
          <p className="muted">
            Set a spending target and compare it with your recorded bills.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="section-title">
          <Target size={22} />
          <h2>{t("monthlySavingsGoal")}</h2>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="monthlyBudget">
              Monthly electricity budget (Rs.)
            </label>

            <input
              id="monthlyBudget"
              type="number"
              min="1"
              step="1"
              value={budget}
              onChange={(event) => {
                setBudget(event.target.value);
                setSavedGoal(false);
              }}
              required
            />
          </div>

          <button type="submit" className="primary-button">
            {t("save")}
          </button>
        </form>

        {savedGoal && (
          <p className="notice notice-success" role="status">
            {t("saved")}
          </p>
        )}
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon blue">
            <Target size={21} />
          </span>

          <p className="stat-title">Monthly budget</p>
          <h2>{validBudget ? formatRupees(budgetValue) : "—"}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon green">
            <IndianRupee size={21} />
          </span>

          <p className="stat-title">Recorded bill total</p>
          <h2>{formatRupees(totalAmount)}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon orange">
            <TrendingDown size={21} />
          </span>

          <p className="stat-title">
            {remaining >= 0 ? t("left") : "Over budget"}
          </p>

          <h2>
            {validBudget ? formatRupees(Math.abs(remaining)) : "—"}
          </h2>
        </article>
      </section>

      <section className="content-card">
        <h2>Budget progress</h2>

        <div className="progress-track" aria-label="Budget usage">
          <div
            className="progress-fill"
            style={{ width: progress + "%" }}
          />
        </div>

        <p className="muted">
          {validBudget
            ? progress.toFixed(1) + "% of the budget amount"
            : "Enter a valid budget to view progress."}
        </p>

        <p className="muted">
          Comparison uses all bills currently passed to this page. It is not
          necessarily limited to the current billing month.
        </p>
      </section>
    </main>
  );
}

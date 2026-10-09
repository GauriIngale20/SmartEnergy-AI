import { Leaf, Target } from "lucide-react";

export default function SavingsProgress({
  goal = 500,
  saved = 150,
  title = "Monthly Savings Goal"
}) {
  const safeGoal = Math.max(0, Number(goal) || 0);
  const safeSaved = Math.max(0, Number(saved) || 0);

  const percentage =
    safeGoal > 0
      ? Math.min(100, Math.round((safeSaved / safeGoal) * 100))
      : 0;

  const remaining = Math.max(0, safeGoal - safeSaved);

  return (
    <section className="content-card savings-card">
      <div className="savings-icon">
        <Leaf size={25} />
      </div>

      <p className="eyebrow">SAVINGS TRACKER</p>
      <h2>{title}</h2>

      <div className="savings-amounts">
        <div>
          <span className="muted">Saved</span>
          <h3>₹{safeSaved.toLocaleString("en-IN")}</h3>
        </div>

        <div className="goal-amount">
          <span className="muted">Goal</span>
          <h3>₹{safeGoal.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="progress-labels">
        <span>{percentage}% completed</span>
        <strong>{safeGoal > 0 ? `₹${remaining.toLocaleString("en-IN")} left` : "Set a goal"}</strong>
      </div>

      <p className="muted">
        <Target size={15} style={{ verticalAlign: "middle" }} /> Track your
        savings progress each month.
      </p>
    </section>
  );
}
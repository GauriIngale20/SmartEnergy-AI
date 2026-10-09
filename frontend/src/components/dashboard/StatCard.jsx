import { TrendingDown, TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "green",
  trend,
  positive = true
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className={`stat-icon ${color}`}>
          {Icon && <Icon size={21} />}
        </span>

        {trend && (
          <span className="trend">
            {positive ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )}
            {trend}
          </span>
        )}
      </div>

      <p className="stat-title">{title}</p>
      <h2>{value}</h2>
      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}
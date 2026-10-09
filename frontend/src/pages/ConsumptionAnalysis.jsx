

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Activity, Zap, IndianRupee, TrendingUp } from "lucide-react";

export default function ConsumptionAnalysis({ bills = [] }) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    return [...bills]
      .map((bill) => ({
        month: bill.month || "Unknown",
        units: Number(bill.units) || 0,
        amount: Number(bill.amount) || 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [bills]);

  const totalUnits = chartData.reduce(
    (sum, bill) => sum + bill.units,
    0
  );

  const totalAmount = chartData.reduce(
    (sum, bill) => sum + bill.amount,
    0
  );

  const averageUnits = chartData.length
    ? Math.round(totalUnits / chartData.length)
    : 0;

  const highestUsage = chartData.reduce(
    (highest, bill) => Math.max(highest, bill.units),
    0
  );

  function formatNumber(value) {
    return Number(value).toLocaleString("en-IN");
  }

  function formatRupees(value) {
    return `₹${formatNumber(value)}`;
  }

  function formatMonth(month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return month;
    }

    const [year, monthNumber] = month.split("-").map(Number);

    return new Date(year, monthNumber - 1, 1).toLocaleDateString(
      "en-IN",
      { month: "short", year: "numeric" }
    );
  }

  const stats = [
    {
      title: t("totalConsumption"),
      value: `${formatNumber(totalUnits)} kWh`,
      icon: Zap
    },
    {
      title: t("totalBill"),
      value: formatRupees(totalAmount),
      icon: IndianRupee
    },
    {
      title: "Average monthly usage",
      value: `${formatNumber(averageUnits)} kWh`,
      icon: Activity
    },
    {
      title: "Highest recorded usage",
      value: `${formatNumber(highestUsage)} kWh`,
      icon: TrendingUp
    }
  ];

  const monthTick = (value) => formatMonth(value);

  const billTooltip = (value) => [
    formatRupees(value),
    "Bill amount"
  ];

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("consumption")}</h1>
          <p className="muted">
            Analyze your recorded electricity consumption and bill trends.
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="content-card">
          <h2>{t("noData")}</h2>
          <p className="muted">
            Add electricity bills first to view your consumption analysis.
          </p>
        </div>
      ) : (
        <>
          <section className="stats-grid">
            {stats.map(({ title, value, icon: Icon }) => (
              <article className="stat-card" key={title}>
                <span className="stat-icon green">
                  <Icon size={21} />
                </span>
                <p className="stat-title">{title}</p>
                <h2>{value}</h2>
              </article>
            ))}
          </section>

          <section className="dashboard-charts">
            <article className="content-card">
              <h2>{t("monthlyConsumption")}</h2>
              <p className="muted">Recorded usage in kWh</p>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={monthTick}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        `Month: ${formatMonth(label)}`
                      }
                      formatter={(value) => [
                        `${formatNumber(value)} kWh`,
                        "Consumption"
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="units"
                      name="Consumption (kWh)"
                      stroke="#16a34a"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="content-card">
              <h2>{t("monthlyBillComparison")}</h2>
              <p className="muted">Recorded bill amount in rupees</p>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={monthTick}
                    />
                    <YAxis
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        `Month: ${formatMonth(label)}`
                      }
                      formatter={billTooltip}
                    />
                    <Bar
                      dataKey="amount"
                      name="Bill amount"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}

import { useTranslation } from "react-i18next";
import {
Zap,
IndianRupee,
TrendingDown,
Leaf
} from "lucide-react";
import {
ResponsiveContainer,
AreaChart,
Area,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip
} from "recharts";

const sampleData = [
{ month: "May", units: 218, amount: 1740 },
{ month: "Jun", units: 246, amount: 1960 },
{ month: "Jul", units: 232, amount: 1850 },
{ month: "Aug", units: 285, amount: 2280 },
{ month: "Sep", units: 260, amount: 2080 },
{ month: "Oct", units: 210, amount: 1680 }
];

export default function Dashboard({ bills = [] }) {
const { t } = useTranslation();

const totalUnits = bills.reduce(
(sum, bill) => sum + (Number(bill.units) || 0),
0
);

const totalAmount = bills.reduce(
(sum, bill) => sum + (Number(bill.amount) || 0),
0
);

const hasBills = bills.length > 0;
const chartData = hasBills
? bills.map((bill) => ({
month: bill.month,
units: Number(bill.units) || 0,
amount: Number(bill.amount) || 0
}))
: sampleData;

const stats = [
{
title: t("totalConsumption"),
value: `${totalUnits.toLocaleString("en-IN")} kWh`,
icon: Zap,
color: "green"
},
{
title: t("totalBill"),
value: `₹${totalAmount.toLocaleString("en-IN")}`,
icon: IndianRupee,
color: "blue"
},
{
title: t("monthlyBudget"),
value: "₹2,500",
icon: TrendingDown,
color: "orange"
},
{
title: t("savingTips"),
value: "3",
icon: Leaf,
color: "purple"
}
];

return ( <main className="page-content"> <div className="page-heading"> <div> <h1>{t("overview")}</h1> <p className="muted">
Track your electricity bills and consumption. </p> </div> </div>

```
  {!hasBills && (
    <p className="sample-data-note">
      Showing illustrative chart data. Add bills to see your recorded totals.
    </p>
  )}

  <section className="stats-grid">
    {stats.map(({ title, value, icon: Icon, color }) => (
      <article className="stat-card" key={title}>
        <span className={`stat-icon ${color}`}>
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
      <p className="muted">Electricity usage in kWh</p>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="units"
              stroke="#16a34a"
              fill="#bbf7d0"
              name="Units (kWh)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>

    <article className="content-card">
      <h2>{t("monthlyBillComparison")}</h2>
      <p className="muted">Bill amount in rupees</p>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value}`, "Bill amount"]} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  </section>

  <section className="content-card">
    <h2>{t("billHistory")}</h2>

    {hasBills ? (
      <div className="bill-list">
        {bills.map((bill, index) => (
          <div className="bill-row" key={bill.id ?? `${bill.month}-${index}`}>
            <div className="bill-row-icon">
              <Zap size={19} />
            </div>
            <div className="bill-row-main">
              <strong>{bill.month}</strong>
              <span className="muted">{bill.units} kWh</span>
            </div>
            <strong>₹{Number(bill.amount).toLocaleString("en-IN")}</strong>
          </div>
        ))}
      </div>
    ) : (
      <p className="muted">{t("noBills")}</p>
    )}
  </section>
</main>

);
}


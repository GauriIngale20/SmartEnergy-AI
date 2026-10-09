import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const sampleBills = [
  { month: "May", amount: 1740 },
  { month: "Jun", amount: 1960 },
  { month: "Jul", amount: 1850 },
  { month: "Aug", amount: 2280 },
  { month: "Sep", amount: 2080 },
  { month: "Oct", amount: 1680 }
];

export default function BillComparison({
  data = sampleBills,
  title = "Monthly Bill Comparison"
}) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p className="muted">Electricity bill amount in rupees</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8eee9"
            />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [`₹${value}`, "Bill amount"]} />

            <Bar
              dataKey="amount"
              name="Bill amount"
              fill="#3b82f6"
              radius={[7, 7, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
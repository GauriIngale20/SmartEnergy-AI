import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const sampleData = [
  { month: "May", units: 218 },
  { month: "Jun", units: 246 },
  { month: "Jul", units: 232 },
  { month: "Aug", units: 285 },
  { month: "Sep", units: 260 },
  { month: "Oct", units: 210 }
];

export default function ConsumptionChart({
  data = sampleData,
  title = "Monthly Consumption"
}) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p className="muted">Electricity usage in kWh</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="consumptionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8eee9"
            />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="units"
              name="Units (kWh)"
              stroke="#16a34a"
              strokeWidth={3}
              fill="url(#consumptionFill)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
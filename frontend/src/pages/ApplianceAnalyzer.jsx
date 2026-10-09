
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Refrigerator,
  Snowflake,
  Tv,
  Lightbulb,
  WashingMachine,
  Zap,
  Calculator,
  Info
} from "lucide-react";

const applianceOptions = [
  { name: "LED bulb", watts: 9, icon: Lightbulb },
  { name: "Ceiling fan", watts: 75, icon: Zap },
  { name: "Television", watts: 100, icon: Tv },
  { name: "Refrigerator", watts: 180, icon: Refrigerator },
  { name: "Air conditioner", watts: 1500, icon: Snowflake },
  { name: "Washing machine", watts: 500, icon: WashingMachine }
];

export default function ApplianceAnalyzer() {
  const { t } = useTranslation();
  const [appliance, setAppliance] = useState("LED bulb");
  const [quantity, setQuantity] = useState("1");
  const [hoursPerDay, setHoursPerDay] = useState("5");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [tariff, setTariff] = useState("8");

  const selected = applianceOptions.find(
    (item) => item.name === appliance
  );

  const result = useMemo(() => {
    const qty = Number(quantity);
    const hours = Number(hoursPerDay);
    const days = Number(daysPerMonth);
    const rate = Number(tariff);

    if (
      !selected ||
      !Number.isFinite(qty) ||
      !Number.isFinite(hours) ||
      !Number.isFinite(days) ||
      !Number.isFinite(rate) ||
      qty <= 0 ||
      hours < 0 ||
      hours > 24 ||
      days <= 0 ||
      days > 31 ||
      rate < 0
    ) {
      return null;
    }

    const units = (selected.watts * qty * hours * days) / 1000;

    return {
      units,
      cost: units * rate
    };
  }, [selected, quantity, hoursPerDay, daysPerMonth, tariff]);

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("appliances")}</h1>
          <p className="muted">
            Estimate monthly electricity usage for common appliances.
          </p>
        </div>
      </div>

      <div className="notice notice-info">
        <Info size={19} />
        <p>
          These are illustrative power ratings. Actual consumption varies by
          model, operating mode, and usage. This estimate does not measure
          electricity directly.
        </p>
      </div>

      <section className="dashboard-charts">
        <article className="content-card">
          <div className="section-title">
            <Calculator size={22} />
            <h2>Appliance calculator</h2>
          </div>

          <div className="form-group">
            <label htmlFor="appliance">Choose appliance</label>
            <select
              id="appliance"
              value={appliance}
              onChange={(event) => setAppliance(event.target.value)}
            >
              {applianceOptions.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} — {item.watts} W
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Number of appliances</label>
            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hoursPerDay">Hours used per day</label>
            <input
              id="hoursPerDay"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="daysPerMonth">Days used per month</label>
            <input
              id="daysPerMonth"
              type="number"
              min="1"
              max="31"
              value={daysPerMonth}
              onChange={(event) => setDaysPerMonth(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tariff">Estimated tariff (₹ per kWh)</label>
            <input
              id="tariff"
              type="number"
              min="0"
              step="0.1"
              value={tariff}
              onChange={(event) => setTariff(event.target.value)}
            />
          </div>
        </article>

        <article className="content-card appliance-result">
          <div className="section-title">
            <Zap size={22} />
            <h2>Estimated monthly usage</h2>
          </div>

          {result ? (
            <>
              <span className="stat-icon green">
                {selected && <selected.icon size={25} />}
              </span>

              <p className="stat-title">Estimated energy consumption</p>
              <h2 className="appliance-result-value">
                {result.units.toFixed(2)} kWh
              </h2>

              <p className="muted">
                Approximate energy cost for one month
              </p>
              <h3>₹{result.cost.toLocaleString("en-IN", {
                maximumFractionDigits: 2
              })}</h3>

              <p className="muted">
                Formula: watts × quantity × hours per day × days ÷ 1000.
              </p>
            </>
          ) : (
            <p className="notice notice-warning">
              Enter valid values to calculate the estimate.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}


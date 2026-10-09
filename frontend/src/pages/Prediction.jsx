
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrainCircuit, TrendingUp, Zap, AlertCircle } from "lucide-react";
import predictionService from "../services/predictionService";

export default function Prediction({ bills = [] }) {
  const { t } = useTranslation();

  const [monthsAhead, setMonthsAhead] = useState("1");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalUnits = bills.reduce(
    (sum, bill) => sum + (Number(bill.units) || 0),
    0
  );

  const averageUnits = bills.length ? totalUnits / bills.length : 0;

  async function handlePredict() {
    setError("");
    setPrediction(null);

    if (bills.length < 3) {
      setError(
        "Add at least 3 months of bill history before requesting a forecast."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await predictionService.predictUsage({
        bills: bills.map((bill) => ({
          month: bill.month,
          units: Number(bill.units),
          amount: Number(bill.amount)
        })),
        months_ahead: Number(monthsAhead)
      });

      setPrediction(result);
    } catch {
      setError(
        "Prediction service is unavailable. Please check that the backend is running and its /api/predict endpoint is configured."
      );
    } finally {
      setLoading(false);
    }
  }

  const predictedUnits =
    prediction?.predicted_units ??
    prediction?.prediction?.predicted_units ??
    prediction?.prediction ??
    null;

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("prediction")}</h1>
          <p className="muted">
            Forecast electricity consumption using your bill history.
          </p>
        </div>
      </div>

      <section className="content-card prediction-intro">
        <span className="stat-icon purple">
          <BrainCircuit size={25} />
        </span>
        <h2>{t("predictionTitle")}</h2>
        <p className="muted">{t("predictionNote")}</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon green">
            <Zap size={21} />
          </span>
          <p className="stat-title">Recorded bills</p>
          <h2>{bills.length}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon blue">
            <TrendingUp size={21} />
          </span>
          <p className="stat-title">Average recorded usage</p>
          <h2>{averageUnits.toFixed(1)} kWh</h2>
        </article>
      </section>

      <section className="content-card">
        <h2>Generate a forecast</h2>
        <p className="muted">
          At least three recorded bills are required by this page before it
          sends a prediction request.
        </p>

        <div className="form-group">
          <label htmlFor="monthsAhead">Forecast period</label>
          <select
            id="monthsAhead"
            value={monthsAhead}
            onChange={(event) => setMonthsAhead(event.target.value)}
          >
            <option value="1">Next month</option>
            <option value="2">Next 2 months</option>
            <option value="3">Next 3 months</option>
          </select>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handlePredict}
          disabled={loading}
        >
          <BrainCircuit size={18} />
          {loading ? t("loading") : "Generate prediction"}
        </button>

        {error && (
          <div className="notice notice-warning" role="alert">
            <AlertCircle size={19} />
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className="prediction-result">
            <h3>Forecast result</h3>

            {predictedUnits !== null && typeof predictedUnits !== "object" ? (
              <p className="prediction-value">
                {Number(predictedUnits).toFixed(1)} kWh
              </p>
            ) : (
              <pre className="prediction-output">
                {JSON.stringify(prediction, null, 2)}
              </pre>
            )}

            <p className="muted">
              This is a model estimate, not a guaranteed future bill.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}


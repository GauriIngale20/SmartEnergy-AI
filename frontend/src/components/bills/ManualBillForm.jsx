

import { useState } from "react";
import { Receipt, Save } from "lucide-react";

const initialForm = {
  month: "",
  units: "",
  amount: "",
  dueDate: ""
};

export default function ManualBillForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const units = Number(form.units);
    const amount = Number(form.amount);

    if (!form.month || !form.dueDate) {
      setError("Please select the bill month and due date.");
      return;
    }

    if (!Number.isFinite(units) || units <= 0) {
      setError("Units must be greater than zero.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Bill amount must be greater than zero.");
      return;
    }

    if (typeof onSubmit === "function") {
      onSubmit({
        month: form.month,
        units,
        amount,
        dueDate: form.dueDate
      });
    }

    setForm({ ...initialForm });
    setError("");
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Enter Bill Details</h2>
          <p className="muted">
            Add your electricity bill manually.
          </p>
        </div>

        <Receipt size={22} />
      </div>

      <form className="bill-form" onSubmit={handleSubmit}>
        <label>
          Bill Month
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Units Consumed (kWh)
          <input
            type="number"
            name="units"
            min="0.01"
            step="any"
            placeholder="e.g. 250"
            value={form.units}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Bill Amount (Rs.)
          <input
            type="number"
            name="amount"
            min="0.01"
            step="any"
            placeholder="e.g. 1850"
            value={form.amount}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Due Date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={updateField}
            required
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button" type="submit">
          <Save size={17} />
          Save Bill
        </button>
      </form>
    </section>
  );
}
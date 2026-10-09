
import {
  CalendarDays,
  Zap,
  IndianRupee,
  Trash2
} from "lucide-react";

export default function BillDetails({ bills = [], onDelete }) {
  if (!bills.length) {
    return (
      <section className="content-card">
        <h2>Bill History</h2>
        <p className="muted">
          No bills added yet. Enter a bill to see your history here.
        </p>
      </section>
    );
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Bill History</h2>
          <p className="muted">
            {bills.length} bill(s) recorded
          </p>
        </div>
      </div>

      <div className="bill-list">
        {bills.map((bill, index) => (
          <article
            className="bill-row"
            key={bill.id ?? `${bill.month}-${index}`}
          >
            <div className="bill-row-icon">
              <Zap size={20} />
            </div>

            <div className="bill-row-main">
              <strong>{bill.month || "Unknown month"}</strong>

              <span className="muted">
                <CalendarDays size={14} />
                Due: {bill.dueDate || bill.due_date || "Not provided"}
              </span>

              <span className="muted">
                <Zap size={14} />
                {Number(bill.units || 0).toLocaleString("en-IN")} kWh
              </span>
            </div>

            <div className="bill-row-amount">
              <strong>
                <IndianRupee size={14} />
                {Number(bill.amount || 0).toLocaleString("en-IN")}
              </strong>

              {onDelete && (
                <button
                  type="button"
                  className="icon-button delete-button"
                  aria-label={"Delete bill for " + (bill.month || "unknown month")}
                  onClick={() => onDelete(bill.id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

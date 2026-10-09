
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, IndianRupee, Zap } from "lucide-react";
import * as XLSX from "xlsx";

export default function Reports({ bills = [] }) {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    const totalUnits = bills.reduce(
      (sum, bill) => sum + (Number(bill.units) || 0),
      0
    );

    const totalAmount = bills.reduce(
      (sum, bill) => sum + (Number(bill.amount) || 0),
      0
    );

    return {
      totalUnits,
      totalAmount,
      averageUnits: bills.length ? totalUnits / bills.length : 0
    };
  }, [bills]);

  function downloadExcel() {
    if (bills.length === 0) {
      window.alert("Please add at least one bill before exporting.");
      return;
    }

    const rows = bills.map((bill) => {
      const rawDate = bill.dueDate ?? bill.due_date ?? "";
      let dueDate = "";

      if (rawDate) {
        const match = String(rawDate).match(
          /^(\d{4})-(\d{2})-(\d{2})/
        );

        dueDate = match
          ? `${match[1]}-${match[2]}-${match[3]}`
          : String(rawDate);
      }

      return {
        Month: bill.month ?? "",
        "Units (kWh)": Number(bill.units) || 0,
        "Bill Amount (INR)": Number(bill.amount) || 0,
        "Due Date": dueDate
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set readable column widths, especially for the due date.
    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 16 },
      { wch: 22 },
      { wch: 18 }
    ];

    worksheet["!autofilter"] = {
      ref: worksheet["!ref"]
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bill Report");

    XLSX.writeFile(workbook, "smartenergy-bill-report.xlsx");
  }

  function formatRupees(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-IN");
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("reports")}</h1>
          <p className="muted">
            Review your recorded bills and export an Excel report.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={downloadExcel}
          disabled={bills.length === 0}
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon green">
            <FileText size={21} />
          </span>
          <p className="stat-title">Recorded bills</p>
          <h2>{bills.length}</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon blue">
            <Zap size={21} />
          </span>
          <p className="stat-title">{t("totalConsumption")}</p>
          <h2>{summary.totalUnits.toLocaleString("en-IN")} kWh</h2>
        </article>

        <article className="stat-card">
          <span className="stat-icon orange">
            <IndianRupee size={21} />
          </span>
          <p className="stat-title">{t("totalBill")}</p>
          <h2>{formatRupees(summary.totalAmount)}</h2>
        </article>
      </section>

      <section className="content-card">
        <h2>Bill summary</h2>

        {bills.length === 0 ? (
          <p className="muted">
            {t("noData")}. Add electricity bills to prepare your report.
          </p>
        ) : (
          <>
            <p>
              <strong>Average usage per recorded bill:</strong>{" "}
              {summary.averageUnits.toFixed(2)} kWh
            </p>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Units (kWh)</th>
                    <th>Bill amount</th>
                    <th>Due date</th>
                  </tr>
                </thead>

                <tbody>
                  {bills.map((bill, index) => (
                    <tr key={bill.id ?? `${bill.month}-${index}`}>
                      <td>{bill.month || "—"}</td>
                      <td>
                        {Number(bill.units || 0).toLocaleString("en-IN")}
                      </td>
                      <td>{formatRupees(bill.amount || 0)}</td>
                      <td>{bill.dueDate ?? bill.due_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
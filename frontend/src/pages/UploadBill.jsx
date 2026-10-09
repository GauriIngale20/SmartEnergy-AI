
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Upload } from "lucide-react";

import ManualBillForm from "../components/bills/ManualBillForm";
import BillUpload from "../components/bills/BillUpload";
import BillDetails from "../components/bills/BillDetails";

export default function UploadBill({
  bills = [],
  onAddBill,
  onDeleteBill
}) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedBill, setExtractedBill] = useState(null);
  const [savingExtracted, setSavingExtracted] = useState(false);
  const [extractError, setExtractError] = useState("");

  function handleSubmit(bill) {
    onAddBill?.({
      ...bill,
      id: Date.now()
    });
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t("uploadBill")}</h1>
          <p className="muted">
            Add electricity bill details and track your usage.
          </p>
        </div>
      </div>

      <section className="dashboard-charts">
        <article className="content-card">
          <div className="section-title">
            <FileText size={21} />
            <h2>{t("enterBillDetails")}</h2>
          </div>

          <ManualBillForm onSubmit={handleSubmit} />
        </article>

        <article className="content-card">
          <div className="section-title">
            <Upload size={21} />
            <h2>{t("chooseFile")}</h2>
          </div>

          <BillUpload onFileSelect={setSelectedFile} onExtracted={setExtractedBill} />

          {selectedFile && (
            <p className="muted">
              Selected file: {selectedFile.name}
            </p>
          )}

          {extractedBill && (
            <div className="content-card">
              <h3>Review Extracted Bill Details</h3>
              <p className="muted">
                Check the extracted values carefully before saving.
              </p>

              <label>
                Bill Month
                <input
                  type="month"
                  value={extractedBill.month || ""}
                  onChange={(event) => setExtractedBill({
                    ...extractedBill, month: event.target.value
                  })}
                />
              </label>

              <label>
                Units Consumed (kWh)
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={extractedBill.units ?? ""}
                  onChange={(event) => setExtractedBill({
                    ...extractedBill, units: event.target.value
                  })}
                />
              </label>

              <label>
                Bill Amount (Rs.)
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={extractedBill.amount ?? ""}
                  onChange={(event) => setExtractedBill({
                    ...extractedBill, amount: event.target.value
                  })}
                />
              </label>

              <label>
                Due Date (optional)
                <input
                  type="date"
                  value={extractedBill.dueDate || ""}
                  onChange={(event) => setExtractedBill({
                    ...extractedBill, dueDate: event.target.value
                  })}
                />
              </label>

              {extractError && (
                <p className="form-error" role="alert">{extractError}</p>
              )}

              <button
                type="button"
                className="primary-button"
                disabled={savingExtracted}
                onClick={async () => {
                  const units = Number(extractedBill.units);
                  const amount = Number(extractedBill.amount);

                  if (
                    !/^\d{4}-\d{2}$/.test(extractedBill.month || "") ||
                    !Number.isFinite(units) || units <= 0 ||
                    !Number.isFinite(amount) || amount <= 0
                  ) {
                    setExtractError("Check month, units and amount before saving.");
                    return;
                  }

                  setSavingExtracted(true);
                  setExtractError("");

                  try {
                    await onAddBill?.({
                      month: extractedBill.month,
                      units,
                      amount,
                      dueDate: extractedBill.dueDate || ""
                    });
                    setExtractedBill(null);
                    setSelectedFile(null);
                  } catch {
                    setExtractError("Could not save the extracted bill.");
                  } finally {
                    setSavingExtracted(false);
                  }
                }}
              >
                {savingExtracted ? "Saving..." : "Confirm and Save Bill"}
              </button>
            </div>
          )}
          <p className="muted">
            {t("fileProcessingNote")}
          </p>
        </article>
      </section>

      <section className="content-card">
        <h2>{t("billHistory")}</h2>

        <BillDetails
          bills={bills}
          onDelete={onDeleteBill}
        />
      </section>
    </main>
  );
}



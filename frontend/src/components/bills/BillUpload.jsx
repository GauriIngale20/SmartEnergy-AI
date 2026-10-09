
import { useRef, useState } from "react";
import { Upload, FileText, X, LoaderCircle } from "lucide-react";
import billService from "../../services/billService";

export default function BillUpload({ onFileSelect, onExtracted }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleFile(file) {
    setError("");
    setSuccess("");

    if (!file) return;

    const validExtension = /\.(pdf|jpe?g|png|webp|csv)$/i.test(file.name);
    if (!validExtension) {
      setError("Choose a PDF, JPG, PNG, WebP or CSV file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be 10 MB or less.");
      return;
    }

    setFileName(file.name);
    onFileSelect?.(file);
    setLoading(true);

    try {
      const extracted = await billService.uploadBillFile(file);
      onExtracted?.(extracted);
      setSuccess("File processed. Review the extracted values below before saving.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Could not process this file. You can still enter bill details manually."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRemoveFile() {
    setFileName("");
    setError("");
    setSuccess("");

    if (inputRef.current) inputRef.current.value = "";

    onFileSelect?.(null);
    onExtracted?.(null);
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Upload Electricity Bill</h2>
          <p className="muted">
            Extract bill details from a CSV, PDF or image.
          </p>
        </div>
        <FileText size={22} />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.csv"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <button
        type="button"
        className="primary-button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? <LoaderCircle size={17} /> : <Upload size={17} />}
        {loading ? "Processing..." : "Choose Bill File"}
      </button>

      {fileName && (
        <div className="upload-file-info">
          <FileText size={18} />
          <span>{fileName}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Remove selected file"
            onClick={handleRemoveFile}
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && <p role="status" className="muted">{success}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}

      <p className="muted">
        Extracted information may be inaccurate. Always verify the month,
        units and amount before saving the bill.
      </p>
    </section>
  );
}
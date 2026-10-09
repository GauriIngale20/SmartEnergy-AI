import { Zap } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="loading-container"
      role="status"
      aria-live="polite"
    >
      <div className="loading-icon">
        <Zap size={28} fill="currentColor" />
      </div>

      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}
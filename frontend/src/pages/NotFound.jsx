
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-content not-found-page">
      <section className="content-card not-found-card">
        <div className="not-found-icon">
          <Zap size={42} />
        </div>

        <p className="not-found-code">404</p>

        <h1>Page Not Found</h1>

        <p className="muted">
          Sorry! The page you are looking for does not exist or may have
          been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="primary-button">
            <Home size={18} />
            Go to Home
          </Link>

          <button
            type="button"
            className="secondary-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
}


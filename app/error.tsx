"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="page-hero">
      <div className="site-container not-found-shell">
        <p className="eyebrow">Unexpected error</p>
        <h1 className="page-title">Something went wrong while loading the page.</h1>
        <p className="page-intro">
          Please try again. If the issue continues, contact the firm and mention the page you were trying to open.
        </p>
        <div className="cta-actions">
          <button type="button" className="button-primary" onClick={reset}>
            Try again
          </button>
        </div>
        {process.env.NODE_ENV !== "production" ? (
          <pre className="error-debug">{error.message}</pre>
        ) : null}
      </div>
    </section>
  );
}

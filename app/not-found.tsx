import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="site-container not-found-shell">
        <p className="eyebrow">Page not found</p>
        <h1 className="page-title">That page is not available.</h1>
        <p className="page-intro">
          The page may have moved, the URL may be incorrect, or the content may no longer be public.
        </p>
        <div className="cta-actions">
          <Link href="/" className="button-primary">
            Return home
          </Link>
          <Link href="/contact" className="button-secondary">
            Contact the firm
          </Link>
        </div>
      </div>
    </section>
  );
}

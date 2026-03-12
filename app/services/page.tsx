import type { Metadata } from "next";
import Link from "next/link";
import { getPracticeAreasForPage } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Kinsley Law Advocates practice areas, from family and corporate law to real estate, criminal defense, estate planning, and personal injury.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const practiceAreas = await getPracticeAreasForPage();
  const processSteps = [
    "Structured intake and conflict review",
    "A defined lead attorney and workstream",
    "Clear action plan with practical next steps",
  ];

  return (
    <>
      <section className="page-hero">
        <div className="site-container page-hero-grid compact">
          <div>
            <p className="eyebrow">Practice areas</p>
            <h1 className="page-title">Comprehensive legal services structured around real client needs.</h1>
            <p className="page-intro">
              Our services are designed for clients who want both sharp legal
              insight and a clear, well-managed engagement. We advise on
              personal, business, property, and dispute matters with the same
              level of rigor.
            </p>
          </div>
          <div className="services-side-panel card-surface">
            <h2>What you can expect</h2>
            <ul>
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container services-grid-modern">
          {practiceAreas.map((area, index) => (
            <article key={area.name} className="service-panel">
              <div className="service-panel-header">
                <span className="service-index">0{index + 1}</span>
                <div>
                  <p className="eyebrow">Practice Group</p>
                  <h2>{area.name}</h2>
                </div>
              </div>
              <p className="service-description">{area.description}</p>
              {"attorney" in area && area.attorney ? (
                <p className="service-attorney">Lead attorney: {area.attorney.name}</p>
              ) : null}
              <ul className="service-list">
                {area.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section section-dark">
        <div className="site-container consultation-banner">
          <div>
            <p className="eyebrow light">Schedule a consultation</p>
            <h2 className="section-title light">Tell us what you are facing and we will guide you to the right practice area.</h2>
          </div>
          <Link href="/contact" className="button-primary">
            Contact the Team
          </Link>
        </div>
      </section>
    </>
  );
}

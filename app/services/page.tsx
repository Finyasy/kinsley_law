import type { Metadata } from "next";
import Link from "next/link";
import { BrandCard } from "@/components/brand/brand-card";
import { getPracticeAreasForPage } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore the practice areas at Kinsley Advocates, from family and business law to real estate, defense, estate planning, and mineral-sector advisory.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const practiceAreas = await getPracticeAreasForPage();
  const mineralsPractice =
    practiceAreas.find((area) => {
      const normalizedName = area.name.toLowerCase();
      return normalizedName.includes("gold") || normalizedName.includes("mineral");
    }) ?? null;
  const processSteps = [
    "Structured intake and conflict review",
    "A defined lead advocate and clear workstream",
    "Practical next steps with managed communication",
  ];
  const mineralsClientTypes = [
    "Investors evaluating mineral-sector entry, structuring, or risk allocation",
    "Landowners and rights holders dealing with access, use, compensation, or title issues",
    "Exploration and operating companies managing permits, contracts, and counterparties",
    "Mineral traders and commercial partners handling supply, offtake, and performance disputes",
  ];
  const mineralsEarlyEngagementReasons = [
    "Permit, land-access, and counterpart risk is cheaper to manage before commitments are signed.",
    "Upstream structuring decisions often determine how exposed a project becomes downstream.",
    "Clear legal positioning helps preserve leverage when approvals, operations, or supply obligations tighten.",
  ];
  const mineralsProcessSteps = [
    {
      title: "Risk framing",
      text: "We identify the licensing, counterpart, land, and commercial issues that can materially affect the matter.",
    },
    {
      title: "Permit and rights review",
      text: "We review approvals, land-access questions, mineral-rights position, and responsibility allocation early.",
    },
    {
      title: "Structure and response plan",
      text: "We help shape the contract, negotiation, or dispute strategy around the actual commercial pressure points.",
    },
  ];
  const mineralsProofPoints = [
    {
      title: "Commercially grounded advice",
      text: "We focus on what protects the client’s legal position without losing sight of operational timing and deal pressure.",
    },
    {
      title: "Early-stage issue spotting",
      text: "We help surface permitting, land-rights, and counterpart risks before they harden into disputes or stalled execution.",
    },
    {
      title: "Discreet, structured coordination",
      text: "Sensitive mining and mineral matters benefit from disciplined communication and a single clear legal workstream.",
    },
  ];

  return (
    <>
      <section className="page-hero page-hero-premium">
        <div className="site-container page-hero-grid compact">
          <div>
            <p className="eyebrow">Practice areas</p>
            <h1 className="page-title">Comprehensive legal services for matters that need calm control.</h1>
            <p className="page-intro">
              Our services are designed for clients who want both sharp legal insight and a
              well-managed engagement. We advise on personal, business, property, and dispute
              matters with the same disciplined standard.
            </p>
          </div>
          <div className="services-side-panel services-hero-panel">
            <BrandCard priority className="services-brand-card" />
            <div className="services-hero-copy">
              <h2>What working with us feels like</h2>
              <ul>
                {processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
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
                <p className="service-attorney">Lead advocate: {area.attorney.name}</p>
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

      {mineralsPractice ? (
        <section className="site-section section-tint">
          <div className="site-container">
            <div className="minerals-service-feature">
              <div className="minerals-service-hero">
                <div>
                  <p className="eyebrow">Sector advisory</p>
                  <h2 className="section-title">{mineralsPractice.name}</h2>
                </div>
                <p className="minerals-service-intro">{mineralsPractice.description}</p>
                <div className="minerals-service-meta">
                  <span>Licensing, land access, contracts, compliance, and disputes</span>
                  {mineralsPractice.attorney ? (
                    <span>Lead advocate: {mineralsPractice.attorney.name}</span>
                  ) : null}
                </div>
              </div>

              <div className="minerals-service-grid">
                <article className="minerals-service-card card-surface">
                  <p className="eyebrow">Who we advise</p>
                  <ul className="minerals-service-list">
                    {mineralsClientTypes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="minerals-service-card card-surface">
                  <p className="eyebrow">Representative work</p>
                  <ul className="minerals-service-list">
                    {mineralsPractice.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="minerals-service-grid minerals-service-grid-supporting">
                <article className="minerals-service-card card-surface">
                  <p className="eyebrow">Why clients come to us early</p>
                  <ul className="minerals-service-list">
                    {mineralsEarlyEngagementReasons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="minerals-service-card card-surface">
                  <p className="eyebrow">Typical advisory path</p>
                  <div className="minerals-process-strip">
                    {mineralsProcessSteps.map((step, index) => (
                      <div key={step.title} className="minerals-process-step">
                        <span className="minerals-process-index">0{index + 1}</span>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="minerals-proof-panel">
                <div className="section-heading-row">
                  <div>
                    <p className="eyebrow light">Sector proof</p>
                    <h3 className="section-title light">Built for minerals matters where timing, permissions, and commercial pressure intersect.</h3>
                  </div>
                </div>
                <div className="minerals-proof-grid">
                  {mineralsProofPoints.map((item) => (
                    <article key={item.title} className="minerals-proof-card">
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </article>

              <div className="minerals-service-cta">
                <div>
                  <p className="eyebrow">Need minerals-sector guidance?</p>
                  <h3>Bring the matter early so we can help structure it before risk compounds.</h3>
                </div>
                <div className="cta-actions">
                  <Link
                    href={`/contact?practiceArea=${encodeURIComponent(mineralsPractice.name)}#consultation`}
                    className="button-primary"
                  >
                    Request a minerals consultation
                  </Link>
                  <Link href="/contact" className="button-secondary">
                    Send an enquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!mineralsPractice ? (
        <section className="site-section section-dark">
          <div className="site-container consultation-banner">
            <div>
              <p className="eyebrow light">Schedule a consultation</p>
              <h2 className="section-title light">
                Tell us what you are facing and we will route you to the right practice area.
              </h2>
            </div>
            <Link href="/contact#consultation" className="button-primary">
              Contact the Team
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}

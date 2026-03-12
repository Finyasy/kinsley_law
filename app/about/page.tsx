import type { Metadata } from "next";
import { AttorneyAvatar } from "@/components/brand/attorney-avatar";
import { BrandSeal } from "@/components/brand/brand-seal";
import { getAttorneysForPage } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the legal team behind Kinsley Law Advocates and learn how the firm approaches high-trust representation.",
};

export const dynamic = "force-dynamic";

const principles = [
  {
    title: "Strategic clarity",
    text: "We simplify complex legal questions into actionable choices with clear tradeoffs.",
  },
  {
    title: "Measured communication",
    text: "Clients should never feel uninformed, rushed, or left to interpret legal risk alone.",
  },
  {
    title: "Professional stamina",
    text: "We prepare thoroughly, stay calm under pressure, and keep matters moving with discipline.",
  },
];

export default async function AboutPage() {
  const attorneys = await getAttorneysForPage();

  return (
    <>
      <section className="page-hero">
        <div className="site-container page-hero-grid">
          <div>
            <p className="eyebrow">About the firm</p>
            <h1 className="page-title">A legal practice shaped by integrity, mastery, and client experience.</h1>
            <p className="page-intro">
              Kinsley Law Advocates was founded in 2010 to provide legal counsel
              that balances technical excellence with a refined human touch. We
              represent private clients and businesses with discretion, focus,
              and accountability at every stage of a matter.
            </p>
          </div>
          <div className="page-hero-card page-brand-card">
            <BrandSeal size="md" className="page-brand-seal" />
            <div className="page-brand-copy">
              <span className="eyebrow light">Since 2010</span>
              <p>
                The firm was built to feel current in service, disciplined in
                preparation, and steady under pressure.
              </p>
              <div className="page-brand-metrics">
                <div>
                  <strong>Senior-led</strong>
                  <span>intake and strategy</span>
                </div>
                <div>
                  <strong>Six groups</strong>
                  <span>under one operating model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container story-grid">
          <article className="card-surface story-card">
            <p className="eyebrow">Our story</p>
            <h2>Built to be the legal partner clients return to.</h2>
            <p>
              Over the years, the firm has grown into a dependable legal partner
              for individuals, families, and organizations that need precise
              advice, strong representation, and a responsive team.
            </p>
          </article>

          <article className="card-surface story-card">
            <p className="eyebrow">Our mission</p>
            <h2>Deliver high-quality representation without losing the human element.</h2>
            <p>
              We maintain high ethical standards, protect our clients&apos; time
              and trust, and work to build long relationships grounded in
              results, candor, and respect.
            </p>
          </article>
        </div>
      </section>

      <section className="site-section section-tint">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="section-title">Principles that shape the client experience.</h2>
            </div>
          </div>

          <div className="principles-grid">
            {principles.map((principle) => (
              <article key={principle.title} className="principle-card">
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Our legal team</p>
              <h2 className="section-title">Experienced attorneys with focused domain expertise.</h2>
            </div>
          </div>

          <div className="team-grid">
            {attorneys.map((attorney, index) => (
              <article key={attorney.email} className="team-card card-surface">
                <div className="team-card-media">
                  <AttorneyAvatar name={attorney.name} role={attorney.position} />
                  <span className="team-card-tag">Attorney {index + 1}</span>
                </div>
                <div className="team-card-body">
                  <h3>{attorney.name}</h3>
                  <p className="team-card-role">{attorney.position}</p>
                  <p className="team-card-specialization">{attorney.specialization}</p>
                  <p>{attorney.bio}</p>
                  {attorney.practiceAreas.length > 0 ? (
                    <div className="team-card-practices">
                      {attorney.practiceAreas.map((practiceArea) => (
                        <span key={practiceArea.id}>{practiceArea.name}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="team-card-meta">
                    <span>{attorney.email}</span>
                    <span>{attorney.phone}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

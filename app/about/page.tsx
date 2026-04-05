import type { Metadata } from "next";
import { AttorneyAvatar } from "@/components/brand/attorney-avatar";
import { BrandCard } from "@/components/brand/brand-card";
import {
  FIRM_CONTACT_EMAIL,
  FIRM_CONTACT_PHONE,
} from "@/lib/firm-contact";
import { getAttorneysForPage } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind Kinsley Advocates and learn how the firm approaches disciplined, dignified representation.",
};

export const dynamic = "force-dynamic";

const principles = [
  {
    title: "Strategic clarity",
    text: "We simplify legal pressure into choices clients can understand, evaluate, and act on.",
  },
  {
    title: "Dignity under pressure",
    text: "We handle each matter with restraint, discretion, and the composure serious representation demands.",
  },
  {
    title: "Prepared advocacy",
    text: "Every brief, negotiation, filing, and conversation is built on disciplined preparation.",
  },
  {
    title: "Advanced training",
    text: "Several members hold master's degrees and regularly contribute to legal education through talks and law-school sessions.",
  },
];

export default async function AboutPage() {
  const attorneys = await getAttorneysForPage();

  return (
    <>
      <section className="page-hero page-hero-premium">
        <div className="site-container page-hero-grid">
          <div>
            <p className="eyebrow">About the firm</p>
            <h1 className="page-title">A legal practice shaped by disciplined judgment, regional fluency, and calm execution.</h1>
            <p className="page-intro">
              Kinsley Advocates was built to deliver legal representation that feels refined,
              responsive, and steady under pressure. We represent private clients, businesses,
              investors, and operators that value sharp preparation, clear communication, and
              commercially grounded legal strategy.
            </p>
          </div>
          <div className="page-brand-card page-brand-card-premium">
            <BrandCard priority className="services-brand-card" />
            <div className="page-brand-copy">
              <span className="eyebrow light">Since 2010</span>
              <p>
                Our operating model is simple: senior-led intake, measured communication, and
                advocacy that protects both legal position and client confidence.
              </p>
              <div className="page-brand-metrics">
                <div>
                  <strong>Senior-led</strong>
                  <span>intake and strategy</span>
                </div>
                <div>
                  <strong>Nairobi based</strong>
                  <span>serving private and commercial matters</span>
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
            <h2>Built to be the legal partner clients trust when matters feel sensitive, urgent, or high-value.</h2>
            <p>
              We have grown into a dependable legal partner for families, founders, investors,
              and operating businesses that need calm advice, strong representation, and a team
              that can move fluidly across disputes, transactions, and cross-border instructions.
            </p>
          </article>

          <article className="card-surface story-card">
            <p className="eyebrow">Our mission</p>
            <h2>Protect our clients with attorneys who are exacting, commercially alert, and deeply human.</h2>
            <p>
              We aim to bring discipline and clarity to every matter by combining technical
              excellence with candor, respect, and a premium client experience that remains steady
              even when the underlying issue is not.
            </p>
          </article>
        </div>
      </section>

      <section className="site-section section-tint">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="section-title">Principles that shape every client experience.</h2>
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
              <h2 className="section-title">Experienced advocates with focused domain expertise, advanced study, and teaching presence.</h2>
            </div>
          </div>

          <div className="team-grid">
            {attorneys.map((attorney, index) => (
              <article key={attorney.email} className="team-card card-surface">
                <div className="team-card-media">
                  <AttorneyAvatar
                    name={attorney.name}
                    role={attorney.position}
                    photoUrl={attorney.photoUrl}
                  />
                  <span className="team-card-tag">Advocate {index + 1}</span>
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
                  <div className="team-card-routing">
                    <span>All client enquiries are routed through the firm.</span>
                    <div className="team-card-meta">
                      <a href={`mailto:${FIRM_CONTACT_EMAIL}`}>{FIRM_CONTACT_EMAIL}</a>
                      <a href={`tel:${FIRM_CONTACT_PHONE.replace(/\s+/g, "")}`}>{FIRM_CONTACT_PHONE}</a>
                    </div>
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

import type { Metadata } from "next";
import Link from "next/link";
import { AttorneyAvatar } from "@/components/brand/attorney-avatar";
import { LogoMark } from "@/components/brand/logo-mark";
import { ValueRotator } from "@/components/home/value-rotator";
import {
  getAttorneysForPage,
  getHomePageContent,
  getPracticeAreasForPage,
  getTestimonialsForPage,
} from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Better Call Kinsley Advocates",
  description:
    "Bring dignity and honor to your legal battles with strategic counsel from Kinsley Advocates in Nairobi.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [homePageContent, attorneys, practiceAreas, testimonials] = await Promise.all([
    getHomePageContent(),
    getAttorneysForPage(),
    getPracticeAreasForPage(),
    getTestimonialsForPage(),
  ]);

  const featuredAttorneys = attorneys.slice(0, 3);
  const featuredPractices = practiceAreas.slice(0, 6);
  const mineralsPractice =
    practiceAreas.find((area) => area.name.toLowerCase().includes("gold and mineral")) ?? null;

  return (
    <>
      <section className="hero-shell">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Better Call Kinsley Advocates</p>
            <ValueRotator values={homePageContent.valueRotatorWords} />
            <p className="hero-kicker">Bring dignity &amp; honor to your legal battles.</p>
            <p className="hero-description">{homePageContent.heroDescription}</p>
            <div className="hero-actions">
              <Link href="/contact" className="button-primary">
                Start a Consultation
              </Link>
              <Link href="/services" className="button-secondary">
                Explore Practice Areas
              </Link>
            </div>
            <div className="credibility-band">
              {homePageContent.credibilityBand.map((item) => (
                <div key={item.label}>
                  <span className="credibility-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-visual-stage">
              <div className="hero-visual-card">
                <LogoMark size="lg" priority className="hero-logo" />
                <div className="hero-visual-copy">
                  <span className="eyebrow light">Kinsley Advocates</span>
                  <h2>Senior-led legal strategy with clarity, restraint, and force.</h2>
                  <p>{homePageContent.portraitText}</p>
                </div>
              </div>
              <article className="hero-floating-card hero-floating-card-primary">
                <span className="hero-floating-label">Main office</span>
                <strong>Global Trading Center (GTC), Westlands, 9th Floor, Suite D36</strong>
                <p>P.O. Box 18627-00100, Nairobi.</p>
              </article>
              <article className="hero-floating-card hero-floating-card-compact secondary">
                <span className="hero-floating-label">Direct line</span>
                <strong>+254 704 561 831</strong>
              </article>
              <article className="hero-floating-card hero-floating-card-compact secondary">
                <span className="hero-floating-label">Email</span>
                <strong>kinsleyadvocates@gmail.com</strong>
              </article>
              <article className="hero-floating-card hero-floating-card-compact secondary">
                <span className="hero-floating-label">Client experience</span>
                <strong>Structured updates, discreet handling, and clear next steps</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="site-container stats-grid">
          {homePageContent.highlights.map((item) => (
            <article key={item.label} className="stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="site-container split-section">
          <div className="section-copy">
            <p className="eyebrow">{homePageContent.legacySectionEyebrow}</p>
            <h2 className="section-title">A modern Nairobi law firm with a steadier way to fight.</h2>
            {homePageContent.legacyParagraphs.map((paragraph) => (
              <p key={paragraph} className="section-text">
                {paragraph}
              </p>
            ))}
            <div className="feature-list">
              {homePageContent.achievements.map((achievement) => (
                <div key={achievement} className="feature-item">
                  <span className="feature-bullet" />
                  <p>{achievement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="legacy-card card-surface">
            <LogoMark size="md" className="legacy-logo" />
            <div className="legacy-grid">
              {homePageContent.legacyMetrics.map((metric) => (
                <div key={`${metric.value}-${metric.text}`}>
                  <span className="metric">{metric.value}</span>
                  <p>{metric.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section section-tint">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{homePageContent.servicesEyebrow}</p>
              <h2 className="section-title">
                Legal services built around how clients actually search for help.
              </h2>
            </div>
            <Link href="/services" className="text-link">
              View all services
            </Link>
          </div>

          <div className="practice-grid">
            {featuredPractices.map((area) => (
              <article key={area.name} className="practice-card card-surface">
                <p className="practice-kicker">Practice Group</p>
                <h3>{area.name}</h3>
                <p>{area.description}</p>
                <ul className="practice-chip-list">
                  {area.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {mineralsPractice ? (
            <article className="minerals-spotlight card-surface">
              <div className="minerals-spotlight-copy">
                <p className="eyebrow">Sector focus</p>
                <h3>{mineralsPractice.name}</h3>
                <p>{mineralsPractice.description}</p>
                <div className="minerals-spotlight-meta">
                  <span>
                    Built for exploration companies, investors, landowners, and
                    mineral-trade counterparties.
                  </span>
                  {mineralsPractice.attorney ? (
                    <span>Lead attorney: {mineralsPractice.attorney.name}</span>
                  ) : null}
                </div>
              </div>

              <div className="minerals-spotlight-actions">
                <ul className="practice-chip-list">
                  {mineralsPractice.highlights.slice(0, 4).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="cta-actions">
                  <Link
                    href={`/contact?practiceArea=${encodeURIComponent(mineralsPractice.name)}#consultation`}
                    className="button-primary"
                  >
                    Speak with our minerals advisory team
                  </Link>
                  <Link href="/services" className="button-secondary">
                    Review all practice areas
                  </Link>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{homePageContent.teamEyebrow}</p>
              <h2 className="section-title">Experienced lawyers with clearly defined strengths.</h2>
            </div>
            <Link href="/about" className="text-link">
              Meet the firm
            </Link>
          </div>

          <div className="attorney-grid">
            {featuredAttorneys.map((attorney, index) => (
              <article key={attorney.email} className="attorney-card">
                <div className="attorney-card-image">
                  <AttorneyAvatar
                    name={attorney.name}
                    role={attorney.specialization}
                    photoUrl={attorney.photoUrl}
                  />
                </div>
                <div className="attorney-card-content">
                  <span className="attorney-index">0{index + 1}</span>
                  <h3>{attorney.name}</h3>
                  <p className="attorney-role">
                    {attorney.position} · {attorney.specialization}
                  </p>
                  <p>{attorney.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section section-dark">
        <div className="site-container">
          <div className="section-heading-row light">
            <div>
              <p className="eyebrow light">{homePageContent.testimonialsEyebrow}</p>
              <h2 className="section-title light">
                Clients remember the calm, clarity, and preparation.
              </h2>
            </div>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <article key={testimonial.name} className="testimonial-card">
                <span className="testimonial-mark">0{index + 1}</span>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.title}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section cta-section">
        <div className="site-container cta-panel">
          <div>
            <p className="eyebrow">{homePageContent.ctaEyebrow}</p>
            <h2 className="section-title">
              Tell us what you are facing, and we will route it to the right advocate.
            </h2>
          </div>
          <div className="cta-actions">
            <Link href="/contact" className="button-primary">
              Contact the Firm
            </Link>
            <Link href="/about" className="button-secondary">
              Learn About the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

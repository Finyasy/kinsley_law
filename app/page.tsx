import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ValueRotator } from "@/components/home/value-rotator";
import {
  getAttorneysForPage,
  getHomePageContent,
  getPracticeAreasForPage,
  getTestimonialsForPage,
} from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Strategic Counsel With Staying Power",
  description:
    "Kinsley Law Advocates delivers modern legal counsel across family, corporate, real estate, criminal defense, estate planning, and personal injury matters.",
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

  return (
    <>
      <section className="hero-shell">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{homePageContent.heroEyebrow}</p>
            <ValueRotator
              label={homePageContent.valueRotatorLabel}
              prefix={homePageContent.valueRotatorPrefix}
              values={homePageContent.valueRotatorWords}
            />
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
            <div className="hero-portrait-frame">
              <Image
                src="/images/kinsley.webp"
                alt="Kinsley Law Advocates team"
                width={720}
                height={780}
                className="hero-portrait"
                priority
              />
              <div className="portrait-caption card-surface">
                <span className="eyebrow">{homePageContent.portraitEyebrow}</span>
                <p>{homePageContent.portraitText}</p>
              </div>
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
            <h2 className="section-title">{homePageContent.legacySectionTitle}</h2>
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
              <h2 className="section-title">{homePageContent.servicesTitle}</h2>
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
                <ul>
                  {area.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{homePageContent.teamEyebrow}</p>
              <h2 className="section-title">{homePageContent.teamTitle}</h2>
            </div>
            <Link href="/about" className="text-link">
              Meet the firm
            </Link>
          </div>

          <div className="attorney-grid">
            {featuredAttorneys.map((attorney, index) => (
              <article key={attorney.email} className="attorney-card">
                <div className="attorney-card-image">
                  <Image
                    src="/images/kinsley.webp"
                    alt={attorney.name}
                    width={480}
                    height={360}
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
              <h2 className="section-title light">{homePageContent.testimonialsTitle}</h2>
            </div>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
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
            <h2 className="section-title">{homePageContent.ctaTitle}</h2>
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

import type { Metadata } from "next";
import Link from "next/link";
import { AttorneyAvatar } from "@/components/brand/attorney-avatar";
import { BrandPoster } from "@/components/brand/brand-poster";
import { ValueRotator } from "@/components/home/value-rotator";
import {
  getAttorneysForPage,
  getHomePageContent,
  getPracticeAreasForPage,
  getTestimonialsForPage,
} from "@/lib/server-data";

function splitRotatorPrefix(prefix: string) {
  const trimmed = prefix.trim();

  if (!trimmed) {
    return { primaryText: "Strategic counsel", staticText: "with" };
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return { primaryText: parts[0], staticText: "with" };
  }

  return {
    primaryText: parts.slice(0, -1).join(" "),
    staticText: parts[parts.length - 1],
  };
}

export const metadata: Metadata = {
  title: "Strategic Counsel for High-Stakes Matters",
  description:
    "Kinsley Advocates delivers strategic, senior-led legal counsel for private clients, businesses, property matters, disputes, and mineral-sector work in Nairobi.",
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
    practiceAreas.find((area) => {
      const normalizedName = area.name.toLowerCase();
      return normalizedName.includes("gold") || normalizedName.includes("mineral");
    }) ?? null;
  const { primaryText, staticText } = splitRotatorPrefix(homePageContent.valueRotatorPrefix);

  return (
    <>
      <section className="hero-shell">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{homePageContent.heroEyebrow}</p>
            <ValueRotator
              label={homePageContent.valueRotatorLabel}
              primaryText={primaryText}
              staticText={staticText}
              values={homePageContent.valueRotatorWords}
            />
            <p className="hero-kicker">Strategic legal counsel for matters that need calm control.</p>
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
                <BrandPoster priority className="hero-poster" />
                <div className="hero-visual-copy">
                  <span className="eyebrow light">{homePageContent.portraitEyebrow}</span>
                  <h2>Senior-led legal strategy with precision, restraint, and follow-through.</h2>
                  <p>{homePageContent.portraitText}</p>
                </div>
              </div>
              <article className="hero-floating-card hero-floating-card-primary">
                <span className="hero-floating-label">Main office</span>
                <strong>Global Trading Center (GTC), Westlands, 9th Floor, Suite D36</strong>
                <p>P.O. Box 18627-00100, Nairobi.</p>
              </article>
              <article className="hero-floating-card hero-contact-card secondary">
                <span className="hero-floating-label">Direct contact</span>
                <div className="hero-contact-list">
                  <div>
                    <span>Direct line</span>
                    <strong>+254 704 561 831</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>kinsleyadvocates@gmail.com</strong>
                  </div>
                  <div>
                    <span>Client experience</span>
                    <strong>Structured updates, discreet handling, and clear next steps</strong>
                  </div>
                </div>
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
            <BrandPoster className="legacy-poster" />
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
              <h2 className="section-title light">{homePageContent.testimonialsTitle}</h2>
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

import type { Metadata } from "next";
import Link from "next/link";
import { AttorneyAvatar } from "@/components/brand/attorney-avatar";
import { LogoMark } from "@/components/brand/logo-mark";
import {
  getAttorneysForPage,
  getHomePageContent,
  getPracticeAreasForPage,
  getTestimonialsForPage,
} from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Strategic Attorneys for High-Stakes Matters",
  description:
    "Kinsley Advocates delivers strategic legal services led by experienced attorneys for private clients, businesses, property matters, disputes, and mineral-sector work in Nairobi.",
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
  const featuredPractices = practiceAreas.slice(0, 4);
  const mineralsPractice =
    practiceAreas.find((area) => {
      const normalizedName = area.name.toLowerCase();
      return normalizedName.includes("gold") || normalizedName.includes("mineral");
    }) ?? null;
  const legacyMetrics = homePageContent.legacyMetrics.map((metric) => ({
    ...metric,
    value: metric.value.trim().toLowerCase() === "masters" ? "Advanced study" : metric.value,
  }));
  const balancedLegacyMetrics =
    legacyMetrics.length % 2 === 0
      ? legacyMetrics
      : [
          ...legacyMetrics,
          {
            value: "5",
            text: "Regional touchpoints across Kenya, Rwanda, DRC, South Sudan, and South Africa.",
          },
        ];
  const normalizedLegacyMetrics = balancedLegacyMetrics.map((metric) => {
    const normalizedValue = metric.value.trim().toLowerCase();

    if (normalizedValue === "2010") {
      return {
        label: "Founded",
        value: "2010",
        text: metric.text,
      };
    }

    if (normalizedValue === "4") {
      return {
        label: "Lead advocates",
        value: "4",
        text: metric.text,
      };
    }

    if (normalizedValue === "6") {
      return {
        label: "Practice groups",
        value: "6",
        text: metric.text,
      };
    }

    if (normalizedValue === "1") {
      return {
        label: "Client journey",
        value: "One path",
        text: metric.text,
      };
    }

    if (normalizedValue === "advanced study") {
      return {
        label: "Advanced study",
        value: "Postgraduate depth",
        text: metric.text,
      };
    }

    if (normalizedValue === "5") {
      return {
        label: "Regional reach",
        value: "5 markets",
        text: metric.text,
      };
    }

    return {
      label: "Firm profile",
      value: metric.value,
      text: metric.text,
    };
  });

  return (
    <>
      <section className="hero-shell">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{homePageContent.heroEyebrow}</p>
            <div className="hero-billboard">
              <h1 className="hero-billboard-title">
                <span>Better Call</span>
                <span className="hero-billboard-accent">Kinsley Advocates</span>
              </h1>
              <p className="hero-billboard-tagline">
                <span>Bring Dignity &amp; Honor</span>
                <span>To Your Legal Battles</span>
              </p>
            </div>
            <p className="hero-description hero-description-tight">
              Senior-led legal representation for disputes, consultations, transactions, and
              mineral-sector matters that require calm control and clear next steps.
            </p>
            <div className="hero-actions">
              <Link href="/contact#consultation" className="button-primary">
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
                <div className="hero-brand-tile">
                  <LogoMark
                    size="sm"
                    priority
                    variant="monogram"
                    treatment="embossed"
                    className="hero-logo hero-logo-monogram"
                  />
                  <span className="hero-brand-caption">Kinsley Advocates</span>
                </div>
                <div className="hero-visual-copy">
                  <span className="hero-panel-kicker">{homePageContent.portraitEyebrow}</span>
                  <h2>Senior-led strategy, measured communication, and clear follow-through.</h2>
                  <p>{homePageContent.portraitText}</p>
                </div>
              </div>
              <article className="hero-details-panel">
                <div className="hero-details-copy">
                  <span className="hero-floating-label">Nairobi office</span>
                  <strong>Global Trading Center (GTC), Westlands, 9th Floor, Suite D36</strong>
                  <p>P.O. Box 18627-00100, Nairobi.</p>
                </div>
                <div className="hero-details-grid">
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
          {homePageContent.highlights.map((item, index) => (
            <article
              key={item.label}
              className={`stat-card${index === 0 ? " stat-card-featured" : ""}`}
            >
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
            <div className="legacy-card-intro">
              <span className="legacy-card-kicker">Firm profile</span>
              <h3>Clear proof points that support the way the firm operates.</h3>
            </div>
            <div className="legacy-grid">
              {normalizedLegacyMetrics.map((metric) => (
                <article key={`${metric.label}-${metric.value}-${metric.text}`} className="legacy-metric-card">
                  <span className="legacy-metric-label">{metric.label}</span>
                  <span className="metric">{metric.value}</span>
                  <p>{metric.text}</p>
                </article>
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
              <p className="section-lead section-lead-compact">
                A tighter overview of the matters we handle most often, with every instruction
                reviewed and routed by the firm.
              </p>
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

      <section className="site-section section-tint testimonials-section-light">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{homePageContent.testimonialsEyebrow}</p>
              <h2 className="section-title">{homePageContent.testimonialsTitle}</h2>
              <p className="section-lead section-lead-compact">
                Client trust is earned through composure, clarity, and follow-through that holds
                when matters become sensitive.
              </p>
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
            <Link href="/contact#consultation" className="button-primary">
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

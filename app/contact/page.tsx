import type { Metadata } from "next";
import { BrandPoster } from "@/components/brand/brand-poster";
import { AppointmentForm } from "@/components/contact/appointment-form";
import { ContactForm } from "@/components/contact/contact-form";
import {
  FIRM_WEBSITE_LABEL,
  FIRM_WEBSITE_URL,
} from "@/lib/firm-contact";
import { getOfficeDetails, getPracticeAreasForPage } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Kinsley Advocates to discuss your legal matter or request a consultation with the firm.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [officeDetails, practiceAreas] = await Promise.all([
    getOfficeDetails(),
    getPracticeAreasForPage(),
  ]);

  const practiceAreaNames = practiceAreas.map((area) => area.name);

  return (
    <>
      <section className="page-hero page-hero-premium">
        <div className="site-container page-hero-grid compact">
          <div>
            <p className="eyebrow">Contact us</p>
            <h1 className="page-title">Start the conversation with a team that handles sensitive matters with dignity.</h1>
            <p className="page-intro">
              Whether you need immediate legal guidance, a second opinion, or a structured
              consultation, send us your details and the firm will review and route the matter
              with a clear next step.
            </p>
            <div className="contact-intro-pills">
              <span>General enquiries handled centrally</span>
              <span>Consultations reviewed before confirmation</span>
              <span>Response standard within one business day</span>
            </div>
          </div>

          <div className="contact-hero-card card-surface">
            <div className="contact-hero-top">
              <BrandPoster treatment="embossed" className="contact-poster" />
              <div className="contact-hero-status">
                <div>
                  <span className="office-label">Response standard</span>
                  <strong>Within one business day</strong>
                </div>
                <div>
                  <span className="office-label">Matter routing</span>
                  <strong>Reviewed and routed through the firm</strong>
                </div>
              </div>
            </div>
            <h2>Office details</h2>
            <div className="office-stack office-stack-grid">
              <div className="office-card office-card-address">
                <span className="office-label">Address</span>
                <strong>{officeDetails.addressLine1}</strong>
                <strong>{officeDetails.addressLine2}</strong>
                <strong>{officeDetails.city}</strong>
              </div>
              <div className="office-card">
                <span className="office-label">Phone</span>
                <a href={`tel:${officeDetails.phone.replace(/\s+/g, "")}`} className="office-link">
                  {officeDetails.phone}
                </a>
              </div>
              <div className="office-card">
                <span className="office-label">Email</span>
                <a href={`mailto:${officeDetails.email}`} className="office-link">
                  {officeDetails.email}
                </a>
              </div>
              <div className="office-card">
                <span className="office-label">Website</span>
                <a href={FIRM_WEBSITE_URL} target="_blank" rel="noreferrer" className="office-link">
                  {FIRM_WEBSITE_LABEL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container contact-grid">
          <div className="contact-column">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Send a message</p>
                <h2 className="section-title">General enquiries and legal intake</h2>
                <p className="section-lead section-lead-compact">
                  Best for new matters, quick questions, or when you want the firm to review the
                  issue first and route it internally.
                </p>
              </div>
            </div>
            <ContactForm practiceAreas={practiceAreaNames} />
          </div>

          <div className="contact-column consultation-target" id="consultation">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Request a consultation</p>
                <h2 className="section-title">Book a preferred date and let the firm route it correctly.</h2>
                <p className="section-lead section-lead-compact">
                  Best for matters where you already know you need a timed consultation and want
                  to propose a preferred appointment window.
                </p>
              </div>
            </div>
            <AppointmentForm practiceAreas={practiceAreaNames} />
          </div>
        </div>
      </section>
    </>
  );
}

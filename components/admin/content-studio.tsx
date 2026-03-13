"use client";

import { useActionState } from "react";
import {
  deleteTestimonialAction,
  savePracticeAreaAction,
  saveTestimonialAction,
  updateHomePageContentAction,
  updateOfficeDetailsAction,
} from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin-editor-state";
import type {
  PageAttorney,
  PagePracticeArea,
  PageTestimonial,
} from "@/lib/server-data";
import type {
  HomePageContent,
  OfficeDetails,
} from "@/lib/site-defaults";

type ContentStudioProps = {
  homePageContent: HomePageContent;
  officeDetails: OfficeDetails;
  practiceAreas: PagePracticeArea[];
  testimonials: PageTestimonial[];
  attorneys: PageAttorney[];
};

type PracticeAreaEditorCardProps = {
  area?: PagePracticeArea;
  attorneys: PageAttorney[];
};

type TestimonialEditorCardProps = {
  testimonial?: PageTestimonial;
  sortOrder: number;
};

function FormMessage({ state }: { state: AdminActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div className={state.status === "success" ? "form-status" : "form-error"}>
      {state.message}
    </div>
  );
}

function FormSubmitButton({
  idleLabel,
  pendingLabel,
  isPending,
  className = "button-primary",
}: {
  idleLabel: string;
  pendingLabel: string;
  isPending: boolean;
  className?: string;
}) {
  return (
    <button type="submit" className={className} disabled={isPending}>
      {isPending ? pendingLabel : idleLabel}
    </button>
  );
}

function OfficeDetailsEditor({ officeDetails }: { officeDetails: OfficeDetails }) {
  const [state, formAction, isPending] = useActionState(
    updateOfficeDetailsAction,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="admin-editor-card">
      <div className="admin-editor-heading">
        <div>
          <p className="eyebrow">Office details</p>
          <h3>Update contact information</h3>
        </div>
      </div>
      <FormMessage state={state} />
      <div className="admin-editor-fields">
        <div className="field">
          <label htmlFor="office-address-line-1">Address line 1</label>
          <input id="office-address-line-1" name="addressLine1" defaultValue={officeDetails.addressLine1} required />
        </div>
        <div className="field">
          <label htmlFor="office-address-line-2">Address line 2</label>
          <input id="office-address-line-2" name="addressLine2" defaultValue={officeDetails.addressLine2} required />
        </div>
        <div className="field">
          <label htmlFor="office-city">City</label>
          <input id="office-city" name="city" defaultValue={officeDetails.city} required />
        </div>
        <div className="field">
          <label htmlFor="office-phone">Phone</label>
          <input id="office-phone" name="phone" defaultValue={officeDetails.phone} required />
        </div>
        <div className="field full">
          <label htmlFor="office-email">Email</label>
          <input id="office-email" type="email" name="email" defaultValue={officeDetails.email} required />
        </div>
        <div className="field full">
          <label htmlFor="office-hours-weekday">Weekday hours</label>
          <input id="office-hours-weekday" name="hoursWeekday" defaultValue={officeDetails.hoursWeekday} required />
        </div>
        <div className="field full">
          <label htmlFor="office-hours-weekend">Weekend hours</label>
          <input id="office-hours-weekend" name="hoursWeekend" defaultValue={officeDetails.hoursWeekend} required />
        </div>
      </div>
      <div className="button-row">
        <FormSubmitButton idleLabel="Save Office Details" pendingLabel="Saving..." isPending={isPending} />
      </div>
    </form>
  );
}

function HomePageContentEditor({
  homePageContent,
}: {
  homePageContent: HomePageContent;
}) {
  const [state, formAction, isPending] = useActionState(
    updateHomePageContentAction,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="admin-editor-card admin-editor-card-wide">
      <div className="admin-editor-heading">
        <div>
          <p className="eyebrow">Homepage content</p>
          <h3>Edit the core public-facing copy</h3>
        </div>
      </div>
      <p className="admin-editor-note">
        Multi-line fields use one line per item. Saving here updates the hero,
        metric rail, credibility band, legacy section, and CTA on the homepage.
      </p>
      <FormMessage state={state} />

      <div className="admin-editor-stack">
        <section className="admin-editor-subsection">
          <div className="admin-editor-subheading">
            <h4>Hero</h4>
          </div>
          <div className="admin-editor-fields">
            <div className="field full">
              <label htmlFor="home-hero-eyebrow">Hero eyebrow</label>
              <input id="home-hero-eyebrow" name="heroEyebrow" defaultValue={homePageContent.heroEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="home-hero-description">Hero description</label>
              <textarea id="home-hero-description" name="heroDescription" rows={4} defaultValue={homePageContent.heroDescription} required />
            </div>
            <div className="field">
              <label htmlFor="home-portrait-eyebrow">Brand panel eyebrow</label>
              <input id="home-portrait-eyebrow" name="portraitEyebrow" defaultValue={homePageContent.portraitEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="home-portrait-text">Brand panel copy</label>
              <textarea id="home-portrait-text" name="portraitText" rows={3} defaultValue={homePageContent.portraitText} required />
            </div>
            <div className="field">
              <label htmlFor="home-rotator-label">Value rotator label</label>
              <input id="home-rotator-label" name="valueRotatorLabel" defaultValue={homePageContent.valueRotatorLabel} required />
            </div>
            <div className="field">
              <label htmlFor="home-rotator-prefix">Value rotator prefix</label>
              <input id="home-rotator-prefix" name="valueRotatorPrefix" defaultValue={homePageContent.valueRotatorPrefix} required />
            </div>
            <div className="field full">
              <label htmlFor="home-rotator-words">Value rotator words</label>
              <textarea id="home-rotator-words" name="valueRotatorWords" rows={4} defaultValue={homePageContent.valueRotatorWords.join("\n")} required />
            </div>
          </div>
        </section>

        <section className="admin-editor-subsection">
          <div className="admin-editor-subheading">
            <h4>Stats and credibility</h4>
          </div>
          <div className="admin-pair-grid">
            {homePageContent.highlights.map((highlight, index) => (
              <div key={`highlight-${index}`} className="admin-inline-card">
                <strong>Homepage stat {index + 1}</strong>
                <div className="field">
                  <label htmlFor={`highlight-value-${index}`}>Value</label>
                  <input id={`highlight-value-${index}`} name={`highlight-value-${index}`} defaultValue={highlight.value} required />
                </div>
                <div className="field">
                  <label htmlFor={`highlight-label-${index}`}>Label</label>
                  <input id={`highlight-label-${index}`} name={`highlight-label-${index}`} defaultValue={highlight.label} required />
                </div>
              </div>
            ))}
          </div>

          <div className="admin-pair-grid">
            {homePageContent.credibilityBand.map((item, index) => (
              <div key={`credibility-${index}`} className="admin-inline-card">
                <strong>Credibility item {index + 1}</strong>
                <div className="field">
                  <label htmlFor={`credibility-label-${index}`}>Label</label>
                  <input id={`credibility-label-${index}`} name={`credibility-label-${index}`} defaultValue={item.label} required />
                </div>
                <div className="field">
                  <label htmlFor={`credibility-value-${index}`}>Value</label>
                  <input id={`credibility-value-${index}`} name={`credibility-value-${index}`} defaultValue={item.value} required />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-editor-subsection">
          <div className="admin-editor-subheading">
            <h4>Legacy and CTA copy</h4>
          </div>
          <div className="admin-editor-fields">
            <div className="field">
              <label htmlFor="legacy-section-eyebrow">Legacy eyebrow</label>
              <input id="legacy-section-eyebrow" name="legacySectionEyebrow" defaultValue={homePageContent.legacySectionEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="legacy-section-title">Legacy title</label>
              <input id="legacy-section-title" name="legacySectionTitle" defaultValue={homePageContent.legacySectionTitle} required />
            </div>
            <div className="field full">
              <label htmlFor="legacy-paragraphs">Legacy paragraphs</label>
              <textarea id="legacy-paragraphs" name="legacyParagraphs" rows={6} defaultValue={homePageContent.legacyParagraphs.join("\n")} required />
            </div>
            <div className="field full">
              <label htmlFor="legacy-achievements">Achievements</label>
              <textarea id="legacy-achievements" name="achievements" rows={4} defaultValue={homePageContent.achievements.join("\n")} required />
            </div>
          </div>

          <div className="admin-pair-grid">
            {homePageContent.legacyMetrics.map((metric, index) => (
              <div key={`metric-${index}`} className="admin-inline-card">
                <strong>Legacy metric {index + 1}</strong>
                <div className="field">
                  <label htmlFor={`metric-value-${index}`}>Value</label>
                  <input id={`metric-value-${index}`} name={`metric-value-${index}`} defaultValue={metric.value} required />
                </div>
                <div className="field">
                  <label htmlFor={`metric-text-${index}`}>Supporting text</label>
                  <textarea id={`metric-text-${index}`} name={`metric-text-${index}`} rows={3} defaultValue={metric.text} required />
                </div>
              </div>
            ))}
          </div>

          <div className="admin-editor-fields">
            <div className="field">
              <label htmlFor="services-eyebrow">Services eyebrow</label>
              <input id="services-eyebrow" name="servicesEyebrow" defaultValue={homePageContent.servicesEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="services-title">Services title</label>
              <input id="services-title" name="servicesTitle" defaultValue={homePageContent.servicesTitle} required />
            </div>
            <div className="field">
              <label htmlFor="team-eyebrow">Team eyebrow</label>
              <input id="team-eyebrow" name="teamEyebrow" defaultValue={homePageContent.teamEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="team-title">Team title</label>
              <input id="team-title" name="teamTitle" defaultValue={homePageContent.teamTitle} required />
            </div>
            <div className="field">
              <label htmlFor="testimonials-eyebrow">Testimonials eyebrow</label>
              <input id="testimonials-eyebrow" name="testimonialsEyebrow" defaultValue={homePageContent.testimonialsEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="testimonials-title">Testimonials title</label>
              <input id="testimonials-title" name="testimonialsTitle" defaultValue={homePageContent.testimonialsTitle} required />
            </div>
            <div className="field">
              <label htmlFor="cta-eyebrow">CTA eyebrow</label>
              <input id="cta-eyebrow" name="ctaEyebrow" defaultValue={homePageContent.ctaEyebrow} required />
            </div>
            <div className="field full">
              <label htmlFor="cta-title">CTA title</label>
              <textarea id="cta-title" name="ctaTitle" rows={3} defaultValue={homePageContent.ctaTitle} required />
            </div>
          </div>
        </section>
      </div>

      <div className="button-row">
        <FormSubmitButton idleLabel="Save Homepage Content" pendingLabel="Saving..." isPending={isPending} />
      </div>
    </form>
  );
}

function PracticeAreaEditorCard({
  area,
  attorneys,
}: PracticeAreaEditorCardProps) {
  const [state, formAction, isPending] = useActionState(
    savePracticeAreaAction,
    initialAdminActionState,
  );

  const heading = area ? area.name : "Add practice area";
  const orderedAttorneys = attorneys.filter((attorney) => typeof attorney.id === "number");

  return (
    <form action={formAction} className="admin-editor-card">
      <input type="hidden" name="id" value={area?.id ?? ""} />
      <div className="admin-editor-heading">
        <div>
          <p className="eyebrow">{area ? "Practice area" : "New practice area"}</p>
          <h3>{heading}</h3>
        </div>
      </div>
      <FormMessage state={state} />
      <div className="admin-editor-fields">
        <div className="field full">
          <label htmlFor={`practice-name-${area?.id ?? "new"}`}>Name</label>
          <input
            id={`practice-name-${area?.id ?? "new"}`}
            name="name"
            defaultValue={area?.name ?? ""}
            placeholder="Employment Law"
            required
          />
        </div>
        <div className="field full">
          <label htmlFor={`practice-description-${area?.id ?? "new"}`}>Description</label>
          <textarea
            id={`practice-description-${area?.id ?? "new"}`}
            name="description"
            rows={4}
            defaultValue={area?.description ?? ""}
            required
          />
        </div>
        <div className="field full">
          <label htmlFor={`practice-attorney-${area?.id ?? "new"}`}>Lead attorney</label>
          <select
            id={`practice-attorney-${area?.id ?? "new"}`}
            name="attorneyId"
            defaultValue={area?.attorney?.id ?? ""}
          >
            <option value="">Unassigned</option>
            {orderedAttorneys.map((attorney) => (
              <option key={attorney.id} value={attorney.id}>
                {attorney.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor={`practice-highlights-${area?.id ?? "new"}`}>Highlights</label>
          <textarea
            id={`practice-highlights-${area?.id ?? "new"}`}
            name="highlights"
            rows={6}
            defaultValue={area?.highlights.join("\n") ?? ""}
            placeholder="One service highlight per line"
            required
          />
        </div>
      </div>
      <div className="button-row">
        <FormSubmitButton idleLabel={area ? "Save Practice Area" : "Create Practice Area"} pendingLabel="Saving..." isPending={isPending} />
      </div>
    </form>
  );
}

function TestimonialEditorCard({
  testimonial,
  sortOrder,
}: TestimonialEditorCardProps) {
  const [saveState, saveAction, isSaving] = useActionState(
    saveTestimonialAction,
    initialAdminActionState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteTestimonialAction,
    initialAdminActionState,
  );

  return (
    <article className="admin-editor-card">
      <form action={saveAction} className="admin-editor-stack">
        <input type="hidden" name="id" value={testimonial?.id ?? ""} />
        <input type="hidden" name="sortOrder" value={testimonial ? sortOrder : ""} />
        <div className="admin-editor-heading">
          <div>
            <p className="eyebrow">{testimonial ? "Testimonial" : "New testimonial"}</p>
            <h3>{testimonial?.name ?? "Add testimonial"}</h3>
          </div>
        </div>
        <FormMessage state={saveState} />
        <div className="admin-editor-fields">
          <div className="field">
            <label htmlFor={`testimonial-name-${testimonial?.id ?? "new"}`}>Client name</label>
            <input
              id={`testimonial-name-${testimonial?.id ?? "new"}`}
              name="name"
              defaultValue={testimonial?.name ?? ""}
              required
            />
          </div>
          <div className="field">
            <label htmlFor={`testimonial-title-${testimonial?.id ?? "new"}`}>Client title</label>
            <input
              id={`testimonial-title-${testimonial?.id ?? "new"}`}
              name="title"
              defaultValue={testimonial?.title ?? ""}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor={`testimonial-quote-${testimonial?.id ?? "new"}`}>Quote</label>
            <textarea
              id={`testimonial-quote-${testimonial?.id ?? "new"}`}
              name="quote"
              rows={4}
              defaultValue={testimonial?.quote ?? ""}
              required
            />
          </div>
        </div>
        <div className="button-row">
          <FormSubmitButton idleLabel={testimonial ? "Save Testimonial" : "Add Testimonial"} pendingLabel="Saving..." isPending={isSaving} />
        </div>
      </form>

      {testimonial?.id ? (
        <form action={deleteAction} className="admin-editor-delete-row">
          <input type="hidden" name="id" value={testimonial.id} />
          <FormMessage state={deleteState} />
          <FormSubmitButton
            idleLabel="Delete Testimonial"
            pendingLabel="Deleting..."
            isPending={isDeleting}
            className="button-secondary"
          />
        </form>
      ) : null}
    </article>
  );
}

export function ContentStudio({
  homePageContent,
  officeDetails,
  practiceAreas,
  testimonials,
  attorneys,
}: ContentStudioProps) {
  return (
    <section className="admin-panel admin-content-studio">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">Content studio</p>
          <h2>Edit the site without touching code</h2>
        </div>
      </div>

      <div className="admin-editor-grid">
        <OfficeDetailsEditor officeDetails={officeDetails} />
        <HomePageContentEditor homePageContent={homePageContent} />
      </div>

      <div className="admin-editor-section">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Practice areas</p>
            <h2>Manage services and attorney assignments</h2>
          </div>
        </div>
        <div className="admin-editor-grid">
          {practiceAreas.map((practiceArea) => (
            <PracticeAreaEditorCard
              key={practiceArea.id ?? practiceArea.name}
              area={practiceArea}
              attorneys={attorneys}
            />
          ))}
          <PracticeAreaEditorCard attorneys={attorneys} />
        </div>
      </div>

      <div className="admin-editor-section">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Testimonials</p>
            <h2>Manage homepage social proof</h2>
          </div>
        </div>
        <div className="admin-editor-grid">
          {testimonials.map((testimonial, index) => (
            <TestimonialEditorCard
              key={testimonial.id ?? `${testimonial.name}-${testimonial.title}`}
              testimonial={testimonial}
              sortOrder={index}
            />
          ))}
          <TestimonialEditorCard sortOrder={testimonials.length} />
        </div>
      </div>
    </section>
  );
}

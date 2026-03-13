"use client";

import { useState } from "react";
import { AdminSessionButton } from "@/components/admin/admin-session-button";
import {
  ContentStudioAttorneysSection,
  ContentStudioCoreSection,
  ContentStudioPracticeAreasSection,
  ContentStudioTestimonialsSection,
} from "@/components/admin/content-studio";
import { IntakeWorkspace } from "@/components/admin/intake-workspace";
import { isOpenWorkflowStatus } from "@/lib/intake-workflow";
import type { AdminDashboardData } from "@/lib/server-data";

type AdminWorkspaceProps = {
  dashboard: AdminDashboardData;
  systemHealth: Array<{
    label: string;
    value: string;
  }>;
};

type AdminTab =
  | "overview"
  | "inbox"
  | "content"
  | "attorneys"
  | "practice-areas"
  | "testimonials";

const adminTabs: Array<{
  id: AdminTab;
  label: string;
  description: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Readiness, counts, and migration health.",
  },
  {
    id: "inbox",
    label: "Inbox",
    description: "Messages and consultation workflow.",
  },
  {
    id: "content",
    label: "Content",
    description: "Homepage and office details.",
  },
  {
    id: "attorneys",
    label: "Attorneys",
    description: "Profiles, order, and photos.",
  },
  {
    id: "practice-areas",
    label: "Practice Areas",
    description: "Services, leads, and highlights.",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    description: "Social proof and trust signals.",
  },
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatSettingLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatSettingValue(value: unknown) {
  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return `${Object.keys(value).length} fields`;
  }

  return "Not set";
}

function getSettingEntries(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [
      {
        label: "Value",
        value: formatSettingValue(value),
      },
    ];
  }

  return Object.entries(value).map(([key, entryValue]) => ({
    label: formatSettingLabel(key),
    value: formatSettingValue(entryValue),
  }));
}

export function AdminWorkspace({
  dashboard,
  systemHealth,
}: AdminWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const openContacts = dashboard.contacts.filter((contact) =>
    isOpenWorkflowStatus(contact.status),
  ).length;
  const openAppointments = dashboard.appointments.filter((appointment) =>
    isOpenWorkflowStatus(appointment.status),
  ).length;

  return (
    <>
      <section className="page-hero">
        <div className="site-container admin-hero">
          <div>
            <p className="eyebrow">Internal dashboard</p>
            <h1 className="page-title admin-title">
              Manage intake, content, and migration work with less noise.
            </h1>
            <p className="page-intro">
              The dashboard is now split into focused work areas so intake
              operations and site editing are easier to manage without scrolling
              through one long mixed surface.
            </p>
            <div className="admin-status-row">
              {systemHealth.map((item) => (
                <div key={item.label} className="admin-status-pill">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-hero-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setActiveTab("inbox")}
            >
              Open Inbox
            </button>
            <AdminSessionButton />
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container admin-shell">
          {!dashboard.databaseConfigured ? (
            <div className="form-error">
              Database access is currently unavailable. The dashboard is showing
              fallback content only.
            </div>
          ) : null}

          <div className="admin-stat-grid">
            <button
              type="button"
              className="admin-stat-card admin-stat-button"
              onClick={() => setActiveTab("attorneys")}
            >
              <span>Attorneys</span>
              <strong>{dashboard.counts.attorneys}</strong>
            </button>
            <button
              type="button"
              className="admin-stat-card admin-stat-button"
              onClick={() => setActiveTab("practice-areas")}
            >
              <span>Practice areas</span>
              <strong>{dashboard.counts.practiceAreas}</strong>
            </button>
            <button
              type="button"
              className="admin-stat-card admin-stat-button"
              onClick={() => setActiveTab("inbox")}
            >
              <span>Open messages</span>
              <strong>{openContacts}</strong>
            </button>
            <button
              type="button"
              className="admin-stat-card admin-stat-button"
              onClick={() => setActiveTab("inbox")}
            >
              <span>Open consultations</span>
              <strong>{openAppointments}</strong>
            </button>
            <button
              type="button"
              className="admin-stat-card admin-stat-button"
              onClick={() => setActiveTab("testimonials")}
            >
              <span>Testimonials</span>
              <strong>{dashboard.counts.testimonials}</strong>
            </button>
          </div>

          <nav
            className="admin-tab-bar"
            aria-label="Admin sections"
            role="tablist"
          >
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                type="button"
                className="admin-tab-button"
                role="tab"
                data-active={activeTab === tab.id}
                aria-selected={activeTab === tab.id}
                aria-controls={`admin-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <strong>{tab.label}</strong>
                <span>{tab.description}</span>
              </button>
            ))}
          </nav>

          {activeTab === "overview" ? (
            <section
              className="admin-workspace-pane"
              id="admin-panel-overview"
              role="tabpanel"
              aria-labelledby="admin-tab-overview"
            >
              <div className="admin-grid">
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <p className="eyebrow">Open work</p>
                      <h2>Inbox priorities</h2>
                    </div>
                  </div>
                  <div className="admin-mini-stat-grid">
                    <article className="admin-mini-stat">
                      <span>Message backlog</span>
                      <strong>{openContacts}</strong>
                    </article>
                    <article className="admin-mini-stat">
                      <span>Consultation backlog</span>
                      <strong>{openAppointments}</strong>
                    </article>
                    <article className="admin-mini-stat">
                      <span>Total submissions</span>
                      <strong>
                        {dashboard.counts.contacts + dashboard.counts.appointments}
                      </strong>
                    </article>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => setActiveTab("inbox")}
                    >
                      Manage Inbox
                    </button>
                  </div>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <p className="eyebrow">Content operations</p>
                      <h2>Publishing controls</h2>
                    </div>
                  </div>
                  <div className="admin-mini-stat-grid">
                    <article className="admin-mini-stat">
                      <span>Homepage content</span>
                      <strong>Live</strong>
                    </article>
                    <article className="admin-mini-stat">
                      <span>Attorney profiles</span>
                      <strong>{dashboard.counts.attorneys}</strong>
                    </article>
                    <article className="admin-mini-stat">
                      <span>Practice areas</span>
                      <strong>{dashboard.counts.practiceAreas}</strong>
                    </article>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => setActiveTab("content")}
                    >
                      Open Content Studio
                    </button>
                  </div>
                </section>
              </div>

              <div className="admin-grid admin-grid-secondary">
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <p className="eyebrow">Recent messages</p>
                      <h2>Latest intake activity</h2>
                    </div>
                  </div>
                  <div className="admin-list-grid compact">
                    {dashboard.contacts.slice(0, 4).map((contact) => (
                      <article key={contact.id} className="admin-list-card">
                        <strong>{contact.name}</strong>
                        <span>
                          {contact.service} · {formatDate(contact.createdAt)}
                        </span>
                        <p>{contact.message}</p>
                      </article>
                    ))}
                    {dashboard.contacts.length === 0 ? (
                      <p className="admin-empty">No message submissions yet.</p>
                    ) : null}
                  </div>

                  <div className="admin-list-grid compact">
                    {dashboard.appointments.slice(0, 4).map((appointment) => (
                      <article key={appointment.id} className="admin-list-card">
                        <strong>{appointment.name}</strong>
                        <span>
                          {appointment.practiceArea} ·{" "}
                          {formatDate(appointment.createdAt)}
                        </span>
                        <p>{appointment.description}</p>
                      </article>
                    ))}
                    {dashboard.appointments.length === 0 ? (
                      <p className="admin-empty">No consultation requests yet.</p>
                    ) : null}
                  </div>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <p className="eyebrow">Signals</p>
                      <h2>System, settings, and migration checks</h2>
                    </div>
                  </div>

                  <div className="admin-list-grid compact">
                    {systemHealth.map((item) => (
                      <article key={item.label} className="admin-list-card">
                        <strong>{item.label}</strong>
                        <span>{item.value}</span>
                      </article>
                    ))}
                  </div>

                  <div className="admin-settings-stack">
                    {dashboard.settings.map((setting) => (
                      <article key={setting.key} className="admin-setting-card">
                        <div className="admin-setting-header">
                          <div>
                            <strong>{formatSettingLabel(setting.key)}</strong>
                            <span>Updated from PostgreSQL content settings</span>
                          </div>
                          <span>{formatDate(setting.updatedAt)}</span>
                        </div>
                        <div className="admin-setting-grid">
                          {getSettingEntries(setting.value).map((entry) => (
                            <div
                              key={`${setting.key}-${entry.label}`}
                              className="admin-setting-item"
                            >
                              <span>{entry.label}</span>
                              <strong>{entry.value}</strong>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          ) : null}

          {activeTab === "inbox" ? (
            <div
              id="admin-panel-inbox"
              role="tabpanel"
              aria-labelledby="admin-tab-inbox"
            >
              <IntakeWorkspace
                contacts={dashboard.contacts}
                appointments={dashboard.appointments}
              />
            </div>
          ) : null}

          {activeTab === "content" ? (
            <section
              className="admin-panel admin-content-studio"
              id="admin-panel-content"
              role="tabpanel"
              aria-labelledby="admin-tab-content"
            >
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Content studio</p>
                  <h2>Edit the site without touching code</h2>
                </div>
              </div>
              <ContentStudioCoreSection
                homePageContent={dashboard.homePageContent}
                officeDetails={dashboard.officeDetails}
              />
            </section>
          ) : null}

          {activeTab === "attorneys" ? (
            <section
              className="admin-panel admin-content-studio"
              id="admin-panel-attorneys"
              role="tabpanel"
              aria-labelledby="admin-tab-attorneys"
            >
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Attorneys</p>
                  <h2>Manage profiles, display order, and photos</h2>
                </div>
              </div>
              <ContentStudioAttorneysSection attorneys={dashboard.attorneys} />
            </section>
          ) : null}

          {activeTab === "practice-areas" ? (
            <section
              className="admin-panel admin-content-studio"
              id="admin-panel-practice-areas"
              role="tabpanel"
              aria-labelledby="admin-tab-practice-areas"
            >
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Practice areas</p>
                  <h2>Manage services, highlights, and lead assignments</h2>
                </div>
              </div>
              <ContentStudioPracticeAreasSection
                practiceAreas={dashboard.practiceAreas}
                attorneys={dashboard.attorneys}
              />
            </section>
          ) : null}

          {activeTab === "testimonials" ? (
            <section
              className="admin-panel admin-content-studio"
              id="admin-panel-testimonials"
              role="tabpanel"
              aria-labelledby="admin-tab-testimonials"
            >
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Testimonials</p>
                  <h2>Manage social proof and trust cues</h2>
                </div>
              </div>
              <ContentStudioTestimonialsSection
                testimonials={dashboard.testimonials}
              />
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}

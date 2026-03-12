import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminSessionButton } from "@/components/admin/admin-session-button";
import {
  ADMIN_SESSION_COOKIE,
  hasAdminPasswordConfigured,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Internal dashboard for Kinsley Law Advocates submissions and migrated Next.js content.",
};

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminPage() {
  if (!hasAdminPasswordConfigured()) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <div className="admin-auth-card">
            <p className="eyebrow">Admin setup</p>
            <h1 className="page-title admin-title">Set `ADMIN_DASHBOARD_PASSWORD` to enable the internal dashboard.</h1>
            <p className="page-intro">
              Add the variable to your local `.env`, restart the Next.js server,
              and reload this page.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const cookieStore = await cookies();
  const isAuthenticated = isAdminSessionValid(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <AdminLoginForm />
        </div>
      </section>
    );
  }

  const dashboard = await getAdminDashboardData();

  return (
    <>
      <section className="page-hero">
        <div className="site-container admin-hero">
          <div>
            <p className="eyebrow">Internal dashboard</p>
            <h1 className="page-title admin-title">Monitor intake, content, and migration readiness from one place.</h1>
            <p className="page-intro">
              This view replaces the operational visibility the old backend
              would normally provide while the Next.js app becomes the primary
              system.
            </p>
          </div>
          <div className="admin-hero-actions">
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
            <article className="admin-stat-card">
              <span>Attorneys</span>
              <strong>{dashboard.counts.attorneys}</strong>
            </article>
            <article className="admin-stat-card">
              <span>Practice areas</span>
              <strong>{dashboard.counts.practiceAreas}</strong>
            </article>
            <article className="admin-stat-card">
              <span>Contacts</span>
              <strong>{dashboard.counts.contacts}</strong>
            </article>
            <article className="admin-stat-card">
              <span>Appointments</span>
              <strong>{dashboard.counts.appointments}</strong>
            </article>
            <article className="admin-stat-card">
              <span>Testimonials</span>
              <strong>{dashboard.counts.testimonials}</strong>
            </article>
          </div>

          <div className="admin-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Latest contacts</p>
                  <h2>Recent message submissions</h2>
                </div>
              </div>
              {dashboard.contacts.length === 0 ? (
                <p className="admin-empty">No contact submissions yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Service</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>
                            <strong>{contact.name}</strong>
                            <span>{contact.email}</span>
                            {contact.phone ? <span>{contact.phone}</span> : null}
                            <p>{contact.message}</p>
                          </td>
                          <td>{contact.service}</td>
                          <td>{formatDate(contact.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Latest appointments</p>
                  <h2>Recent consultation requests</h2>
                </div>
              </div>
              {dashboard.appointments.length === 0 ? (
                <p className="admin-empty">No appointment requests yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Practice area</th>
                        <th>Requested</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <strong>{appointment.name}</strong>
                            <span>{appointment.email}</span>
                            <span>{appointment.phone}</span>
                            <p>{appointment.description}</p>
                          </td>
                          <td>
                            <strong>{appointment.practiceArea}</strong>
                            <span>{appointment.attorneyName ?? "Unassigned"}</span>
                            <span>
                              {appointment.date.toLocaleDateString("en-US")} at {appointment.time}
                            </span>
                          </td>
                          <td>{formatDate(appointment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <div className="admin-grid admin-grid-secondary">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Firm profile</p>
                  <h2>Attorneys and practice areas</h2>
                </div>
              </div>
              <div className="admin-list-grid">
                {dashboard.attorneys.map((attorney) => (
                  <article key={attorney.email} className="admin-list-card">
                    <strong>{attorney.name}</strong>
                    <span>
                      {attorney.position} · {attorney.specialization}
                    </span>
                    <span>{attorney.email}</span>
                    <p>{attorney.bio}</p>
                  </article>
                ))}
              </div>
              <div className="admin-tag-grid">
                {dashboard.practiceAreas.map((practiceArea) => (
                  <article key={practiceArea.name} className="admin-tag-card">
                    <strong>{practiceArea.name}</strong>
                    <p>{practiceArea.description}</p>
                    <div className="admin-chip-row">
                      {practiceArea.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Content blocks</p>
                  <h2>Testimonials and stored settings</h2>
                </div>
              </div>
              <div className="admin-list-grid compact">
                {dashboard.testimonials.map((testimonial) => (
                  <article key={`${testimonial.name}-${testimonial.title}`} className="admin-list-card">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.title}</span>
                    <p>{testimonial.quote}</p>
                  </article>
                ))}
              </div>
              <div className="admin-settings-stack">
                {dashboard.settings.map((setting) => (
                  <article key={setting.key} className="admin-setting-card">
                    <div className="admin-setting-header">
                      <strong>{setting.key}</strong>
                      <span>
                        {setting.updatedAt.getTime() > 0
                          ? `Updated ${formatDate(setting.updatedAt)}`
                          : "Using fallback timestamp"}
                      </span>
                    </div>
                    <pre>{JSON.stringify(setting.value, null, 2)}</pre>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

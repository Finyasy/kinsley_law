import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import {
  isAdminManager,
  getAdminSessionFromCookies,
  hasAdminUsersConfigured,
} from "@/lib/admin-auth";
import { getNotificationStatusLabel } from "@/lib/email-notifications";
import { isDatabaseConfigured } from "@/lib/persistence";
import { getAdminDashboardData } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Internal dashboard for Kinsley Law Advocates submissions and migrated Next.js content.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isDatabaseConfigured()) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <div className="admin-auth-card">
            <p className="eyebrow">Admin setup</p>
            <h1 className="page-title admin-title">
              Configure `DATABASE_URL` to enable admin authentication.
            </h1>
            <p className="page-intro">
              The admin portal now uses database-backed users and sessions, so
              PostgreSQL must be available before anyone can sign in.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const hasAdminUsers = await hasAdminUsersConfigured();

  if (!hasAdminUsers) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <div className="admin-auth-card">
            <div className="admin-auth-copy">
              <p className="eyebrow">Admin setup</p>
              <h1 className="page-title admin-title">
                Create the first admin user to unlock the dashboard.
              </h1>
              <p className="page-intro">
                The shared environment password has been retired. Bootstrap a
                named admin account, then sign in with email and password.
              </p>
              <div className="admin-auth-bullets">
                <div>
                  <strong>Local bootstrap command</strong>
                  <span>
                    <code>
                      npm run admin:create -- --email admin@kinsleylaw.com --name
                      &quot;Kinsley Admin&quot; --password &quot;replace-with-a-long-password&quot;
                    </code>
                  </span>
                </div>
                <div>
                  <strong>Persistent roles</strong>
                  <span>Admin users are stored in PostgreSQL with role and active state.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const session = await getAdminSessionFromCookies();

  if (!session) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <AdminLoginForm />
        </div>
      </section>
    );
  }

  const canManageAdmins = isAdminManager(session.user.role);
  const dashboard = await getAdminDashboardData({
    includeAdminManagement: canManageAdmins,
  });
  const systemHealth = [
    {
      label: "Database",
      value: dashboard.databaseConfigured ? "Connected" : "Fallback mode",
    },
    {
      label: "Content source",
      value: `${dashboard.counts.practiceAreas} practice areas, ${dashboard.counts.testimonials} testimonials`,
    },
    {
      label: "Recent intake",
      value: `${dashboard.counts.contacts + dashboard.counts.appointments} total submissions`,
    },
    {
      label: "Notifications",
      value: getNotificationStatusLabel(),
    },
  ];

  return (
    <AdminWorkspace
      dashboard={dashboard}
      systemHealth={systemHealth}
      currentAdmin={session.user}
      canManageAdmins={canManageAdmins}
    />
  );
}

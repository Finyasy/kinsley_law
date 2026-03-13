import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import {
  ADMIN_SESSION_COOKIE,
  hasAdminPasswordConfigured,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import { getNotificationStatusLabel } from "@/lib/email-notifications";
import { getAdminDashboardData } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Internal dashboard for Kinsley Law Advocates submissions and migrated Next.js content.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasAdminPasswordConfigured()) {
    return (
      <section className="page-hero">
        <div className="site-container admin-shell">
          <div className="admin-auth-card">
            <p className="eyebrow">Admin setup</p>
            <h1 className="page-title admin-title">
              Set `ADMIN_DASHBOARD_PASSWORD` to enable the internal dashboard.
            </h1>
            <p className="page-intro">
              Add the variable to your local `.env`, restart the Next.js
              server, and reload this page.
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

  return <AdminWorkspace dashboard={dashboard} systemHealth={systemHealth} />;
}

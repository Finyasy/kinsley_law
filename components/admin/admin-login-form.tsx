"use client";

import { type FormEvent, useState, useTransition } from "react";
import { BrandCard } from "@/components/brand/brand-card";
import { readJsonResponse } from "@/lib/read-json-response";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await readJsonResponse<{
          error?: string;
        }>(response);

        if (!response.ok) {
          throw new Error(result?.error ?? "Unable to open the admin dashboard.");
        }

        window.location.reload();
      } catch (loginError) {
        setError(
          loginError instanceof Error
            ? loginError.message
            : "Unable to open the admin dashboard.",
        );
      }
    });
  }

  return (
    <form className="admin-auth-card" onSubmit={handleSubmit}>
      <div className="admin-auth-copy">
        <p className="eyebrow">Admin access</p>
        <h1 className="page-title admin-title">Sign in to the internal dashboard.</h1>
        <p className="page-intro">
          Use your admin email and password to manage intake, update site
          content, and review operational activity from one place.
        </p>
        <div className="admin-auth-bullets">
          <div>
            <strong>Named user accounts</strong>
            <span>Each admin uses a real account instead of a shared environment password.</span>
          </div>
          <div>
            <strong>Editors sign in here too</strong>
            <span>
              The `editor` role uses this same `/admin` login and can work on inbox
              and content tasks without seeing user-management controls.
            </span>
          </div>
          <div>
            <strong>Database-backed sessions</strong>
            <span>Session state is stored in PostgreSQL and expires automatically.</span>
          </div>
          <div>
            <strong>Operational workflow</strong>
            <span>Inbox, content controls, and settings stay behind authenticated access.</span>
          </div>
        </div>
      </div>

      <div className="admin-auth-form">
        <BrandCard priority className="admin-auth-brand-card" />
        {error ? <div className="form-error">{error}</div> : null}

        <div className="field">
          <label htmlFor="admin-email">Admin email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="button-row">
          <button type="submit" className="button-primary" disabled={isPending}>
            {isPending ? "Signing in..." : "Open Dashboard"}
          </button>
        </div>

        <p className="admin-auth-note">
          Access is limited to configured dashboard users. Editors and full admins
          both sign in here with their own email and password. Only full admins can
          manage accounts and sessions.
        </p>
      </div>
    </form>
  );
}

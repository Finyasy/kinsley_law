"use client";

import { type FormEvent, useState, useTransition } from "react";
import { BrandPoster } from "@/components/brand/brand-poster";
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
        <p className="eyebrow">Kinsley internal access</p>
        <h1 className="page-title admin-title">Sign in to the Kinsley command desk.</h1>
        <p className="page-intro">
          Use your named admin account to manage intake, update public content,
          and oversee firm operations from one branded workspace.
        </p>
        <div className="admin-auth-bullets">
          <div>
            <strong>Kinsley-owned access</strong>
            <span>Each admin signs in through a real named account tied to the firm database.</span>
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
            <strong>Backup admin ready</strong>
            <span>Keep at least one private backup admin active in addition to the firm mailbox account.</span>
          </div>
        </div>
        </div>

      <div className="admin-auth-form">
        <div className="admin-auth-brand-lockup">
          <BrandPoster priority className="admin-auth-brand-poster" />
        </div>
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

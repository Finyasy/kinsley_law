"use client";

import { type FormEvent, useState, useTransition } from "react";
import { readJsonResponse } from "@/lib/read-json-response";

export function AdminLoginForm() {
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
          body: JSON.stringify({ password }),
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
        <h1 className="page-title admin-title">Open the internal dashboard.</h1>
        <p className="page-intro">
          Use the admin password from your environment to review submissions,
          confirm the content migration, and monitor intake activity from one
          place.
        </p>
        <div className="admin-auth-bullets">
          <div>
            <strong>Live intake visibility</strong>
            <span>Contacts and consultation requests from PostgreSQL.</span>
          </div>
          <div>
            <strong>Content source checks</strong>
            <span>Practice areas, testimonials, and site settings.</span>
          </div>
          <div>
            <strong>Protected local access</strong>
            <span>Password-gated access for internal review only.</span>
          </div>
        </div>
      </div>

      <div className="admin-auth-form">
        {error ? <div className="form-error">{error}</div> : null}

        <div className="field">
          <label htmlFor="admin-password">Admin password</label>
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
            {isPending ? "Opening..." : "Open Dashboard"}
          </button>
        </div>

        <p className="admin-auth-note">
          Internal access only. Use this dashboard on trusted devices during
          firm review and content operations.
        </p>
      </div>
    </form>
  );
}

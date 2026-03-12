"use client";

import { type FormEvent, useState, useTransition } from "react";

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

        const result = (await response.json()) as {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to open the admin dashboard.");
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
      <p className="eyebrow">Admin access</p>
      <h1 className="page-title admin-title">Open the internal dashboard.</h1>
      <p className="page-intro">
        Use the admin password from your environment to review submissions and
        confirm the content migration is running from PostgreSQL.
      </p>

      {error ? <div className="form-error">{error}</div> : null}

      <div className="field">
        <label htmlFor="admin-password">Admin password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="button-row">
        <button type="submit" className="button-primary" disabled={isPending}>
          {isPending ? "Opening..." : "Open Dashboard"}
        </button>
      </div>
    </form>
  );
}

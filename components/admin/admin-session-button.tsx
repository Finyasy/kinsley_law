"use client";

import { useTransition } from "react";

export function AdminSessionButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/admin/session", {
        method: "DELETE",
      });

      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      className="button-secondary"
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

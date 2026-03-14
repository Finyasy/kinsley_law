"use client";

import { useActionState } from "react";
import {
  revokeAdminUserSessionsAction,
  saveAdminUserAction,
  toggleAdminUserStatusAction,
} from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin-editor-state";
import type { AdminAccountSummary } from "@/lib/server-data";

type AdminUserManagementProps = {
  adminUsers: AdminAccountSummary[];
  currentAdminId: number;
};

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
] as const;

function formatDate(value: Date | null) {
  if (!value) {
    return "No recent session";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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
  disabled = false,
}: {
  idleLabel: string;
  pendingLabel: string;
  isPending: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button type="submit" className={className} disabled={isPending || disabled}>
      {isPending ? pendingLabel : idleLabel}
    </button>
  );
}

function AdminUserEditorCard({
  adminUser,
  currentAdminId,
}: {
  adminUser?: AdminAccountSummary;
  currentAdminId: number;
}) {
  const [saveState, saveAction, isSaving] = useActionState(
    saveAdminUserAction,
    initialAdminActionState,
  );
  const [toggleState, toggleAction, isToggling] = useActionState(
    toggleAdminUserStatusAction,
    initialAdminActionState,
  );
  const [revokeState, revokeAction, isRevoking] = useActionState(
    revokeAdminUserSessionsAction,
    initialAdminActionState,
  );

  const isCurrentAdmin = adminUser?.id === currentAdminId;
  const isActive = adminUser?.isActive ?? true;

  return (
    <article className="admin-editor-card">
      <form action={saveAction} className="admin-editor-stack">
        <input type="hidden" name="id" value={adminUser?.id ?? ""} />
        <div className="admin-editor-heading">
          <div>
            <p className="eyebrow">{adminUser ? "Admin user" : "New admin user"}</p>
            <h3>{adminUser?.name ?? "Create dashboard account"}</h3>
          </div>
          {adminUser ? (
            <span
              className="admin-intake-status"
              data-status={adminUser.isActive ? "scheduled" : "closed"}
            >
              {adminUser.isActive ? "Active" : "Inactive"}
            </span>
          ) : null}
        </div>

        {adminUser ? (
          <div className="admin-mini-stat-grid">
            <article className="admin-mini-stat">
              <span>Role</span>
              <strong>{adminUser.role}</strong>
            </article>
            <article className="admin-mini-stat">
              <span>Active sessions</span>
              <strong>{adminUser.activeSessionCount}</strong>
            </article>
            <article className="admin-mini-stat">
              <span>Last seen</span>
              <strong>{formatDate(adminUser.lastSeenAt)}</strong>
            </article>
          </div>
        ) : null}

        <p className="admin-editor-note">
          {adminUser
            ? "Leave the password field blank to keep the current password. Enter a new one to rotate access."
            : "Create named dashboard access for firm staff. Passwords must be at least 12 characters long."}
        </p>
        <FormMessage state={saveState} />

        <div className="admin-editor-fields">
          <div className="field">
            <label htmlFor={`admin-user-name-${adminUser?.id ?? "new"}`}>Full name</label>
            <input
              id={`admin-user-name-${adminUser?.id ?? "new"}`}
              name="name"
              defaultValue={adminUser?.name ?? ""}
              required
            />
          </div>
          <div className="field">
            <label htmlFor={`admin-user-email-${adminUser?.id ?? "new"}`}>Email</label>
            <input
              id={`admin-user-email-${adminUser?.id ?? "new"}`}
              type="email"
              name="email"
              defaultValue={adminUser?.email ?? ""}
              required
            />
          </div>
          <div className="field">
            <label htmlFor={`admin-user-role-${adminUser?.id ?? "new"}`}>Role</label>
            <select
              id={`admin-user-role-${adminUser?.id ?? "new"}`}
              name="role"
              defaultValue={adminUser?.role ?? "admin"}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`admin-user-password-${adminUser?.id ?? "new"}`}>
              {adminUser ? "New password" : "Password"}
            </label>
            <input
              id={`admin-user-password-${adminUser?.id ?? "new"}`}
              type="password"
              name="password"
              autoComplete="new-password"
              required={!adminUser}
            />
          </div>
        </div>

        <div className="button-row">
          <FormSubmitButton
            idleLabel={adminUser ? "Save Admin User" : "Create Admin User"}
            pendingLabel="Saving..."
            isPending={isSaving}
          />
        </div>
      </form>

      {adminUser ? (
        <div className="admin-editor-action-stack">
          <form action={revokeAction} className="admin-editor-delete-row">
            <input type="hidden" name="id" value={adminUser.id} />
            <FormMessage state={revokeState} />
            <FormSubmitButton
              idleLabel="Revoke Sessions"
              pendingLabel="Revoking..."
              isPending={isRevoking}
              className="button-secondary"
              disabled={isCurrentAdmin}
            />
          </form>

          <form action={toggleAction} className="admin-editor-delete-row">
            <input type="hidden" name="id" value={adminUser.id} />
            <input
              type="hidden"
              name="nextActiveState"
              value={isActive ? "inactive" : "active"}
            />
            <FormMessage state={toggleState} />
            <FormSubmitButton
              idleLabel={
                isCurrentAdmin && isActive
                  ? "Current Session Account"
                  : isActive
                    ? "Deactivate User"
                    : "Reactivate User"
              }
              pendingLabel={isActive ? "Deactivating..." : "Reactivating..."}
              isPending={isToggling}
              className="button-secondary"
              disabled={isCurrentAdmin && isActive}
            />
          </form>
        </div>
      ) : null}
    </article>
  );
}

export function AdminUserManagement({
  adminUsers,
  currentAdminId,
}: AdminUserManagementProps) {
  return (
    <div className="admin-editor-section">
      <div className="admin-editor-grid">
        {adminUsers.map((adminUser) => (
          <AdminUserEditorCard
            key={adminUser.id}
            adminUser={adminUser}
            currentAdminId={currentAdminId}
          />
        ))}
        <AdminUserEditorCard currentAdminId={currentAdminId} />
      </div>
    </div>
  );
}

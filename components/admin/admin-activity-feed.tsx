"use client";

import type { AdminAuditEntry } from "@/lib/server-data";

type AdminActivityFeedProps = {
  entries: AdminAuditEntry[];
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatEntityLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function AdminActivityFeed({ entries }: AdminActivityFeedProps) {
  if (entries.length === 0) {
    return <p className="admin-empty">No admin activity has been recorded yet.</p>;
  }

  return (
    <div className="admin-activity-feed">
      {entries.map((entry) => (
        <article key={entry.id} className="admin-activity-card">
          <div className="admin-activity-header">
            <div>
              <p className="eyebrow">Activity</p>
              <h3>{entry.summary}</h3>
            </div>
            <span>{formatDate(entry.createdAt)}</span>
          </div>

          <div className="admin-activity-meta">
            <div>
              <span>Actor</span>
              <strong>
                {entry.actor
                  ? `${entry.actor.name} · ${entry.actor.role}`
                  : "Unknown admin"}
              </strong>
            </div>
            <div>
              <span>Entity</span>
              <strong>{formatEntityLabel(entry.entityType)}</strong>
            </div>
            <div>
              <span>Action</span>
              <strong>{formatEntityLabel(entry.action)}</strong>
            </div>
            {entry.entityId ? (
              <div>
                <span>Record</span>
                <strong>#{entry.entityId}</strong>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

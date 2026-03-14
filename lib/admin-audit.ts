import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/persistence";

type RecordAdminAuditEventOptions = {
  actorAdminUserId?: number | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  summary: string;
  metadata?: Prisma.InputJsonValue;
};

export async function recordAdminAuditEvent(
  options: RecordAdminAuditEventOptions,
) {
  if (!isDatabaseConfigured()) {
    return;
  }

  try {
    await prisma.auditLog.create({
      data: {
        actorAdminUserId: options.actorAdminUserId ?? null,
        action: options.action,
        entityType: options.entityType,
        entityId:
          options.entityId === undefined || options.entityId === null
            ? null
            : String(options.entityId),
        summary: options.summary,
        ...(options.metadata ? { metadata: options.metadata } : {}),
      },
    });
  } catch (error) {
    console.error("Unable to persist admin audit log entry.", error);
  }
}

ALTER TABLE "Contact"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN "assignedTo" TEXT,
ADD COLUMN "internalNotes" TEXT;

ALTER TABLE "Appointment"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN "assignedTo" TEXT,
ADD COLUMN "internalNotes" TEXT;

CREATE INDEX "Contact_status_createdAt_idx" ON "Contact"("status", "createdAt");
CREATE INDEX "Appointment_status_createdAt_idx" ON "Appointment"("status", "createdAt");

ALTER TABLE "Contact"
ADD COLUMN "notificationStatus" TEXT,
ADD COLUMN "notificationDetail" TEXT,
ADD COLUMN "clientReplyStatus" TEXT,
ADD COLUMN "clientReplyDetail" TEXT;

ALTER TABLE "Appointment"
ADD COLUMN "notificationStatus" TEXT,
ADD COLUMN "notificationDetail" TEXT,
ADD COLUMN "clientReplyStatus" TEXT,
ADD COLUMN "clientReplyDetail" TEXT;

-- AlterTable
ALTER TABLE "Attorney" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PracticeArea" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill ordering to preserve the current alphabetical display order
WITH ordered_attorneys AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "name" ASC, "id" ASC) - 1 AS "position"
  FROM "Attorney"
)
UPDATE "Attorney"
SET "sortOrder" = ordered_attorneys."position"
FROM ordered_attorneys
WHERE "Attorney"."id" = ordered_attorneys."id";

WITH ordered_practice_areas AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "name" ASC, "id" ASC) - 1 AS "position"
  FROM "PracticeArea"
)
UPDATE "PracticeArea"
SET "sortOrder" = ordered_practice_areas."position"
FROM ordered_practice_areas
WHERE "PracticeArea"."id" = ordered_practice_areas."id";

-- CreateIndex
CREATE INDEX "Attorney_sortOrder_idx" ON "Attorney"("sortOrder");

-- CreateIndex
CREATE INDEX "PracticeArea_sortOrder_idx" ON "PracticeArea"("sortOrder");

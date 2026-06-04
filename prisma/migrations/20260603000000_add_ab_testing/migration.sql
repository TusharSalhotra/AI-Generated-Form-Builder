ALTER TABLE "Submission"
ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'A';

ALTER TABLE "Analytics"
ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'A';

CREATE TABLE IF NOT EXISTS "FormVersion" (
  "id" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "schema" JSONB NOT NULL,
  "label" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FormVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "FormVersion_formId_label_key"
ON "FormVersion" ("formId", "label");

CREATE INDEX IF NOT EXISTS "FormVersion_formId_idx"
ON "FormVersion" ("formId");

INSERT INTO "FormVersion" ("id", "formId", "schema", "label", "createdAt")
SELECT md5(random()::text || clock_timestamp()::text), "id", "schema", 'A', NOW()
FROM "Form"
ON CONFLICT ("formId", "label") DO NOTHING;

INSERT INTO "FormVersion" ("id", "formId", "schema", "label", "createdAt")
SELECT md5(random()::text || clock_timestamp()::text), "id", "schema", 'B', NOW()
FROM "Form"
ON CONFLICT ("formId", "label") DO NOTHING;

-- AlterTable: Add organization branch support
-- parent_organization_id: optional FK to parent org (for branches)
-- branch_type: STANDALONE (default), HEADQUARTERS, BRANCH

ALTER TABLE "Organization" ADD COLUMN "parent_organization_id" TEXT;
ALTER TABLE "Organization" ADD COLUMN "branch_type" TEXT NOT NULL DEFAULT 'STANDALONE';

ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parent_organization_id_fkey"
  FOREIGN KEY ("parent_organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Organization_parent_organization_id_idx" ON "Organization"("parent_organization_id");

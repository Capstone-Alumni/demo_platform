/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,account_id]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "alumni_tenant_id_account_id_key" ON "alumni"("tenant_id", "account_id");

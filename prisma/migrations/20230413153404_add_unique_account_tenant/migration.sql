/*
  Warnings:

  - A unique constraint covering the columns `[account_id,tenant_id]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "alumni_account_id_tenant_id_key" ON "alumni"("account_id", "tenant_id");

/*
  Warnings:

  - You are about to drop the column `tenantId` on the `tenants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tenants_tenantId_key";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "tenantId";

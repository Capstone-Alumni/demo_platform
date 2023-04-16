/*
  Warnings:

  - You are about to drop the column `envidenceUrl` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "envidenceUrl",
ADD COLUMN     "evidenceUrl" TEXT;

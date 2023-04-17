/*
  Warnings:

  - You are about to drop the column `approved` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "approved";

-- DropEnum
DROP TYPE "AccessLevel";

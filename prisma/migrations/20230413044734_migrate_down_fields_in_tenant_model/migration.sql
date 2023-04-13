/*
  Warnings:

  - You are about to drop the column `is_paid` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `is_wait_for_pay` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "is_paid",
DROP COLUMN "is_wait_for_pay";

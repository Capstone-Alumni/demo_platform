/*
  Warnings:

  - You are about to drop the column `is_tenant_admin` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `alumni` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_email,tenant_id]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_account_id_fkey";

-- DropIndex
DROP INDEX "alumni_account_id_tenant_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "is_tenant_admin";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "account_id",
ADD COLUMN     "account_email" TEXT,
ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "alumni_account_email_tenant_id_key" ON "alumni"("account_email", "tenant_id");

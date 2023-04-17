/*
  Warnings:

  - You are about to drop the column `access_level` on the `alumni` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_account_id_fkey";

-- DropIndex
DROP INDEX "alumni_tenant_id_account_id_key";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "access_level",
ALTER COLUMN "account_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `account_id` on table `alumni` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_account_id_fkey";

-- AlterTable
ALTER TABLE "alumni" ALTER COLUMN "account_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

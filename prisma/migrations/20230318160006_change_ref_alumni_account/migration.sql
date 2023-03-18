/*
  Warnings:

  - You are about to drop the column `user_id` on the `alumni` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `alumni` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_user_id_fkey";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "user_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

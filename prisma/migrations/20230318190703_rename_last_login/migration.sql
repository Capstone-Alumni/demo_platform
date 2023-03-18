/*
  Warnings:

  - You are about to drop the column `first_login` on the `alumni` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "first_login",
ADD COLUMN     "last_login" TIMESTAMP(3);

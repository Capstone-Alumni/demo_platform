/*
  Warnings:

  - You are about to drop the column `userId` on the `alumni` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_userId_fkey";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "userId";

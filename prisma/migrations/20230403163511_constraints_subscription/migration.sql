/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

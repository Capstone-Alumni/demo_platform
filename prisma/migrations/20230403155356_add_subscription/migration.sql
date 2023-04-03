/*
  Warnings:

  - You are about to drop the column `activated` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "activated",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plan_id" TEXT;

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

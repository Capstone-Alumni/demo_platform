-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_wait_for_pay" BOOLEAN NOT NULL DEFAULT false;

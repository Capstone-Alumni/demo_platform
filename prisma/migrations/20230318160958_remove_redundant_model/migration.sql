/*
  Warnings:

  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_fkey";

-- DropTable
DROP TABLE "members";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AccessMode";

-- DropEnum
DROP TYPE "AccessStatus";

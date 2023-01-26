/*
  Warnings:

  - You are about to drop the column `access_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `access_mode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `access_status` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "access_level" "AccessLevel" NOT NULL DEFAULT 'ALUMNI',
ADD COLUMN     "access_mode" "AccessMode" NOT NULL DEFAULT 'FULL_ACCESS',
ADD COLUMN     "access_status" "AccessStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_level",
DROP COLUMN "access_mode",
DROP COLUMN "access_status";

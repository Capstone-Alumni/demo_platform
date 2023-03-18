-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_user_id_fkey";

-- AlterTable
ALTER TABLE "alumni" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_tenant_admin" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

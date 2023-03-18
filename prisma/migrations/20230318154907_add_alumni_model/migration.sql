-- CreateTable
CREATE TABLE "alumni" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" "AccessLevel" NOT NULL DEFAULT 'ALUMNI',
    "first_login" TIMESTAMP(3),
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

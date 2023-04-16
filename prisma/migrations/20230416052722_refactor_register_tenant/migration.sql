-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "request_status" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TransactionRequest" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,

    CONSTRAINT "TransactionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionRequest_token_key" ON "TransactionRequest"("token");

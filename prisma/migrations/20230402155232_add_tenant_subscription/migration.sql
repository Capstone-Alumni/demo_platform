-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "address" TEXT,
ADD COLUMN     "subscription_end" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vpn_version" TEXT NOT NULL,
    "vnp_commnad" TEXT NOT NULL,
    "vnp_tmn_code" TEXT NOT NULL,
    "vnp_amount" INTEGER NOT NULL,
    "vnp_bank_code" TEXT,
    "vnp_create_date" TEXT NOT NULL,
    "vnp_CurrCode" TEXT NOT NULL,
    "vnp_ip_addr" TEXT NOT NULL,
    "vnp_locale" TEXT NOT NULL,
    "vnp_order_info" TEXT NOT NULL,
    "vpn_order_type" TEXT NOT NULL,
    "vnp_txn_ref" TEXT NOT NULL,
    "vnp_transaction_no" TEXT,
    "vnp_response_code" TEXT,
    "vnp_transaction_status" TEXT,
    "payment_status" INTEGER NOT NULL DEFAULT 0,
    "subcription" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_vnp_txn_ref_key" ON "transactions"("vnp_txn_ref");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

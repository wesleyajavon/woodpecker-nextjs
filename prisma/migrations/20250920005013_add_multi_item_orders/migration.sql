-- CreateTable
CREATE TABLE "public"."MultiItemOrder" (
    "id" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "sessionId" TEXT,
    "licenseType" "public"."LicenseType" NOT NULL DEFAULT 'NON_EXCLUSIVE',
    "usageRights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "MultiItemOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "beatId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MultiItemOrder_customerEmail_idx" ON "public"."MultiItemOrder"("customerEmail");

-- CreateIndex
CREATE INDEX "MultiItemOrder_status_idx" ON "public"."MultiItemOrder"("status");

-- CreateIndex
CREATE INDEX "MultiItemOrder_createdAt_idx" ON "public"."MultiItemOrder"("createdAt");

-- CreateIndex
CREATE INDEX "MultiItemOrder_sessionId_idx" ON "public"."MultiItemOrder"("sessionId");

-- CreateIndex
CREATE INDEX "MultiItemOrder_userId_idx" ON "public"."MultiItemOrder"("userId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_beatId_idx" ON "public"."OrderItem"("beatId");

-- AddForeignKey
ALTER TABLE "public"."MultiItemOrder" ADD CONSTRAINT "MultiItemOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."MultiItemOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "public"."Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

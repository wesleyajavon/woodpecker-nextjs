-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."LicenseType" AS ENUM ('NON_EXCLUSIVE', 'EXCLUSIVE', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."Beat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "genre" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "stripePriceId" TEXT,
    "previewUrl" TEXT,
    "fullUrl" TEXT,
    "stemsUrl" TEXT,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
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
    "licenseType" "public"."LicenseType" NOT NULL DEFAULT 'NON_EXCLUSIVE',
    "usageRights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "beatId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Beat_genre_idx" ON "public"."Beat"("genre");

-- CreateIndex
CREATE INDEX "Beat_bpm_idx" ON "public"."Beat"("bpm");

-- CreateIndex
CREATE INDEX "Beat_key_idx" ON "public"."Beat"("key");

-- CreateIndex
CREATE INDEX "Beat_price_idx" ON "public"."Beat"("price");

-- CreateIndex
CREATE INDEX "Beat_rating_idx" ON "public"."Beat"("rating");

-- CreateIndex
CREATE INDEX "Beat_isActive_idx" ON "public"."Beat"("isActive");

-- CreateIndex
CREATE INDEX "Beat_featured_idx" ON "public"."Beat"("featured");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "public"."Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_beatId_idx" ON "public"."Order"("beatId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "public"."Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Beat" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Beat_userId_idx" ON "public"."Beat"("userId");

-- AddForeignKey
ALTER TABLE "public"."Beat" ADD CONSTRAINT "Beat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

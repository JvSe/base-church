-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'PASTOR';

-- AlterTable
ALTER TABLE "public"."enrollments" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

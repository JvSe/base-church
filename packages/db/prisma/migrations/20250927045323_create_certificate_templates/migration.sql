/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `certificates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `templateId` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CertificateStatus" AS ENUM ('PENDING', 'ISSUED', 'REVOKED');

-- AlterTable
ALTER TABLE "public"."certificates" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "public"."CertificateStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "templateId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificationCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "issuedAt" DROP NOT NULL,
ALTER COLUMN "issuedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."certificate_templates" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "templateUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificate_templates_courseId_key" ON "public"."certificate_templates"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verificationCode_key" ON "public"."certificates"("verificationCode");

-- AddForeignKey
ALTER TABLE "public"."certificate_templates" ADD CONSTRAINT "certificate_templates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."certificate_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

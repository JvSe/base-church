/*
  Warnings:

  - You are about to drop the column `academicBackground` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `highlights` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBROS', 'LIDER');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "academicBackground",
DROP COLUMN "highlights",
DROP COLUMN "location",
DROP COLUMN "skills",
DROP COLUMN "website",
DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBROS';

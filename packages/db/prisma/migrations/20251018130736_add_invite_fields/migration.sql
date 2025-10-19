-- AlterTable
ALTER TABLE "users" ADD COLUMN "inviteToken" TEXT,
ADD COLUMN "inviteTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN "isInvitePending" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_inviteToken_key" ON "users"("inviteToken");


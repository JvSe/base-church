-- CreateTable
CREATE TABLE "public"."user_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyStudyHours" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "monthlyCoursesTarget" INTEGER NOT NULL DEFAULT 1,
    "weeklyStudyHours" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_goals_userId_key" ON "public"."user_goals"("userId");

-- AddForeignKey
ALTER TABLE "public"."user_goals" ADD CONSTRAINT "user_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

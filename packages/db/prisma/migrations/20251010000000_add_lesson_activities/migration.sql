-- CreateEnum para tipos de lição
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'OBJECTIVE_QUIZ', 'SUBJECTIVE_QUIZ');

-- CreateEnum para tipos de questão
CREATE TYPE "QuestionType" AS ENUM ('OBJECTIVE', 'SUBJECTIVE');

-- CreateEnum para tipos de resposta subjetiva
CREATE TYPE "SubjectiveAnswerType" AS ENUM ('TEXT', 'FILE');

-- CreateEnum para status de resposta
CREATE TYPE "AnswerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION');

-- AlterTable Lesson - Adiciona novos campos
ALTER TABLE "lessons" ADD COLUMN "isActivity" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "lessons" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "lessons" ALTER COLUMN "type" TYPE "LessonType" USING (
  CASE 
    WHEN "type" = 'video' THEN 'VIDEO'::"LessonType"
    WHEN "type" = 'text' OR "type" = 'reading' THEN 'TEXT'::"LessonType"
    WHEN "type" = 'quiz' OR "type" = 'exercise' THEN 'OBJECTIVE_QUIZ'::"LessonType"
    ELSE 'VIDEO'::"LessonType"
  END
);
ALTER TABLE "lessons" ALTER COLUMN "type" SET DEFAULT 'VIDEO';

-- AlterTable Module - Adiciona campo de bloqueio por atividade
ALTER TABLE "modules" ADD COLUMN "requiresActivityCompletion" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable Question
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "order" INTEGER NOT NULL,
    "explanation" TEXT,
    "subjectiveAnswerType" "SubjectiveAnswerType",
    "correctAnswer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable QuestionOption
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable StudentAnswer
CREATE TABLE "student_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "answerText" TEXT,
    "selectedOptionId" TEXT,
    "fileUrl" TEXT,
    "status" "AnswerStatus" NOT NULL DEFAULT 'PENDING',
    "score" INTEGER DEFAULT 0,
    "feedback" TEXT,
    "correctedBy" TEXT,
    "correctedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_answers_userId_questionId_key" ON "student_answers"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;


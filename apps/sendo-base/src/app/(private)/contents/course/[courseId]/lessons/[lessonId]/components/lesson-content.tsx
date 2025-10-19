"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { QuizLessonContent } from "./quiz-lesson-content";
import { TextLessonContent } from "./text-lesson-content";
import { VideoLessonContent } from "./video-lesson-content";

type Question = {
  id: string;
  questionText: string;
  points: number;
  order: number;
  options: {
    id: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }[];
};

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "OBJECTIVE_QUIZ" | "SUBJECTIVE_QUIZ";
  videoUrl?: string | null;
  content?: string | null;
  questions?: Question[];
  isCompleted?: boolean;
};

type LessonContentProps = {
  lesson: Lesson;
  userId: string;
  isCompleted: boolean;
  isUpdatingProgress: boolean;
  onCompleteLesson: () => void;
  onCompleteQuiz?: (
    answers: Array<{ questionId: string; selectedOptionId: string }>,
  ) => Promise<any>;
};

function LessonCompletionFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />

        {/* Main content */}
        <div className="dark-glass relative rounded-2xl p-12 text-center shadow-2xl">
          {/* Icon container with animation */}
          <div className="mb-6 flex items-center justify-center">
            {/* Rotating border */}

            {/* Icon */}
            <CheckCircle2 className="dark-success animate-bounce" size={48} />
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="dark-text-primary text-2xl font-bold">
                Aula Concluída! 🎉
              </h3>
              <p className="dark-text-secondary text-lg">
                Finalizando sua aula...
              </p>
            </div>

            {/* Loading indicator */}
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="dark-primary animate-spin" size={20} />
              <span className="dark-text-tertiary text-sm font-medium">
                Carregando próxima aula
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 pt-2">
              <div
                className="dark-primary-subtle-bg h-2 w-2 animate-bounce rounded-full"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="dark-primary-subtle-bg h-2 w-2 animate-bounce rounded-full"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="dark-primary-subtle-bg h-2 w-2 animate-bounce rounded-full"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        </div>
      </div>
    </div>
  );
}

export function LessonContent({
  lesson,
  userId,
  isCompleted,
  isUpdatingProgress,
  onCompleteLesson,
  onCompleteQuiz,
}: LessonContentProps) {
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  useEffect(() => {
    if (isUpdatingProgress) {
      setIsVideoEnded(true);
    }
  }, [isUpdatingProgress]);

  // Show completion fallback when updating progress
  if (isVideoEnded) {
    return <LessonCompletionFallback />;
  }
  // VIDEO Lesson
  if (lesson.type === "VIDEO") {
    return (
      <VideoLessonContent
        videoUrl={lesson.videoUrl || ""}
        onEnded={onCompleteLesson}
      />
    );
  }

  // TEXT Lesson
  if (lesson.type === "TEXT") {
    return (
      <TextLessonContent
        content={lesson.content || ""}
        isCompleted={isCompleted}
        isUpdatingProgress={isUpdatingProgress}
        onComplete={onCompleteLesson}
      />
    );
  }

  // QUIZ Lesson (OBJECTIVE_QUIZ)
  if (lesson.type === "OBJECTIVE_QUIZ") {
    if (!onCompleteQuiz) {
      return (
        <div className="dark-bg-secondary flex h-full items-center justify-center">
          <div className="dark-bg-primary dark-border rounded-lg border p-8 text-center">
            <p className="dark-text-primary text-lg font-semibold">
              Erro no Quiz
            </p>
            <p className="dark-text-secondary mt-2">
              Função de completar quiz não disponível.
            </p>
          </div>
        </div>
      );
    }

    return (
      <QuizLessonContent
        questions={lesson.questions || []}
        lessonId={lesson.id}
        userId={userId}
        isCompleted={isCompleted}
        onComplete={onCompleteQuiz}
      />
    );
  }

  // SUBJECTIVE_QUIZ (future implementation)
  if (lesson.type === "SUBJECTIVE_QUIZ") {
    return (
      <div className="dark-bg-secondary flex h-full items-center justify-center">
        <div className="dark-bg-primary dark-border rounded-lg border p-8 text-center">
          <p className="dark-text-primary text-lg font-semibold">
            Quiz Subjetivo
          </p>
          <p className="dark-text-secondary mt-2">
            Este tipo de avaliação ainda não está disponível.
          </p>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="dark-bg-secondary flex h-full items-center justify-center">
      <div className="dark-bg-primary dark-border rounded-lg border p-8 text-center">
        <p className="dark-text-primary text-lg font-semibold">
          Tipo de lição não reconhecido
        </p>
        <p className="dark-text-secondary mt-2">Tipo da lição: {lesson.type}</p>
      </div>
    </div>
  );
}

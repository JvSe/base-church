"use client";

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

export function LessonContent({
  lesson,
  userId,
  isCompleted,
  isUpdatingProgress,
  onCompleteLesson,
  onCompleteQuiz,
}: LessonContentProps) {
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

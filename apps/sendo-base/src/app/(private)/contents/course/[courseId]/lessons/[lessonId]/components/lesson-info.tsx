"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import {
  Award,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Loader2,
} from "lucide-react";

type LessonInfoProps = {
  lesson: any;
  isCompleted: boolean;
  isUpdatingProgress: boolean;
  showSuccessFeedback: boolean;
  showCertificateNotification: boolean;
  onCompleteLesson: () => void;
};

export function LessonInfo({
  lesson,
  isCompleted,
  isUpdatingProgress,
  showSuccessFeedback,
  showCertificateNotification,
  onCompleteLesson,
}: LessonInfoProps) {
  return (
    <div
      className={cn(
        "dark-bg-primary dark-border rounded-b-lg border p-4 sm:p-6 md:flex-[0.2]",
        lesson.type !== "VIDEO" && "rounded-t-lg",
      )}
    >
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="dark-text-primary mb-2 text-lg font-bold sm:text-xl">
            {lesson.title}
          </h1>
          <p className="dark-text-secondary text-sm sm:text-base">
            {lesson.description}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Success Feedback */}
          {showSuccessFeedback && (
            <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 px-3 py-2 text-green-400">
              <Check size={16} />
              <span className="text-sm font-medium">
                {isCompleted
                  ? "Lição marcada como assistida!"
                  : "Lição desmarcada!"}
              </span>
            </div>
          )}

          {/* Certificate Notification */}
          {showCertificateNotification && (
            <div className="flex items-center space-x-2 rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400">
              <Award size={16} />
              <span className="text-sm font-medium">
                🎉 Parabéns! Certificado gerado automaticamente!
              </span>
            </div>
          )}

          {/* Complete Lesson Button - Only for VIDEO lessons */}
          {lesson.type === "VIDEO" && (
            <Button
              onClick={onCompleteLesson}
              disabled={isUpdatingProgress}
              className={`transition-all duration-200 ${
                isCompleted
                  ? "dark-success-bg dark-success-border hover:dark-success-bg-hover text-white"
                  : "dark-glass dark-border hover:dark-border-hover"
              }`}
              size="sm"
            >
              {isUpdatingProgress ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isCompleted ? (
                <CheckCircle size={16} />
              ) : (
                <Circle size={16} />
              )}
              <span className="ml-2">
                {isUpdatingProgress
                  ? "Salvando..."
                  : isCompleted
                    ? "Assistida"
                    : "Marcar como assistida"}
              </span>
            </Button>
          )}

          {/* Status badge for TEXT and QUIZ lessons */}
          {(lesson.type === "TEXT" ||
            lesson.type === "OBJECTIVE_QUIZ" ||
            lesson.type === "SUBJECTIVE_QUIZ") &&
            isCompleted && (
              <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 px-3 py-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Concluída</span>
              </div>
            )}

          {/* <Button variant="ghost" size="sm" className="hover:dark-bg-tertiary">
            <Bookmark className="dark-text-primary" size={16} />
          </Button> */}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="dark-text-tertiary flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatDuration(lesson.duration || 0)}</span>
          </div>
          {/* <div className="flex items-center">
            <Star size={14} className="dark-secondary mr-1" />
            <span>Avalie esta aula</span>
          </div> */}
          {/* {lesson.videoUrl && (
            <div className="flex items-center">
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dark-primary hover:dark-primary-hover flex items-center space-x-2 text-sm font-medium transition-colors"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Abrir no YouTube</span>
              </a>
            </div>
          )} */}
        </div>

        {/* <div className="flex items-center space-x-2">
          <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
            <MessageCircle size={16} />
            Assistente IA
          </Button>
          <Button className="dark-btn-primary">Fazer Pergunta</Button>
        </div> */}
      </div>
    </div>
  );
}

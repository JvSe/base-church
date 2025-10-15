"use client";

import { Button } from "@base-church/ui/components/button";
import { CheckCircle, Download, Play } from "lucide-react";
import Link from "next/link";

type CourseProgressCardProps = {
  courseId: string;
  progress: number;
  nextLessonId: string | null;
  isCompleted: boolean;
};

export function CourseProgressCard({
  courseId,
  progress,
  nextLessonId,
  isCompleted,
}: CourseProgressCardProps) {
  return (
    <div className="dark-card dark-shadow-sm rounded-xl p-6">
      <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
        <Play className="dark-text-tertiary" size={48} />
      </div>

      <div className="space-y-4">
        {/* Progresso do Curso */}
        <div className="mb-4 text-center">
          <div className="dark-text-primary mb-1 text-2xl font-bold">
            {progress}%
          </div>
          <div className="dark-text-tertiary mb-2 text-sm">Concluído</div>
          <div className="dark-bg-tertiary h-2 w-full rounded-full">
            <div
              className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Botão de Continuar/Concluído */}
        {isCompleted ? (
          <div className="dark-success-bg dark-success rounded-lg p-4 text-center">
            <CheckCircle className="mx-auto mb-2" size={20} />
            <p className="text-sm font-medium">Curso Concluído!</p>
            <p className="text-xs opacity-80">Parabéns por finalizar o curso</p>
          </div>
        ) : nextLessonId ? (
          <Button asChild className="dark-btn-primary w-full">
            <Link href={`/contents/course/${courseId}/lessons/${nextLessonId}`}>
              <Play className="mr-2" size={16} />
              Continuar Assistindo
            </Link>
          </Button>
        ) : null}

        <Button className="dark-glass dark-border hover:dark-border-hover w-full">
          <Download className="mr-2" size={16} />
          Baixar Recursos
        </Button>
      </div>
    </div>
  );
}

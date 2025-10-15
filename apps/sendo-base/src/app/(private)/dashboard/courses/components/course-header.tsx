"use client";

import { Button } from "@base-church/ui/components/button";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseHeaderProps {
  courseId: string | null;
  hasModules: boolean;
  isLoading: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
  isPublished?: boolean;
  onSaveDraft?: () => void;
  onFinishCourse: () => void;
  onDeleteCourse?: () => void;
}

export function CourseHeader({
  courseId,
  hasModules,
  isLoading,
  isEditing = false,
  isDeleting = false,
  isPublished = false,
  onSaveDraft,
  onFinishCourse,
  onDeleteCourse,
}: CourseHeaderProps) {
  const router = useRouter();

  return (
    <div className="dark-glass dark-shadow-md rounded-2xl p-6">
      <div className="flex items-center space-x-4">
        <Button
          className="dark-glass dark-border hover:dark-border-hover"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="dark-text-primary text-3xl font-bold">
              {isEditing ? "Editar Curso 📚" : "Criar Curso Completo 📚"}
            </h1>
            {isEditing && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isPublished
                    ? "border border-green-500/30 bg-green-500/20 text-green-400"
                    : "border border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {isPublished ? "✓ Publicado" : "⏳ Rascunho"}
              </span>
            )}
          </div>
          <p className="dark-text-secondary mt-2">
            {isEditing
              ? "Edite seu curso com módulos e lições em uma única tela"
              : "Crie seu curso com módulos e lições em uma única tela"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && onSaveDraft && (
            <Button
              type="button"
              className="dark-glass dark-border hover:dark-border-hover"
              onClick={onSaveDraft}
              disabled={isLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
          )}
          {courseId && hasModules && (
            <Button
              type="button"
              className={
                isPublished
                  ? "dark-glass dark-border hover:dark-border-hover"
                  : "dark-btn-primary"
              }
              onClick={onFinishCourse}
              disabled={isLoading}
            >
              {isPublished ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Voltar para Rascunho
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isEditing ? "Publicar Curso" : "Finalizar Curso"}
                </>
              )}
            </Button>
          )}
          {isEditing && onDeleteCourse && (
            <Button
              onClick={onDeleteCourse}
              variant="destructive"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir Curso"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

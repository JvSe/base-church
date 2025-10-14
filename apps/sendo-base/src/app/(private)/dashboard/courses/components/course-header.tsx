"use client";

import { Button } from "@base-church/ui/components/button";
import { ArrowLeft, CheckCircle, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseHeaderProps {
  courseId: string | null;
  hasModules: boolean;
  isLoading: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
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
          <h1 className="dark-text-primary text-3xl font-bold">
            {isEditing ? "Editar Curso 📚" : "Criar Curso Completo 📚"}
          </h1>
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
              className="dark-btn-primary"
              onClick={onFinishCourse}
              disabled={isLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isEditing ? "Publicar Curso" : "Finalizar Curso"}
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

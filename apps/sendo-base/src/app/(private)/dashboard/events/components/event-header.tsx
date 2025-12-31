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

interface EventHeaderProps {
  eventId: string | null;
  isLoading: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
  isPublished?: boolean;
  onSaveDraft?: () => void;
  onFinishEvent: () => void;
  onDeleteEvent?: () => void;
}

export function EventHeader({
  eventId,
  isLoading,
  isEditing = false,
  isDeleting = false,
  isPublished = false,
  onSaveDraft,
  onFinishEvent,
  onDeleteEvent,
}: EventHeaderProps) {
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
              {isEditing ? "Editar Evento 📅" : "Criar Evento 📅"}
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
              ? "Edite as informações do seu evento"
              : "Preencha as informações para criar um novo evento"}
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
          {eventId && (
            <Button
              type="button"
              className={
                isPublished
                  ? "dark-glass dark-border hover:dark-border-hover"
                  : "dark-btn-primary"
              }
              onClick={onFinishEvent}
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
                  {isEditing ? "Publicar Evento" : "Finalizar Evento"}
                </>
              )}
            </Button>
          )}
          {isEditing && onDeleteEvent && (
            <Button
              onClick={onDeleteEvent}
              variant="destructive"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir Evento"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


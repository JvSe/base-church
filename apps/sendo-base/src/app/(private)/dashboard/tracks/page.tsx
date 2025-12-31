"use client";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { usePageTitle } from "@/src/hooks";
import {
  deleteTrack,
  getTracks,
  updateTrackStatus,
} from "@/src/lib/actions/tracks";
import { Button } from "@base-church/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Edit,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TracksPage() {
  usePageTitle("Gerenciar Trilhas");
  const queryClient = useQueryClient();

  // Fetch tracks
  const {
    data: tracksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tracks", "all"],
    queryFn: () => getTracks("all"),
    select: (data) => data.tracks,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success("Trilha excluída com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir trilha");
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      updateTrackStatus(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Target}
          title="Carregando trilhas..."
          description="Aguarde enquanto carregamos as trilhas de estudo"
        />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={Target}
          title="Erro ao carregar trilhas"
          description="Não foi possível carregar as trilhas. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  const tracks = tracksData || [];
  const publishedTracks = tracks.filter((t: any) => t.isPublished).length;
  const totalCourses = tracks.reduce(
    (sum: number, t: any) => sum + t.courses.length,
    0,
  );

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Gestão de Trilhas 🎯
              </h1>
              <p className="dark-text-secondary">
                Gerencie trilhas de estudo e organize seus cursos em sequências
              </p>
            </div>
            <Link href="/dashboard/tracks/new">
              <Button variant="success">
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Trilha
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Trilhas
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {tracks.length}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <Target className="dark-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Trilhas Publicadas
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {publishedTracks}
                </p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <Eye className="dark-success" size={24} />
              </div>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Cursos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCourses}
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-secondary" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <Layers className="dark-primary" size={24} />
            Todas as Trilhas ({tracks.length})
          </h2>

          {tracks.length > 0 ? (
            <div className="space-y-4">
              {tracks.map((track: any) => (
                <div
                  key={track.id}
                  className="dark-card dark-shadow-sm rounded-xl p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="dark-text-primary text-xl font-bold">
                          {track.title}
                        </h3>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            track.isPublished
                              ? "dark-success-bg dark-success"
                              : "dark-bg-tertiary dark-text-tertiary"
                          }`}
                        >
                          {track.isPublished ? "Publicada" : "Rascunho"}
                        </div>
                      </div>

                      {track.description && (
                        <p className="dark-text-secondary mb-4 text-sm">
                          {track.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="dark-text-tertiary" size={14} />
                          <span className="dark-text-tertiary text-sm">
                            {track.courses.length} cursos
                          </span>
                        </div>

                        {track.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="dark-text-tertiary" size={14} />
                            <span className="dark-text-tertiary text-sm">
                              {Math.round(track.duration / 60)}h
                            </span>
                          </div>
                        )}

                        {track.category && (
                          <div className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs">
                            {track.category}
                          </div>
                        )}

                        {track.level && (
                          <div className="dark-secondary-subtle-bg dark-secondary rounded-full px-2 py-1 text-xs">
                            {track.level === "beginner"
                              ? "Iniciante"
                              : track.level === "intermediate"
                                ? "Intermediário"
                                : "Avançado"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={track.isPublished ? "default" : "success"}
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: track.id,
                            isPublished: !track.isPublished,
                          })
                        }
                        disabled={togglePublishMutation.isPending}
                      >
                        {track.isPublished ? (
                          <>
                            <EyeOff className="mr-1 h-3 w-3" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            Publicar
                          </>
                        )}
                      </Button>

                      <Button size="sm" variant="info" asChild>
                        <Link href={`/dashboard/tracks/${track.id}`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Editar
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            confirm(
                              "Tem certeza que deseja excluir esta trilha?",
                            )
                          ) {
                            deleteMutation.mutate(track.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dark-card dark-shadow-sm rounded-xl p-12 text-center">
              <div className="dark-bg-secondary mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <Target className="dark-text-tertiary" size={36} />
              </div>
              <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                Nenhuma trilha cadastrada
              </h3>
              <p className="dark-text-secondary mb-6 text-sm">
                Comece criando sua primeira trilha de estudo
              </p>
              <Link href="/dashboard/tracks/new">
                <Button variant="success">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Trilha
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

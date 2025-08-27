"use client";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LessonPage() {
  const { lessonId: paramLessonId } = { lessonId: "1" };
  const [lessonId, setLessonId] = useState<string>(paramLessonId || "1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from server actions
  const lesson = {
    id: lessonId,
    title: "O Que Você Vai Aprender",
    description:
      "Neste curso de Sendo Base, vamos explorar os fundamentos ministeriais da Base Church.",
    videoUrl: "https://youtu.be/fzfOUJos-GU", // YouTube video URL
    youtubeEmbedId: "fzfOUJos-GU", // YouTube video ID for embedding
    duration: 177, // seconds
    isCompleted: false,
    isWatched: false,
    order: 1,
    module: {
      id: "1",
      title: "Introdução aos Fundamentos",
      order: 1,
      course: {
        id: "1",
        title: "Sendo Base - Fundamentos Ministeriais",
        modules: [
          {
            id: "1",
            title: "Introdução aos Fundamentos",
            order: 1,
            lessons: [
              {
                id: "1",
                title: "O Que Você Vai Aprender",
                duration: 177,
                isCompleted: true,
                isWatched: true,
                order: 1,
                youtubeEmbedId: "fzfOUJos-GU",
              },
            ],
          },
          {
            id: "2",
            title: "Princípios da Base Church",
            order: 2,
            lessons: [
              {
                id: "2",
                title: "Configurando sua base ministerial",
                duration: 1268,
                isCompleted: false,
                isWatched: false,
                order: 1,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "3",
                title: "Criando sua primeira célula",
                duration: 1016,
                isCompleted: false,
                isWatched: false,
                order: 2,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "4",
                title: "Entendendo princípios bíblicos",
                duration: 856,
                isCompleted: false,
                isWatched: false,
                order: 3,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "5",
                title: "Cultura da igreja",
                duration: 933,
                isCompleted: false,
                isWatched: false,
                order: 4,
                youtubeEmbedId: "fzfOUJos-GU",
              },
            ],
          },
          {
            id: "3",
            title: "Fundamentos do React Native",
            order: 3,
            lessons: [
              {
                id: "6",
                title: "Instalação da Unity",
                duration: 578,
                isCompleted: false,
                isWatched: false,
                order: 1,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "7",
                title: "A interface da Unity",
                duration: 1008,
                isCompleted: false,
                isWatched: false,
                order: 2,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "8",
                title: "Criando e entendendo os GameObjects",
                duration: 1016,
                isCompleted: false,
                isWatched: false,
                order: 3,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "9",
                title: "Entendendo os Componentes",
                duration: 813,
                isCompleted: false,
                isWatched: false,
                order: 4,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "10",
                title: "Iluminação",
                duration: 931,
                isCompleted: false,
                isWatched: false,
                order: 5,
                youtubeEmbedId: "fzfOUJos-GU",
              },
              {
                id: "11",
                title: "Importando assets e arquivos",
                duration: 746,
                isCompleted: false,
                isWatched: false,
                order: 6,
                youtubeEmbedId: "fzfOUJos-GU",
              },
            ],
          },
        ],
      },
    },
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteLesson = () => {
    setIsCompleted(true);
    // In real app, this would call a server action to update progress
  };

  const allLessons = lesson.module.course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })),
  );

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const filteredLessons = allLessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="dark-bg-primary flex h-screen flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* YouTube Video Player */}
        <div className="relative flex-1 overflow-hidden rounded-lg bg-black">
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="dark-glass dark-border hover:dark-border-hover text-white backdrop-blur-sm"
            >
              <Link href={`/dashboard/courses/${lesson.module.course.id}`}>
                <ArrowLeft size={16} className="mr-2" />
                Voltar ao Curso
              </Link>
            </Button>
          </div>

          <iframe
            src={`https://www.youtube.com/embed/${lesson.youtubeEmbedId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3&autohide=0&color=white&theme=dark`}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              border: "none",
              background: "#000",
            }}
          />
        </div>

        {/* Lesson Info */}
        <div className="dark-glass dark-shadow-md dark-border flex-[0.2] border-t p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-xl font-bold">
                {lesson.title}
              </h1>
              <p className="dark-text-secondary">{lesson.description}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={handleCompleteLesson}
                  className="data-[state=checked]:dark-secondary-bg data-[state=checked]:dark-border"
                />
                <span className="dark-text-tertiary text-sm">
                  Marcar como assistida
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hover:dark-bg-tertiary"
              >
                <Bookmark className="dark-text-primary" size={16} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="dark-text-tertiary flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{formatDuration(lesson.duration)}</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="dark-secondary mr-1" />
                <span>Avalie esta aula</span>
              </div>
              <div className="flex items-center">
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark-primary hover:dark-primary-hover flex items-center transition-colors"
                >
                  <svg
                    className="mr-1"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>Ver no YouTube</span>
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <MessageCircle size={16} />
                Assistente IA
              </Button>
              <Button className="dark-btn-primary">Fazer Pergunta</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="dark-glass dark-border dark-shadow-lg flex w-96 flex-col border-l">
          {/* Sidebar Header */}
          <div className="dark-border border-b p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dark-text-primary font-semibold">
                Conteúdo do Curso
              </h3>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <ChevronLeft className="dark-text-secondary" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <ChevronRight className="dark-text-secondary" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <Settings className="dark-text-secondary" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="hover:dark-bg-tertiary"
                >
                  <X className="dark-text-secondary" size={16} />
                </Button>
              </div>
            </div>

            <div className="dark-info-bg dark-info mb-4 rounded-lg p-3 text-sm">
              💡 Você possui 1 recomendação de estudo
            </div>

            <div className="relative">
              <Search
                className="dark-text-tertiary absolute top-1/2 left-3 -translate-y-1/2 transform"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar conteúdo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark-input w-full py-2 pr-4 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {lesson.module.course.modules.map((module) => (
              <div key={module.id} className="dark-border border-b">
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="dark-text-primary font-medium">
                      {module.title}
                    </h4>
                    <span className="dark-text-tertiary text-sm">
                      {module.lessons.length} aulas •{" "}
                      {formatDuration(
                        module.lessons.reduce(
                          (total, l) => total + l.duration,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pb-4">
                  {module.lessons.map((moduleLesson) => (
                    <Link
                      key={moduleLesson.id}
                      href={`/dashboard/courses/${lesson.module.course.id}/lessons/${moduleLesson.id}`}
                      className={`mx-4 flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                        moduleLesson.id === lessonId
                          ? "dark-gradient-primary text-white shadow-lg"
                          : "hover:dark-bg-tertiary hover:shadow-sm"
                      }`}
                    >
                      {moduleLesson.isCompleted ? (
                        <CheckCircle
                          size={16}
                          className="dark-success flex-shrink-0"
                        />
                      ) : moduleLesson.isWatched ? (
                        <Circle
                          size={16}
                          className="dark-primary flex-shrink-0"
                        />
                      ) : (
                        <Circle
                          size={16}
                          className="dark-text-tertiary flex-shrink-0"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            moduleLesson.id === lessonId
                              ? "text-white"
                              : "dark-text-primary"
                          }`}
                        >
                          {moduleLesson.title}
                        </p>
                      </div>

                      <span
                        className={`flex-shrink-0 text-xs ${
                          moduleLesson.id === lessonId
                            ? "text-white/80"
                            : "dark-text-tertiary"
                        }`}
                      >
                        {formatDuration(moduleLesson.duration)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
          className="dark-glass dark-border hover:dark-border-hover absolute top-4 right-4 z-10 text-white shadow-lg backdrop-blur-sm"
        >
          <Menu size={16} />
        </Button>
      )}
    </div>
  );
}

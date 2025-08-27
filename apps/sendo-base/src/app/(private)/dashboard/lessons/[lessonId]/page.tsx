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
  Maximize,
  Menu,
  MessageCircle,
  Pause,
  Play,
  Search,
  Settings,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId: paramLessonId } = await params;
  const [lessonId, setLessonId] = useState<string>(paramLessonId || "1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Mock data - in real app this would come from server actions
  const lesson = {
    id: lessonId,
    title: "O Que Você Vai Aprender",
    description:
      "Neste curso de Sendo Base, vamos explorar os fundamentos ministeriais da Base Church.",
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Sample video URL
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
              },
              {
                id: "3",
                title: "Criando sua primeira célula",
                duration: 1016,
                isCompleted: false,
                isWatched: false,
                order: 2,
              },
              {
                id: "4",
                title: "Entendendo princípios bíblicos",
                duration: 856,
                isCompleted: false,
                isWatched: false,
                order: 3,
              },
              {
                id: "5",
                title: "Cultura da igreja",
                duration: 933,
                isCompleted: false,
                isWatched: false,
                order: 4,
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
              },
              {
                id: "7",
                title: "A interface da Unity",
                duration: 1008,
                isCompleted: false,
                isWatched: false,
                order: 2,
              },
              {
                id: "8",
                title: "Criando e entendendo os GameObjects",
                duration: 1016,
                isCompleted: false,
                isWatched: false,
                order: 3,
              },
              {
                id: "9",
                title: "Entendendo os Componentes",
                duration: 813,
                isCompleted: false,
                isWatched: false,
                order: 4,
              },
              {
                id: "10",
                title: "Iluminação",
                duration: 931,
                isCompleted: false,
                isWatched: false,
                order: 5,
              },
              {
                id: "11",
                title: "Importando assets e arquivos",
                duration: 746,
                isCompleted: false,
                isWatched: false,
                order: 6,
              },
            ],
          },
        ],
      },
    },
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Mark as watched if video is more than 90% complete
      if (videoRef.current.currentTime / videoRef.current.duration > 0.9) {
        setIsWatched(true);
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoClick = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
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
        {/* Video Player */}
        <div
          className="relative flex-1 overflow-hidden rounded-lg bg-black"
          onMouseMove={handleMouseMove}
        >
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            className="h-full w-full object-contain"
            onClick={handleVideoClick}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Video Controls Overlay */}
          {showControls && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              {/* Top Controls */}
              <div className="pointer-events-auto absolute top-4 right-4 left-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="dark-glass dark-border hover:dark-border-hover text-white backdrop-blur-sm"
                >
                  <Link href={`/dashboard/courses/${lesson.module.course.id}`}>
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar
                  </Link>
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="dark-glass dark-border hover:dark-border-hover text-white backdrop-blur-sm"
                  >
                    <Settings size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="dark-glass dark-border hover:dark-border-hover text-white backdrop-blur-sm"
                  >
                    <Maximize size={16} />
                  </Button>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePlayPause}
                  className="dark-glass dark-border hover:dark-border-hover text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="pointer-events-auto absolute right-0 bottom-0 left-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="slider bg-dark-2 h-1 w-full cursor-pointer appearance-none rounded-lg"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSkip(-10)}
                    >
                      <SkipBack size={16} />
                      <span className="ml-1">10</span>
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSkip(10)}
                    >
                      <SkipForward size={16} />
                      <span className="ml-1">10</span>
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="bg-dark-1/80 hover:bg-dark-2/80 border-dark-2 border text-white backdrop-blur-sm"
                      >
                        {isMuted ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="slider bg-dark-2 h-1 w-20 cursor-pointer appearance-none rounded-lg"
                      />
                    </div>

                    <span className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-dark-1/80 hover:bg-dark-2/80 border-dark-2 border text-white backdrop-blur-sm"
                    >
                      CC
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-dark-1/80 hover:bg-dark-2/80 border-dark-2 border text-white backdrop-blur-sm"
                    >
                      <Settings size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="bg-dark-1/80 hover:bg-dark-2/80 border-dark-2 border text-white backdrop-blur-sm"
                    >
                      <Maximize size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="dark-glass dark-shadow-md dark-border border-t p-6">
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
                <span>O que você achou desta aula?</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <MessageCircle size={16} />
                Assistente IA
              </Button>
              <Button className="dark-btn-primary">Perguntar</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="dark-glass dark-border dark-shadow-lg flex w-80 flex-col border-l">
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
                      href={`/dashboard/lessons/${moduleLesson.id}`}
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

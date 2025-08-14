"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  MessageCircle,
  Play,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["1"]);

  // Mock data - in real app this would come from server actions
  const course = {
    id: params.courseId,
    title: "Sendo Base - Fundamentos Ministeriais",
    description:
      "Aprenda os fundamentos ministeriais da Base Church, criando uma base sólida para o ministério com princípios bíblicos.",
    image: "/api/placeholder/300/200",
    duration: 120,
    level: "Iniciante",
    instructor: "Pr. Robson",
    progress: 65,
    totalLessons: 32,
    completedLessons: 21,
    enrolledStudents: 15420,
    rating: 4.8,
    lastAccessed: new Date("2024-01-15"),
    modules: [
      {
        id: "1",
        title: "Introdução aos Fundamentos",
        description: "Configuração inicial e conceitos básicos",
        order: 1,
        lessons: [
          {
            id: "1",
            title: "O Que Você Vai Aprender",
            description:
              "Neste curso de Sendo Base, vamos explorar os fundamentos ministeriais da Base Church.",
            duration: 177, // seconds
            isCompleted: true,
            isWatched: true,
            order: 1,
            videoUrl: "https://example.com/video1.mp4",
          },
        ],
      },
      {
        id: "2",
        title: "Princípios da Base Church",
        description: "Fundamentos e primeiros princípios",
        order: 2,
        lessons: [
          {
            id: "2",
            title: "Configurando sua base ministerial",
            description:
              "Aprenda a configurar sua base ministerial para o ministério.",
            duration: 1268, // seconds
            isCompleted: false,
            isWatched: false,
            order: 1,
            videoUrl: "https://example.com/video2.mp4",
          },
          {
            id: "3",
            title: "Criando sua primeira célula",
            description: "Crie sua primeira célula ministerial do zero.",
            duration: 1016, // seconds
            isCompleted: false,
            isWatched: false,
            order: 2,
            videoUrl: "https://example.com/video3.mp4",
          },
          {
            id: "4",
            title: "Entendendo princípios bíblicos",
            description: "Aprenda sobre princípios bíblicos fundamentais.",
            duration: 856, // seconds
            isCompleted: false,
            isWatched: false,
            order: 3,
            videoUrl: "https://example.com/video4.mp4",
          },
          {
            id: "5",
            title: "Cultura da igreja",
            description: "Aprenda a cultura da igreja com princípios bíblicos.",
            duration: 933, // seconds
            isCompleted: false,
            isWatched: false,
            order: 4,
            videoUrl: "https://example.com/video5.mp4",
          },
        ],
      },
      {
        id: "3",
        title: "Fundamentos do React Native",
        description: "Componentes principais e navegação",
        order: 3,
        lessons: [
          {
            id: "6",
            title: "Instalação da Unity",
            description:
              "Aprenda a instalar e configurar a Unity para desenvolvimento.",
            duration: 578, // seconds
            isCompleted: false,
            isWatched: false,
            order: 1,
            videoUrl: "https://example.com/video6.mp4",
          },
          {
            id: "7",
            title: "A interface da Unity",
            description:
              "Conheça a interface principal da Unity e suas ferramentas.",
            duration: 1008, // seconds
            isCompleted: false,
            isWatched: false,
            order: 2,
            videoUrl: "https://example.com/video7.mp4",
          },
          {
            id: "8",
            title: "Criando e entendendo os GameObjects",
            description: "Aprenda sobre GameObjects e como criá-los.",
            duration: 1016, // seconds
            isCompleted: false,
            isWatched: false,
            order: 3,
            videoUrl: "https://example.com/video8.mp4",
          },
          {
            id: "9",
            title: "Entendendo os Componentes",
            description: "Conheça os componentes principais da Unity.",
            duration: 813, // seconds
            isCompleted: false,
            isWatched: false,
            order: 4,
            videoUrl: "https://example.com/video9.mp4",
          },
          {
            id: "10",
            title: "Iluminação",
            description: "Aprenda sobre iluminação e renderização na Unity.",
            duration: 931, // seconds
            isCompleted: false,
            isWatched: false,
            order: 5,
            videoUrl: "https://example.com/video10.mp4",
          },
          {
            id: "11",
            title: "Importando assets e arquivos",
            description:
              "Aprenda a importar e organizar assets no seu projeto.",
            duration: 746, // seconds
            isCompleted: false,
            isWatched: false,
            order: 6,
            videoUrl: "https://example.com/video11.mp4",
          },
        ],
      },
    ],
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getModuleProgress = (module: any) => {
    const completedLessons = module.lessons.filter(
      (lesson: any) => lesson.isCompleted,
    ).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const getTotalModuleDuration = (module: any) => {
    return module.lessons.reduce(
      (total: number, lesson: any) => total + lesson.duration,
      0,
    );
  };

  return (
    <div className="bg-background flex flex-1 gap-6 p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Course Header */}
        <div className="flex items-start space-x-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-dark-2/50"
          >
            <Link href="/dashboard/conteudos">
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Link>
          </Button>

          <div className="flex-1">
            <h1 className="text-foreground mb-2 text-2xl font-bold">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>

            <div className="text-muted-foreground flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                <span>{course.enrolledStudents.toLocaleString()} alunos</span>
              </div>
              <div className="flex items-center">
                <Star size={16} className="text-secondary mr-2" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{formatTotalDuration(course.duration)}</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="mr-2" />
                <span>{course.totalLessons} aulas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground text-lg font-semibold">
                Seu Progresso
              </h3>
              <Badge
                variant="secondary"
                className="from-secondary to-secondary-1 text-secondary-foreground bg-gradient-to-r shadow-lg"
              >
                {course.progress}% completo
              </Badge>
            </div>

            <Progress value={course.progress} className="bg-dark-2 mb-4 h-3" />

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>
                {course.completedLessons} de {course.totalLessons} aulas
                concluídas
              </span>
              <span>
                {course.totalLessons - course.completedLessons} aulas restantes
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">
              Conteúdo do curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              value={expandedModules}
              onValueChange={setExpandedModules}
              className="space-y-2"
            >
              {course.modules.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="from-primary to-primary-2 text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r text-sm font-semibold shadow-lg">
                          {module.order}
                        </div>
                        <div className="text-left">
                          <h4 className="text-foreground font-semibold">
                            {module.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {module.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                        <span>{module.lessons.length} aulas</span>
                        <span>
                          {formatDuration(getTotalModuleDuration(module))}
                        </span>
                        <Badge
                          variant="secondary"
                          className="from-secondary to-secondary-1 text-secondary-foreground bg-gradient-to-r shadow-lg"
                        >
                          {getModuleProgress(module)}%
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="hover:bg-dark-2/50 flex items-center justify-between rounded-lg p-3 transition-all duration-200 hover:shadow-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {lesson.isCompleted ? (
                              <CheckCircle
                                size={20}
                                className="text-secondary"
                              />
                            ) : lesson.isWatched ? (
                              <Circle size={20} className="text-primary" />
                            ) : (
                              <Circle
                                size={20}
                                className="text-muted-foreground"
                              />
                            )}

                            <div className="flex-1">
                              <h5 className="text-foreground font-medium">
                                {lesson.title}
                              </h5>
                              <p className="text-muted-foreground text-sm">
                                {lesson.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-muted-foreground text-sm">
                              {formatDuration(lesson.duration)}
                            </span>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className={
                                lesson.isCompleted
                                  ? "text-secondary hover:bg-secondary/10"
                                  : "hover:bg-dark-2/50"
                              }
                            >
                              <Link href={`/dashboard/aulas/${lesson.id}`}>
                                <Play size={16} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Course Info */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-6">
            <img
              src={course.image}
              alt={course.title}
              className="mb-4 h-32 w-full rounded-lg object-cover"
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Instrutor</span>
                <span className="text-foreground text-sm">
                  {course.instructor}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Nível</span>
                <Badge
                  variant="secondary"
                  className="bg-dark-1/80 text-foreground border-dark-2 border backdrop-blur-sm"
                >
                  {course.level}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Duração</span>
                <span className="text-foreground text-sm">
                  {formatTotalDuration(course.duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Avaliação</span>
                <div className="flex items-center">
                  <Star size={14} className="text-secondary mr-1" />
                  <span className="text-foreground text-sm">
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-foreground text-base">
              Ações rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 w-full shadow-lg"
              asChild
            >
              <Link
                href={`/dashboard/aulas/${course.modules[0]?.lessons[0]?.id}`}
              >
                <Play size={16} className="mr-2" />
                Continuar assistindo
              </Link>
            </Button>

            <Button
              variant="outline"
              className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50 w-full"
            >
              <MessageCircle size={16} className="mr-2" />
              Tirar dúvidas
            </Button>

            <Button
              variant="outline"
              className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50 w-full"
            >
              <Trophy size={16} className="mr-2" />
              Ver certificado
            </Button>
          </CardContent>
        </Card>

        {/* Course Stats */}
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-foreground text-base">
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-secondary" />
                <span className="text-muted-foreground text-sm">Progresso</span>
              </div>
              <span className="text-foreground text-sm font-semibold">
                {course.progress}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  Aulas concluídas
                </span>
              </div>
              <span className="text-foreground text-sm font-semibold">
                {course.completedLessons}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  Tempo assistido
                </span>
              </div>
              <span className="text-foreground text-sm font-semibold">
                {formatTotalDuration(
                  Math.round(course.duration * (course.progress / 100)),
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

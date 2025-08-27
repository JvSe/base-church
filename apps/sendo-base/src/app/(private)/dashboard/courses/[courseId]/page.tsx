"use client";

import { Button } from "@repo/ui/components/button";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Globe,
  Heart,
  MessageCircle,
  Play,
  Share,
  Star,
  Target,
  User,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from server actions
  const course = {
    id: courseId,
    title: "Fundamentos Ministeriais - Base Church",
    description:
      "Um curso abrangente sobre os fundamentos ministeriais da Base Church, cobrindo princípios bíblicos, estrutura ministerial e práticas essenciais para líderes eficazes.",
    longDescription:
      "Este curso foi desenvolvido especificamente para formar líderes sólidos na Base Church. Você aprenderá desde os princípios bíblicos fundamentais até as práticas avançadas de liderança ministerial. O conteúdo é baseado em anos de experiência pastoral e está estruturado para proporcionar uma base sólida para seu ministério.",
    image: null,
    instructor: {
      name: "Pr. Robson Silva",
      role: "Pastor Principal",
      experience: "15 anos de ministério",
      avatar: null,
      bio: "Pastor principal da Base Church há mais de 15 anos, formado em Teologia e especialista em liderança ministerial.",
    },
    level: "Iniciante",
    duration: 180, // minutes
    totalLessons: 24,
    completedLessons: 8,
    progress: 33,
    rating: 4.8,
    reviewsCount: 234,
    studentsCount: 1247,
    price: 0, // Free
    tags: ["Fundamentos", "Liderança", "Ministério", "Princípios Bíblicos"],
    certificate: true,
    lastUpdated: new Date("2024-01-10"),
    createdAt: new Date("2023-06-15"),
    objectives: [
      "Compreender os princípios bíblicos fundamentais da Base Church",
      "Desenvolver habilidades de liderança ministerial eficaz",
      "Aplicar estruturas organizacionais no ministério",
      "Criar uma base sólida para crescimento ministerial",
      "Implementar práticas de discipulado efetivas",
    ],
    requirements: [
      "Compromisso com o ministério cristão",
      "Disponibilidade de 3-4 horas semanais",
      "Acesso à internet para aulas online",
      "Bíblia para estudos práticos",
    ],
  };

  const modules = [
    {
      id: "1",
      title: "Introdução aos Fundamentos",
      description: "Visão geral dos princípios da Base Church",
      lessons: [
        {
          id: "1",
          title: "Bem-vindo à Base Church",
          duration: 8,
          completed: true,
          type: "video",
        },
        {
          id: "2",
          title: "Nossa História e Visão",
          duration: 12,
          completed: true,
          type: "video",
        },
        {
          id: "3",
          title: "Princípios Fundamentais",
          duration: 15,
          completed: true,
          type: "video",
        },
        {
          id: "4",
          title: "Leitura: Manual do Líder",
          duration: 20,
          completed: false,
          type: "reading",
        },
      ],
      duration: 55,
      completed: 3,
      total: 4,
    },
    {
      id: "2",
      title: "Estrutura Ministerial",
      description: "Como organizar e estruturar seu ministério",
      lessons: [
        {
          id: "5",
          title: "Organização Ministerial",
          duration: 18,
          completed: true,
          type: "video",
        },
        {
          id: "6",
          title: "Hierarquia e Responsabilidades",
          duration: 22,
          completed: true,
          type: "video",
        },
        {
          id: "7",
          title: "Gestão de Equipes",
          duration: 25,
          completed: true,
          type: "video",
        },
        {
          id: "8",
          title: "Exercício Prático: Estrutura",
          duration: 30,
          completed: true,
          type: "exercise",
        },
        {
          id: "9",
          title: "Comunicação Interna",
          duration: 15,
          completed: true,
          type: "video",
        },
      ],
      duration: 110,
      completed: 5,
      total: 5,
    },
    {
      id: "3",
      title: "Discipulado e Mentoria",
      description: "Técnicas eficazes de discipulado",
      lessons: [
        {
          id: "10",
          title: "Fundamentos do Discipulado",
          duration: 20,
          completed: false,
          type: "video",
        },
        {
          id: "11",
          title: "Métodos de Mentoria",
          duration: 25,
          completed: false,
          type: "video",
        },
        {
          id: "12",
          title: "Discipulado de Novos Convertidos",
          duration: 30,
          completed: false,
          type: "video",
        },
        {
          id: "13",
          title: "Avaliação: Casos Práticos",
          duration: 45,
          completed: false,
          type: "quiz",
        },
      ],
      duration: 120,
      completed: 0,
      total: 4,
    },
  ];

  const reviews = [
    {
      id: "1",
      author: "Ana Costa",
      role: "Líder de Célula",
      rating: 5,
      comment:
        "Curso transformador! Me ajudou muito a entender melhor os princípios ministeriais e aplicar no meu dia a dia.",
      date: new Date("2024-01-05"),
      avatar: null,
    },
    {
      id: "2",
      author: "Carlos Silva",
      role: "Pastor Auxiliar",
      rating: 5,
      comment:
        "Conteúdo excelente e muito bem estruturado. O Pr. Robson tem uma didática excepcional.",
      date: new Date("2023-12-20"),
      avatar: null,
    },
    {
      id: "3",
      author: "Maria Santos",
      role: "Coordenadora",
      rating: 4,
      comment:
        "Muito bom para quem está começando no ministério. Recomendo fortemente!",
      date: new Date("2023-12-15"),
      avatar: null,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "reading":
        return FileText;
      case "exercise":
        return Target;
      case "quiz":
        return CheckCircle;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Course Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-sm font-medium">
                    {course.level}
                  </span>
                  <span className="dark-success-bg dark-success rounded-full px-3 py-1 text-sm font-medium">
                    Gratuito
                  </span>
                  {course.certificate && (
                    <span className="dark-warning-bg dark-warning rounded-full px-3 py-1 text-sm font-medium">
                      📜 Certificado
                    </span>
                  )}
                </div>
                <h1 className="dark-text-primary mb-3 text-3xl font-bold">
                  {course.title}
                </h1>
                <p className="dark-text-secondary text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mb-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="dark-primary-subtle-bg rounded-full p-2">
                    <User className="dark-primary" size={16} />
                  </div>
                  <div>
                    <div className="dark-text-primary text-sm font-medium">
                      {course.instructor.name}
                    </div>
                    <div className="dark-text-tertiary text-xs">
                      {course.instructor.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="dark-warning fill-current" size={16} />
                  <span className="dark-text-primary font-semibold">
                    {course.rating}
                  </span>
                  <span className="dark-text-tertiary text-sm">
                    ({course.reviewsCount} avaliações)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary text-sm">
                    {course.studentsCount.toLocaleString()} alunos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    {formatDuration(course.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    {course.totalLessons} aulas
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">Acesso vitalício</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    Atualizado em {formatDate(course.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="dark-card dark-shadow-sm rounded-xl p-6">
              <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
                <Play className="dark-text-tertiary" size={48} />
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="mb-4 text-center">
                    <div className="dark-text-primary mb-1 text-2xl font-bold">
                      {course.progress}%
                    </div>
                    <div className="dark-text-tertiary mb-2 text-sm">
                      Concluído
                    </div>
                    <div className="dark-bg-tertiary h-2 w-full rounded-full">
                      <div
                        className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button asChild className="dark-btn-primary w-full">
                    <Link href={`/dashboard/lessons/10`}>
                      <Play className="mr-2" size={16} />
                      Continuar Assistindo
                    </Link>
                  </Button>

                  <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                    <Download className="mr-2" size={16} />
                    Baixar Recursos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    className="dark-btn-primary w-full"
                    onClick={() => setIsEnrolled(true)}
                  >
                    <Play className="mr-2" size={16} />
                    Matricular-se Gratuitamente
                  </Button>

                  <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                    <Heart className="mr-2" size={16} />
                    Adicionar aos Favoritos
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <Share className="dark-text-secondary" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <MessageCircle className="dark-text-secondary" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Navigation */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-1">
          <div className="flex items-center space-x-1">
            {[
              { id: "overview", label: "Visão Geral" },
              { id: "curriculum", label: "Conteúdo" },
              { id: "instructor", label: "Instrutor" },
              { id: "reviews", label: "Avaliações" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "dark-btn-primary"
                    : "dark-text-secondary hover:dark-text-primary"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                  <h2 className="dark-text-primary mb-4 text-xl font-bold">
                    Sobre este curso
                  </h2>
                  <p className="dark-text-secondary mb-6 leading-relaxed">
                    {course.longDescription}
                  </p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="dark-text-primary mb-3 font-semibold">
                        O que você aprenderá
                      </h3>
                      <ul className="space-y-2">
                        {course.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle
                              className="dark-success mt-0.5 flex-shrink-0"
                              size={16}
                            />
                            <span className="dark-text-secondary text-sm">
                              {objective}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="dark-text-primary mb-3 font-semibold">
                        Pré-requisitos
                      </h3>
                      <ul className="space-y-2">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target
                              className="dark-primary mt-0.5 flex-shrink-0"
                              size={16}
                            />
                            <span className="dark-text-secondary text-sm">
                              {requirement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Conteúdo do Curso
                </h2>

                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="dark-card rounded-xl p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="dark-text-primary font-semibold">
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="dark-text-tertiary">
                            {module.completed}/{module.total} aulas
                          </span>
                          <span className="dark-text-tertiary">
                            {formatDuration(module.duration)}
                          </span>
                        </div>
                      </div>
                      <p className="dark-text-secondary mb-4 text-sm">
                        {module.description}
                      </p>

                      <div className="space-y-2">
                        {module.lessons.map((lesson) => {
                          const Icon = getTypeIcon(lesson.type);
                          return (
                            <div
                              key={lesson.id}
                              className="hover:dark-bg-secondary flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle
                                    className="dark-success"
                                    size={16}
                                  />
                                ) : (
                                  <div className="dark-bg-tertiary h-4 w-4 rounded-full" />
                                )}
                                <Icon
                                  className="dark-text-tertiary"
                                  size={16}
                                />
                                <span
                                  className={`text-sm ${
                                    lesson.completed
                                      ? "dark-text-secondary"
                                      : "dark-text-primary"
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="dark-text-tertiary text-xs">
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Seu Instrutor
                </h2>

                <div className="flex items-start gap-6">
                  <div className="dark-primary-subtle-bg rounded-full p-4">
                    <User className="dark-primary" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="dark-text-primary mb-1 text-lg font-semibold">
                      {course.instructor.name}
                    </h3>
                    <p className="dark-text-secondary mb-2">
                      {course.instructor.role}
                    </p>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      {course.instructor.experience}
                    </p>
                    <p className="dark-text-secondary leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="dark-text-primary text-xl font-bold">
                    Avaliações dos Alunos
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="dark-warning fill-current" size={20} />
                    <span className="dark-text-primary text-lg font-bold">
                      {course.rating}
                    </span>
                    <span className="dark-text-tertiary">
                      ({course.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="dark-card rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="dark-primary-subtle-bg rounded-full p-2">
                          <User className="dark-primary" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <div className="dark-text-primary text-sm font-medium">
                                {review.author}
                              </div>
                              <div className="dark-text-tertiary text-xs">
                                {review.role}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`${
                                    i < review.rating
                                      ? "dark-warning fill-current"
                                      : "dark-text-tertiary"
                                  }`}
                                  size={12}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="dark-text-secondary mb-2 text-sm">
                            {review.comment}
                          </p>
                          <p className="dark-text-tertiary text-xs">
                            {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Tags */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Stats */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Estatísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Total de aulas
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Duração total
                  </span>
                  <span className="dark-primary font-semibold">
                    {formatDuration(course.duration)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Alunos matriculados
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.studentsCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Nota média
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.rating}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Cursos Relacionados
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Discipulado Avançado", rating: 4.7 },
                  { title: "Liderança Ministerial", rating: 4.9 },
                  { title: "Cultura da Igreja", rating: 4.6 },
                ].map((related, index) => (
                  <div key={index} className="dark-card rounded-lg p-3">
                    <h4 className="dark-text-primary mb-1 text-sm font-medium">
                      {related.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="dark-warning fill-current" size={12} />
                      <span className="dark-text-tertiary text-xs">
                        {related.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

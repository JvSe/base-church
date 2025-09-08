"use client";

import { getCourses, getUserProfile } from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Play,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function JornadaPage() {
  const [activeStep, setActiveStep] = useState(1);

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
    queryFn: () => getUserProfile("30d453b9-88c9-429e-9700-81d2db735f7a"),
    select: (data) => data.user,
  });

  // Fetch courses
  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    select: (data) => data.courses,
  });

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  // Calculate journey steps based on user enrollments and course categories
  const calculateJourneySteps = () => {
    if (!userData?.enrollments || !coursesData) return [];

    const categories = [
      {
        id: 1,
        title: "Fundamentos Ministeriais",
        description: "Aprenda os princípios básicos da Base Church",
        category: "fundamentos",
        icon: BookOpen,
        color: "dark-success",
        bgColor: "dark-success-bg",
        estimatedTime: "2 semanas",
      },
      {
        id: 2,
        title: "Discipulado e Mentoria",
        description: "Desenvolva habilidades de discipulado eficaz",
        category: "discipulado",
        icon: Users,
        color: "dark-primary",
        bgColor: "dark-primary-subtle-bg",
        estimatedTime: "3 semanas",
      },
      {
        id: 3,
        title: "Liderança Ministerial",
        description: "Torne-se um líder eficaz no ministério",
        category: "lideranca",
        icon: Trophy,
        color: "dark-warning",
        bgColor: "dark-warning-bg",
        estimatedTime: "4 semanas",
      },
      {
        id: 4,
        title: "Plantação de Igrejas",
        description: "Aprenda a plantar e desenvolver igrejas",
        category: "plantacao",
        icon: MapPin,
        color: "dark-secondary",
        bgColor: "dark-secondary-subtle-bg",
        estimatedTime: "6 semanas",
      },
      {
        id: 5,
        title: "Especialização Avançada",
        description: "Especialize-se em áreas específicas do ministério",
        category: "especializacao",
        icon: Award,
        color: "dark-info",
        bgColor: "dark-info-bg",
        estimatedTime: "8 semanas",
      },
    ];

    return categories.map((category) => {
      const categoryCourses = coursesData.filter((course: any) =>
        course.category
          ?.toLowerCase()
          .includes(category.category.toLowerCase()),
      );

      const userEnrollments = userData.enrollments.filter((enrollment: any) =>
        categoryCourses.some(
          (course: any) => course.id === enrollment.courseId,
        ),
      );

      const completedCourses = userEnrollments.filter(
        (e: any) => e.completedAt,
      ).length;
      const totalCourses = categoryCourses.length;
      const progress =
        totalCourses > 0
          ? Math.round((completedCourses / totalCourses) * 100)
          : 0;

      let status = "locked";
      if (progress === 100) status = "completed";
      else if (progress > 0) status = "in_progress";
      else if (category.id === 1) status = "in_progress"; // First category is always available

      return {
        ...category,
        progress,
        status,
        courses: categoryCourses.map((course: any) => {
          const enrollment = userEnrollments.find(
            (e: any) => e.courseId === course.id,
          );
          return {
            id: course.id,
            title: course.title,
            completed: enrollment?.completedAt ? true : false,
            courseId: course.id,
          };
        }),
        certificate: progress === 100,
      };
    });
  };

  const journeySteps = calculateJourneySteps();

  // Calculate achievements based on user progress
  const calculateAchievements = () => {
    if (!userData) return [];

    const achievements = [
      {
        id: "1",
        title: "Primeiro Passo",
        description: "Completou o primeiro módulo",
        icon: "🚀",
        earned: journeySteps.some((step) => step.status === "completed"),
      },
      {
        id: "2",
        title: "Fundador",
        description: "Concluiu Fundamentos Ministeriais",
        icon: "🏛️",
        earned: journeySteps[0]?.status === "completed",
      },
      {
        id: "3",
        title: "Mentor em Formação",
        description: "50% do módulo de Discipulado",
        icon: "👨‍🏫",
        earned: (journeySteps[1]?.progress ?? 0) >= 50,
      },
      {
        id: "5",
        title: "Plantador",
        description: "Concluiu Plantação de Igrejas",
        icon: "🌱",
        earned: journeySteps[3]?.status === "completed",
      },
      {
        id: "6",
        title: "Especialista",
        description: "Concluiu Especialização Avançada",
        icon: "🎯",
        earned: journeySteps[4]?.status === "completed",
      },
    ];

    return achievements;
  };

  const achievements = calculateAchievements();

  const currentStep = journeySteps.find((step) => step.id === activeStep);

  // Loading state
  if (!userData || !coursesData) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-7xl space-y-6 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Target className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Carregando sua jornada...
            </h1>
            <p className="dark-text-secondary">
              Preparando sua trilha personalizada de aprendizado
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Sua Jornada Ministerial
              </h1>
              <p className="dark-text-secondary">
                Trilha personalizada de aprendizado para seu crescimento no
                ministério
              </p>
            </div>
            <div className="text-center">
              <div className="dark-primary-subtle-bg mb-2 rounded-full p-4">
                <Target className="dark-primary" size={32} />
              </div>
              <div className="dark-text-primary text-xl font-bold">
                Nível {userData?.level || 1}
              </div>
              <div className="dark-text-tertiary text-sm">
                {userData?.role || "Membro da Comunidade"}
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {journeySteps.filter((s) => s.status === "completed").length}
              </div>
              <div className="dark-text-tertiary text-sm">
                Módulos Concluídos
              </div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {journeySteps.length > 0
                  ? Math.round(
                      journeySteps.reduce(
                        (acc, step) => acc + step.progress,
                        0,
                      ) / journeySteps.length,
                    )
                  : 0}
                %
              </div>
              <div className="dark-text-tertiary text-sm">Progresso Geral</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {achievements.filter((a) => a.earned).length}
              </div>
              <div className="dark-text-tertiary text-sm">Conquistas</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {userData?.stats?.hoursStudied || 0}h
              </div>
              <div className="dark-text-tertiary text-sm">Horas Estudadas</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Journey Timeline */}
          <div className="lg:col-span-2">
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
                <MapPin className="dark-secondary" size={24} />
                Trilha de Aprendizado
              </h2>

              <div className="space-y-6">
                {journeySteps.length > 0 ? (
                  journeySteps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`${step.bgColor} rounded-full p-3 ${
                            step.status === "completed"
                              ? "ring-2 ring-green-500"
                              : step.status === "in_progress"
                                ? "ring-2 ring-blue-500"
                                : "opacity-50"
                          }`}
                        >
                          <step.icon className={step.color} size={24} />
                        </div>
                        {index < journeySteps.length - 1 && (
                          <div
                            className={`mt-2 h-16 w-0.5 ${
                              step.status === "completed"
                                ? "dark-success-bg"
                                : step.status === "in_progress"
                                  ? "dark-primary-subtle-bg"
                                  : "dark-bg-tertiary"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <div
                          className={`dark-card dark-shadow-sm cursor-pointer rounded-xl p-6 transition-all ${
                            step.status === "locked"
                              ? "opacity-50"
                              : "hover:shadow-md"
                          }`}
                          onClick={() =>
                            step.status !== "locked" && setActiveStep(step.id)
                          }
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="dark-text-primary mb-1 text-lg font-semibold">
                                {step.title}
                              </h3>
                              <p className="dark-text-secondary mb-2 text-sm">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock
                                    className="dark-text-tertiary"
                                    size={14}
                                  />
                                  <span className="dark-text-tertiary">
                                    {step.estimatedTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen
                                    className="dark-text-tertiary"
                                    size={14}
                                  />
                                  <span className="dark-text-tertiary">
                                    {step.courses.length} cursos
                                  </span>
                                </div>
                                {step.certificate && (
                                  <div className="flex items-center gap-1">
                                    <Award className="dark-warning" size={14} />
                                    <span className="dark-warning text-xs">
                                      Certificado
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div
                                className={`mb-2 rounded-full px-3 py-1 text-xs font-medium ${
                                  step.status === "completed"
                                    ? "dark-success-bg dark-success"
                                    : step.status === "in_progress"
                                      ? "dark-primary-subtle-bg dark-primary"
                                      : "dark-bg-tertiary dark-text-tertiary"
                                }`}
                              >
                                {step.status === "completed"
                                  ? "✅ Concluído"
                                  : step.status === "in_progress"
                                    ? "🔄 Em Andamento"
                                    : "🔒 Bloqueado"}
                              </div>
                              <div className="dark-text-primary text-lg font-bold">
                                {step.progress}%
                              </div>
                            </div>
                          </div>

                          {step.progress > 0 && (
                            <div className="mt-4">
                              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    step.status === "completed"
                                      ? "dark-gradient-secondary"
                                      : "dark-gradient-primary"
                                  }`}
                                  style={{ width: `${step.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {step.status !== "locked" && (
                            <div className="mt-4 flex justify-end">
                              <Button
                                asChild
                                className={
                                  step.status === "completed"
                                    ? "dark-gradient-secondary"
                                    : "dark-btn-primary"
                                }
                                size="sm"
                              >
                                <Link href={`/catalog`}>
                                  <Play size={14} className="mr-1" />
                                  {step.status === "completed"
                                    ? "Revisar"
                                    : "Continuar"}
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
                    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <MapPin className="dark-text-tertiary" size={24} />
                    </div>
                    <h3 className="dark-text-primary mb-2 font-semibold">
                      Nenhuma jornada disponível
                    </h3>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Comece a estudar para desbloquear sua jornada ministerial
                    </p>
                    <Link href="/catalog">
                      <Button className="dark-btn-primary">
                        Explorar Cursos
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Step Details */}
            {currentStep && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                  <currentStep.icon className={currentStep.color} size={20} />
                  {currentStep.title}
                </h3>

                <div className="space-y-3">
                  {currentStep.courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {course.completed ? (
                          <CheckCircle className="dark-success" size={16} />
                        ) : (
                          <div className="dark-bg-tertiary h-4 w-4 rounded-full" />
                        )}
                        <span
                          className={`text-sm ${
                            course.completed
                              ? "dark-text-secondary"
                              : "dark-text-primary"
                          }`}
                        >
                          {course.title}
                        </span>
                      </div>
                      {!course.completed && (
                        <Button size="sm" className="dark-btn-primary" asChild>
                          <Link href={`/courses/${course.courseId}`}>
                            <Play size={12} />
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                <Trophy className="dark-warning" size={20} />
                Conquistas
              </h3>

              <div className="space-y-3">
                {achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center space-x-3 ${
                        achievement.earned ? "" : "opacity-50"
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="dark-text-primary text-sm font-medium">
                          {achievement.title}
                        </div>
                        <div className="dark-text-tertiary text-xs">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <Trophy className="dark-text-tertiary" size={20} />
                    </div>
                    <p className="dark-text-tertiary text-sm">
                      Nenhuma conquista disponível
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Estatísticas
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Tempo de estudo
                  </span>
                  <span className="dark-primary font-semibold">
                    {userData?.stats?.hoursStudied || 0}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Sequência atual
                  </span>
                  <span className="dark-error flex items-center gap-1 font-semibold">
                    <Zap size={14} />
                    {userData?.currentStreak || 0} dias
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Próxima meta
                  </span>
                  <span className="dark-warning font-semibold">
                    {journeySteps.find((step) => step.status === "in_progress")
                      ?.title || "Começar jornada"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Próximos Passos
              </h3>

              <div className="space-y-2">
                {userData?.enrollments?.some(
                  (e: any) => e.isActive && !e.completedAt,
                ) ? (
                  <Button
                    className="dark-btn-primary w-full justify-start"
                    asChild
                  >
                    <Link href="/contents">
                      <Play className="mr-2" size={16} />
                      Continuar Curso Atual
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="dark-btn-primary w-full justify-start"
                    asChild
                  >
                    <Link href="/catalog">
                      <Play className="mr-2" size={16} />
                      Explorar Cursos
                    </Link>
                  </Button>
                )}
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Users className="mr-2" size={16} />
                  Encontrar Mentor
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Calendar className="mr-2" size={16} />
                  Ver Eventos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

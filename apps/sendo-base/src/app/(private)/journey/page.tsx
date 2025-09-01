"use client";

import { Button } from "@repo/ui/components/button";
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
  const [activeStep, setActiveStep] = useState(2);

  const journeySteps = [
    {
      id: 1,
      title: "Fundamentos Ministeriais",
      description: "Aprenda os princípios básicos da Base Church",
      status: "completed",
      progress: 100,
      courses: [
        { id: "1", title: "Introdução à Base Church", completed: true },
        { id: "2", title: "Princípios Bíblicos", completed: true },
        { id: "3", title: "Estrutura Ministerial", completed: true },
      ],
      estimatedTime: "2 semanas",
      certificate: true,
      icon: BookOpen,
      color: "dark-success",
      bgColor: "dark-success-bg",
    },
    {
      id: 2,
      title: "Discipulado e Mentoria",
      description: "Desenvolva habilidades de discipulado eficaz",
      status: "in_progress",
      progress: 65,
      courses: [
        { id: "4", title: "Fundamentos do Discipulado", completed: true },
        { id: "5", title: "Técnicas de Mentoria", completed: true },
        {
          id: "6",
          title: "Discipulado de Novos Convertidos",
          completed: false,
        },
        { id: "7", title: "Liderança no Discipulado", completed: false },
      ],
      estimatedTime: "3 semanas",
      certificate: false,
      icon: Users,
      color: "dark-primary",
      bgColor: "dark-primary-subtle-bg",
    },
    {
      id: 3,
      title: "Liderança Ministerial",
      description: "Torne-se um líder eficaz no ministério",
      status: "locked",
      progress: 0,
      courses: [
        { id: "8", title: "Princípios de Liderança", completed: false },
        { id: "9", title: "Gestão de Equipes", completed: false },
        { id: "10", title: "Comunicação Eficaz", completed: false },
        { id: "11", title: "Resolução de Conflitos", completed: false },
      ],
      estimatedTime: "4 semanas",
      certificate: false,
      icon: Trophy,
      color: "dark-text-tertiary",
      bgColor: "dark-bg-tertiary",
    },
    {
      id: 4,
      title: "Plantação de Igrejas",
      description: "Aprenda a plantar e desenvolver igrejas",
      status: "locked",
      progress: 0,
      courses: [
        { id: "12", title: "Estratégias de Plantação", completed: false },
        { id: "13", title: "Desenvolvimento Comunitário", completed: false },
        { id: "14", title: "Sustentabilidade Ministerial", completed: false },
      ],
      estimatedTime: "6 semanas",
      certificate: false,
      icon: MapPin,
      color: "dark-text-tertiary",
      bgColor: "dark-bg-tertiary",
    },
    {
      id: 5,
      title: "Especialização Avançada",
      description: "Especialize-se em áreas específicas do ministério",
      status: "locked",
      progress: 0,
      courses: [
        { id: "15", title: "Ministério Jovem", completed: false },
        { id: "16", title: "Ministério Infantil", completed: false },
        { id: "17", title: "Aconselhamento Pastoral", completed: false },
        { id: "18", title: "Missões e Evangelismo", completed: false },
      ],
      estimatedTime: "8 semanas",
      certificate: false,
      icon: Award,
      color: "dark-text-tertiary",
      bgColor: "dark-bg-tertiary",
    },
  ];

  const achievements = [
    {
      id: "1",
      title: "Primeiro Passo",
      description: "Completou o primeiro módulo",
      icon: "🚀",
      earned: true,
    },
    {
      id: "2",
      title: "Fundador",
      description: "Concluiu Fundamentos Ministeriais",
      icon: "🏛️",
      earned: true,
    },
    {
      id: "3",
      title: "Mentor em Formação",
      description: "50% do módulo de Discipulado",
      icon: "👨‍🏫",
      earned: true,
    },
    {
      id: "4",
      title: "Líder Nato",
      description: "Complete Liderança Ministerial",
      icon: "👑",
      earned: false,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const currentStep = journeySteps.find((step) => step.id === activeStep);

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
              <div className="dark-text-primary text-xl font-bold">Nível 2</div>
              <div className="dark-text-tertiary text-sm">Discipulador</div>
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
                {Math.round(
                  journeySteps.reduce((acc, step) => acc + step.progress, 0) /
                    journeySteps.length,
                )}
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
                12
              </div>
              <div className="dark-text-tertiary text-sm">
                Semanas Restantes
              </div>
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
                {journeySteps.map((step, index) => (
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
                              <Link href={`/courses`}>
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
                ))}
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
                        <Button size="sm" className="dark-btn-primary">
                          <Play size={12} />
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
                {achievements.map((achievement) => (
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
                ))}
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
                  <span className="dark-primary font-semibold">42h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Sequência atual
                  </span>
                  <span className="dark-error flex items-center gap-1 font-semibold">
                    <Zap size={14} />
                    15 dias
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Próxima meta
                  </span>
                  <span className="dark-warning font-semibold">Liderança</span>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Próximos Passos
              </h3>

              <div className="space-y-2">
                <Button className="dark-btn-primary w-full justify-start">
                  <Play className="mr-2" size={16} />
                  Continuar Curso Atual
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Users className="mr-2" size={16} />
                  Encontrar Mentor
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Calendar className="mr-2" size={16} />
                  Agendar Sessão
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

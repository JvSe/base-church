"use client";

import { Button } from "@repo/ui/components/button";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  Edit,
  Flame,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  Share,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from server actions
  const user = {
    id: "1",
    name: "Pr. João Vitor Soares",
    username: "@jvsen",
    email: "joaovitorsoares12@gmail.com",
    image: null,
    role: "Pastor e Líder Ministerial",
    bio: "Pastor apaixonado por criar bases ministeriais sólidas com princípios bíblicos e liderança eficaz. Formado em Teologia pela Faculdade Batista e especialista em Gestão Ministerial.",
    location: "São Paulo, SP",
    phone: "(11) 99999-9999",
    website: "www.basechurch.com.br",
    joinDate: new Date("2019-08-22"),
    profileCompletion: 85,
    stats: {
      coursesCompleted: 12,
      certificatesEarned: 8,
      studentsImpacted: 324,
      hoursStudied: 156,
      currentStreak: 15,
      totalPoints: 2840,
    },
  };

  const achievements = [
    {
      id: "1",
      name: "Fundador",
      description: "Completou o curso de Fundamentos Ministeriais",
      icon: "🏛️",
      color: "dark-primary",
      bgColor: "dark-primary-subtle-bg",
      earnedAt: new Date("2023-01-15"),
      rarity: "comum",
    },
    {
      id: "2",
      name: "Líder de Excelência",
      description: "Formou mais de 50 líderes",
      icon: "👑",
      color: "dark-secondary",
      bgColor: "dark-secondary-subtle-bg",
      earnedAt: new Date("2023-06-20"),
      rarity: "raro",
    },
    {
      id: "3",
      name: "Mentor Especialista",
      description: "Mentorou 100+ pessoas",
      icon: "🎯",
      color: "dark-warning",
      bgColor: "dark-warning-bg",
      earnedAt: new Date("2023-09-10"),
      rarity: "épico",
    },
    {
      id: "4",
      name: "Sequência de Ouro",
      description: "30 dias consecutivos de estudo",
      icon: "🔥",
      color: "dark-error",
      bgColor: "dark-error-bg",
      earnedAt: new Date("2024-01-05"),
      rarity: "lendário",
    },
  ];

  const courses = [
    {
      id: "1",
      title: "Fundamentos Ministeriais",
      progress: 100,
      completedAt: new Date("2023-01-15"),
      certificateUrl: "#",
      instructor: "Pr. Robson",
    },
    {
      id: "2",
      title: "Cultura da Igreja",
      progress: 100,
      completedAt: new Date("2023-03-20"),
      certificateUrl: "#",
      instructor: "Pr. João",
    },
    {
      id: "3",
      title: "Discipulado Avançado",
      progress: 75,
      completedAt: null,
      certificateUrl: null,
      instructor: "Pr. Maria",
    },
    {
      id: "4",
      title: "Liderança Ministerial",
      progress: 45,
      completedAt: null,
      certificateUrl: null,
      instructor: "Pr. Carlos",
    },
  ];

  const activities = [
    {
      id: "1",
      type: "course_completed",
      title: "Concluiu o curso de Liderança Ministerial",
      description: "Obteve certificado com nota 9.5",
      timestamp: new Date("2024-01-15T10:30:00"),
      icon: Trophy,
    },
    {
      id: "2",
      type: "achievement",
      title: "Conquistou a conquista 'Mentor Especialista'",
      description: "Mentorou mais de 100 pessoas",
      timestamp: new Date("2024-01-14T16:20:00"),
      icon: Award,
    },
    {
      id: "3",
      type: "streak",
      title: "Sequência de 15 dias mantida!",
      description: "Continue assim para conquistar novos marcos",
      timestamp: new Date("2024-01-13T08:45:00"),
      icon: Flame,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dia${days > 1 ? "s" : ""} atrás`;
    if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
    return "Agora mesmo";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header Profile */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="dark-primary-subtle-bg rounded-full p-4">
                <User className="dark-primary" size={48} />
              </div>
              <div>
                <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                  {user.name}
                </h1>
                <p className="dark-text-secondary mb-2 text-lg">{user.role}</p>
                <p className="dark-text-tertiary mb-4 max-w-2xl">{user.bio}</p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="dark-text-tertiary" size={14} />
                    <span className="dark-text-tertiary">{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="dark-text-tertiary" size={14} />
                    <span className="dark-text-tertiary">
                      Desde {formatDate(user.joinDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="dark-text-tertiary" size={14} />
                    <span className="dark-text-tertiary">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <Edit size={16} />
                Editar Perfil
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <Share size={16} />
                Compartilhar
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover">
                <Settings size={16} />
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {user.stats.coursesCompleted}
              </div>
              <div className="dark-text-tertiary text-sm">
                Cursos Concluídos
              </div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {user.stats.certificatesEarned}
              </div>
              <div className="dark-text-tertiary text-sm">Certificados</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {user.stats.studentsImpacted}
              </div>
              <div className="dark-text-tertiary text-sm">
                Pessoas Impactadas
              </div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {user.stats.hoursStudied}h
              </div>
              <div className="dark-text-tertiary text-sm">Horas de Estudo</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 flex items-center justify-center gap-1 text-2xl font-bold">
                <Flame className="dark-error" size={20} />
                {user.stats.currentStreak}
              </div>
              <div className="dark-text-tertiary text-sm">Sequência Atual</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {user.stats.totalPoints.toLocaleString()}
              </div>
              <div className="dark-text-tertiary text-sm">Pontos Totais</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Achievements Section */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Trophy className="dark-secondary" size={24} />
                  Conquistas ({achievements.length})
                </h2>
                <Button className="dark-glass dark-border hover:dark-border-hover">
                  Ver Todas
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="dark-card dark-shadow-sm rounded-xl p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`${achievement.bgColor} flex-shrink-0 rounded-full p-3`}
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h3 className="dark-text-primary font-semibold">
                            {achievement.name}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              achievement.rarity === "lendário"
                                ? "dark-error-bg dark-error"
                                : achievement.rarity === "épico"
                                  ? "dark-warning-bg dark-warning"
                                  : achievement.rarity === "raro"
                                    ? "dark-secondary-bg dark-secondary"
                                    : "dark-primary-subtle-bg dark-primary"
                            }`}
                          >
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="dark-text-tertiary mb-2 text-sm">
                          {achievement.description}
                        </p>
                        <p className="dark-text-tertiary text-xs">
                          Conquistado em {formatDate(achievement.earnedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Progress */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <BookOpen className="dark-primary" size={24} />
                  Meus Cursos
                </h2>
                <Button className="dark-glass dark-border hover:dark-border-hover">
                  Ver Todos
                </Button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="dark-bg-secondary rounded-lg p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="dark-text-primary mb-1 font-semibold">
                          {course.title}
                        </h3>
                        <p className="dark-text-tertiary text-sm">
                          Instrutor: {course.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        {course.completedAt ? (
                          <div className="flex items-center gap-2">
                            <span className="dark-success text-sm font-medium">
                              Concluído
                            </span>
                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                            >
                              <Download size={14} className="mr-1" />
                              Certificado
                            </Button>
                          </div>
                        ) : (
                          <span className="dark-primary text-sm font-medium">
                            {course.progress}% completo
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="dark-bg-tertiary h-2 w-full rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          course.progress === 100
                            ? "dark-gradient-secondary"
                            : "dark-gradient-primary"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
                <Zap className="dark-info" size={24} />
                Atividade Recente
              </h2>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-2">
                      <activity.icon className="dark-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="dark-text-primary mb-1 font-medium">
                        {activity.title}
                      </h3>
                      <p className="dark-text-tertiary mb-1 text-sm">
                        {activity.description}
                      </p>
                      <p className="dark-text-tertiary text-xs">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                <Target className="dark-warning" size={20} />
                Completar Perfil
              </h3>

              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="dark-text-secondary">Progresso</span>
                  <span className="dark-primary font-semibold">
                    {user.profileCompletion}%
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 rounded-full">
                  <div
                    className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${user.profileCompletion}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start text-sm">
                  <Plus className="mr-2" size={14} />
                  Adicionar foto de perfil
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start text-sm">
                  <Plus className="mr-2" size={14} />
                  Adicionar habilidades
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start text-sm">
                  <Plus className="mr-2" size={14} />
                  Conectar redes sociais
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Informações de Contato
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="dark-text-tertiary" size={16} />
                  <span className="dark-text-secondary text-sm">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="dark-text-tertiary" size={16} />
                  <span className="dark-text-secondary text-sm">
                    {user.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="dark-text-tertiary" size={16} />
                  <span className="dark-text-secondary text-sm">
                    {user.website}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="dark-text-tertiary" size={16} />
                  <span className="dark-text-secondary text-sm">
                    {user.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Ações Rápidas
              </h3>

              <div className="space-y-2">
                <Button className="dark-btn-primary w-full justify-start">
                  <BookOpen className="mr-2" size={16} />
                  Continuar Estudos
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Download className="mr-2" size={16} />
                  Baixar Certificados
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <Share className="mr-2" size={16} />
                  Compartilhar Perfil
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                  <MessageCircle className="mr-2" size={16} />
                  Falar com Mentor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

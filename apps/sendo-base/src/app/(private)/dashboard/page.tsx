"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  Clock,
  GraduationCap,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCachedDashboardAnalytics,
  getCachedDashboardStats,
} from "../../../lib/actions";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalCertificates: number;
  activeStudents: number;
  completedCourses: number;
  averageRating: number;
  monthlyGrowth: number;
  recentActivity: Array<{
    id: string;
    type: "enrollment" | "completion" | "certificate";
    studentName: string;
    courseName: string;
    timestamp: Date;
  }>;
}

interface DashboardAnalytics {
  completionRate: number;
  averageCourseDuration: number;
  studentSatisfaction: number;
  monthlyRetention: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar dados em paralelo com cache
        const [statsResult, analyticsResult] = await Promise.all([
          getCachedDashboardStats(),
          getCachedDashboardAnalytics(),
        ]);

        if (statsResult.success && analyticsResult.success) {
          setStats(statsResult.stats || null);
          setAnalytics(analyticsResult.analytics || null);
        } else {
          setError(
            statsResult.error ||
              analyticsResult.error ||
              "Erro ao carregar dados",
          );
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Erro interno do servidor");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="dark-text-primary mb-4 text-xl font-semibold">
              Carregando Dashboard...
            </div>
            <div className="dark-text-secondary">
              Aguarde enquanto carregamos os dados.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="dark-text-primary mb-4 text-xl font-semibold">
              Erro ao carregar dashboard
            </div>
            <div className="dark-text-secondary mb-4">
              {error || "Tente novamente mais tarde."}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="dark-primary-bg dark-primary-text hover:dark-primary-bg-hover rounded-lg px-4 py-2 font-medium transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ActivityItem = ({
    activity,
  }: {
    activity: DashboardStats["recentActivity"][0];
  }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case "enrollment":
          return <Users className="dark-primary h-4 w-4" />;
        case "completion":
          return <GraduationCap className="dark-success h-4 w-4" />;
        case "certificate":
          return <Award className="dark-warning h-4 w-4" />;
        default:
          return <Clock className="dark-text-tertiary h-4 w-4" />;
      }
    };

    const getActivityText = () => {
      switch (activity.type) {
        case "enrollment":
          return `${activity.studentName} se inscreveu em ${activity.courseName}`;
        case "completion":
          return `${activity.studentName} completou ${activity.courseName}`;
        case "certificate":
          return `${activity.studentName} recebeu certificado de ${activity.courseName}`;
        default:
          return "Atividade desconhecida";
      }
    };

    const getTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - activity.timestamp.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days > 0) return `${days}d atrás`;
      if (hours > 0) return `${hours}h atrás`;
      if (minutes > 0) return `${minutes}min atrás`;
      return "Agora";
    };

    return (
      <div className="dark-card dark-shadow-sm rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="dark-primary-subtle-bg rounded-lg p-2">
            {getActivityIcon()}
          </div>
          <div className="flex-1">
            <p className="dark-text-primary text-sm font-medium">
              {getActivityText()}
            </p>
            <p className="dark-text-tertiary text-xs">{getTimeAgo()}</p>
          </div>
        </div>
      </div>
    );
  };

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
                Dashboard Administrativo 📊
              </h1>
              <p className="dark-text-secondary">
                Gerencie sua plataforma de cursos e acompanhe o progresso dos
                alunos
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Alunos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.totalStudents.toLocaleString()}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <Users className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.monthlyGrowth > 0 ? "+" : ""}
                {stats.monthlyGrowth}% este mês
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Cursos Ativos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.totalCourses > 0
                  ? `${stats.totalCourses} cursos ativos`
                  : "Nenhum curso ativo"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Certificados Emitidos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.totalCertificates.toLocaleString()}
                </p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Award className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.totalCertificates > 0
                  ? `${stats.totalCertificates} certificados emitidos`
                  : "Nenhum certificado emitido"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Avaliação Média
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.averageRating}/5
                </p>
              </div>
              <div className="dark-info-bg rounded-xl p-3">
                <Star className="dark-info" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.averageRating > 0
                  ? `${stats.averageRating}/5 avaliação média`
                  : "Sem avaliações"}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Alunos Ativos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.activeStudents.toLocaleString()}
                </p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <TrendingUp className="dark-success" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.activeStudents > 0
                  ? `${stats.activeStudents} alunos ativos`
                  : "Nenhum aluno ativo"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Cursos Completados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.completedCourses.toLocaleString()}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <GraduationCap className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.completedCourses > 0
                  ? `${stats.completedCourses} cursos completados`
                  : "Nenhum curso completado"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Crescimento Mensal
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {stats.monthlyGrowth}%
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <BarChart3 className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {stats.monthlyGrowth > 0 ? "+" : ""}
                {stats.monthlyGrowth}% vs mês anterior
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
              <Clock className="dark-info" size={24} />
              Atividade Recente
            </h2>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="dark-card dark-shadow-sm rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="dark-primary-subtle-bg rounded-lg p-2">
                      <Clock className="dark-text-tertiary h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="dark-text-primary text-sm font-medium">
                        Nenhuma atividade recente
                      </p>
                      <p className="dark-text-tertiary text-xs">
                        As atividades aparecerão aqui quando houver movimentação
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Analytics */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
              <BarChart3 className="dark-secondary" size={24} />
              Análise Rápida
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm font-medium">
                    Taxa de Conclusão
                  </span>
                  <span className="dark-text-primary font-semibold">
                    {analytics?.completionRate || 0}%
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div
                    className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analytics?.completionRate || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm font-medium">
                    Tempo Médio de Curso
                  </span>
                  <span className="dark-text-primary font-semibold">
                    {analytics?.averageCourseDuration || 0}h
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div
                    className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((analytics?.averageCourseDuration || 0) * 20, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm font-medium">
                    Satisfação dos Alunos
                  </span>
                  <span className="dark-text-primary font-semibold">
                    {analytics?.studentSatisfaction || 0}%
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div
                    className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analytics?.studentSatisfaction || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm font-medium">
                    Retenção Mensal
                  </span>
                  <span className="dark-text-primary font-semibold">
                    {analytics?.monthlyRetention || 0}%
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div
                    className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analytics?.monthlyRetention || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

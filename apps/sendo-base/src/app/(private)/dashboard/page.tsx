"use client";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { usePageTitle } from "@/src/hooks";
import { useQuery } from "@tanstack/react-query";
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
import {
  getDashboardAnalytics,
  getDashboardStats,
  testDashboardData,
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

export default function DashboardPage() {
  usePageTitle("Dashboard");

  // Fetch dashboard stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    select: (data) => data.stats,
  });

  // Fetch dashboard analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
    select: (data) => data.analytics,
  });

  // Test dashboard data
  const {
    data: testData,
    isLoading: testLoading,
    error: testError,
  } = useQuery({
    queryKey: ["test-dashboard-data"],
    queryFn: testDashboardData,
    select: (data) => data.data,
  });

  const isLoading = statsLoading || analyticsLoading;
  const error = statsError || analyticsError;

  // Log para debug
  console.log("🔍 Dashboard Debug:", {
    statsData,
    analyticsData,
    testData,
    statsError,
    analyticsError,
    testError,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={BarChart3}
          title="Carregando Dashboard..."
          description="Aguarde enquanto carregamos os dados."
        />
      </PageLayout>
    );
  }

  if (error || !statsData) {
    return (
      <PageLayout>
        <ErrorState
          icon={BarChart3}
          title="Erro ao carregar dashboard"
          description={error?.message || "Tente novamente mais tarde."}
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
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
    <PageLayout spacing="relaxed">
      <PageHeader
        title="Dashboard Administrativo 📊"
        description="Gerencie sua plataforma de cursos e acompanhe o progresso dos alunos"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Total de Alunos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {(statsData?.totalStudents || 0).toLocaleString()}
              </p>
            </div>
            <div className="dark-primary-subtle-bg rounded-xl p-3">
              <Users className="dark-primary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.monthlyGrowth || 0) > 0 ? "+" : ""}
              {statsData?.monthlyGrowth || 0}% este mês
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
                {statsData?.totalCourses || 0}
              </p>
            </div>
            <div className="dark-secondary-subtle-bg rounded-xl p-3">
              <BookOpen className="dark-secondary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.totalCourses || 0) > 0
                ? `${statsData?.totalCourses} cursos ativos`
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
                {(statsData?.totalCertificates || 0).toLocaleString()}
              </p>
            </div>
            <div className="dark-warning-bg rounded-xl p-3">
              <Award className="dark-warning" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.totalCertificates || 0) > 0
                ? `${statsData?.totalCertificates} certificados emitidos`
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
                {statsData?.averageRating}/5
              </p>
            </div>
            <div className="dark-info-bg rounded-xl p-3">
              <Star className="dark-info" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.averageRating || 0) > 0
                ? `${statsData?.averageRating}/5 avaliação média`
                : "Sem avaliações"}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Alunos Ativos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {(statsData?.activeStudents || 0).toLocaleString()}
              </p>
            </div>
            <div className="dark-success-bg rounded-xl p-3">
              <TrendingUp className="dark-success" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.activeStudents || 0) > 0
                ? `${statsData?.activeStudents} alunos ativos`
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
                {(statsData?.completedCourses || 0).toLocaleString()}
              </p>
            </div>
            <div className="dark-primary-subtle-bg rounded-xl p-3">
              <GraduationCap className="dark-primary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.completedCourses || 0) > 0
                ? `${statsData?.completedCourses} cursos completados`
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
                {statsData?.monthlyGrowth || 0}%
              </p>
            </div>
            <div className="dark-secondary-subtle-bg rounded-xl p-3">
              <BarChart3 className="dark-secondary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {(statsData?.monthlyGrowth || 0) > 0 ? "+" : ""}
              {statsData?.monthlyGrowth || 0}% vs mês anterior
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <Clock className="dark-info" size={24} />
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {(statsData?.recentActivity?.length || 0) > 0 ? (
              statsData?.recentActivity
                ?.splice(0, 4)
                .map((activity) => (
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
                  {analyticsData?.completionRate || 0}%
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                <div
                  className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analyticsData?.completionRate || 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="dark-text-secondary text-sm font-medium">
                  Tempo Médio de Curso
                </span>
                <span className="dark-text-primary font-semibold">
                  {analyticsData?.averageCourseDuration || 0}h
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                <div
                  className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((analyticsData?.averageCourseDuration || 0) * 20, 100)}%`,
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
                  {analyticsData?.studentSatisfaction || 0}%
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                <div
                  className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${analyticsData?.studentSatisfaction || 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="dark-text-secondary text-sm font-medium">
                  Retenção Mensal
                </span>
                <span className="dark-text-primary font-semibold">
                  {analyticsData?.monthlyRetention || 0}%
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                <div
                  className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${analyticsData?.monthlyRetention || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

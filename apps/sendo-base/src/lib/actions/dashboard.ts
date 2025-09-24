"use server";

import { prisma } from "@base-church/db";
import { revalidatePath, unstable_cache } from "next/cache";

// Dashboard Actions
export async function getDashboardStats() {
  try {
    console.log("🔍 Iniciando busca de estatísticas do dashboard...");

    // Buscar estatísticas básicas em paralelo com cache
    const [
      totalStudents,
      totalCourses,
      totalCertificates,
      totalEnrollments,
      completedEnrollments,
      activeStudents,
      averageRating,
      recentEnrollments,
      recentCompletions,
      recentCertificates,
    ] = await Promise.all([
      // Total de estudantes (usuários com role MEMBROS)
      prisma.user.count({
        where: { role: "MEMBROS" },
      }),

      // Total de cursos publicados
      prisma.course.count({
        where: { isPublished: true },
      }),

      // Total de certificados emitidos
      prisma.certificate.count(),

      // Total de matrículas
      prisma.enrollment.count(),

      // Cursos completados (matrículas com completedAt)
      prisma.enrollment.count({
        where: { completedAt: { not: null } },
      }),

      // Alunos ativos (com atividade nos últimos 30 dias)
      prisma.user.count({
        where: {
          role: "MEMBROS",
          OR: [
            {
              enrollments: {
                some: {
                  lastAccessedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
            {
              progress: {
                some: {
                  updatedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          ],
        },
      }),

      // Avaliação média dos cursos
      prisma.courseReview.aggregate({
        _avg: { rating: true },
      }),

      // Matrículas recentes (últimas 10)
      prisma.enrollment.findMany({
        take: 10,
        where: {
          enrolledAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
          },
        },
        include: {
          user: {
            select: { name: true },
          },
          course: {
            select: { title: true },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),

      // Completions recentes (últimas 10)
      prisma.enrollment.findMany({
        take: 10,
        where: {
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
          },
        },
        include: {
          user: {
            select: { name: true },
          },
          course: {
            select: { title: true },
          },
        },
        orderBy: { completedAt: "desc" },
      }),

      // Certificados recentes (últimos 10)
      prisma.certificate.findMany({
        take: 10,
        where: {
          issuedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
          },
        },
        include: {
          user: {
            select: { name: true },
          },
          course: {
            select: { title: true },
          },
        },
        orderBy: { issuedAt: "desc" },
      }),
    ]);

    // Calcular crescimento mensal (comparar com mês anterior)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [enrollmentsThisMonth, enrollmentsLastMonth] = await Promise.all([
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    const monthlyGrowth =
      enrollmentsLastMonth > 0
        ? Math.round(
            ((enrollmentsThisMonth - enrollmentsLastMonth) /
              enrollmentsLastMonth) *
              100 *
              10,
          ) / 10
        : 0;

    // Processar atividades recentes
    const recentActivity = [
      ...recentEnrollments.map((enrollment) => ({
        id: `enrollment-${enrollment.id}`,
        type: "enrollment" as const,
        studentName: enrollment.user.name || "Usuário",
        courseName: enrollment.course.title,
        timestamp: enrollment.enrolledAt,
      })),
      ...recentCompletions.map((completion) => ({
        id: `completion-${completion.id}`,
        type: "completion" as const,
        studentName: completion.user.name || "Usuário",
        courseName: completion.course.title,
        timestamp: completion.completedAt!,
      })),
      ...recentCertificates.map((certificate) => ({
        id: `certificate-${certificate.id}`,
        type: "certificate" as const,
        studentName: certificate.user.name || "Usuário",
        courseName: certificate.course.title,
        timestamp: certificate.issuedAt,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    const stats = {
      totalStudents,
      totalCourses,
      totalCertificates,
      activeStudents,
      completedCourses: completedEnrollments,
      averageRating: averageRating._avg.rating
        ? Math.round(averageRating._avg.rating * 10) / 10
        : 0,
      monthlyGrowth,
      recentActivity,
    };

    console.log("📊 Estatísticas calculadas:", {
      totalStudents,
      totalCourses,
      totalCertificates,
      activeStudents,
      completedCourses: completedEnrollments,
      averageRating: averageRating._avg.rating,
      monthlyGrowth,
    });

    return { success: true, stats };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getDashboardAnalytics() {
  try {
    // Buscar dados para análises mais detalhadas com otimizações
    const [
      completionRate,
      averageCourseDuration,
      studentSatisfaction,
      monthlyRetention,
    ] = await Promise.all([
      // Taxa de conclusão
      (async () => {
        const totalEnrollments = await prisma.enrollment.count();
        const completedEnrollments = await prisma.enrollment.count({
          where: { completedAt: { not: null } },
        });
        return totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0;
      })(),

      // Duração média dos cursos
      (async () => {
        const avgDuration = await prisma.course.aggregate({
          where: { isPublished: true },
          _avg: { duration: true },
        });
        return avgDuration._avg.duration
          ? Math.round((avgDuration._avg.duration / 60) * 10) / 10
          : 0;
      })(),

      // Satisfação dos alunos (baseada nas avaliações)
      (async () => {
        const totalReviews = await prisma.courseReview.count();
        const positiveReviews = await prisma.courseReview.count({
          where: { rating: { gte: 4 } },
        });
        return totalReviews > 0
          ? Math.round((positiveReviews / totalReviews) * 100)
          : 0;
      })(),

      // Retenção mensal (usuários que continuaram ativos)
      (async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const activeLastMonth = await prisma.user.count({
          where: {
            role: "MEMBROS",
            enrollments: {
              some: {
                enrolledAt: {
                  lt: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  ),
                },
                lastAccessedAt: {
                  gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  ),
                },
              },
            },
          },
        });

        const totalLastMonth = await prisma.user.count({
          where: {
            role: "MEMBROS",
            enrollments: {
              some: {
                enrolledAt: {
                  lt: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  ),
                },
              },
            },
          },
        });

        return totalLastMonth > 0
          ? Math.round((activeLastMonth / totalLastMonth) * 100)
          : 0;
      })(),
    ]);

    return {
      success: true,
      analytics: {
        completionRate,
        averageCourseDuration,
        studentSatisfaction,
        monthlyRetention,
      },
    };
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Versões com cache para melhor performance
export const getCachedDashboardStats = unstable_cache(
  async () => {
    return getDashboardStats();
  },
  ["dashboard-stats"],
  {
    revalidate: 300, // Cache por 5 minutos
    tags: ["dashboard"],
  },
);

export const getCachedDashboardAnalytics = unstable_cache(
  async () => {
    return getDashboardAnalytics();
  },
  ["dashboard-analytics"],
  {
    revalidate: 600, // Cache por 10 minutos
    tags: ["dashboard"],
  },
);

// Função para invalidar cache do dashboard
export async function revalidateDashboard() {
  revalidatePath("/dashboard");
  return { success: true };
}

// Função de teste para verificar dados do banco
export async function testDashboardData() {
  try {
    console.log("🧪 Testando dados do dashboard...");

    // Verificar usuários
    const totalUsers = await prisma.user.count();
    const usersWithRoleMEMBROS = await prisma.user.count({
      where: { role: "MEMBROS" },
    });

    // Verificar cursos
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({
      where: { isPublished: true },
    });

    // Verificar matrículas
    const totalEnrollments = await prisma.enrollment.count();

    console.log("📊 Dados encontrados:", {
      totalUsers,
      usersWithRoleMEMBROS,
      totalCourses,
      publishedCourses,
      totalEnrollments,
    });

    return {
      success: true,
      data: {
        totalUsers,
        usersWithRoleMEMBROS,
        totalCourses,
        publishedCourses,
        totalEnrollments,
      },
    };
  } catch (error) {
    console.error("Erro ao testar dados:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

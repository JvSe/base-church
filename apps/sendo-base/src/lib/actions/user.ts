"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { cleanCpf } from "../helpers/auth.helper";

// User Profile Actions
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
  },
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
        progress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        stats: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" };
  }
}

export type UpdateUserProfileInput = {
  name?: string;
  cpf?: string;
  birthDate?: string;
  bio?: string;
  phone?: string;
  // Address fields
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export async function updateUserProfileData({
  userId,
  data,
}: {
  userId: string;
  data: UpdateUserProfileInput;
}) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/account");
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: "Failed to update user profile" };
  }
}

export async function updateUserEmail({
  userId,
  newEmail,
}: {
  userId: string;
  newEmail: string;
}) {
  try {
    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        error: "Email já está em uso por outro usuário",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: "Failed to update email" };
  }
}

export async function updateUserPassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    // In a real app, you would verify the current password here
    // For now, we'll just update the password
    // You should hash the new password before storing it

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // password: hashedNewPassword, // Hash this in production
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: "Failed to update password" };
  }
}

// Default notification settings
const DEFAULT_NOTIFICATION_SETTINGS = {
  email: {
    courseUpdates: true,
    newCourses: true,
    eventReminders: true,
    communityPosts: false,
    achievements: true,
    weeklyDigest: true,
  },
  push: {
    courseUpdates: true,
    newCourses: false,
    eventReminders: true,
    communityPosts: false,
    achievements: true,
  },
  sms: {
    eventReminders: false,
    urgentUpdates: false,
  },
};

export async function updateUserNotifications({
  userId,
  settings,
}: {
  userId: string;
  settings: {
    email: {
      courseUpdates: boolean;
      newCourses: boolean;
      eventReminders: boolean;
      communityPosts: boolean;
      achievements: boolean;
      weeklyDigest: boolean;
    };
    push: {
      courseUpdates: boolean;
      newCourses: boolean;
      eventReminders: boolean;
      communityPosts: boolean;
      achievements: boolean;
    };
    sms: {
      eventReminders: boolean;
      urgentUpdates: boolean;
    };
  };
}) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        notificationSettings: settings,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: "Failed to update notification settings" };
  }
}

// User Stats Actions
export async function updateUserStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        certificates: true,
        progress: {
          where: { isCompleted: true },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const coursesCompleted = user.enrollments.filter(
      (e) => e.completedAt,
    ).length;
    const certificatesEarned = user.certificates.length;
    const hoursStudied = user.enrollments.reduce((total, enrollment) => {
      return total + (enrollment.course?.duration || 0);
    }, 0);

    // Calculate current streak (simplified - would need more complex logic in real app)
    const currentStreak = 0; // Placeholder

    await prisma.userStats.upsert({
      where: { userId },
      update: {
        coursesCompleted,
        certificatesEarned,
        hoursStudied: Math.round(hoursStudied / 60), // Convert minutes to hours
        currentStreak,
        lastActivityAt: new Date(),
      },
      create: {
        userId,
        coursesCompleted,
        certificatesEarned,
        hoursStudied: Math.round(hoursStudied / 60),
        currentStreak,
        lastActivityAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update user stats" };
  }
}

// User Management Actions
export async function getCurrentUser({ userID }: { userID: string }): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        role: true,
        isPastor: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Dados do usuário formatados para o frontend
    const userData = {
      id: user.id,
      name: user.name!,
      cpf: user.cpf!,
      email: user.email || undefined,
      role: user.role as "MEMBROS" | "LIDER",
      isPastor: user.isPastor || false,
      phone: user.phone || undefined,
      createdAt: user.createdAt,
    };

    return { success: true, user: userData };
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getUserByCpf(cpf: string) {
  try {
    const cleanCpfValue = cleanCpf(cpf);

    const user = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        image: true,
        bio: true,
        phone: true,
        birthDate: true,
        joinDate: true,
        profileCompletion: true,
        currentStreak: true,
        totalPoints: true,
        level: true,
        experience: true,
        notificationSettings: true,
        cep: true,
        street: true,
        number: true,
        complement: true,
        neighborhood: true,
        city: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Get user by CPF error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getLeaders() {
  try {
    const leaders = await prisma.user.findMany({
      where: {
        role: "LIDER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPastor: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, leaders };
  } catch (error) {
    console.error("Error getting leaders:", error);
    return { success: false, error: "Erro ao buscar líderes" };
  }
}

export async function getAllStudents() {
  try {
    const students = await prisma.user.findMany({
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        certificates: true,
        stats: true,
        progress: {
          include: {
            lesson: true,
          },
        },
      },
      orderBy: {
        joinDate: "desc",
      },
    });

    // Transformar dados para o formato esperado pela interface
    const transformedStudents = students.map((student) => ({
      id: student.id,
      name: student.name || "Nome não informado",
      email: student.email || "Email não informado",
      phone: student.phone,
      cpf: student.cpf || "CPF não informado",
      joinDate: student.joinDate,
      role: student.role as "MEMBROS" | "LIDER",
      isPastor: student.isPastor || false,
      profileCompletion: student.profileCompletion || 0,
      coursesEnrolled: student.enrollments?.length || 0,
      coursesCompleted:
        student.enrollments?.filter((e) => e.completedAt).length || 0,
      certificatesEarned: student.certificates?.length || 0,
      lastActivity: student.stats?.lastActivityAt || student.updatedAt,
      status: student.stats?.lastActivityAt
        ? new Date().getTime() -
            new Date(student.stats.lastActivityAt).getTime() <
          7 * 24 * 60 * 60 * 1000
          ? "active"
          : "inactive"
        : ("inactive" as "active" | "inactive" | "suspended"),
    }));

    return { success: true, students: transformedStudents };
  } catch (error) {
    console.error("Error getting all students:", error);
    return { success: false, error: "Erro ao buscar alunos" };
  }
}

export async function getStudentById(studentId: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
        stats: true,
        progress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        notifications: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!student) {
      return { success: false, error: "Aluno não encontrado" };
    }

    return { success: true, student };
  } catch (error) {
    console.error("Error getting student by ID:", error);
    return { success: false, error: "Erro ao buscar aluno" };
  }
}

export async function updateStudentStatus(
  studentId: string,
  status: "active" | "inactive" | "suspended",
) {
  try {
    // Como não temos um campo status direto, vamos usar a última atividade
    const now = new Date();
    let lastActivityAt = now;

    if (status === "inactive") {
      // Definir como inativo há mais de 7 dias
      lastActivityAt = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
    } else if (status === "suspended") {
      // Para suspenso, vamos usar uma data muito antiga
      lastActivityAt = new Date(0);
    }

    // Atualizar ou criar stats do usuário
    await prisma.userStats.upsert({
      where: { userId: studentId },
      update: { lastActivityAt },
      create: {
        userId: studentId,
        lastActivityAt,
      },
    });

    revalidatePath("/dashboard/students");
    return { success: true, message: "Status do aluno atualizado com sucesso" };
  } catch (error) {
    console.error("Error updating student status:", error);
    return { success: false, error: "Erro ao atualizar status do aluno" };
  }
}

export async function deleteStudent(studentId: string) {
  try {
    // Verificar se o usuário existe
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: true,
        progress: true,
        certificates: true,
        subscriptions: true,
        notifications: true,
        forumPosts: true,
        forumComments: true,
        eventEnrollments: true,
        eventReviews: true,
        courseReviews: true,
        achievements: true,
        stats: true,
      },
    });

    if (!student) {
      return { success: false, error: "Aluno não encontrado" };
    }

    // Usar transação para garantir que tudo seja deletado atomicamente
    await prisma.$transaction(async (tx) => {
      // 1. Deletar progresso de lições
      await tx.lessonProgress.deleteMany({
        where: { userId: studentId },
      });

      // 2. Deletar matrículas
      await tx.enrollment.deleteMany({
        where: { userId: studentId },
      });

      // 3. Deletar certificados
      await tx.certificate.deleteMany({
        where: { userId: studentId },
      });

      // 4. Deletar assinaturas
      await tx.subscription.deleteMany({
        where: { userId: studentId },
      });

      // 5. Deletar notificações
      await tx.notification.deleteMany({
        where: { userId: studentId },
      });

      // 6. Deletar comentários do fórum
      await tx.forumComment.deleteMany({
        where: { userId: studentId },
      });

      // 7. Deletar posts do fórum
      await tx.forumPost.deleteMany({
        where: { userId: studentId },
      });

      // 8. Deletar inscrições em eventos
      await tx.eventEnrollment.deleteMany({
        where: { userId: studentId },
      });

      // 9. Deletar avaliações de eventos
      await tx.eventReview.deleteMany({
        where: { userId: studentId },
      });

      // 10. Deletar avaliações de cursos
      await tx.courseReview.deleteMany({
        where: { userId: studentId },
      });

      // 11. Deletar conquistas do usuário
      await tx.userAchievement.deleteMany({
        where: { userId: studentId },
      });

      // 12. Deletar estatísticas do usuário
      await tx.userStats.deleteMany({
        where: { userId: studentId },
      });

      // 13. Atualizar matrículas aprovadas por este usuário (se for líder/pastor)
      await tx.enrollment.updateMany({
        where: { approvedBy: studentId },
        data: { approvedBy: null },
      });

      // 14. Atualizar cursos criados por este usuário (se for instrutor)
      // Nota: Não deletamos os cursos, apenas removemos a referência
      await tx.course.updateMany({
        where: { instructorId: studentId },
        data: { instructorId: null },
      });

      // 15. Atualizar eventos criados por este usuário (se for instrutor)
      await tx.event.updateMany({
        where: { instructorId: studentId },
        data: { instructorId: null },
      });

      // 16. Finalmente, deletar o usuário
      await tx.user.delete({
        where: { id: studentId },
      });
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message:
        "Aluno e todos os dados relacionados foram excluídos com sucesso",
    };
  } catch (error) {
    console.error("Error deleting student:", error);
    return {
      success: false,
      error: "Erro ao excluir aluno e dados relacionados",
    };
  }
}

export async function updateUserRole(
  userId: string,
  role: "MEMBROS" | "LIDER",
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Criar notificação para o usuário
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Função Atualizada",
        message: `Sua função foi alterada para ${role === "MEMBROS" ? "Membro" : "Líder"}`,
        type: "info",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: "Função do usuário atualizada com sucesso",
      user,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Erro ao atualizar função do usuário" };
  }
}

export async function updateUserPastorStatus(
  userId: string,
  isPastor: boolean,
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isPastor },
    });

    // Criar notificação para o usuário
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Status de Pastor Atualizado",
        message: `Seu status de pastor foi ${isPastor ? "ativado" : "desativado"}`,
        type: "info",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: `Status de pastor ${isPastor ? "ativado" : "desativado"} com sucesso`,
      user,
    };
  } catch (error) {
    console.error("Error updating user pastor status:", error);
    return { success: false, error: "Erro ao atualizar status de pastor" };
  }
}

export async function getStudentStats() {
  try {
    const totalStudents = await prisma.user.count();

    const activeStudents = await prisma.userStats.count({
      where: {
        lastActivityAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        },
      },
    });

    const totalEnrollments = await prisma.enrollment.count();

    const totalCertificates = await prisma.certificate.count();

    return {
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalEnrollments,
        totalCertificates,
      },
    };
  } catch (error) {
    console.error("Error getting student stats:", error);
    return { success: false, error: "Erro ao buscar estatísticas" };
  }
}

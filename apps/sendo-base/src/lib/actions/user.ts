"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import { cleanCpf } from "../helpers/auth.helper";
import { uploadUserAvatar } from "../storage/image-storage";

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
          where: {
            status: "approved",
          },
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
        goal: true,
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
  email?: string;
  birthDate?: string;
  bio?: string;
  phone?: string;
  image?: string;
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
    let imageUrl = data.image;

    // Se tem nova imagem em base64, fazer upload para Supabase Storage
    if (data.image && data.image.startsWith("data:")) {
      console.log(
        "⬆️ Detectado base64 no avatar, fazendo upload para Supabase Storage...",
      );

      // Buscar usuário atual para pegar URL da imagem antiga
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });

      // Converter base64 para Buffer
      const base64Parts = data.image.split(",");
      const base64Data = base64Parts[1];

      if (!base64Data) {
        console.error("❌ Formato de base64 inválido");
        imageUrl = currentUser?.image || undefined;
      } else {
        const buffer = Buffer.from(base64Data, "base64");

        // Upload com substituição automática da imagem antiga
        const uploadResult = await uploadUserAvatar(
          buffer,
          userId,
          currentUser?.image, // Passa a URL antiga para ser deletada
          "avatar.png",
        );

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log("✅ Avatar atualizado com sucesso:", imageUrl);
        } else {
          console.error("❌ Erro no upload do avatar:", uploadResult.error);
          // Manter imagem antiga em caso de erro
          imageUrl = currentUser?.image || undefined;
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        image: imageUrl,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/account");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("❌ Erro ao atualizar perfil:", error);
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
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Verify current password
    const bcrypt = await import("bcryptjs");
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return { success: false, error: "Senha atual incorreta" };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        error: "A nova senha deve ter pelo menos 6 caracteres",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/account/access");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "Erro ao atualizar senha" };
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
      role: user.role as "MEMBROS" | "ADMIN",
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
        role: { in: ["ADMIN", "LIDER"] },
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
    return { success: false, error: "Erro ao buscar administradores" };
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
    const transformedStudents = students.map((student) => {
      // Determinar status baseado no approvalStatus e última atividade
      let status: "active" | "inactive" | "suspended" = "active";

      // Se o usuário não foi aprovado, não deve aparecer na lista de alunos
      if (student.approvalStatus === "PENDING") {
        status = "inactive"; // Ou podemos filtrar esses usuários
      } else if (student.approvalStatus === "REJECTED") {
        status = "suspended";
      } else if (student.approvalStatus === "APPROVED") {
        // Se aprovado, verificar atividade baseada na última atividade
        if (student.stats?.lastActivityAt) {
          const daysSinceLastActivity =
            (new Date().getTime() -
              new Date(student.stats.lastActivityAt).getTime()) /
            (1000 * 60 * 60 * 24);

          if (daysSinceLastActivity > 7) {
            status = "inactive";
          } else {
            status = "active";
          }
        } else {
          status = "inactive";
        }
      }

      return {
        id: student.id,
        name: student.name || "Nome não informado",
        email: student.email || "Email não informado",
        phone: student.phone,
        cpf: student.cpf || "CPF não informado",
        joinDate: student.joinDate,
        role: student.role as "MEMBROS" | "ADMIN",
        isPastor: student.isPastor || false,
        profileCompletion: student.profileCompletion || 0,
        coursesEnrolled: student.enrollments?.length || 0,
        coursesCompleted:
          student.enrollments?.filter((e) => e.completedAt).length || 0,
        certificatesEarned: student.certificates?.length || 0,
        lastActivity: student.stats?.lastActivityAt || student.updatedAt,
        status,
        approvalStatus: student.approvalStatus,
      };
    });

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
  status: "APPROVED" | "REJECTED",
) {
  try {
    // Atualizar o status de aprovação do usuário
    const user = await prisma.user.update({
      where: { id: studentId },
      data: {
        approvalStatus: status,
        ...(status === "REJECTED" && {
          rejectionReason: "Conta suspensa pela administração",
        }),
      },
    });

    // Atualizar também a última atividade para controle de status
    const now = new Date();
    let lastActivityAt = now;

    // Atualizar ou criar stats do usuário
    await prisma.userStats.upsert({
      where: { userId: studentId },
      update: { lastActivityAt },
      create: {
        userId: studentId,
        lastActivityAt,
      },
    });

    // Criar notificação para o usuário
    let notificationTitle = "";
    let notificationMessage = "";
    let notificationType = "info";

    if (status === "REJECTED") {
      notificationTitle = "Conta Suspensa";
      notificationMessage =
        "Sua conta foi suspensa pela administração. Entre em contato para mais informações.";
      notificationType = "error";
    } else {
      notificationTitle = "Status Atualizado";
      notificationMessage = "Seu status na plataforma foi atualizado.";
      notificationType = "info";
    }

    await prisma.notification.create({
      data: {
        userId: studentId,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
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
  role: "MEMBROS" | "ADMIN" | "LIDER",
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
        message: `Sua função foi alterada para ${role === "MEMBROS" ? "Membro" : "Administrador"}`,
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

// ===== APROVAÇÃO DE USUÁRIOS =====

export async function approveUser(userId: string, approverId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedBy: approverId,
      },
    });

    // Criar notificação para o usuário
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Conta Aprovada",
        message:
          "Sua conta foi aprovada! Agora você pode acessar todos os recursos da plataforma.",
        type: "success",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: "Usuário aprovado com sucesso",
      user,
    };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, error: "Erro ao aprovar usuário" };
  }
}

export async function rejectUser(
  userId: string,
  approverId: string,
  reason: string,
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "REJECTED",
        approvedAt: new Date(),
        approvedBy: approverId,
        rejectionReason: reason,
      },
    });

    // Criar notificação para o usuário
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Conta Rejeitada",
        message: `Sua conta foi rejeitada. Motivo: ${reason}`,
        type: "error",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: "Usuário rejeitado com sucesso",
      user,
    };
  } catch (error) {
    console.error("Error rejecting user:", error);
    return { success: false, error: "Erro ao rejeitar usuário" };
  }
}

export async function getPendingUsers() {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        approvalStatus: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        createdAt: true,
        joinDate: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      users: pendingUsers,
    };
  } catch (error) {
    console.error("Error getting pending users:", error);
    return { success: false, error: "Erro ao obter usuários pendentes" };
  }
}

export async function getApprovedUsers() {
  try {
    const approvedUsers = await prisma.user.findMany({
      where: {
        approvalStatus: "APPROVED",
      },
      include: {
        stats: true,
        enrollments: {
          include: {
            course: true,
          },
        },
        certificates: true,
      },
      orderBy: {
        joinDate: "desc",
      },
    });

    return {
      success: true,
      users: approvedUsers,
    };
  } catch (error) {
    console.error("Error getting approved users:", error);
    return { success: false, error: "Erro ao obter usuários aprovados" };
  }
}

export async function getRejectedUsers() {
  try {
    const rejectedUsers = await prisma.user.findMany({
      where: {
        approvalStatus: "REJECTED",
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        createdAt: true,
        joinDate: true,
        rejectionReason: true,
        approvedAt: true,
      },
      orderBy: {
        approvedAt: "desc",
      },
    });

    return {
      success: true,
      users: rejectedUsers,
    };
  } catch (error) {
    console.error("Error getting rejected users:", error);
    return { success: false, error: "Erro ao obter usuários rejeitados" };
  }
}

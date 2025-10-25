"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";

// Enrollment Actions
export async function enrollInCourse(userId: string, courseId: string) {
  try {
    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        success: false,
        error: "User is already enrolled in this course",
      };
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
        completedLessons: 0,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
                isPastor: true,
              },
            },
          },
        },
      },
    });

    // Update course students count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsCount: {
          increment: 1,
        },
      },
    });

    revalidatePath("/contents");
    revalidatePath("/catalog");
    return { success: true, enrollment };
  } catch (error) {
    return { success: false, error: "Failed to enroll in course" };
  }
}

export async function getUserEnrollments(
  userId: string,
  status?: "approved" | "pending" | "rejected",
) {
  let where: any = { userId };
  if (status) {
    where = { ...where, status };
  }
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: where,
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
                isPastor: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                enrollments: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Calculate average rating for each course
    const enrollmentsWithRating = enrollments.map((enrollment) => {
      const ratings = enrollment.course.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...enrollment,
        course: {
          ...enrollment.course,
          rating: Math.round(averageRating * 10) / 10,
          reviewsCount: ratings.length,
        },
      };
    });

    return { success: true, enrollments: enrollmentsWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch user enrollments" };
  }
}

// Função para buscar todas as matrículas do usuário (incluindo pendentes)
export async function getAllUserEnrollments(userId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
                isPastor: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                enrollments: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Calculate average rating for each course
    const enrollmentsWithRating = enrollments.map((enrollment) => {
      const ratings = enrollment.course.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...enrollment,
        course: {
          ...enrollment.course,
          rating: Math.round(averageRating * 10) / 10,
          reviewsCount: ratings.length,
        },
      };
    });

    return { success: true, enrollments: enrollmentsWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch all user enrollments" };
  }
}

// Enrollment Management Actions
export async function getStudentEnrollments(studentId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        approver: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return { success: true, enrollments };
  } catch (error) {
    console.error("Error getting student enrollments:", error);
    return { success: false, error: "Erro ao buscar matrículas do aluno" };
  }
}

export async function approveEnrollment(
  enrollmentId: string,
  approverId: string,
) {
  console.log("Approving enrollment:", enrollmentId, approverId);
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: approverId,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // Criar notificação para o aluno
    await prisma.notification.create({
      data: {
        userId: enrollment.userId,
        title: "Matrícula Aprovada",
        message: `Sua matrícula no curso "${enrollment.course.title}" foi aprovada!`,
        type: "success",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: "Matrícula aprovada com sucesso",
      enrollment,
    };
  } catch (error) {
    console.error("Error approving enrollment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao aprovar matrícula",
    };
  }
}

export async function rejectEnrollment(
  enrollmentId: string,
  approverId: string,
  reason: string,
) {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "rejected",
        approvedAt: new Date(),
        approvedBy: approverId,
        rejectionReason: reason,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // Criar notificação para o aluno
    await prisma.notification.create({
      data: {
        userId: enrollment.userId,
        title: "Matrícula Rejeitada",
        message: `Sua matrícula no curso "${enrollment.course.title}" foi rejeitada. Motivo: ${reason}`,
        type: "warning",
      },
    });

    revalidatePath("/dashboard/students");
    return {
      success: true,
      message: "Matrícula rejeitada com sucesso",
      enrollment,
    };
  } catch (error) {
    console.error("Error rejecting enrollment:", error);
    return { success: false, error: "Erro ao rejeitar matrícula" };
  }
}

export async function createEnrollmentRequest(
  courseId: string,
  userId: string,
) {
  try {
    // Validar se userId e courseId foram fornecidos
    if (!userId || !courseId) {
      return {
        success: false,
        error: "Dados inválidos para criar solicitação de matrícula",
      };
    }

    // Verificar se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Verificar se o curso existe
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      return {
        success: false,
        error: "Curso não encontrado",
      };
    }

    // Verificar se já existe uma matrícula para este usuário e curso
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        courseId,
        userId,
      },
    });

    if (existingEnrollment) {
      return {
        success: false,
        error: "Você já possui uma solicitação de matrícula para este curso",
      };
    }

    // Criar nova solicitação de matrícula
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        userId,
        status: "pending",
        enrolledAt: new Date(),
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    // Criar notificação para o usuário
    // await prisma.notification.create({
    //   data: {
    //     userId: userId,
    //     title: "Solicitação de Matrícula Enviada",
    //     message: `Sua solicitação de matrícula no curso "${enrollment.course.title}" foi enviada com sucesso. Aguarde aprovação dos líderes.`,
    //     type: "info",
    //   },
    // });

    revalidatePath(`/catalog/courses/${courseId}`);
    return {
      success: true,
      message: "Solicitação de matrícula enviada com sucesso",
      enrollment,
    };
  } catch (error) {
    console.error("Error creating enrollment request:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao criar solicitação de matrícula",
    };
  }
}

export async function getUserEnrollmentStatus(
  courseId: string,
  userId: string,
) {
  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId,
        userId,
      },
      select: {
        id: true,
        status: true,
        enrolledAt: true,
        approvedAt: true,
        rejectionReason: true,
      },
    });

    return {
      success: true,
      enrollment: enrollment || null,
    };
  } catch (error) {
    console.error("Error getting user enrollment status:", error);
    return { success: false, error: "Erro ao verificar status da matrícula" };
  }
}

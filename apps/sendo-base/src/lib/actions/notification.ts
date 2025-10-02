"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "course_completed"
    | "certificate_ready"
    | "new_lesson"
    | "community_post"
    | "forum_reply";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: {
    courseName?: string;
    lessonName?: string;
    userName?: string;
    communityName?: string;
  };
}

// Buscar notificações do usuário
export async function getUserNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformar para o formato esperado pelo componente
    const formattedNotifications: NotificationData[] = notifications.map(
      (notification) => ({
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationData["type"],
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        // TODO: Adicionar actionUrl e metadata quando necessário
        actionUrl: undefined,
        metadata: undefined,
      }),
    );

    return {
      success: true,
      notifications: formattedNotifications,
    };
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return {
      success: false,
      error: "Erro ao carregar notificações",
      notifications: [],
    };
  }
}

// Marcar notificação como lida
export async function markNotificationAsRead(
  notificationId: string,
  userId: string,
) {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId, // Garantir que o usuário só pode marcar suas próprias notificações
      },
      data: {
        isRead: true,
      },
    });

    if (!notification) {
      return {
        success: false,
        error: "Notificação não encontrada",
      };
    }

    revalidatePath("/");
    return {
      success: true,
      notification,
    };
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return {
      success: false,
      error: "Erro ao marcar notificação como lida",
    };
  }
}

// Marcar todas as notificações como lidas
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      updatedCount: result.count,
    };
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    return {
      success: false,
      error: "Erro ao marcar todas as notificações como lidas",
    };
  }
}

// Limpar todas as notificações
export async function clearAllNotifications(userId: string) {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        userId: userId,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Erro ao limpar notificações:", error);
    return {
      success: false,
      error: "Erro ao limpar notificações",
    };
  }
}

// Criar nova notificação
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type:
    | "course_completed"
    | "certificate_ready"
    | "new_lesson"
    | "community_post"
    | "forum_reply";
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      notification,
    };
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    return {
      success: false,
      error: "Erro ao criar notificação",
    };
  }
}

// Criar notificação de curso concluído
export async function createCourseCompletedNotification(
  userId: string,
  courseName: string,
) {
  return createNotification({
    userId,
    title: `Curso "${courseName}" Concluído!`,
    message: `Parabéns! Você concluiu com sucesso o curso "${courseName}".`,
    type: "course_completed",
  });
}

// Criar notificação de certificado pronto
export async function createCertificateReadyNotification(
  userId: string,
  courseName: string,
) {
  return createNotification({
    userId,
    title: "Seu certificado está pronto!",
    message: `O certificado do curso "${courseName}" foi gerado e está disponível para download.`,
    type: "certificate_ready",
  });
}

// Criar notificação de nova lição
export async function createNewLessonNotification(
  userId: string,
  courseName: string,
  lessonName: string,
) {
  return createNotification({
    userId,
    title: "Nova lição disponível",
    message: `Uma nova lição "${lessonName}" foi adicionada ao curso "${courseName}".`,
    type: "new_lesson",
  });
}

// Criar notificação de post da comunidade
export async function createCommunityPostNotification(
  userId: string,
  userName: string,
  postTitle: string,
) {
  return createNotification({
    userId,
    title: "Novo post na comunidade",
    message: `${userName} compartilhou um post sobre "${postTitle}".`,
    type: "community_post",
  });
}

// Criar notificação de resposta no fórum
export async function createForumReplyNotification(
  userId: string,
  userName: string,
  postTitle: string,
) {
  return createNotification({
    userId,
    title: "Nova resposta no fórum",
    message: `${userName} respondeu sua pergunta sobre "${postTitle}".`,
    type: "forum_reply",
  });
}

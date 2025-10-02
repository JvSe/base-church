import {
  createCertificateReadyNotification,
  createCommunityPostNotification,
  createCourseCompletedNotification,
  createForumReplyNotification,
  createNewLessonNotification,
} from "@/src/lib/actions/notification";

// Helpers para criar notificações em diferentes contextos da aplicação

/**
 * Criar notificação quando um curso é concluído
 * Use este helper na página de lição quando o usuário completa o último módulo
 */
export async function notifyCourseCompleted(
  userId: string,
  courseName: string,
) {
  const result = await createCourseCompletedNotification(userId, courseName);
  if (!result.success) {
    console.error(
      "Erro ao criar notificação de curso concluído:",
      result.error,
    );
  }
  return result;
}

/**
 * Criar notificação quando um certificado é gerado
 * Use este helper na função de geração de certificados
 */
export async function notifyCertificateReady(
  userId: string,
  courseName: string,
) {
  const result = await createCertificateReadyNotification(userId, courseName);
  if (!result.success) {
    console.error(
      "Erro ao criar notificação de certificado pronto:",
      result.error,
    );
  }
  return result;
}

/**
 * Criar notificação quando uma nova lição é adicionada
 * Use este helper na página de edição de cursos quando uma lição é criada
 */
export async function notifyNewLesson(
  userId: string,
  courseName: string,
  lessonName: string,
) {
  const result = await createNewLessonNotification(
    userId,
    courseName,
    lessonName,
  );
  if (!result.success) {
    console.error("Erro ao criar notificação de nova lição:", result.error);
  }
  return result;
}

/**
 * Criar notificação quando há um novo post na comunidade
 * Use este helper na página de comunidade quando um post é criado
 */
export async function notifyCommunityPost(
  userId: string,
  userName: string,
  postTitle: string,
) {
  const result = await createCommunityPostNotification(
    userId,
    userName,
    postTitle,
  );
  if (!result.success) {
    console.error(
      "Erro ao criar notificação de post da comunidade:",
      result.error,
    );
  }
  return result;
}

/**
 * Criar notificação quando há uma resposta no fórum
 * Use este helper na página de fórum quando um comentário é adicionado
 */
export async function notifyForumReply(
  userId: string,
  userName: string,
  postTitle: string,
) {
  const result = await createForumReplyNotification(
    userId,
    userName,
    postTitle,
  );
  if (!result.success) {
    console.error(
      "Erro ao criar notificação de resposta no fórum:",
      result.error,
    );
  }
  return result;
}

// Exemplo de uso em diferentes contextos:

/*
// 1. Na página de lição (quando curso é concluído):
import { notifyCourseCompleted } from "@/src/components/notifications/notification-helpers";

// No final da função que marca o curso como concluído:
await notifyCourseCompleted(user.id, course.title);

// 2. Na função de geração de certificados:
import { notifyCertificateReady } from "@/src/components/notifications/notification-helpers";

// Após gerar o certificado:
await notifyCertificateReady(user.id, course.title);

// 3. Na página de edição de cursos (quando nova lição é criada):
import { notifyNewLesson } from "@/src/components/notifications/notification-helpers";

// Para notificar todos os usuários inscritos no curso:
const enrollments = await getCourseEnrollments(courseId);
for (const enrollment of enrollments) {
  await notifyNewLesson(enrollment.userId, course.title, lesson.title);
}

// 4. Na página de comunidade (quando post é criado):
import { notifyCommunityPost } from "@/src/components/notifications/notification-helpers";

// Para notificar seguidores ou membros da comunidade:
const followers = await getUserFollowers(postAuthorId);
for (const follower of followers) {
  await notifyCommunityPost(follower.id, postAuthor.name, post.title);
}

// 5. Na página de fórum (quando comentário é adicionado):
import { notifyForumReply } from "@/src/components/notifications/notification-helpers";

// Para notificar o autor do post original:
await notifyForumReply(postAuthor.id, commentAuthor.name, post.title);
*/

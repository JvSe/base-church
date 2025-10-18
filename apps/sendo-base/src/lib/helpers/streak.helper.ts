import { prisma } from "@base-church/db";
import { dayjs } from "../dayjs";

/**
 * Verifica e atualiza o streak do usuário no login
 * Zera o streak se passou mais de 24h desde o último acesso
 */
export async function checkAndUpdateLoginStreak(userId: string) {
  try {
    // Buscar UserStats do usuário
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // Se não existe UserStats, criar com valores padrão
    if (!userStats) {
      await prisma.userStats.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: new Date(),
        },
      });
      return { success: true, streakReset: false, currentStreak: 0 };
    }

    // Se nunca teve atividade, apenas atualizar
    if (!userStats.lastActivityAt) {
      await prisma.userStats.update({
        where: { userId },
        data: {
          lastActivityAt: new Date(),
        },
      });
      return {
        success: true,
        streakReset: false,
        currentStreak: userStats.currentStreak,
      };
    }

    // Verificar diferença de tempo
    const now = dayjs();
    const lastActivity = dayjs(userStats.lastActivityAt);
    const hoursDiff = now.diff(lastActivity, "hours");

    // Se passou mais de 24h, zerar o streak
    if (hoursDiff >= 24) {
      await prisma.userStats.update({
        where: { userId },
        data: {
          currentStreak: 0,
          lastActivityAt: new Date(),
        },
      });

      // Também zerar no User
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: 0,
        },
      });

      return { success: true, streakReset: true, currentStreak: 0 };
    }

    // Se não passou 24h, manter streak atual
    return {
      success: true,
      streakReset: false,
      currentStreak: userStats.currentStreak,
    };
  } catch (error) {
    console.error("[CHECK_LOGIN_STREAK_ERROR]:", error);
    return { success: false, error: "Erro ao verificar streak" };
  }
}

/**
 * Incrementa o streak do usuário quando completa uma aula
 * Só incrementa se for a primeira aula do dia
 */
export async function updateStreakOnLessonCompletion(userId: string) {
  try {
    // Buscar UserStats do usuário
    let userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // Se não existe UserStats, criar
    if (!userStats) {
      userStats = await prisma.userStats.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityAt: new Date(),
        },
      });

      // Atualizar também no User
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: 1,
        },
      });

      return {
        success: true,
        streakIncremented: true,
        currentStreak: 1,
        isFirstLessonToday: true,
      };
    }

    const now = dayjs();
    const lastActivity = userStats.lastActivityAt
      ? dayjs(userStats.lastActivityAt)
      : null;

    // Se não tem lastActivityAt ou é o primeiro do dia
    const isFirstLessonToday =
      !lastActivity || !now.isSame(lastActivity, "day");

    // Só incrementa o streak se for a primeira aula do dia
    if (isFirstLessonToday) {
      const newStreak = userStats.currentStreak + 1;
      const newLongestStreak = Math.max(userStats.longestStreak, newStreak);

      await prisma.userStats.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityAt: new Date(),
        },
      });

      // Atualizar também no User
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
        },
      });

      return {
        success: true,
        streakIncremented: true,
        currentStreak: newStreak,
        isFirstLessonToday: true,
      };
    }

    // Se não é a primeira aula do dia, apenas atualizar lastActivityAt
    await prisma.userStats.update({
      where: { userId },
      data: {
        lastActivityAt: new Date(),
      },
    });

    return {
      success: true,
      streakIncremented: false,
      currentStreak: userStats.currentStreak,
      isFirstLessonToday: false,
    };
  } catch (error) {
    console.error("[UPDATE_STREAK_ERROR]:", error);
    return { success: false, error: "Erro ao atualizar streak" };
  }
}



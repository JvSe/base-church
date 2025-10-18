"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import { calculateGoalEstimates } from "../helpers/goals-helpers";

// Get user goal
export async function getUserGoal(userId: string) {
  try {
    const goal = await prisma.userGoal.findUnique({
      where: { userId },
    });

    return { success: true, goal };
  } catch (error) {
    console.error("Get user goal error:", error);
    return { success: false, error: "Failed to fetch goal" };
  }
}

// Create or update user goal
export async function setUserGoal(userId: string, dailyStudyHours: number) {
  try {
    // Validate input
    if (dailyStudyHours <= 0 || dailyStudyHours > 24) {
      return {
        success: false,
        error: "Horas diárias devem estar entre 0.5 e 24",
      };
    }

    const estimates = calculateGoalEstimates(dailyStudyHours);

    // Upsert goal (create or update)
    const goal = await prisma.userGoal.upsert({
      where: { userId },
      update: {
        dailyStudyHours,
        weeklyStudyHours: estimates.weeklyHours,
        monthlyCoursesTarget: estimates.estimatedCoursesPerMonth,
        isActive: true,
      },
      create: {
        userId,
        dailyStudyHours,
        weeklyStudyHours: estimates.weeklyHours,
        monthlyCoursesTarget: estimates.estimatedCoursesPerMonth,
        isActive: true,
      },
    });

    // Revalidate all relevant paths
    revalidatePath("/(private)/home", "page");
    revalidatePath("/home");

    return { success: true, goal, estimates };
  } catch (error) {
    console.error("Set user goal error:", error);
    return { success: false, error: "Failed to set goal" };
  }
}

// Delete user goal
export async function deleteUserGoal(userId: string) {
  try {
    await prisma.userGoal.delete({
      where: { userId },
    });

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("Delete user goal error:", error);
    return { success: false, error: "Failed to delete goal" };
  }
}

// Get goal progress for current week
export async function getGoalProgress(userId: string) {
  try {
    const goal = await prisma.userGoal.findUnique({
      where: { userId },
    });

    if (!goal) {
      return { success: false, error: "No goal set" };
    }

    // Get user stats
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    const hoursStudiedThisWeek = stats?.hoursStudied || 0; // TODO: Filter by week
    const coursesCompletedThisMonth = stats?.coursesCompleted || 0; // TODO: Filter by month

    const weeklyProgress = Math.min(
      (hoursStudiedThisWeek / goal.weeklyStudyHours) * 100,
      100,
    );
    const monthlyProgress = Math.min(
      (coursesCompletedThisMonth / goal.monthlyCoursesTarget) * 100,
      100,
    );

    return {
      success: true,
      progress: {
        weeklyHours: {
          current: hoursStudiedThisWeek,
          target: goal.weeklyStudyHours,
          percentage: Math.round(weeklyProgress),
        },
        monthlyCourses: {
          current: coursesCompletedThisMonth,
          target: goal.monthlyCoursesTarget,
          percentage: Math.round(monthlyProgress),
        },
      },
    };
  } catch (error) {
    console.error("Get goal progress error:", error);
    return { success: false, error: "Failed to fetch progress" };
  }
}

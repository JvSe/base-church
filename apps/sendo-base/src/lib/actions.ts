"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

// User Actions

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
    location?: string;
    skills?: string;
    academicBackground?: string;
    highlights?: string;
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
            course: true,
          },
        },
        certificates: {
          include: {
            course: true,
          },
        },
        subscriptions: true,
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
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" };
  }
}

// Course Actions
export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, courses };
  } catch (error) {
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
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
      },
    });

    return { success: true, course };
  } catch (error) {
    return { success: false, error: "Failed to fetch course" };
  }
}

export async function enrollInCourse(userId: string, courseId: string) {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: true,
      },
    });

    revalidatePath("/contents");
    return { success: true, enrollment };
  } catch (error) {
    return { success: false, error: "Failed to enroll in course" };
  }
}

// Lesson Actions
export async function getLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: {
                      orderBy: { order: "asc" },
                    },
                  },
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, lesson };
  } catch (error) {
    return { success: false, error: "Failed to fetch lesson" };
  }
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: {
    isCompleted?: boolean;
    watchedAt?: Date;
  },
) {
  try {
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        ...data,
        completedAt: data.isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        ...data,
        completedAt: data.isCompleted ? new Date() : undefined,
      },
    });

    revalidatePath("/contents");
    return { success: true, progress };
  } catch (error) {
    return { success: false, error: "Failed to update progress" };
  }
}

export async function getUserProgress(userId: string) {
  try {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
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
    });

    return { success: true, progress };
  } catch (error) {
    return { success: false, error: "Failed to fetch progress" };
  }
}

// Event Actions
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
    });

    return { success: true, events };
  } catch (error) {
    return { success: false, error: "Failed to fetch events" };
  }
}

// Forum Actions
export async function getForumPosts() {
  try {
    const posts = await prisma.forumPost.findMany({
      where: { isPublished: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, posts };
  } catch (error) {
    return { success: false, error: "Failed to fetch forum posts" };
  }
}

export async function createForumPost(
  userId: string,
  data: {
    title: string;
    content: string;
    category?: string;
  },
) {
  try {
    const post = await prisma.forumPost.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/forum");
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to create post" };
  }
}

// Notification Actions
export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/home");
    return { success: true, notification };
  } catch (error) {
    return { success: false, error: "Failed to mark notification as read" };
  }
}

// Search Actions
export async function searchContent(query: string) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    return { success: true, courses, lessons };
  } catch (error) {
    return { success: false, error: "Failed to search content" };
  }
}

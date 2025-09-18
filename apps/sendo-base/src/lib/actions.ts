"use server";

import { prisma } from "@repo/db";
import { revalidatePath, unstable_cache } from "next/cache";
import {
  cleanCpf,
  hashPassword,
  isValidCpf,
  verifyPassword,
} from "./helpers/auth.helper";
import { clearSession, createSession } from "./helpers/session.helper";

// Alias para o banco de dados
const db = prisma;

// Alias para a função de limpeza de CPF
const cleanCpfNumber = cleanCpf;

// User Actions

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

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
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
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating for each course
    const coursesWithRating = courses.map((course) => {
      const ratings = course.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...course,
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewsCount: ratings.length,
      };
    });

    return { success: true, courses: coursesWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            role: true,
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Calculate average rating
    const ratings = course.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const courseWithRating = {
      ...course,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: ratings.length,
    };

    return { success: true, course: courseWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch course" };
  }
}

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

    // Update enrollment progress if lesson is completed
    if (data.isCompleted) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      });

      if (lesson) {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: lesson.module.course.id,
            },
          },
        });

        if (enrollment) {
          // Calculate new progress
          const totalLessons = await prisma.lesson.count({
            where: {
              module: {
                courseId: lesson.module.course.id,
              },
            },
          });

          const completedLessons = await prisma.lessonProgress.count({
            where: {
              userId,
              lesson: {
                module: {
                  courseId: lesson.module.course.id,
                },
              },
              isCompleted: true,
            },
          });

          const newProgress = Math.round(
            (completedLessons / totalLessons) * 100,
          );

          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              progress: newProgress,
              completedLessons,
              lastAccessedAt: new Date(),
            },
          });

          // Check if course is completed
          if (newProgress === 100) {
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: {
                completedAt: new Date(),
              },
            });

            // Create certificate if course has certificate enabled
            if (lesson.module.course.certificate) {
              await prisma.certificate.create({
                data: {
                  userId,
                  courseId: lesson.module.course.id,
                },
              });
            }
          }
        }
      }
    }

    revalidatePath("/contents");
    revalidatePath("/profile");
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
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
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
      orderBy: { startDate: "asc" },
    });

    // Calculate average rating for each event
    const eventsWithRating = events.map((event) => {
      const ratings = event.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...event,
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: ratings.length,
      };
    });

    return { success: true, events: eventsWithRating };
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
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
    });

    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    return { success: true, courses, events };
  } catch (error) {
    return { success: false, error: "Failed to search content" };
  }
}

// Event Actions
export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            role: true,
          },
        },
        speakers: true,
        agenda: {
          orderBy: { order: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Calculate average rating
    const ratings = event.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const eventWithRating = {
      ...event,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: ratings.length,
    };

    return { success: true, event: eventWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function enrollInEvent(userId: string, eventId: string) {
  try {
    // Check if user is already enrolled
    const existingEnrollment = await prisma.eventEnrollment.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        success: false,
        error: "User is already enrolled in this event",
      };
    }

    // Check if event is full
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (
      event &&
      event.maxAttendees &&
      event.currentAttendees &&
      event.currentAttendees >= event.maxAttendees
    ) {
      return { success: false, error: "Event is full" };
    }

    const enrollment = await prisma.eventEnrollment.create({
      data: {
        userId,
        eventId,
      },
    });

    // Update event attendees count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentAttendees: {
          increment: 1,
        },
      },
    });

    revalidatePath("/events");
    return { success: true, enrollment };
  } catch (error) {
    return { success: false, error: "Failed to enroll in event" };
  }
}

// Review Actions
export async function createCourseReview(
  userId: string,
  courseId: string,
  data: {
    rating: number;
    comment?: string;
  },
) {
  try {
    const review = await prisma.courseReview.create({
      data: {
        userId,
        courseId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Update course rating
    const courseReviews = await prisma.courseReview.findMany({
      where: { courseId },
      select: { rating: true },
    });

    const averageRating =
      courseReviews.reduce((sum, r) => sum + r.rating, 0) /
      courseReviews.length;

    await prisma.course.update({
      where: { id: courseId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: courseReviews.length,
      },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/catalog");
    return { success: true, review };
  } catch (error) {
    return { success: false, error: "Failed to create review" };
  }
}

export async function createEventReview(
  userId: string,
  eventId: string,
  data: {
    rating: number;
    comment?: string;
  },
) {
  try {
    const review = await prisma.eventReview.create({
      data: {
        userId,
        eventId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Update event rating
    const eventReviews = await prisma.eventReview.findMany({
      where: { eventId },
      select: { rating: true },
    });

    const averageRating =
      eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length;

    await prisma.event.update({
      where: { id: eventId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: eventReviews.length,
      },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/events");
    return { success: true, review };
  } catch (error) {
    return { success: false, error: "Failed to create review" };
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

// Achievement Actions
export async function unlockAchievement(userId: string, achievementId: string) {
  try {
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
      include: {
        achievement: true,
      },
    });

    revalidatePath("/profile");
    return { success: true, userAchievement };
  } catch (error) {
    return { success: false, error: "Failed to unlock achievement" };
  }
}

// User Enrollments Actions
export async function getUserEnrollments(userId: string) {
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

// Community Actions
export async function getCommunityData() {
  try {
    // Get community stats
    const totalUsers = await prisma.user.count();
    const totalPosts = await prisma.forumPost.count();
    const totalEvents = await prisma.event.count();
    const totalAchievements = await prisma.achievement.count();

    // Get recent forum posts for community feed
    const recentPosts = await prisma.forumPost.findMany({
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            role: true,
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

    // Get active users (users with recent activity)
    const activeUsers = await prisma.user.findMany({
      take: 10,
      where: {
        OR: [
          {
            enrollments: {
              some: {
                lastAccessedAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
          {
            forumPosts: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        role: true,
      },
    });

    return {
      success: true,
      data: {
        stats: {
          totalUsers,
          totalPosts,
          totalEvents,
          totalAchievements,
        },
        recentPosts,
        activeUsers,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch community data" };
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

// Profile Update Actions
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

// Authentication Actions

export type SignUpInput = {
  name: string;
  cpf: string;
  password: string;
  email?: string;
  phone?: string;
};

export type SignInInput = {
  cpf: string;
  password: string;
};

export async function signUp(data: SignUpInput) {
  try {
    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      return { success: false, error: "CPF inválido" };
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Verificar se CPF já existe
    const existingUser = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (existingUser) {
      return { success: false, error: "CPF já cadastrado" };
    }

    // Verificar se email já existe (se fornecido)
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        return { success: false, error: "Email já cadastrado" };
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        cpf: cleanCpfValue,
        password: hashedPassword,
        email: data.email,
        phone: data.phone,
        role: "MEMBROS", // Default role
      },
    });

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function signIn(data: SignInInput) {
  try {
    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      return { success: false, error: "CPF inválido" };
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (!user) {
      return { success: false, error: "CPF ou senha incorretos" };
    }

    // Verificar senha
    if (!user.password) {
      return { success: false, error: "Usuário não possui senha cadastrada" };
    }

    const isPasswordValid = await verifyPassword(data.password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "CPF ou senha incorretos" };
    }

    // Criar sessão
    const sessionCookie = createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
    });

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      sessionCookie,
    };
  } catch (error) {
    console.error("Sign in error:", error);
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

export async function signOut() {
  try {
    const sessionCookie = clearSession();
    return { success: true, sessionCookie };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// ===== RECUPERAÇÃO DE SENHA =====

export async function requestPasswordReset(cpf: string) {
  try {
    // Limpar CPF
    const cleanCpf = cleanCpfNumber(cpf);

    if (!cleanCpf) {
      return { success: false, error: "CPF inválido" };
    }

    // Buscar usuário pelo CPF
    const user = await db.user.findUnique({
      where: { cpf: cleanCpf },
      select: { id: true, name: true, email: true, cpf: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Gerar token de recuperação (em produção, usar crypto.randomBytes)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Salvar token no banco (em produção, criar tabela de reset tokens)
    // Por enquanto, vamos simular o envio do email
    console.log(`Token de recuperação para ${user.email}: ${resetToken}`);

    // TODO: Implementar envio real de email
    // await sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: "Email de recuperação enviado com sucesso",
      email: user.email, // Para debug, não enviar em produção
    };
  } catch (error) {
    console.error("Request password reset error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validar senha
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Senha deve ter pelo menos 8 caracteres",
      };
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Em produção, validar token e buscar usuário
    // Por enquanto, vamos simular a redefinição
    console.log(`Redefinindo senha com token: ${token}`);

    // TODO: Implementar validação real do token
    // const user = await validateResetToken(token);
    // await db.user.update({
    //   where: { id: user.id },
    //   data: { password: hashedPassword }
    // });

    return {
      success: true,
      message: "Senha redefinida com sucesso",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// ===== CRUD DE CURSOS =====

export async function createCourse(courseData: {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  category: string;
  tags: string;
}) {
  try {
    // Validar dados obrigatórios
    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.instructor
    ) {
      return {
        success: false,
        error: "Título, descrição e instrutor são obrigatórios",
      };
    }

    // Processar tags
    const tagsArray = courseData.tags
      ? courseData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Gerar slug a partir do título
    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Criar curso
    const course = await db.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        slug: slug,
        instructorId: "30d453b9-88c9-429e-9700-81d2db735f7a", // TODO: Pegar do usuário logado
        duration: courseData.duration,
        level: courseData.level as any,
        price: courseData.price,
        category: courseData.category,
        tags: tagsArray,
        isFeatured: false,
        image: null,
      },
    });

    return {
      success: true,
      course,
      message: "Curso criado com sucesso",
    };
  } catch (error) {
    console.error("Create course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateCourse(
  courseId: string,
  courseData: {
    title: string;
    description: string;
    instructor: string;
    duration: number;
    level: string;
    status: string;
    price: number;
    category: string;
    tags: string;
  },
) {
  try {
    // Verificar se o curso existe
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Processar tags
    const tagsArray = courseData.tags
      ? courseData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Atualizar curso
    const course = await db.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        instructorId: "30d453b9-88c9-429e-9700-81d2db735f7a", // TODO: Pegar do usuário logado
        duration: courseData.duration,
        level: courseData.level as any,
        price: courseData.price,
        category: courseData.category,
        tags: tagsArray,
      },
    });

    return {
      success: true,
      course,
      message: "Curso atualizado com sucesso",
    };
  } catch (error) {
    console.error("Update course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // Verificar se o curso existe
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Verificar se há alunos matriculados
    if (existingCourse._count.enrollments > 0) {
      return {
        success: false,
        error: "Não é possível excluir um curso com alunos matriculados",
      };
    }

    // Excluir curso (cascade vai excluir módulos e lições)
    await db.course.delete({
      where: { id: courseId },
    });

    return {
      success: true,
      message: "Curso excluído com sucesso",
    };
  } catch (error) {
    console.error("Delete course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function duplicateCourse(courseId: string) {
  try {
    // Buscar curso original
    const originalCourse = await db.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!originalCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Gerar slug para o curso duplicado
    const duplicatedSlug = `${originalCourse.slug}-copia-${Date.now()}`;

    // Criar curso duplicado
    const duplicatedCourse = await db.course.create({
      data: {
        title: `${originalCourse.title} (Cópia)`,
        description: originalCourse.description,
        slug: duplicatedSlug,
        instructorId: originalCourse.instructorId,
        duration: originalCourse.duration,
        level: originalCourse.level,
        price: originalCourse.price,
        category: originalCourse.category,
        tags: originalCourse.tags,
        isFeatured: false,
        image: originalCourse.image,
      },
    });

    // Duplicar módulos e lições
    for (const module of originalCourse.modules) {
      const duplicatedModule = await db.module.create({
        data: {
          title: module.title,
          description: module.description,
          order: module.order,
          courseId: duplicatedCourse.id,
        },
      });

      // Duplicar lições
      for (const lesson of module.lessons) {
        await db.lesson.create({
          data: {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
            type: lesson.type,
            moduleId: duplicatedModule.id,
          },
        });
      }
    }

    return {
      success: true,
      course: duplicatedCourse,
      message: "Curso duplicado com sucesso",
    };
  } catch (error) {
    console.error("Duplicate course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getCourseById(courseId: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
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
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    return { success: true, course };
  } catch (error) {
    console.error("Get course by id error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// ===== MÓDULOS E LIÇÕES =====

export async function createModule(
  courseId: string,
  moduleData: {
    title: string;
    description: string;
    order: number;
  },
) {
  try {
    // Verificar se o curso existe
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Criar módulo
    const module = await db.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        courseId: courseId,
      },
    });

    return {
      success: true,
      module,
      message: "Módulo criado com sucesso",
    };
  } catch (error) {
    console.error("Create module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateModule(
  moduleId: string,
  moduleData: {
    title: string;
    description: string;
    order: number;
  },
) {
  try {
    // Verificar se o módulo existe
    const existingModule = await db.module.findUnique({
      where: { id: moduleId },
    });

    if (!existingModule) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Atualizar módulo
    const module = await db.module.update({
      where: { id: moduleId },
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
      },
    });

    return {
      success: true,
      module,
      message: "Módulo atualizado com sucesso",
    };
  } catch (error) {
    console.error("Update module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteModule(moduleId: string) {
  try {
    // Verificar se o módulo existe
    const existingModule = await db.module.findUnique({
      where: { id: moduleId },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!existingModule) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Excluir módulo (cascade vai excluir lições)
    await db.module.delete({
      where: { id: moduleId },
    });

    return {
      success: true,
      message: "Módulo excluído com sucesso",
    };
  } catch (error) {
    console.error("Delete module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function createLesson(
  moduleId: string,
  lessonData: {
    title: string;
    description: string;
    content?: string;
    videoUrl?: string;
    duration: number;
    order: number;
    type: string;
  },
) {
  try {
    // Verificar se o módulo existe
    const module = await db.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Criar lição
    const lesson = await db.lesson.create({
      data: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || null,
        videoUrl: lessonData.videoUrl || null,
        duration: lessonData.duration,
        order: lessonData.order,
        type: lessonData.type as any,
        moduleId: moduleId,
      },
    });

    return {
      success: true,
      lesson,
      message: "Lição criada com sucesso",
    };
  } catch (error) {
    console.error("Create lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateLesson(
  lessonId: string,
  lessonData: {
    title: string;
    description: string;
    content?: string;
    videoUrl?: string;
    duration: number;
    order: number;
    type: string;
  },
) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Atualizar lição
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || null,
        videoUrl: lessonData.videoUrl || null,
        duration: lessonData.duration,
        order: lessonData.order,
        type: lessonData.type as any,
      },
    });

    return {
      success: true,
      lesson,
      message: "Lição atualizada com sucesso",
    };
  } catch (error) {
    console.error("Update lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Excluir lição
    await db.lesson.delete({
      where: { id: lessonId },
    });

    return {
      success: true,
      message: "Lição excluída com sucesso",
    };
  } catch (error) {
    console.error("Delete lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getCourseModules(courseId: string) {
  try {
    const modules = await db.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return { success: true, modules };
  } catch (error) {
    console.error("Get course modules error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    return { success: true, lesson };
  } catch (error) {
    console.error("Get lesson by id error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// ===== DASHBOARD ACTIONS =====

export async function getDashboardStats() {
  try {
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
      db.user.count({
        where: { role: "MEMBROS" },
      }),

      // Total de cursos publicados
      db.course.count({
        where: { isPublished: true },
      }),

      // Total de certificados emitidos
      db.certificate.count(),

      // Total de matrículas
      db.enrollment.count(),

      // Cursos completados (matrículas com completedAt)
      db.enrollment.count({
        where: { completedAt: { not: null } },
      }),

      // Alunos ativos (com atividade nos últimos 30 dias)
      db.user.count({
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
      db.courseReview.aggregate({
        _avg: { rating: true },
      }),

      // Matrículas recentes (últimas 10)
      db.enrollment.findMany({
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
      db.enrollment.findMany({
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
      db.certificate.findMany({
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
      db.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.enrollment.count({
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
        const totalEnrollments = await db.enrollment.count();
        const completedEnrollments = await db.enrollment.count({
          where: { completedAt: { not: null } },
        });
        return totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0;
      })(),

      // Duração média dos cursos
      (async () => {
        const avgDuration = await db.course.aggregate({
          where: { isPublished: true },
          _avg: { duration: true },
        });
        return avgDuration._avg.duration
          ? Math.round((avgDuration._avg.duration / 60) * 10) / 10
          : 0;
      })(),

      // Satisfação dos alunos (baseada nas avaliações)
      (async () => {
        const totalReviews = await db.courseReview.count();
        const positiveReviews = await db.courseReview.count({
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

        const activeLastMonth = await db.user.count({
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

        const totalLastMonth = await db.user.count({
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

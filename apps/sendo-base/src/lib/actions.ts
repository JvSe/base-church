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

// Course Actions
export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
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

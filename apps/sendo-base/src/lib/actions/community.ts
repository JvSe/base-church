"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

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

"use server";

import { prisma } from "@base-church/db";
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
export async function getForumPosts(userId?: string) {
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
            isPastor: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true },
          },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    // Add isLikedByUser flag
    const postsWithLikes = posts.map((post) => ({
      ...post,
      isLikedByUser: userId ? (post.likes?.length ?? 0) > 0 : false,
      likes: undefined, // Remove the likes array from response
    }));

    return { success: true, posts: postsWithLikes };
  } catch (error) {
    return { success: false, error: "Failed to fetch forum posts" };
  }
}

export async function getForumPostById(postId: string, userId?: string) {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isPastor: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                isPastor: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true },
          },
        }),
      },
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const postWithLike = {
      ...post,
      isLikedByUser: userId ? (post.likes?.length ?? 0) > 0 : false,
      likes: undefined,
    };

    return { success: true, post: postWithLike };
  } catch (error) {
    return { success: false, error: "Failed to fetch post" };
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
            isPastor: true,
          },
        },
        _count: {
          select: {
            comments: true,
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

export async function updateForumPost(
  postId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
  },
) {
  try {
    // Verify ownership
    const existingPost = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!existingPost || existingPost.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.forumPost.update({
      where: { id: postId },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isPastor: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/${postId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to update post" };
  }
}

export async function deleteForumPost(postId: string, userId: string) {
  try {
    // Verify ownership
    const existingPost = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!existingPost || existingPost.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.forumPost.delete({
      where: { id: postId },
    });

    revalidatePath("/forum");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete post" };
  }
}

export async function createForumComment(
  userId: string,
  postId: string,
  content: string,
) {
  try {
    const comment = await prisma.forumComment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isPastor: true,
          },
        },
      },
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/${postId}`);
    return { success: true, comment };
  } catch (error) {
    return { success: false, error: "Failed to create comment" };
  }
}

export async function updateForumComment(
  commentId: string,
  userId: string,
  content: string,
) {
  try {
    // Verify ownership
    const existingComment = await prisma.forumComment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!existingComment || existingComment.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedComment = await prisma.forumComment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isPastor: true,
          },
        },
      },
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/${existingComment.postId}`);
    return { success: true, comment: updatedComment };
  } catch (error) {
    return { success: false, error: "Failed to update comment" };
  }
}

export async function deleteForumComment(commentId: string, userId: string) {
  try {
    // Verify ownership
    const existingComment = await prisma.forumComment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!existingComment || existingComment.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.forumComment.delete({
      where: { id: commentId },
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/${existingComment.postId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete comment" };
  }
}

// Forum Like Actions
export async function toggleForumPostLike(postId: string, userId: string) {
  try {
    // Check if user already liked the post
    const existingLike = await prisma.forumPostLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove like and decrement counter
      await prisma.$transaction([
        prisma.forumPostLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      revalidatePath("/forum");
      revalidatePath(`/forum/${postId}`);
      return { success: true, liked: false };
    } else {
      // Like: Create like and increment counter
      await prisma.$transaction([
        prisma.forumPostLike.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      revalidatePath("/forum");
      revalidatePath(`/forum/${postId}`);
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// Forum View Actions
export async function registerForumPostView(postId: string, userId: string) {
  try {
    // Check if user already viewed this post
    const existingView = await prisma.forumPostView.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    // Only register if it's a new view
    if (!existingView) {
      await prisma.$transaction([
        prisma.forumPostView.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { viewsCount: { increment: 1 } },
        }),
      ]);
    }

    return { success: true };
  } catch (error) {
    console.error("Register view error:", error);
    // Não retornar erro aqui para não quebrar a página se falhar
    return { success: false, error: "Failed to register view" };
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

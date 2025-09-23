// Main exports for the database package
export * from "../generated/client/index.js";
export { prisma } from "./client.js";

// Re-export commonly used types and utilities
export type {
  Certificate,
  Course,
  CourseCategory,
  Enrollment,
  Lesson,
  LessonProgress,
  Module,
  Notification,
  User,
  UserRole,
} from "../generated/client/index.js";

// Database utilities
export const db = {
  // Connection utilities
  connect: async () => {
    await prisma.$connect();
  },

  disconnect: async () => {
    await prisma.$disconnect();
  },

  // Health check
  health: async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "healthy" };
    } catch (error) {
      return { status: "unhealthy", error };
    }
  },

  // Transaction helper
  transaction: prisma.$transaction,

  // Raw query helper
  raw: prisma.$queryRaw,

  // Execute raw SQL
  execute: prisma.$executeRaw,
};

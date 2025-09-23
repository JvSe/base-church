import { PrismaClient } from "../generated/client";

// Global type for Prisma in development
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit in development with hot reloads
const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
    // Connection pooling configuration for production
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Export the Prisma client instance
export const prisma = globalForPrisma.__prisma ?? createPrismaClient();

// In development, save the instance to the global object to prevent
// multiple instances during hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}

// Graceful shutdown
if (process.env.NODE_ENV !== "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

// Re-export all types and utilities from Prisma
export * from "../generated/client";
export type { Prisma } from "../generated/client";

import { PrismaClient } from "../generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Configurações de performance para produção
    ...(process.env.NODE_ENV === "production" && {
      __internal: {
        engine: {
          // Configurar pool de conexões
          connectionLimit: 10,
          poolTimeout: 20,
          // Configurações específicas para Vercel
          binaryTargets: ["native"],
        },
      },
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

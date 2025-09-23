/**
 * Configuração centralizada do banco de dados
 * Inclui validação de ambiente e configurações de produção
 */

import { Prisma, PrismaClient } from "../generated/client";

// Configuração de logs baseada no ambiente
const getLogLevel = (): Prisma.LogLevel[] => {
  if (process.env.NODE_ENV === "development") {
    return ["query", "error", "warn"];
  }
  if (process.env.NODE_ENV === "test") {
    return ["error"];
  }
  return ["error"];
};

// Configuração de datasource para produção
const getDatasourceConfig = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please check your environment configuration."
    );
  }

  return {
    db: {
      url: process.env.DATABASE_URL,
    },
  };
};

// Função para criar cliente Prisma configurado
export const createPrismaClient = (): PrismaClient => {
  try {
    const baseConfig = {
      log: getLogLevel(),
      datasources: getDatasourceConfig(),
    };

    return new PrismaClient(baseConfig);
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    throw error;
  }
};

// Validação de conexão
export const validateDatabaseConnection = async (
  client: PrismaClient
): Promise<boolean> => {
  try {
    await client.$connect();
    await client.$disconnect();
    return true;
  } catch (error) {
    console.error("Database connection validation failed:", error);
    return false;
  }
};

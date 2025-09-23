/**
 * Configuração centralizada de variáveis de ambiente
 * Garante que todas as variáveis necessárias estejam disponíveis
 */

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,

  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || "fallback-session-secret",

  // NextAuth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "fallback-nextauth-secret",
} as const;

// Validação de variáveis críticas
export function validateEnvironment() {
  const requiredVars = ["DATABASE_URL", "DATABASE_DIRECT_URL"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        `Please check your .env file or environment configuration.`,
    );
  }

  return true;
}

// Função para verificar se está em produção
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Middleware de validação para produção
 * Garante que o ambiente está configurado corretamente
 */

import { validateEnvironment } from "../config/env";

let isEnvironmentValidated = false;

export function ensureEnvironmentValidated() {
  if (!isEnvironmentValidated) {
    try {
      validateEnvironment();
      isEnvironmentValidated = true;
      console.log("✅ Environment validation passed");
    } catch (error) {
      console.error("❌ Environment validation failed:", error);
      throw error;
    }
  }
}

// Função para inicializar validações em produção
export function initializeProductionChecks() {
  if (process.env.NODE_ENV === "production") {
    ensureEnvironmentValidated();

    // Log de informações importantes (sem dados sensíveis)
    console.log("🚀 Starting in production mode");
    console.log("📊 Database URL configured:", !!process.env.DATABASE_URL);
    console.log("🔐 Session secret configured:", !!process.env.SESSION_SECRET);
  }
}

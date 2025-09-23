#!/usr/bin/env tsx

/**
 * Script de verificação para produção
 * Executa todas as validações necessárias antes do deploy
 */

import { validateDatabaseConnection } from "@repo/db";
import { validateEnvironment } from "../src/lib/config/env";

async function checkProduction() {
  console.log("🔍 Verificando configuração para produção...\n");

  try {
    // 1. Verificar variáveis de ambiente
    console.log("1️⃣ Verificando variáveis de ambiente...");
    validateEnvironment();
    console.log("✅ Variáveis de ambiente OK\n");

    // 2. Verificar conexão com banco
    console.log("2️⃣ Verificando conexão com banco de dados...");
    const { prisma } = await import("@repo/db");
    const isConnected = await validateDatabaseConnection(prisma);

    if (isConnected) {
      console.log("✅ Conexão com banco OK\n");
    } else {
      throw new Error("❌ Falha na conexão com banco de dados");
    }

    // 3. Verificar configuração de ambiente
    console.log("3️⃣ Verificando configuração de ambiente...");
    const nodeEnv = process.env.NODE_ENV;
    console.log(`📊 NODE_ENV: ${nodeEnv}`);

    if (nodeEnv !== "production") {
      console.log("⚠️  NODE_ENV não está definido como 'production'");
    } else {
      console.log("✅ Ambiente configurado para produção\n");
    }

    // 4. Resumo final
    console.log("🎉 Todas as verificações passaram!");
    console.log("🚀 Sistema pronto para produção");

    process.exit(0);
  } catch (error) {
    console.error("❌ Verificação falhou:", error);
    console.log("\n🔧 Verifique:");
    console.log("- Variáveis de ambiente configuradas");
    console.log("- Conexão com banco de dados");
    console.log("- Credenciais corretas");

    process.exit(1);
  }
}

checkProduction();

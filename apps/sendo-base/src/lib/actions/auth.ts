"use server";

import { prisma } from "@base-church/db";
import {
  cleanCpf,
  hashPassword,
  isValidCpf,
  verifyPassword,
} from "../helpers/auth.helper";
import { clearSession, createSession } from "../helpers/session.helper";
import { checkAndUpdateLoginStreak } from "../helpers/streak.helper";

// Authentication Types
export type SignUpInput = {
  name: string;
  cpf: string;
  password: string;
  email?: string;
};

export type SignInInput = {
  cpf: string;
  password: string;
};

// Authentication Actions
export async function signUp(data: SignUpInput) {
  try {
    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      return { success: false, error: "CPF inválido" };
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Verificar se CPF já existe
    const existingUser = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (existingUser) {
      return { success: false, error: "CPF já cadastrado" };
    }

    // Verificar se email já existe (se fornecido)
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        return { success: false, error: "Email já cadastrado" };
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        cpf: cleanCpfValue,
        email: data.email,
        password: hashedPassword,
        role: "MEMBROS", // Default role
      },
    });

    // Inicializar UserStats para o novo usuário
    await prisma.userStats.create({
      data: {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: new Date(),
      },
    });

    // Criar sessão (agora seta o cookie diretamente)
    await createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
      approvalStatus: user.approvalStatus,
    });

    // Dados do usuário formatados para o frontend
    const userData = {
      id: user.id,
      name: user.name!,
      cpf: user.cpf!,
      email: user.email || undefined,
      role: user.role as "MEMBROS" | "ADMIN",
      isPastor: user.isPastor || false,
      approvalStatus: user.approvalStatus,
    };

    return { success: true, user: userData };
  } catch (error) {
    console.error("[SENDO-BASE-ERROR]:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function signIn(data: SignInInput) {
  try {
    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      return { success: false, error: "CPF inválido" };
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Buscar usuário por CPF
    const user = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (!user) {
      return { success: false, error: "Usuário não cadastrado!" };
    }

    const isPasswordValid = await verifyPassword(data.password, user.password!);

    if (!isPasswordValid) {
      return { success: false, error: "CPF ou senha incorretos" };
    }

    // Verificar e atualizar streak (zera se passou 24h)
    await checkAndUpdateLoginStreak(user.id);

    // Criar sessão (agora seta o cookie diretamente)
    await createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
      approvalStatus: user.approvalStatus,
    });

    const userData = {
      id: user.id,
      name: user.name!,
      cpf: user.cpf!,
      email: user.email || undefined,
      role: user.role as "MEMBROS" | "ADMIN",
      isPastor: user.isPastor || false,
      image: user.image || undefined,
      approvalStatus: user.approvalStatus,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error("[SIGNIN-ERROR]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao fazer login",
    };
  }
}

export async function signOut() {
  try {
    await clearSession();
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

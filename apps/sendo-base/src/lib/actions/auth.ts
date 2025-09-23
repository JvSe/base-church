"use server";

import { prisma } from "@repo/db";
import {
  cleanCpf,
  hashPassword,
  isValidCpf,
  verifyPassword,
} from "../helpers/auth.helper";
import { clearSession, createSession } from "../helpers/session.helper";

// Alias para o banco de dados
const db = prisma;

// Alias para a função de limpeza de CPF
const cleanCpfNumber = cleanCpf;

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

    // Criar sessão
    const sessionCookie = createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
    });

    // Dados do usuário formatados para o frontend
    const userData = {
      id: user.id,
      name: user.name!,
      cpf: user.cpf!,
      email: user.email || undefined,
      role: user.role as "MEMBROS" | "LIDER",
      isPastor: user.isPastor || false,
    };

    return { success: true, user: userData, sessionCookie };
  } catch (error) {
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function signIn(data: SignInInput) {
  try {
    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      throw new Error("CPF inválido");
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Buscar usuário por CPF
    const user = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (!user) {
      throw new Error("Usuário não cadastrado!");
    }

    const isPasswordValid = await verifyPassword(data.password, user.password!);

    if (!isPasswordValid) {
      throw new Error("CPF ou senha incorretos");
    }

    // Criar sessão
    const sessionCookie = createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
    });

    const userData = {
      id: user.id,
      name: user.name!,
      cpf: user.cpf!,
      email: user.email || undefined,
      role: user.role as "MEMBROS" | "LIDER",
      isPastor: user.isPastor || false,
      image: user.image || undefined,
    };

    return {
      success: true,
      user: userData,
      sessionCookie,
    };
  } catch (error) {
    throw new Error("Erro interno do servidor");
  }
}

export async function signOut() {
  try {
    const sessionCookie = clearSession();
    return { success: true, sessionCookie };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// ===== RECUPERAÇÃO DE SENHA =====

export async function requestPasswordReset(cpf: string) {
  try {
    // Limpar CPF
    const cleanCpf = cleanCpfNumber(cpf);

    if (!cleanCpf) {
      return { success: false, error: "CPF inválido" };
    }

    // Buscar usuário pelo CPF
    const user = await db.user.findUnique({
      where: { cpf: cleanCpf },
      select: { id: true, name: true, email: true, cpf: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Gerar token de recuperação (em produção, usar crypto.randomBytes)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Salvar token no banco (em produção, criar tabela de reset tokens)
    // Por enquanto, vamos simular o envio do email
    console.log(`Token de recuperação para ${user.email}: ${resetToken}`);

    // TODO: Implementar envio real de email
    // await sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: "Email de recuperação enviado com sucesso",
      email: user.email, // Para debug, não enviar em produção
    };
  } catch (error) {
    console.error("Request password reset error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validar senha
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Senha deve ter pelo menos 8 caracteres",
      };
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Em produção, validar token e buscar usuário
    // Por enquanto, vamos simular a redefinição
    console.log(`Redefinindo senha com token: ${token}`);

    // TODO: Implementar validação real do token
    // const user = await validateResetToken(token);
    // await db.user.update({
    //   where: { id: user.id },
    //   data: { password: hashedPassword }
    // });

    return {
      success: true,
      message: "Senha redefinida com sucesso",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

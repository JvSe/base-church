"use server";

import { prisma } from "@base-church/db";
import crypto from "crypto";
import { cleanCpf, hashPassword, isValidCpf } from "../helpers/auth.helper";
import { createSession } from "../helpers/session.helper";

/**
 * Gera um token único para convite
 */
function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Cria um usuário pendente e gera link de convite
 * Apenas admins podem executar essa ação
 */
export async function createUserInvite(data: {
  name: string;
  email?: string;
  role?: "MEMBROS" | "ADMIN";
  createdBy: string; // ID do admin que está criando
}) {
  try {
    // Verificar se quem está criando é admin
    const creator = await prisma.user.findUnique({
      where: { id: data.createdBy },
      select: { role: true },
    });

    if (!creator || (creator.role !== "ADMIN" && creator.role !== "LIDER")) {
      return {
        success: false,
        error: "Apenas administradores podem criar convites",
      };
    }

    // Verificar se email já existe (se fornecido)
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        return {
          success: false,
          error: "Email já cadastrado",
        };
      }
    }

    // Gerar token único
    const token = generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token válido por 7 dias

    // Criar usuário pendente
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || "MEMBROS",
        isInvitePending: true,
        inviteToken: token,
        inviteTokenExpiresAt: expiresAt,
        approvalStatus: "PENDING",
      },
    });

    // Gerar link de convite
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/complete-signup?token=${token}`;

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      inviteLink,
      expiresAt,
    };
  } catch (error) {
    console.error("[CREATE_INVITE_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao criar convite",
    };
  }
}

/**
 * Valida um token de convite
 */
export async function validateInviteToken(token: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
      select: {
        id: true,
        name: true,
        email: true,
        isInvitePending: true,
        inviteTokenExpiresAt: true,
        cpf: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Token inválido",
      };
    }

    if (!user.isInvitePending) {
      return {
        success: false,
        error: "Este convite já foi utilizado",
      };
    }

    if (user.cpf || user.password) {
      return {
        success: false,
        error: "Este usuário já completou o cadastro",
      };
    }

    if (user.inviteTokenExpiresAt && user.inviteTokenExpiresAt < new Date()) {
      return {
        success: false,
        error: "Este convite expirou. Solicite um novo convite.",
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("[VALIDATE_TOKEN_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao validar token",
    };
  }
}

/**
 * Completa o cadastro do usuário com CPF e senha
 */
export async function completeUserSignup(data: {
  token: string;
  cpf: string;
  password: string;
}) {
  try {
    // Validar token primeiro
    const tokenValidation = await validateInviteToken(data.token);

    if (!tokenValidation.success) {
      return {
        success: false,
        error: tokenValidation.error,
      };
    }

    // Validar CPF
    if (!isValidCpf(data.cpf)) {
      return {
        success: false,
        error: "CPF inválido",
      };
    }

    const cleanCpfValue = cleanCpf(data.cpf);

    // Verificar se CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (existingCpf) {
      return {
        success: false,
        error: "CPF já cadastrado",
      };
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { inviteToken: data.token },
      data: {
        cpf: cleanCpfValue,
        password: hashedPassword,
        isInvitePending: false,
        inviteToken: null, // Remover token após uso
        inviteTokenExpiresAt: null,
        approvalStatus: "APPROVED", // Aprovar automaticamente usuários convidados
        approvedAt: new Date(),
      },
    });

    // Criar UserStats para o usuário
    await prisma.userStats.create({
      data: {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: new Date(),
      },
    });

    // Criar sessão (fazer login automático)
    await createSession({
      userId: user.id,
      cpf: user.cpf!,
      name: user.name!,
      role: user.role,
      email: user.email || undefined,
      approvalStatus: user.approvalStatus,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    };
  } catch (error) {
    console.error("[COMPLETE_SIGNUP_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao completar cadastro",
    };
  }
}

/**
 * Reenviar convite (gera novo token)
 */
export async function resendInvite(userId: string, createdBy: string) {
  try {
    // Verificar se quem está reenviando é admin
    const creator = await prisma.user.findUnique({
      where: { id: createdBy },
      select: { role: true },
    });

    if (!creator || (creator.role !== "ADMIN" && creator.role !== "LIDER")) {
      return {
        success: false,
        error: "Apenas administradores podem reenviar convites",
      };
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isInvitePending: true,
        cpf: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (!user.isInvitePending || user.cpf) {
      return {
        success: false,
        error: "Este usuário já completou o cadastro",
      };
    }

    // Gerar novo token
    const token = generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token válido por 7 dias

    // Atualizar token
    await prisma.user.update({
      where: { id: userId },
      data: {
        inviteToken: token,
        inviteTokenExpiresAt: expiresAt,
      },
    });

    // Gerar link de convite
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/complete-signup?token=${token}`;

    return {
      success: true,
      inviteLink,
      expiresAt,
    };
  } catch (error) {
    console.error("[RESEND_INVITE_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao reenviar convite",
    };
  }
}

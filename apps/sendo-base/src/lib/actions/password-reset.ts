"use server";

import { prisma } from "@base-church/db";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { cleanCpf, isValidCpf } from "../helpers/auth.helper";
import { hashPassword } from "../helpers/auth.helper";

/**
 * Gera um token único para reset de senha
 */
function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Gera link de reset de senha para usuário
 */
export async function generatePasswordResetLink(userId: string) {
  try {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Verificar se usuário tem CPF e senha (já completou cadastro)
    if (!user.cpf || !user.password) {
      return {
        success: false,
        error: "Este usuário ainda não completou o cadastro",
      };
    }

    // Gerar token único
    const token = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token válido por 7 dias

    // Atualizar usuário com token de reset
    await prisma.user.update({
      where: { id: userId },
      data: {
        inviteToken: token, // Reutilizamos o campo inviteToken
        inviteTokenExpiresAt: expiresAt,
      },
    });

    // Gerar link de reset
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    return {
      success: true,
      resetLink,
      expiresAt,
    };
  } catch (error) {
    console.error("[GENERATE_RESET_LINK_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao gerar link de reset",
    };
  }
}

/**
 * Valida token de reset de senha
 */
export async function validateResetToken(token: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        inviteTokenExpiresAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Token inválido",
      };
    }

    if (!user.cpf) {
      return {
        success: false,
        error: "Este link não é válido para reset de senha",
      };
    }

    if (user.inviteTokenExpiresAt && user.inviteTokenExpiresAt < new Date()) {
      return {
        success: false,
        error: "Este link expirou. Solicite um novo link de reset.",
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
    console.error("[VALIDATE_RESET_TOKEN_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao validar token",
    };
  }
}

/**
 * Reseta a senha do usuário
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validar token
    const validation = await validateResetToken(token);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Atualizar senha e remover token
    await prisma.user.update({
      where: { inviteToken: token },
      data: {
        password: hashedPassword,
        inviteToken: null,
        inviteTokenExpiresAt: null,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Senha alterada com sucesso",
    };
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao resetar senha",
    };
  }
}

/**
 * Solicita recuperação de senha usando CPF
 */
export async function requestPasswordReset(cpf: string) {
  try {
    // Validar CPF
    if (!isValidCpf(cpf)) {
      return {
        success: false,
        error: "CPF inválido",
      };
    }

    const cleanCpfValue = cleanCpf(cpf);

    // Buscar usuário pelo CPF
    const user = await prisma.user.findUnique({
      where: { cpf: cleanCpfValue },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Verificar se usuário tem senha (já completou cadastro)
    if (!user.password) {
      return {
        success: false,
        error: "Este usuário ainda não completou o cadastro",
      };
    }

    // Gerar link de reset
    const result = await generatePasswordResetLink(user.id);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Erro ao gerar link de recuperação",
      };
    }

    // TODO: Implementar envio real de email
    // Por enquanto, apenas logamos o link no console
    console.log(`[PASSWORD_RESET] Link para ${user.email}: ${result.resetLink}`);

    return {
      success: true,
      message: "Link de recuperação gerado com sucesso",
      email: user.email, // Para debug, não enviar em produção
    };
  } catch (error) {
    console.error("[REQUEST_PASSWORD_RESET_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao solicitar recuperação de senha",
    };
  }
}

"use server";

import { prisma } from "@base-church/db";
import { createUserInvite, resendInvite } from "./invite";
import { generatePasswordResetLink } from "./password-reset";

/**
 * Gera link de acesso para usuário
 * - Se já tem CPF e senha: Gera link de reset de senha
 * - Se não tem: Gera link de convite para completar cadastro
 */
export async function generateAccessLink(userId: string, createdBy: string) {
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
        isInvitePending: true,
        inviteToken: true,
        inviteTokenExpiresAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Se usuário já tem CPF e senha, gerar link de RESET DE SENHA
    if (user.cpf && user.password) {
      const result = await generatePasswordResetLink(userId);

      if (result.success && result.resetLink) {
        return {
          success: true,
          inviteLink: result.resetLink, // Padronizar como inviteLink
          expiresAt: result.expiresAt,
          linkType: "password-reset" as const,
          isExisting: false,
        };
      }

      return {
        success: false,
        error: result.error || "Erro ao gerar link de reset",
      };
    }

    // Se tem convite pendente válido, retornar o link existente
    if (
      user.isInvitePending &&
      user.inviteToken &&
      user.inviteTokenExpiresAt &&
      user.inviteTokenExpiresAt > new Date()
    ) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const inviteLink = `${baseUrl}/complete-signup?token=${user.inviteToken}`;

      return {
        success: true,
        inviteLink,
        expiresAt: user.inviteTokenExpiresAt,
        linkType: "signup" as const,
        isExisting: true,
      };
    }

    // Se tem convite expirado, reenviar
    if (user.isInvitePending && user.inviteToken) {
      const result = await resendInvite(userId, createdBy);
      return {
        ...result,
        linkType: "signup" as const,
        isExisting: false,
      };
    }

    // Se não tem convite, criar novo
    const result = await createUserInvite({
      name: user.name || "Usuário",
      email: user.email || undefined,
      role: "MEMBROS",
      createdBy,
    });

    // Atualizar o usuário existente com o token
    if (result.success && result.inviteLink) {
      // Extrair token do link
      const token = result.inviteLink.split("token=")[1];

      await prisma.user.update({
        where: { id: userId },
        data: {
          isInvitePending: true,
          inviteToken: token,
          inviteTokenExpiresAt: result.expiresAt,
        },
      });
    }

    return {
      ...result,
      linkType: "signup" as const,
      isExisting: false,
    };
  } catch (error) {
    console.error("[GENERATE_ACCESS_LINK_ERROR]:", error);
    return {
      success: false,
      error: "Erro ao gerar link de acesso",
    };
  }
}

"use server";

import { prisma } from "@base-church/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import { cleanCpf, hashPassword, isValidCpf } from "../helpers/auth.helper";

// Alias para o banco de dados
const db = prisma;

// ========================================
// PUBLIC EVENT CERTIFICATE ACTIONS
// ========================================

// Gerar certificado de evento (público, sem necessidade de login)
export async function generateEventCertificatePublic(
  eventId: string,
  name: string,
  cpf: string,
  password: string,
) {
  unstable_noStore(); // Desabilitar cache para rotas públicas
  try {
    console.log("📜 Gerando certificado público de evento...", {
      eventId,
      name,
    });

    // Validar CPF
    if (!isValidCpf(cpf)) {
      return {
        success: false,
        error: "CPF inválido",
      };
    }

    const cleanCpfValue = cleanCpf(cpf);

    // Verificar se o evento existe e tem template de certificado
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        certificateTemplate: true,
      },
    });

    if (!event) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    if (!event.certificateTemplate) {
      return {
        success: false,
        error: "Este evento não possui certificado disponível",
      };
    }

    if (!event.certificateTemplate.isActive) {
      return {
        success: false,
        error: "Certificado deste evento não está disponível no momento",
      };
    }

    // Criar ou buscar usuário
    let user = await db.user.findUnique({
      where: { cpf: cleanCpfValue },
    });

    if (!user) {
      // Criar novo usuário
      const hashedPassword = await hashPassword(password);

      user = await db.user.create({
        data: {
          name,
          cpf: cleanCpfValue,
          password: hashedPassword,
          role: "MEMBROS",
        },
      });

      // Inicializar UserStats para o novo usuário
      await db.userStats.create({
        data: {
          userId: user.id,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: new Date(),
        },
      });

      console.log("✅ Usuário criado:", user.id);
    }

    // Verificar se já existe certificado para este usuário neste evento
    const existingCertificate = await db.eventCertificate.findFirst({
      where: {
        eventId,
        userId: user.id,
      },
    });

    // Se já existe certificado, retornar o existente
    if (existingCertificate) {
      return {
        success: true,
        certificate: existingCertificate,
        isNew: false,
      };
    }

    // Gerar código de verificação único
    const verificationCode =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Gerar certificado via API
    let certificateBase64: string | null = null;

    try {
      const apiResponse = await fetch(
        "https://certificados.basechurch.com.br/api/certificate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: name,
            url_img: event.certificateTemplate.templateUrl,
          }),
        },
      );

      if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();

      if (apiData.success && apiData.certificate) {
        certificateBase64 = apiData.certificate;
      } else {
        throw new Error(apiData.message || "Falha na geração do certificado");
      }
    } catch (apiError) {
      console.error("❌ Error calling certificate API:", apiError);
      // Continue with certificate creation even if API fails
      // The certificate will be created without base64
    }

    // Criar certificado vinculado ao usuário
    const certificate = await db.eventCertificate.create({
      data: {
        userId: user.id,
        eventId,
        templateId: event.certificateTemplate.id,
        name,
        cpf: cleanCpfValue,
        verificationCode,
        status: "ISSUED",
        issuedAt: new Date(),
        certificateBase64,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        template: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
    });

    console.log("✅ Certificado de evento criado:", certificate.id);

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/events/${eventId}/certificate`);

    return {
      success: true,
      certificate,
      isNew: true,
    };
  } catch (error) {
    console.error("❌ Erro ao gerar certificado de evento:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao gerar certificado",
    };
  }
}

// Buscar certificado por código de verificação (público)
export async function getEventCertificateByVerificationCode(
  verificationCode: string,
) {
  unstable_noStore(); // Desabilitar cache para rotas públicas
  try {
    const certificate = await db.eventCertificate.findUnique({
      where: { verificationCode },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
        template: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!certificate) {
      return {
        success: false,
        error: "Certificado não encontrado",
      };
    }

    return {
      success: true,
      certificate,
    };
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);
    return {
      success: false,
      error: "Erro ao buscar certificado",
    };
  }
}

// Buscar certificado por CPF e evento (público)
export async function getEventCertificateByCpf(
  eventId: string,
  cpf: string,
) {
  unstable_noStore(); // Desabilitar cache para rotas públicas
  try {
    const cleanCpf = cpf.replace(/\D/g, "");

    const certificate = await db.eventCertificate.findFirst({
      where: {
        eventId,
        cpf: cleanCpf,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        template: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!certificate) {
      return {
        success: false,
        error: "Certificado não encontrado",
      };
    }

    return {
      success: true,
      certificate,
    };
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);
    return {
      success: false,
      error: "Erro ao buscar certificado",
    };
  }
}


"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";

// Alias para o banco de dados
const db = prisma;

// Certificate Actions
export async function getAllCertificates() {
  try {
    console.log("🏆 Buscando certificados...");

    const certificates = await db.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    console.log("📊 Certificados encontrados:", certificates.length);

    return {
      success: true,
      certificates,
    };
  } catch (error) {
    console.error("Erro ao buscar certificados:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao buscar certificados",
    };
  }
}

export async function getCertificateStats() {
  try {
    console.log("📈 Buscando estatísticas de certificados...");

    const [totalCertificates, issuedCertificates, pendingCertificates] =
      await Promise.all([
        // Total de certificados
        db.certificate.count(),

        // Certificados emitidos (com issuedAt)
        db.certificate.count({
          where: {
            issuedAt: {
              not: null as any,
            },
          },
        }),

        // Certificados pendentes (sem issuedAt)
        db.certificate.count({
          where: {
            issuedAt: null as any,
          },
        }),
      ]);

    // Para agora, vamos usar um valor padrão para a nota média
    // Em uma implementação real, você adicionaria um campo grade ao modelo Certificate
    const defaultAverageGrade = 92.5; // Valor padrão baseado nos dados mock

    console.log("📊 Estatísticas de certificados:", {
      totalCertificates,
      issuedCertificates,
      pendingCertificates,
      averageGrade: defaultAverageGrade,
    });

    return {
      success: true,
      stats: {
        totalCertificates,
        issuedCertificates,
        pendingCertificates,
        averageGrade: defaultAverageGrade,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de certificados:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao buscar estatísticas",
    };
  }
}

export async function getCertificateById(certificateId: string) {
  try {
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      return { success: false, error: "Certificado não encontrado" };
    }

    return { success: true, certificate };
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao buscar certificado",
    };
  }
}

export async function revokeCertificate(certificateId: string) {
  try {
    const certificate = await db.certificate.update({
      where: { id: certificateId },
      data: {
        // Em uma implementação real, você adicionaria um campo status ou revokedAt
        // Por enquanto, vamos apenas deletar o certificado
      },
    });

    // Na verdade, vamos deletar o certificado para simular a revogação
    await db.certificate.delete({
      where: { id: certificateId },
    });

    revalidatePath("/dashboard/certificates");
    return {
      success: true,
      message: "Certificado revogado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao revogar certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao revogar certificado",
    };
  }
}

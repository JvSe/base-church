"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import {
  CreateCertificateInput,
  CreateCertificateTemplateInput,
  IssueCertificateInput,
  UpdateCertificateInput,
  UpdateCertificateTemplateInput,
} from "../types/certificate";

// Alias para o banco de dados
const db = prisma;

// ========================================
// CERTIFICATE TEMPLATE ACTIONS
// ========================================

// Buscar todos os templates de certificado
export async function getAllCertificateTemplates() {
  try {
    console.log("📋 Buscando templates de certificado...");

    const templates = await db.certificateTemplate.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        certificates: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("📊 Templates encontrados:", templates.length);

    return {
      success: true,
      templates,
    };
  } catch (error) {
    console.error("Erro ao buscar templates de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar templates de certificado",
    };
  }
}

// Buscar template por ID
export async function getCertificateTemplateById(templateId: string) {
  try {
    const template = await db.certificateTemplate.findUnique({
      where: { id: templateId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!template) {
      return {
        success: false,
        error: "Template de certificado não encontrado",
      };
    }

    return { success: true, template };
  } catch (error) {
    console.error("Erro ao buscar template de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar template de certificado",
    };
  }
}

// Buscar template por curso
export async function getCertificateTemplateByCourse(courseId: string) {
  try {
    const template = await db.certificateTemplate.findUnique({
      where: { courseId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { success: true, template };
  } catch (error) {
    console.error("Erro ao buscar template por curso:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar template por curso",
    };
  }
}

// Criar template de certificado
export async function createCertificateTemplate(
  data: CreateCertificateTemplateInput,
) {
  try {
    console.log("📜 Criando template de certificado...", data);

    const template = await db.certificateTemplate.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description,
        templateUrl: data.templateUrl,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log("✅ Template de certificado criado:", template.id);

    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      template,
    };
  } catch (error) {
    console.error("Erro ao criar template de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao criar template de certificado",
    };
  }
}

// Atualizar template de certificado
export async function updateCertificateTemplate(
  templateId: string,
  data: UpdateCertificateTemplateInput,
) {
  try {
    console.log("📝 Atualizando template de certificado...", templateId, data);

    const template = await db.certificateTemplate.update({
      where: { id: templateId },
      data: {
        title: data.title,
        description: data.description,
        templateUrl: data.templateUrl,
        isActive: data.isActive,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log("✅ Template de certificado atualizado:", template.id);

    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      template,
    };
  } catch (error) {
    console.error("Erro ao atualizar template de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar template de certificado",
    };
  }
}

// Excluir template de certificado
export async function deleteCertificateTemplate(templateId: string) {
  try {
    console.log("🗑️ Excluindo template de certificado...", templateId);

    await db.certificateTemplate.delete({
      where: { id: templateId },
    });

    console.log("✅ Template de certificado excluído:", templateId);

    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/certificates");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao excluir template de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao excluir template de certificado",
    };
  }
}

// ========================================
// CERTIFICATE ACTIONS
// ========================================
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
        template: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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

    const [
      totalCertificates,
      issuedCertificates,
      pendingCertificates,
      revokedCertificates,
      averageGrade,
    ] = await Promise.all([
      // Total de certificados
      db.certificate.count(),

      // Certificados emitidos
      db.certificate.count({
        where: {
          status: "ISSUED",
        },
      }),

      // Certificados pendentes
      db.certificate.count({
        where: {
          status: "PENDING",
        },
      }),

      // Certificados revogados
      db.certificate.count({
        where: {
          status: "REVOKED",
        },
      }),

      // Calcular média das avaliações dos cursos
      db.courseReview
        .aggregate({
          _avg: {
            rating: true,
          },
        })
        .then((result) => {
          // Converter rating de 1-5 para nota de 0-100
          const avgRating = result._avg.rating;
          if (avgRating === null || avgRating === undefined) {
            return 0; // Nenhuma avaliação encontrada
          }
          // Converter de escala 1-5 para 0-100
          return Math.round((avgRating / 5) * 100);
        }),
    ]);

    console.log("📊 Estatísticas de certificados:", {
      totalCertificates,
      issuedCertificates,
      pendingCertificates,
      revokedCertificates,
      averageGrade,
    });

    return {
      success: true,
      stats: {
        totalCertificates,
        issuedCertificates,
        pendingCertificates,
        revokedCertificates,
        averageGrade,
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

// Buscar certificado por código de verificação
export async function getCertificateByVerificationCode(
  verificationCode: string,
) {
  try {
    const certificate = await db.certificate.findUnique({
      where: { verificationCode },
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
      return { success: false, error: "Certificado não encontrado" };
    }

    return { success: true, certificate };
  } catch (error) {
    console.error("Erro ao buscar certificado por código:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar certificado por código",
    };
  }
}

export async function revokeCertificate(certificateId: string) {
  try {
    const certificate = await db.certificate.update({
      where: { id: certificateId },
      data: {
        status: "REVOKED",
      },
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

// Criar certificado (quando usuário completa curso)
export async function createCertificate(data: CreateCertificateInput) {
  try {
    console.log("📜 Criando certificado...", data);

    // Gerar código de verificação único
    const verificationCode = generateVerificationCode();

    const certificate = await db.certificate.create({
      data: {
        courseId: data.courseId,
        templateId: data.templateId,
        userId: data.userId,
        verificationCode,
        status: "PENDING",
      },
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
        template: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    console.log("✅ Certificado criado:", certificate.id);

    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      certificate,
    };
  } catch (error) {
    console.error("Erro ao criar certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao criar certificado",
    };
  }
}

// Emitir certificado (quando processado)
export async function issueCertificate(data: IssueCertificateInput) {
  try {
    console.log("🎓 Emitindo certificado...", data);

    const certificate = await db.certificate.update({
      where: { id: data.certificateId },
      data: {
        userId: data.userId,
        status: "ISSUED",
        issuedAt: new Date(),
        certificateUrl: data.certificateUrl,
      },
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
        template: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    console.log("✅ Certificado emitido:", certificate.id);

    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      certificate,
    };
  } catch (error) {
    console.error("Erro ao emitir certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao emitir certificado",
    };
  }
}

// Atualizar certificado
export async function updateCertificate(
  certificateId: string,
  data: UpdateCertificateInput,
) {
  try {
    console.log("📝 Atualizando certificado...", certificateId, data);

    const certificate = await db.certificate.update({
      where: { id: certificateId },
      data: {
        status: data.status,
        certificateUrl: data.certificateUrl,
        issuedAt: data.issuedAt,
      },
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
        template: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    console.log("✅ Certificado atualizado:", certificate.id);

    revalidatePath("/dashboard/certificates");

    return {
      success: true,
      certificate,
    };
  } catch (error) {
    console.error("Erro ao atualizar certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar certificado",
    };
  }
}

// Excluir certificado
export async function deleteCertificate(certificateId: string) {
  try {
    console.log("🗑️ Excluindo certificado...", certificateId);

    await db.certificate.delete({
      where: { id: certificateId },
    });

    console.log("✅ Certificado excluído:", certificateId);

    revalidatePath("/dashboard/certificates");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao excluir certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao excluir certificado",
    };
  }
}

// Buscar usuários para seleção
export async function getUsersForCertificate() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar usuários",
    };
  }
}

// Buscar cursos para seleção
export async function getCoursesForCertificate() {
  try {
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
      where: {
        isPublished: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return {
      success: true,
      courses,
    };
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar cursos",
    };
  }
}

// Buscar templates de certificado para seleção
export async function getCertificateTemplatesForSelection() {
  try {
    const templates = await db.certificateTemplate.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      where: {
        isActive: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return {
      success: true,
      templates,
    };
  } catch (error) {
    console.error("Erro ao buscar templates de certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar templates de certificado",
    };
  }
}

// Buscar certificados pendentes para processamento
export async function getPendingCertificates() {
  try {
    const certificates = await db.certificate.findMany({
      where: {
        status: "PENDING",
      },
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
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            templateUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      certificates,
    };
  } catch (error) {
    console.error("Erro ao buscar certificados pendentes:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar certificados pendentes",
    };
  }
}

// Gerar código de verificação único
function generateVerificationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`.toUpperCase();
}

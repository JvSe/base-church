"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import {
  deleteCertificateTemplate as deleteTemplateFile,
  downloadCertificateTemplate,
  uploadCertificateTemplate,
} from "../storage/certificate-storage";

// Alias para o banco de dados
const db = prisma;

// ========================================
// EVENT CERTIFICATE TEMPLATE ACTIONS
// ========================================

// Buscar template por evento
export async function getEventCertificateTemplateByEvent(eventId: string) {
  try {
    const template = await db.eventCertificateTemplate.findUnique({
      where: { eventId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { success: true, template };
  } catch (error) {
    console.error("Erro ao buscar template por evento:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar template por evento",
    };
  }
}

// Buscar template por ID
export async function getEventCertificateTemplateById(templateId: string) {
  try {
    const template = await db.eventCertificateTemplate.findUnique({
      where: { id: templateId },
      include: {
        event: {
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

// Upload de template de certificado para Supabase Storage
export async function uploadEventCertificateTemplateToStorage(
  templateId: string,
  file: File | Buffer,
  eventId: string,
  fileName?: string,
) {
  try {
    console.log("📤 Enviando template de evento para Supabase Storage...", {
      templateId,
      eventId,
    });

    const uploadResult = await uploadCertificateTemplate(
      file,
      eventId,
      templateId,
      fileName,
    );

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || "Erro no upload do template",
      };
    }

    // Atualizar o template no banco com a URL do Supabase
    const template = await db.eventCertificateTemplate.update({
      where: { id: templateId },
      data: {
        templateUrl: uploadResult.url,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log("✅ Template enviado e atualizado:", template.id);

    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${eventId}`);

    return {
      success: true,
      template,
      storageUrl: uploadResult.url,
      storagePath: uploadResult.path,
    };
  } catch (error) {
    console.error("❌ Erro no upload do template:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro desconhecido no upload",
    };
  }
}

// Criar template de certificado com upload para Supabase Storage
export async function createEventCertificateTemplateWithStorage(
  eventId: string,
  title: string,
  description: string | null,
  file: File | Buffer,
  fileName?: string,
) {
  try {
    console.log("📋 Criando template de evento com upload...", {
      eventId,
      title,
    });

    // Primeiro criar o template no banco
    const template = await db.eventCertificateTemplate.create({
      data: {
        eventId,
        title,
        description,
        templateUrl: "", // Será atualizado após o upload
        isActive: true,
      },
    });

    // Upload do arquivo para Supabase Storage
    const uploadResult = await uploadEventCertificateTemplateToStorage(
      template.id,
      file,
      eventId,
      fileName,
    );

    if (!uploadResult.success) {
      // Se o upload falhou, deletar o template criado
      await db.eventCertificateTemplate.delete({
        where: { id: template.id },
      });
      return uploadResult;
    }

    console.log("✅ Template criado e enviado para Supabase Storage");

    return {
      success: true,
      template: uploadResult.template,
      storageUrl: uploadResult.storageUrl,
      storagePath: uploadResult.storagePath,
    };
  } catch (error) {
    console.error("❌ Erro ao criar template:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro desconhecido na criação",
    };
  }
}

// Atualizar template de certificado com upload para Supabase Storage
export async function updateEventCertificateTemplateWithStorage(
  templateId: string,
  title: string,
  description: string | null,
  file?: File | Buffer,
  fileName?: string,
) {
  try {
    console.log("📝 Atualizando template de evento...", {
      templateId,
      title,
    });

    // Buscar template existente para obter eventId
    const existingTemplate = await db.eventCertificateTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      return {
        success: false,
        error: "Template não encontrado",
      };
    }

    // Se tem arquivo novo, fazer upload
    if (file) {
      const uploadResult = await uploadEventCertificateTemplateToStorage(
        templateId,
        file,
        existingTemplate.eventId,
        fileName,
      );

      if (!uploadResult.success) {
        return uploadResult;
      }

      // Atualizar template no banco
      const template = await db.eventCertificateTemplate.update({
        where: { id: templateId },
        data: {
          title,
          description,
          templateUrl: uploadResult.storageUrl,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      console.log("✅ Template atualizado e enviado para Supabase Storage");

      return {
        success: true,
        template,
        storageUrl: uploadResult.storageUrl,
        storagePath: uploadResult.storagePath,
      };
    } else {
      // Apenas atualizar dados sem arquivo
      const template = await db.eventCertificateTemplate.update({
        where: { id: templateId },
        data: {
          title,
          description,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      console.log("✅ Template atualizado (sem arquivo)");

      return {
        success: true,
        template,
      };
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido na atualização",
    };
  }
}

// Deletar template de certificado
export async function deleteEventCertificateTemplate(templateId: string) {
  try {
    const template = await db.eventCertificateTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return {
        success: false,
        error: "Template não encontrado",
      };
    }

    // Deletar arquivo do storage se existir
    if (template.templateUrl) {
      // Extrair o path do URL
      const urlParts = template.templateUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `templates/${fileName}`;

      await deleteTemplateFile(filePath);
    }

    // Deletar template do banco
    await db.eventCertificateTemplate.delete({
      where: { id: templateId },
    });

    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${template.eventId}`);

    return {
      success: true,
      message: "Template excluído com sucesso",
    };
  } catch (error) {
    console.error("❌ Erro ao excluir template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido na exclusão",
    };
  }
}


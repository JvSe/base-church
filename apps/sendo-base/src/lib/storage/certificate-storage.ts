import {
  STORAGE_BUCKETS,
  generateUniqueFileName,
  getPublicUrl,
  supabaseAdmin,
} from "../supabase";

export interface CertificateUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface CertificateDownloadResult {
  success: boolean;
  data?: ArrayBuffer;
  error?: string;
}

/**
 * Upload de certificado para o Supabase Storage
 */
export async function uploadCertificate(
  file: File | Buffer,
  userId: string,
  certificateId: string,
  fileName?: string,
): Promise<CertificateUploadResult> {
  try {
    console.log("📤 Iniciando upload do certificado...", {
      userId,
      certificateId,
    });

    // Gerar nome único para o arquivo
    const uniqueFileName = fileName
      ? generateUniqueFileName(fileName, userId)
      : generateUniqueFileName(`certificate-${certificateId}.pdf`, userId);

    // Definir o caminho no storage
    const filePath = `certificates/${uniqueFileName}`;

    // Converter File para Buffer se necessário
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload para o Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.CERTIFICATES)
      .upload(filePath, fileBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Erro no upload:", error);
      return {
        success: false,
        error: `Erro no upload: ${error.message}`,
      };
    }

    // Obter URL pública
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.CERTIFICATES, data.path);

    console.log("✅ Certificado enviado com sucesso:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("❌ Erro no upload do certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro desconhecido no upload",
    };
  }
}

/**
 * Download de certificado do Supabase Storage
 */
export async function downloadCertificate(
  filePath: string,
): Promise<CertificateDownloadResult> {
  try {
    console.log("📥 Iniciando download do certificado...", { filePath });

    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.CERTIFICATES)
      .download(filePath);

    if (error) {
      console.error("❌ Erro no download:", error);
      return {
        success: false,
        error: `Erro no download: ${error.message}`,
      };
    }

    // Converter Blob para ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();

    console.log("✅ Certificado baixado com sucesso");

    return {
      success: true,
      data: arrayBuffer,
    };
  } catch (error) {
    console.error("❌ Erro no download do certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido no download",
    };
  }
}

/**
 * Obter URL pública do certificado
 */
export async function getCertificateUrl(
  filePath: string,
): Promise<string | null> {
  try {
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.CERTIFICATES, filePath);
    return publicUrl;
  } catch (error) {
    console.error("❌ Erro ao obter URL do certificado:", error);
    return null;
  }
}

/**
 * Deletar certificado do Supabase Storage
 */
export async function deleteCertificate(
  filePath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("🗑️ Iniciando exclusão do certificado...", { filePath });

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.CERTIFICATES)
      .remove([filePath]);

    if (error) {
      console.error("❌ Erro na exclusão:", error);
      return {
        success: false,
        error: `Erro na exclusão: ${error.message}`,
      };
    }

    console.log("✅ Certificado excluído com sucesso");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Erro na exclusão do certificado:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido na exclusão",
    };
  }
}

/**
 * Verificar se o certificado existe no storage
 */
export async function certificateExists(filePath: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.CERTIFICATES)
      .list(filePath.split("/")[0], {
        search: filePath.split("/").pop(),
      });

    if (error) {
      console.error("❌ Erro ao verificar existência:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("❌ Erro ao verificar existência do certificado:", error);
    return false;
  }
}

// ========================================
// CERTIFICATE TEMPLATE STORAGE FUNCTIONS
// ========================================

/**
 * Upload de template de certificado para Supabase Storage
 */
export async function uploadCertificateTemplate(
  file: File | Buffer,
  courseId: string,
  templateId: string,
  fileName?: string,
): Promise<CertificateUploadResult> {
  try {
    console.log(
      "📤 Enviando template de certificado para Supabase Storage...",
      {
        courseId,
        templateId,
      },
    );

    // Gerar nome único para o arquivo
    const uniqueFileName = fileName
      ? generateUniqueFileName(fileName, courseId)
      : generateUniqueFileName(`template-${templateId}.pdf`, courseId);

    // Definir o caminho no storage
    const filePath = `templates/${uniqueFileName}`;

    // Converter File para Buffer se necessário
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload para o Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.TEMPLATES)
      .upload(filePath, fileBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Erro no upload do template:", error);
      return {
        success: false,
        error: `Erro no upload: ${error.message}`,
      };
    }

    // Obter URL pública
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.TEMPLATES, data.path);

    console.log("✅ Template enviado com sucesso:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
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

/**
 * Download de template de certificado do Supabase Storage
 */
export async function downloadCertificateTemplate(
  filePath: string,
): Promise<CertificateDownloadResult> {
  try {
    console.log("📥 Baixando template do Supabase Storage...", { filePath });

    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.TEMPLATES)
      .download(filePath);

    if (error) {
      console.error("❌ Erro no download do template:", error);
      return {
        success: false,
        error: `Erro no download: ${error.message}`,
      };
    }

    // Converter Blob para ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();

    console.log("✅ Template baixado com sucesso");

    return {
      success: true,
      data: arrayBuffer,
    };
  } catch (error) {
    console.error("❌ Erro no download do template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido no download",
    };
  }
}

/**
 * Deletar template de certificado do Supabase Storage
 */
export async function deleteCertificateTemplate(
  filePath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("🗑️ Excluindo template do Supabase Storage...", { filePath });

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKETS.TEMPLATES)
      .remove([filePath]);

    if (error) {
      console.error("❌ Erro na exclusão do template:", error);
      return {
        success: false,
        error: `Erro na exclusão: ${error.message}`,
      };
    }

    console.log("✅ Template excluído com sucesso");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Erro na exclusão do template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido na exclusão",
    };
  }
}

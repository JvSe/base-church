"use server";

import { supabaseAdmin } from "../supabase";
import {
  STORAGE_BUCKETS,
  generateUniqueFileName,
  getPublicUrl,
  extractPathFromUrl,
} from "../supabase";

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Função genérica para deletar imagem antiga
 */
async function deleteOldImage(
  bucket: string,
  oldUrl: string | null | undefined,
): Promise<void> {
  if (!oldUrl || !oldUrl.includes("supabase")) {
    console.log("⏭️ Sem imagem antiga para deletar ou não é do Supabase");
    return;
  }

  try {
    const oldPath = extractPathFromUrl(oldUrl, bucket);
    if (!oldPath) {
      console.warn("⚠️ Não foi possível extrair o path da URL antiga");
      return;
    }

    console.log(`🗑️ Deletando imagem antiga: ${oldPath}`);

    const { error } = await supabaseAdmin.storage.from(bucket).remove([oldPath]);

    if (error) {
      console.error("❌ Erro ao deletar imagem antiga:", error);
      // Não lançar erro, apenas logar
    } else {
      console.log("✅ Imagem antiga deletada com sucesso");
    }
  } catch (error) {
    console.error("❌ Erro ao deletar imagem antiga:", error);
    // Não lançar erro, apenas logar
  }
}

/**
 * Função genérica para fazer upload de imagem
 */
async function uploadImage(
  bucket: string,
  file: File | Buffer,
  entityId: string,
  fileName: string,
  oldImageUrl?: string | null,
): Promise<ImageUploadResult> {
  try {
    // PASSO 1: Deletar imagem antiga se existir
    if (oldImageUrl) {
      await deleteOldImage(bucket, oldImageUrl);
    }

    // PASSO 2: Gerar nome único
    const uniqueFileName = generateUniqueFileName(fileName, entityId);
    const filePath = `${entityId}/${uniqueFileName}`;

    // PASSO 3: Converter File para Buffer
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // PASSO 4: Upload para Supabase
    const contentType = file instanceof File ? file.type : "image/png";

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: false, // Não sobrescrever, criar novo arquivo
      });

    if (error) {
      console.error("❌ Erro no upload:", error);
      return {
        success: false,
        error: `Erro no upload: ${error.message}`,
      };
    }

    // PASSO 5: Obter URL pública
    const publicUrl = getPublicUrl(bucket, data.path);

    console.log("✅ Imagem enviada com sucesso:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro desconhecido no upload",
    };
  }
}

// ============================================================================
// FUNÇÕES ESPECÍFICAS POR TIPO DE IMAGEM
// ============================================================================

/**
 * Upload de avatar de usuário
 * Deleta avatar antigo automaticamente se existir
 */
export async function uploadUserAvatar(
  file: File | Buffer,
  userId: string,
  oldAvatarUrl?: string | null,
  fileName: string = "avatar.png",
): Promise<ImageUploadResult> {
  console.log("📤 Enviando avatar do usuário para Supabase Storage...", {
    userId,
    hasOldAvatar: !!oldAvatarUrl,
  });

  return uploadImage(
    STORAGE_BUCKETS.USER_AVATARS,
    file,
    userId,
    fileName,
    oldAvatarUrl,
  );
}

/**
 * Upload de banner de curso
 * Deleta banner antigo automaticamente se existir
 */
export async function uploadCourseImage(
  file: File | Buffer,
  courseId: string,
  oldImageUrl?: string | null,
  fileName: string = "banner.png",
): Promise<ImageUploadResult> {
  console.log("📤 Enviando banner do curso para Supabase Storage...", {
    courseId,
    hasOldImage: !!oldImageUrl,
  });

  return uploadImage(
    STORAGE_BUCKETS.COURSE_IMAGES,
    file,
    courseId,
    fileName,
    oldImageUrl,
  );
}

/**
 * Upload de imagem de trilha
 * Deleta imagem antiga automaticamente se existir
 */
export async function uploadTrackImage(
  file: File | Buffer,
  trackId: string,
  oldImageUrl?: string | null,
  fileName: string = "cover.png",
): Promise<ImageUploadResult> {
  console.log("📤 Enviando imagem da trilha para Supabase Storage...", {
    trackId,
    hasOldImage: !!oldImageUrl,
  });

  return uploadImage(
    STORAGE_BUCKETS.TRACK_IMAGES,
    file,
    trackId,
    fileName,
    oldImageUrl,
  );
}

/**
 * Deletar avatar de usuário manualmente (para casos específicos)
 */
export async function deleteUserAvatar(avatarUrl: string): Promise<boolean> {
  try {
    await deleteOldImage(STORAGE_BUCKETS.USER_AVATARS, avatarUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletar banner de curso manualmente
 */
export async function deleteCourseImage(imageUrl: string): Promise<boolean> {
  try {
    await deleteOldImage(STORAGE_BUCKETS.COURSE_IMAGES, imageUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletar imagem de trilha manualmente
 */
export async function deleteTrackImage(imageUrl: string): Promise<boolean> {
  try {
    await deleteOldImage(STORAGE_BUCKETS.TRACK_IMAGES, imageUrl);
    return true;
  } catch {
    return false;
  }
}


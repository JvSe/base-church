import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client para uso no frontend (com autenticação do usuário)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client para uso no backend (com service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Configurações do Storage
export const STORAGE_BUCKETS = {
  CERTIFICATES: "certificates",
  TEMPLATES: "certificate-templates",
  USER_AVATARS: "user-avatars",
  COURSE_IMAGES: "course-images",
  TRACK_IMAGES: "track-images",
} as const;

// Função para gerar nome único do arquivo
export function generateUniqueFileName(
  originalName: string,
  userId: string,
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

// Função para obter URL pública do arquivo
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extrai o path do arquivo a partir da URL pública do Supabase
 * Exemplo: https://xxx.supabase.co/storage/v1/object/public/user-avatars/userId/file.png
 * Retorna: userId/file.png
 */
export function extractPathFromUrl(url: string, bucket: string): string | null {
  try {
    if (!url.includes("supabase")) return null;
    
    const urlParts = url.split(`/public/${bucket}/`);
    if (urlParts.length < 2) return null;
    
    return urlParts[1];
  } catch {
    return null;
  }
}

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

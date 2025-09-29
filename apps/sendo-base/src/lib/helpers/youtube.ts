/**
 * Extrai o YouTube Embed ID de diferentes formatos de URL do YouTube
 * @param url - URL do YouTube (qualquer formato)
 * @returns YouTube Embed ID ou null se não conseguir extrair
 */
export function extractYouTubeEmbedId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Remove espaços em branco
  const cleanUrl = url.trim();

  // Padrões de URL do YouTube que precisamos suportar:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/watch?v=VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  // - https://youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID

  const patterns = [
    // Padrão: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Padrão: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Padrão: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Se a URL já é apenas o ID (11 caracteres alfanuméricos)
  const directIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (directIdPattern.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Valida se uma string é um YouTube Embed ID válido
 * @param id - String para validar
 * @returns true se for um ID válido
 */
export function isValidYouTubeEmbedId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }

  // YouTube IDs têm exatamente 11 caracteres
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  return youtubeIdPattern.test(id.trim());
}

/**
 * Gera a URL de embed do YouTube a partir do ID
 * @param embedId - YouTube Embed ID
 * @returns URL de embed do YouTube
 */
export function generateYouTubeEmbedUrl(embedId: string): string {
  if (!isValidYouTubeEmbedId(embedId)) {
    throw new Error("Invalid YouTube Embed ID");
  }

  return `https://www.youtube.com/embed/${embedId}`;
}

/**
 * Gera a URL de visualização do YouTube a partir do ID
 * @param embedId - YouTube Embed ID
 * @returns URL de visualização do YouTube
 */
export function generateYouTubeWatchUrl(embedId: string): string {
  if (!isValidYouTubeEmbedId(embedId)) {
    throw new Error("Invalid YouTube Embed ID");
  }

  return `https://www.youtube.com/watch?v=${embedId}`;
}

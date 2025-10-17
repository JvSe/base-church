/**
 * Formata uma data para exibição relativa (ex: "2h atrás", "3d atrás")
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  if (diffInWeeks < 4) return `${diffInWeeks}sem atrás`;
  if (diffInMonths < 12)
    return `${diffInMonths}mês${diffInMonths > 1 ? "es" : ""} atrás`;
  return `${diffInYears} ano${diffInYears > 1 ? "s" : ""} atrás`;
}

/**
 * Formata uma contagem para exibição compacta (ex: 1.2K, 3.5M)
 */
export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

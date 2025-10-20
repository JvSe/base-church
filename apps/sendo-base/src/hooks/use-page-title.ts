import { useEffect } from "react";

/**
 * Hook para definir o título da página em componentes client
 * @param title - Título da página (será formatado como "título | Sendo Base")
 * @param absolute - Se true, usa o título exato sem adicionar "| Sendo Base"
 */
export function usePageTitle(title: string, absolute = false) {
  useEffect(() => {
    const formattedTitle = absolute ? title : `${title} | Sendo Base`;
    document.title = formattedTitle;

    // Cleanup: restaurar o título padrão quando o componente desmontar
    return () => {
      document.title = "Sendo Base";
    };
  }, [title, absolute]);
}

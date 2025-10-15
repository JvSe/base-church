import { useState } from "react";

/**
 * Hook para gerenciar estado de acordeões
 *
 * Simplifica a gestão complexa de múltiplos acordeões aninhados
 *
 * @example
 * const { openItems, toggleItem, openItem, closeItem, isOpen } = useAccordionState();
 *
 * // Abrir módulo
 * openItem('module-0');
 *
 * // Verificar se está aberto
 * if (isOpen('module-0')) { ... }
 *
 * // Toggle
 * toggleItem('lesson-0-1');
 */

type UseAccordionStateOptions = {
  initialItems?: string[];
  allowMultiple?: boolean;
};

export function useAccordionState(options: UseAccordionStateOptions = {}) {
  const { initialItems = [], allowMultiple = true } = options;

  const [openItems, setOpenItems] = useState<string[]>(initialItems);

  /**
   * Verifica se um item está aberto
   */
  const isOpen = (itemId: string): boolean => {
    return openItems.includes(itemId);
  };

  /**
   * Abre um item específico
   */
  const openItem = (itemId: string) => {
    if (allowMultiple) {
      if (!openItems.includes(itemId)) {
        setOpenItems([...openItems, itemId]);
      }
    } else {
      setOpenItems([itemId]);
    }
  };

  /**
   * Fecha um item específico
   */
  const closeItem = (itemId: string) => {
    setOpenItems(openItems.filter((id) => id !== itemId));
  };

  /**
   * Toggle de um item
   */
  const toggleItem = (itemId: string) => {
    if (isOpen(itemId)) {
      closeItem(itemId);
    } else {
      openItem(itemId);
    }
  };

  /**
   * Fecha todos os itens
   */
  const closeAll = () => {
    setOpenItems([]);
  };

  /**
   * Abre múltiplos itens de uma vez
   */
  const openMultiple = (itemIds: string[]) => {
    if (allowMultiple) {
      const newItems = itemIds.filter((id) => !openItems.includes(id));
      setOpenItems([...openItems, ...newItems]);
    } else {
      setOpenItems([itemIds[0] || ""]);
    }
  };

  /**
   * Substitui completamente os itens abertos
   */
  const setItems = (itemIds: string[]) => {
    setOpenItems(itemIds);
  };

  return {
    openItems,
    isOpen,
    openItem,
    closeItem,
    toggleItem,
    closeAll,
    openMultiple,
    setItems,
  };
}

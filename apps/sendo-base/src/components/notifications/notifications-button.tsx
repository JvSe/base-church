"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "./hook";
import { NotificationsDropdown } from "./notifications-dropdown";
import { NotificationsDropdownVariants } from "./notifications-dropdown-variants";

export function NotificationsButton({
  variant,
}: {
  variant?: "modern" | "minimalist" | "card" | "timeline";
}) {
  const {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearAll,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isClearing,
  } = useNotifications();

  // Mostrar loading se estiver carregando
  if (isLoading) {
    return (
      <div className="dark-glass dark-border hover:dark-border-hover relative animate-pulse rounded-lg p-3">
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    console.error("Erro ao carregar notificações:", error);
    // Mesmo com erro, mostrar o botão vazio para não quebrar a UI
  }

  if (variant) {
    return (
      <NotificationsDropdownVariants
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
        variant={variant}
      />
    );
  }

  return (
    <NotificationsDropdown
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onClearAll={clearAll}
    />
  );
}

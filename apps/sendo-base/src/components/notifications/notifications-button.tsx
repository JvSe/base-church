"use client";

import { MobileNotificationsDrawer } from "@/src/components/mobile";
import { useResponsive } from "@/src/hooks";
import { Bell } from "lucide-react";
import { useNotifications } from "./hook";
import { NotificationsDropdown } from "./notifications-dropdown";

export function NotificationsButton() {
  const { isMobile } = useResponsive();
  const {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="dark-glass dark-border hover:dark-border-hover relative animate-pulse rounded-lg p-3">
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  // Mostrar erro (mas não quebrar a UI)
  if (error) {
    console.error("Erro ao carregar notificações:", error);
  }

  // Use drawer on mobile, dropdown on desktop
  if (isMobile) {
    return (
      <MobileNotificationsDrawer
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
        isLoading={isLoading}
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

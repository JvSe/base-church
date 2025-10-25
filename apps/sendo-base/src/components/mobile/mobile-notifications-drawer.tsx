"use client";

import { Badge } from "@base-church/ui/components/badge";
import { Button } from "@base-church/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@base-church/ui/components/drawer";
import { Bell, Check, X } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type:
    | "course_completed"
    | "certificate_ready"
    | "new_lesson"
    | "community_post"
    | "forum_reply";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    courseName?: string;
    lessonName?: string;
    userName?: string;
    communityName?: string;
  };
}

interface MobileNotificationsDrawerProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  isLoading?: boolean;
}

export function MobileNotificationsDrawer({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  isLoading = false,
}: MobileNotificationsDrawerProps) {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course_completed":
        return "🎓";
      case "certificate_ready":
        return "🏆";
      case "new_lesson":
        return "📚";
      case "community_post":
        return "👥";
      case "forum_reply":
        return "💬";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "course_completed":
        return "text-green-400";
      case "certificate_ready":
        return "text-yellow-400";
      case "new_lesson":
        return "text-blue-400";
      case "community_post":
        return "text-purple-400";
      case "forum_reply":
        return "text-cyan-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "Agora";
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark-text-secondary hover:dark-text-primary relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="dark-bg-secondary h-full w-full border-0">
        <DrawerHeader className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DrawerTitle className="dark-text-primary text-lg font-semibold">
                Notificações
              </DrawerTitle>
              <DrawerDescription className="dark-text-tertiary text-sm">
                {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="dark-text-secondary hover:dark-text-primary"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Marcar todas
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="dark-text-secondary hover:dark-text-primary"
                >
                  <X className="mr-1 h-4 w-4" />
                  Limpar
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="dark-text-secondary hover:dark-text-primary"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="dark-bg-tertiary animate-pulse rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`dark-bg-tertiary hover:dark-bg-quaternary rounded-lg p-4 transition-all ${
                    !notification.read ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="dark-text-primary text-sm font-medium">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead?.(notification.id)}
                            className="dark-text-tertiary hover:dark-text-primary h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="dark-text-secondary mt-1 text-sm">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="dark-text-tertiary text-xs">
                          {formatDate(notification.createdAt)}
                        </span>
                        <span
                          className={`text-xs font-medium ${getNotificationColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="dark-bg-tertiary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Bell className="dark-text-tertiary h-8 w-8" />
              </div>
              <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                Nenhuma notificação
              </h3>
              <p className="dark-text-tertiary text-sm">
                Você está em dia! Novas notificações aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

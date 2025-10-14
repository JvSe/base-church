"use client";

import { useAuth } from "@/src/hooks";
import {
  clearAllNotifications,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/src/lib/actions/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Notification } from "./notifications-dropdown";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar notificações
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const result = await getUserNotifications(user.id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar notificações");
      }

      return result.notifications;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  // Marcar notificação como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const result = await markNotificationAsRead(notificationId, user.id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao marcar notificação como lida");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidar e refetch as notificações
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success("Notificação marcada como lida");
    },
    onError: (error) => {
      console.error("Erro ao marcar notificação como lida:", error);
      toast.error("Erro ao marcar notificação como lida");
    },
  });

  // Marcar todas as notificações como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const result = await markAllNotificationsAsRead(user.id);
      if (!result.success) {
        throw new Error(
          result.error || "Erro ao marcar todas as notificações como lidas",
        );
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success(`${result.updatedCount} notificações marcadas como lidas`);
    },
    onError: (error) => {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      toast.error("Erro ao marcar todas as notificações como lidas");
    },
  });

  // Limpar todas as notificações
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const result = await clearAllNotifications(user.id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao limpar notificações");
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success(`${result.deletedCount} notificações removidas`);
    },
    onError: (error) => {
      console.error("Erro ao limpar notificações:", error);
      toast.error("Erro ao limpar notificações");
    },
  });

  return {
    notifications: notifications as unknown as Notification[],
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    clearAll: clearAllMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isClearing: clearAllMutation.isPending,
  };
};

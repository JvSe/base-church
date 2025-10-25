"use client";

import { useState } from "react";
import { MobileNotificationsDrawer } from "./mobile-notifications-drawer";

// Dados de exemplo para testar o drawer
const mockNotifications = [
  {
    id: "1",
    title: "Nova lição disponível",
    message: "Uma nova lição do curso 'Fundamentos da Fé' está disponível.",
    type: "new_lesson" as const,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    actionUrl: "/contents",
    metadata: {
      courseName: "Fundamentos da Fé",
      lessonName: "Introdução à Teologia",
    },
  },
  {
    id: "2",
    title: "Curso concluído",
    message: "Parabéns! Você concluiu o curso 'Introdução à Bíblia'.",
    type: "course_completed" as const,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    actionUrl: "/contents",
    metadata: {
      courseName: "Introdução à Bíblia",
    },
  },
  {
    id: "3",
    title: "Nova postagem na comunidade",
    message: "João Silva compartilhou uma reflexão sobre fé.",
    type: "community_post" as const,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    actionUrl: "/community",
    metadata: {
      userName: "João Silva",
    },
  },
  {
    id: "4",
    title: "Certificado emitido",
    message: "Seu certificado do curso 'Discipulado' foi emitido com sucesso.",
    type: "certificate_ready" as const,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
    actionUrl: "/certificates",
    metadata: {
      courseName: "Discipulado",
    },
  },
  {
    id: "5",
    title: "Resposta no fórum",
    message: "Maria Santos respondeu sua pergunta sobre oração.",
    type: "forum_reply" as const,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
    actionUrl: "/forum",
    metadata: {
      userName: "Maria Santos",
    },
  },
];

export function MobileNotificationsDemo() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <MobileNotificationsDrawer
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onClearAll={handleClearAll}
      isLoading={false}
    />
  );
}

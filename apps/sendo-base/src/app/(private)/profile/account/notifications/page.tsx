"use client";

import { getUserProfile, updateUserNotifications } from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Mail,
  MessageSquare,
  Save,
  Settings,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileEditNotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      courseUpdates: true,
      newCourses: true,
      eventReminders: true,
      communityPosts: false,
      achievements: true,
      weeklyDigest: true,
    },
    push: {
      courseUpdates: true,
      newCourses: false,
      eventReminders: true,
      communityPosts: false,
      achievements: true,
    },
    sms: {
      eventReminders: false,
      urgentUpdates: false,
    },
  });

  const queryClient = useQueryClient();

  const { data: userAuth, isLoading } = useQuery({
    queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
    queryFn: () => getUserProfile("30d453b9-88c9-429e-9700-81d2db735f7a"),
    select: (data) => data.user,
  });

  useEffect(() => {
    if (userAuth?.notificationSettings) {
      setNotificationSettings(
        userAuth.notificationSettings as typeof notificationSettings,
      );
    } else {
      // Use default settings if user doesn't have notification settings
      setNotificationSettings({
        email: {
          courseUpdates: true,
          newCourses: true,
          eventReminders: true,
          communityPosts: false,
          achievements: true,
          weeklyDigest: true,
        },
        push: {
          courseUpdates: true,
          newCourses: false,
          eventReminders: true,
          communityPosts: false,
          achievements: true,
        },
        sms: {
          eventReminders: false,
          urgentUpdates: false,
        },
      });
    }
  }, [userAuth]);

  const updateNotificationsMutation = useMutation({
    mutationFn: updateUserNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Preferências de notificação atualizadas!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar notificações");
    },
  });

  const handleSave = () => {
    updateNotificationsMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      settings: notificationSettings,
    });
  };

  const handleToggle = (category: string, setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !(
          prev[category as keyof typeof prev] as Record<string, boolean>
        )[setting],
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="dark-glass dark-shadow-sm rounded-xl p-8 text-center">
        <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Bell className="dark-text-tertiary" size={32} />
        </div>
        <h3 className="dark-text-primary mb-2 text-xl font-semibold">
          Carregando preferências...
        </h3>
        <p className="dark-text-secondary">
          Buscando suas configurações de notificação
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="dark-text-primary mb-2 text-xl font-semibold">
              Preferências de notificação
            </h2>
            <p className="dark-text-secondary text-sm">
              Configure como você recebe notificações da plataforma
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="dark-btn-primary"
            disabled={updateNotificationsMutation.isPending}
          >
            <Save size={16} className="mr-1" />
            {updateNotificationsMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="dark-primary-subtle-bg rounded-lg p-2">
            <Mail className="dark-primary" size={20} />
          </div>
          <div>
            <h3 className="dark-text-primary font-semibold">
              Notificações por Email
            </h3>
            <p className="dark-text-secondary text-sm">
              Receba atualizações importantes no seu email
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Atualizações de cursos
              </Label>
              <p className="dark-text-tertiary text-sm">
                Novas aulas, materiais e anúncios dos seus cursos
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.courseUpdates}
              onCheckedChange={() => handleToggle("email", "courseUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Novos cursos disponíveis
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações sobre novos cursos que podem te interessar
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.newCourses}
              onCheckedChange={() => handleToggle("email", "newCourses")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Lembretes de eventos
              </Label>
              <p className="dark-text-tertiary text-sm">
                Lembretes sobre eventos da comunidade e webinars
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.eventReminders}
              onCheckedChange={() => handleToggle("email", "eventReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Posts da comunidade
              </Label>
              <p className="dark-text-tertiary text-sm">
                Atualizações sobre discussões e posts no fórum
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.communityPosts}
              onCheckedChange={() => handleToggle("email", "communityPosts")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Conquistas e certificados
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações quando você conquista algo novo
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.achievements}
              onCheckedChange={() => handleToggle("email", "achievements")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Resumo semanal
              </Label>
              <p className="dark-text-tertiary text-sm">
                Um resumo semanal das suas atividades e progresso
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.email.weeklyDigest}
              onCheckedChange={() => handleToggle("email", "weeklyDigest")}
            />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="dark-secondary-subtle-bg rounded-lg p-2">
            <Smartphone className="dark-secondary" size={20} />
          </div>
          <div>
            <h3 className="dark-text-primary font-semibold">
              Notificações Push
            </h3>
            <p className="dark-text-secondary text-sm">
              Receba notificações instantâneas no seu dispositivo
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Atualizações de cursos
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações imediatas sobre novos conteúdos
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.push.courseUpdates}
              onCheckedChange={() => handleToggle("push", "courseUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Novos cursos
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações sobre cursos recém-lançados
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.push.newCourses}
              onCheckedChange={() => handleToggle("push", "newCourses")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Lembretes de eventos
              </Label>
              <p className="dark-text-tertiary text-sm">
                Lembretes sobre eventos próximos
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.push.eventReminders}
              onCheckedChange={() => handleToggle("push", "eventReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Atividade da comunidade
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações sobre posts e interações
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.push.communityPosts}
              onCheckedChange={() => handleToggle("push", "communityPosts")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Conquistas
              </Label>
              <p className="dark-text-tertiary text-sm">
                Celebre suas conquistas em tempo real
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.push.achievements}
              onCheckedChange={() => handleToggle("push", "achievements")}
            />
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="dark-info-bg rounded-lg p-2">
            <MessageSquare className="dark-info" size={20} />
          </div>
          <div>
            <h3 className="dark-text-primary font-semibold">
              Notificações SMS
            </h3>
            <p className="dark-text-secondary text-sm">
              Receba mensagens importantes por SMS
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Lembretes de eventos importantes
              </Label>
              <p className="dark-text-tertiary text-sm">
                SMS para eventos especiais e webinars importantes
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.sms.eventReminders}
              onCheckedChange={() => handleToggle("sms", "eventReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Atualizações urgentes
              </Label>
              <p className="dark-text-tertiary text-sm">
                Notificações críticas sobre a plataforma
              </p>
            </div>
            <Checkbox
              checked={notificationSettings.sms.urgentUpdates}
              onCheckedChange={() => handleToggle("sms", "urgentUpdates")}
            />
          </div>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="dark-warning-bg rounded-lg p-2">
            <Settings className="dark-warning" size={20} />
          </div>
          <div>
            <h3 className="dark-text-primary font-semibold">
              Frequência de Notificações
            </h3>
            <p className="dark-text-secondary text-sm">
              Configure quando e com que frequência receber notificações
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Modo silencioso
              </Label>
              <p className="dark-text-tertiary text-sm">
                Pausar todas as notificações por um período
              </p>
            </div>
            <Checkbox />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="dark-text-secondary font-medium">
                Horário de funcionamento
              </Label>
              <p className="dark-text-tertiary text-sm">
                Receber notificações apenas durante horário comercial (9h às
                18h)
              </p>
            </div>
            <Checkbox />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <Button
          onClick={handleSave}
          className="dark-btn-primary"
          disabled={updateNotificationsMutation.isPending}
        >
          <Save size={16} className="mr-1" />
          {updateNotificationsMutation.isPending
            ? "Salvando..."
            : "Salvar Preferências"}
        </Button>
      </div>
    </div>
  );
}

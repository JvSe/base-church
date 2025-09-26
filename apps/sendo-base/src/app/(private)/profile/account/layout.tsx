"use client";

import { useAuth } from "@/src/hooks";
import { getUserProfile } from "@/src/lib/actions";
import { getInitials } from "@/src/lib/get-initial-by-name";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { Button } from "@base-church/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Key, Mail, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const { data: userAuth } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserProfile(user!.id),
    select: (data) => data.user,
    enabled: !!user?.id,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const navigationItems = [
    {
      id: "overview",
      label: "Visão geral",
      icon: User,
      href: "/profile/account",
      description:
        "Gerencie as informações de conta, dados pessoais e assinaturas",
      isExact: true,
    },
    {
      id: "personal",
      label: "Dados pessoais",
      icon: User,
      href: "/profile/account/personal",
      description: "Atualize suas informações pessoais e de contato",
    },
    {
      id: "access",
      label: "Dados de acesso",
      icon: Key,
      href: "/profile/account/access",
      description: "Altere seu email e senha de acesso",
    },
    {
      id: "notifications",
      label: "Preferências de notificação",
      icon: Settings,
      href: "/profile/account/notifications",
      description: "Configure como você recebe notificações",
    },
  ];

  const getCurrentSection = () => {
    const currentItem = navigationItems.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    );
    return currentItem || navigationItems[0];
  };

  const currentSection = getCurrentSection();

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:dark-bg-tertiary"
              >
                <Link href="/profile">
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar ao Perfil
                </Link>
              </Button>
              <div className="dark-bg-tertiary h-6 w-px" />
              <h1 className="dark-text-primary text-2xl font-bold">
                Minha conta
              </h1>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="flex items-start space-x-6">
            <div className="dark-primary-subtle-bg h-20 min-h-20 w-20 min-w-20 overflow-hidden rounded-full">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={userAuth?.image ?? ""}
                  alt={userAuth?.name ?? ""}
                  className="h-full w-full"
                />
                <AvatarFallback className="rounded-full">
                  {getInitials(userAuth?.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="dark-text-primary mb-1 text-xl font-semibold">
                {userAuth?.name || "Usuário"}
              </h2>
              <p className="dark-text-secondary mb-2">
                {currentSection?.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {userAuth?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="dark-text-tertiary" size={12} />
                    <span className="dark-text-tertiary text-nowrap">
                      {userAuth.email}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="dark-text-tertiary" size={12} />
                  <span className="dark-text-tertiary text-nowrap">
                    Desde {formatDate(userAuth?.joinDate ?? new Date())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="dark-glass dark-shadow-sm rounded-xl p-1">
                <nav className="space-y-1 px-2">
                  {navigationItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (!item.isExact && pathname.startsWith(item.href + "/"));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm transition-all ${
                          isActive
                            ? "dark-btn-primary"
                            : "dark-text-secondary hover:dark-text-primary hover:dark-bg-tertiary"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

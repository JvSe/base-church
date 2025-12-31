"use client";

import { PageHeader } from "@/src/components/common/layout/page-header";
import { Key, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    // {
    //   id: "notifications",
    //   label: "Preferências de notificação",
    //   icon: Settings,
    //   href: "/profile/account/notifications",
    //   description: "Configure como você recebe notificações",
    // },
  ];

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        {/* Header */}
        <PageHeader
          title="Minha Conta"
          description="Gerencie as informações de conta e dados pessoais."
          backButton={{ href: "/profile", label: "Voltar ao Perfil" }}
        />

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

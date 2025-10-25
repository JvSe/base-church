"use client";

import { useAuth } from "@/src/hooks";
import { getInitials } from "@/src/lib/get-initial-by-name";
import { getFirstName } from "@/src/lib/helpers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { Separator } from "@base-church/ui/components/separator";
import {
  Award,
  BarChart3,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileSidebarContentProps {
  onNavigate?: () => void;
}

export function MobileSidebarContent({
  onNavigate,
}: MobileSidebarContentProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleNavigation = () => {
    onNavigate?.();
  };

  const data = {
    navMain: [
      {
        title: "Início",
        url: "/home",
        icon: Home,
      },
      {
        title: "Perfil",
        url: "/profile",
        icon: User,
      },
    ],
    navAdmin:
      user?.role === "ADMIN"
        ? [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: BarChart3,
              isExact: true,
            },
            {
              title: "Gestão de Alunos",
              url: "/dashboard/students",
              icon: Users,
            },
            {
              title: "Gestão de Cursos",
              url: "/dashboard/courses",
              icon: BookOpen,
            },
            {
              title: "Certificados",
              url: "/dashboard/certificates",
              icon: Award,
            },
          ]
        : [],
    navLearning: [
      {
        title: "Meus Conteúdos",
        icon: FileText,
        url: "/contents",
        items: [
          {
            title: "Em Andamento",
            url: "/contents?status=in-progress",
          },
          {
            title: "Concluídos",
            url: "/contents?status=completed",
          },
          {
            title: "Não Iniciados",
            url: "/contents?status=not-started",
          },
        ],
      },
      {
        title: "Catálogo",
        icon: BookOpen,
        url: "/catalog",
        items: [
          {
            title: "Todos os Cursos",
            url: "/catalog",
          },
          {
            title: "Em Destaque",
            url: "/catalog?featured=true",
          },
          {
            title: "Matriculados",
            url: "/catalog?enrolled=true",
          },
        ],
      },
    ],
    navCommunity: [
      {
        title: "Fórum",
        icon: MessageCircle,
        url: "/forum",
        items: [
          {
            title: "Discussões",
            url: "/forum/discussions",
          },
          {
            title: "Minhas Postagens",
            url: "/forum/my-posts",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Ajuda",
        url: "/help",
        icon: HelpCircle,
      },
      {
        title: "Sair",
        url: "/logout",
        icon: LogOut,
      },
    ],
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="dark-border border-b p-4">
        <Link href="/profile" className="flex items-center gap-3">
          <div className="dark-primary-subtle-bg flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
            <Avatar className="h-full w-full">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
              <AvatarFallback className="rounded-full">
                {getInitials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="dark-text-primary truncate text-sm font-semibold">
              {getFirstName(user?.name ?? "")}
            </h3>
            <p className="dark-text-tertiary mt-0.5 truncate text-xs">
              {user?.role}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <h4 className="dark-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
            Principal
          </h4>
          <div className="space-y-1">
            {data.navMain.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={handleNavigation}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Navigation */}
        {data.navAdmin.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <h4 className="dark-text-tertiary text-xs font-semibold tracking-wider uppercase">
                Administração
              </h4>
              <Separator className="flex-1 bg-white opacity-5" />
            </div>
            <div className="space-y-1">
              {data.navAdmin.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={handleNavigation}
                  className={`flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.isExact
                      ? pathname === item.url
                      : pathname.startsWith(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Learning Navigation */}
        <div className="mb-6">
          <h4 className="dark-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
            Aprendizado
          </h4>
          <div className="space-y-1">
            {data.navLearning.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={handleNavigation}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Navigation */}
        <div className="mb-6">
          <h4 className="dark-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
            Comunidade
          </h4>
          <div className="space-y-1">
            {data.navCommunity.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={handleNavigation}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mb-6">
          <h4 className="dark-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
            Sistema
          </h4>
          <div className="space-y-1">
            {data.navSecondary.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={handleNavigation}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="dark-border border-t p-4">
        <div className="text-center">
          <p className="dark-text-tertiary text-xs">Base Church Platform</p>
          <p className="dark-text-tertiary mt-1 text-xs">Versão 1.0</p>
        </div>
      </div>
    </div>
  );
}

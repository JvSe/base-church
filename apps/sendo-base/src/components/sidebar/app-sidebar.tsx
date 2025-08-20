"use client";

import {
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Map,
  MessageCircle,
  User,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    user: {
      name: "João Vitor Soares",
      title: "Líder em Formação",
    },
    navigation: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Perfil",
        url: "/dashboard/profile",
        icon: User,
      },
      {
        title: "Meus Conteúdos",
        url: "/dashboard/conteudos",
        icon: FileText,
      },
      {
        title: "Minha Jornada",
        url: "/dashboard/jornada",
        icon: Map,
      },
      {
        title: "Catálogo",
        url: "/dashboard/catalogo",
        icon: BookOpen,
      },
      {
        title: "Eventos",
        url: "/dashboard/eventos",
        icon: Calendar,
      },
      {
        title: "Fórum",
        url: "/dashboard/forum",
        icon: MessageCircle,
      },
      {
        title: "Comunidade",
        url: "/dashboard/comunidade",
        icon: Users,
      },
      {
        title: "Ajuda",
        url: "/dashboard/ajuda",
        icon: HelpCircle,
      },
    ],
  };

  return (
    <Sidebar className="rounded-xl" collapsible="icon" {...props}>
      {/* Header Simples */}
      <SidebarHeader className="dark-border border-b p-6">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="dark-primary-subtle-bg flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
            <User className="dark-primary" size={20} />
          </div>
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <h3 className="dark-text-primary text-sm font-semibold">
              {data.user.name}
            </h3>
            <p className="dark-text-tertiary mt-0.5 text-xs">
              {data.user.title}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navegação Principal */}
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                    className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                      pathname === item.url
                        ? "dark-primary-subtle-bg dark-primary"
                        : "dark-text-secondary hover:dark-text-primary hover:dark-bg-secondary"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Simples */}
      <SidebarFooter className="dark-border border-t p-4 group-data-[collapsible=icon]:hidden">
        <div className="text-center">
          <p className="dark-text-tertiary text-xs">Base Church Platform</p>
          <p className="dark-text-tertiary mt-1 text-xs">Versão 1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

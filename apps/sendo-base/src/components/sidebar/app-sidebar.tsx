"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Map,
  MessageCircle,
  User,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@base-church/ui/components/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const { user } = useAuth();

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
        title: "Minha Jornada",
        url: "/journey",
        icon: Map,
      },
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
      // {
      //   title: "Eventos",
      //   icon: Calendar,
      //   url: "/events",
      //   items: [
      //     {
      //       title: "Próximos Eventos",
      //       url: "/events?upcoming=true",
      //     },
      //     {
      //       title: "Meus Eventos",
      //       url: "/events?my-events=true",
      //     },
      //   ],
      // },
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
      // {
      //   title: "Comunidade",
      //   icon: Users,
      //   url: "/community",
      //   items: [
      //     {
      //       title: "Membros",
      //       url: "/community/members",
      //     },
      //     {
      //       title: "Grupos",
      //       url: "/community/groups",
      //     },
      //   ],
      // },
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
    documents: [
      {
        name: "Base de Conhecimento",
        url: "/knowledge-base",
        icon: BookOpen,
      },
      {
        name: "Recursos",
        url: "/resources",
        icon: FileText,
      },
      {
        name: "Suporte",
        url: "/support",
        icon: HelpCircle,
      },
    ],
  };

  return (
    <Sidebar className="rounded-xl" collapsible="icon" {...props}>
      {/* Header Simples */}
      <SidebarHeader className="dark-border w-full flex-row justify-between border-b pt-10 pb-5">
        <Link href="/profile" className="w-full max-w-4/5 flex-1">
          <div className="flex cursor-pointer items-center gap-3 overflow-hidden transition-[margin,opacity,width] duration-300 ease-in-out group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
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
          </div>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      {/* Navegação Principal */}
      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url)}
                    asChild
                    className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                      pathname.startsWith(item.url)
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

        {/* Navegação Administrativa - Apenas para Líderes */}
        {data.navAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="gap-2 px-0 text-xs font-semibold tracking-wider uppercase">
              Administração
              <Separator className="bg-white opacity-5" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {data.navAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.isExact
                          ? pathname === item.url
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                        item.isExact
                          ? pathname === item.url
                          : pathname.startsWith(item.url)
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
        )}

        {/* Navegação de Aprendizado */}
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 px-0 text-xs font-semibold tracking-wider uppercase">
            Aprendizado
            <Separator className="bg-white opacity-5" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navLearning.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url)}
                    asChild
                    className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                      pathname.startsWith(item.url)
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

        {/* Navegação da Comunidade */}
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 px-0 text-xs font-semibold tracking-wider uppercase">
            Comunidade
            <Separator className="bg-white opacity-5" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navCommunity.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url)}
                    asChild
                    className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                      pathname.startsWith(item.url)
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

        {/* Navegação Secundária */}
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 px-0 text-xs font-semibold tracking-wider uppercase">
            Sistema
            <Separator className="bg-white opacity-5" />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.url)}
                    asChild
                    className={`h-10 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-5 ${
                      pathname.startsWith(item.url)
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

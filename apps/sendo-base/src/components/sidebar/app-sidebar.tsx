"use client";

import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    user: {
      name: "Joao Vitor Soares Egidio Nunes",
      email: "joao@example.com",
      avatar: "/avatars/joao.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Perfil",
        url: "/dashboard/profile",
        icon: User,
      },
    ],
    navProgresso: [
      {
        title: "Meus conteúdos",
        url: "/dashboard/conteudos",
        icon: FileText,
      },
      {
        title: "Minha Jornada",
        url: "/dashboard/jornada",
        icon: Map,
      },
    ],
    navAprendizado: [
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
    ],
    navBottom: [
      {
        title: "Comunidade",
        url: "/dashboard/comunidade",
        icon: Users,
        hasChevron: true,
      },
      {
        title: "Pós-Graduação",
        url: "/dashboard/pos-graduacao",
        icon: GraduationCap,
        hasChevron: true,
      },
      {
        title: "Ajuda",
        url: "/dashboard/ajuda",
        icon: HelpCircle,
        hasChevron: true,
      },
    ],
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        {/* Home Section */}
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                    className="h-12 p-3 text-base group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-3 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-6"
                  >
                    <Link href={item.url}>
                      <item.icon size={24} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PROGRESSO Section */}
        <SidebarGroup>
          <SidebarGroupLabel>PROGRESSO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navProgresso.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                    className="h-12 p-3 text-base group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-3 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-6"
                  >
                    <Link href={item.url}>
                      <item.icon size={24} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* APRENDIZADO Section */}
        <SidebarGroup>
          <SidebarGroupLabel>APRENDIZADO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navAprendizado.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                    className="h-12 p-3 text-base group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-3 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-6"
                  >
                    <Link href={item.url}>
                      <item.icon size={24} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Navigation - moved to bottom with mt-auto */}
        {/* <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navBottom.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      asChild
                      className="text-base group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-3 [&>span]:group-data-[collapsible=icon]:hidden [&>svg]:!size-6 [&>svg:last-child]:group-data-[collapsible=icon]:hidden"
                    >
                      <Link href={item.url} className="group">
                        <item.icon size={24} />
                        <span>{item.title}</span>
                        {item.hasChevron && (
                          <ChevronRight
                            size={16}
                            className="ml-auto text-gray-500 transition-colors group-hover:text-gray-300"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div> */}
      </SidebarContent>
    </Sidebar>
  );
}

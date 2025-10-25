"use client";

import { NotificationsButton } from "@/src/components/notifications";
import { useResponsive } from "@/src/hooks";
import { useEffect, useState } from "react";
import { MobileSidebarDrawer } from "./mobile-sidebar-drawer";

interface MobileHeaderProps {
  title?: string;
  showOnScroll?: boolean;
}

export function MobileHeader({
  title = "Base Church",
  showOnScroll = true,
}: MobileHeaderProps) {
  const { isMobile } = useResponsive();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!showOnScroll || !isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll, isMobile]);

  if (!isMobile) return null;

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "dark-bg-secondary/95 border-b border-white/10 shadow-lg backdrop-blur-md"
          : "dark-bg-secondary border-b border-white/10"
      }`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <MobileSidebarDrawer />
          <div className="flex items-center gap-2">
            <h1 className="dark-text-primary text-lg font-semibold">{title}</h1>
          </div>
          <NotificationsButton />
        </div>
      </div>
    </div>
  );
}

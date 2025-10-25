"use client";

import { Button } from "@base-church/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@base-church/ui/components/drawer";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { MobileSidebarContent } from "./mobile-sidebar-content";

interface MobileSidebarDrawerProps {
  children?: React.ReactNode;
}

export function MobileSidebarDrawer({ children }: MobileSidebarDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark-text-secondary hover:dark-text-primary md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="dark-bg-secondary h-full w-full border-0 p-0 sm:w-80">
        <DrawerHeader className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="dark-text-primary text-lg font-semibold">
              Menu de Navegação
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="dark-text-secondary hover:dark-text-primary"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </DrawerHeader>
        <div className="flex h-full w-full flex-col">
          <MobileSidebarContent onNavigate={() => setOpen(false)} />
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

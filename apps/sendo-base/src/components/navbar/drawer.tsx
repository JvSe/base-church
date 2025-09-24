"use client";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@base-church/ui/components/drawer";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NavLinks } from "./nav-links";

export const NavDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger className="md:hidden">
        <Menu size={34} />
      </DrawerTrigger>
      <DrawerContent className="bg-primary h-screen">
        <DrawerHeader>
          <DrawerTitle className="sr-only">
            Are you absolutely sure?
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mt-8">
          <NavLinks variant="drawer" onSubmit={() => setOpen(false)} />
        </div>
        <div className="mt-auto flex h-min w-full flex-col items-center gap-4">
          <Image
            className="w-2/4"
            src="/assets/svg/sendo-base.svg"
            alt="logo"
            width={100}
            height={100}
          />
          <p className="text-[0.5rem]">© Todos os direitos reservados</p>
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

import { Button } from "@repo/ui/components/button";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavDrawer } from "./drawer";
import { NavLinks } from "./nav-links";

export const Navbar = () => {
  return (
    <nav className="absolute top-0 z-10 w-full border-b border-white py-2 shadow-md backdrop-blur-sm md:py-4">
      <div className="mx-auto px-4 sm:px-6 md:max-w-10/12 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                src="/assets/svg/sendo-base.svg"
                alt="Sendo Base Logo"
                width={100}
                height={100}
                className="w-40"
              />
            </Link>
          </div>

          {/* NAV BAR SECTIONS */}
          <NavLinks />

          <Link className="hidden md:block" href="/signin">
            <Button
              size="clean"
              className="gradient-radial-dark gap-3 px-5 py-3 uppercase"
            >
              <User />
              Entrar
            </Button>
          </Link>

          <NavDrawer />
        </div>
      </div>
    </nav>
  );
};

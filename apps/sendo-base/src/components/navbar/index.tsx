"use client";

import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavDrawer } from "./drawer";
import { NavLinks } from "./nav-links";
import { NavbarScrollWrapper } from "./navbar-scroll-wrapper";

export function Navbar() {
  return (
    <NavbarScrollWrapper>
      {(scrolled) => (
        <nav
          className={`fixed top-0 z-10 backdrop-blur-md transition-all duration-300 ${
            scrolled
              ? "mt-2 w-11/12 rounded-xl py-1 shadow-md sm:w-10/12 sm:px-6 md:w-9/12 md:px-10 md:py-2 dark:bg-white/10"
              : "2xl:px-50 w-full border-b border-white py-2 shadow-md sm:px-8 md:px-32 md:py-4"
          }`}
        >
          <div className={cn("mx-auto px-4 sm:px-6 lg:px-8")}>
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
                    className="w-32 sm:w-40"
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
      )}
    </NavbarScrollWrapper>
  );
}

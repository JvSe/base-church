import { Button } from "@repo/ui/components/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="w-full z-10 border-b border-white py-4 shadow-md absolute top-0 backdrop-blur-sm">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center  justify-between h-16">
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
          <div className="hidden md:block shadow gradient-radial-dark py-3 rounded-full px-5 ">
            <div className="flex items-baseline space-x-4 uppercase text-white">
              <Link
                href="/"
                className="text-gray-900 dark:text-white hover:gradient-yellow-text px-3 py-2 rounded-md text-sm font-medium"
              >
                Inicio
              </Link>
              <Link
                href="/about"
                className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sobre nós
              </Link>
              <Link
                href="/about"
                className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cursos
              </Link>
              <Link
                href="/about"
                className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Professores
              </Link>
              <Link
                href="/about"
                className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pilares
              </Link>
            </div>
          </div>

          <Link href="/signin">
            <Button
              size="clean"
              className="gap-3 uppercase gradient-radial-dark py-3 px-5"
            >
              <User />
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

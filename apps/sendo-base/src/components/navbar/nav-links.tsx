import { cn } from "@repo/ui/lib/utils";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

const LinkCustom = ({
  className,
  variant,
  ...rest
}: LinkProps &
  PropsWithChildren<{
    className?: string;
    variant?: "drawer" | "default";
  }>) => {
  return (
    <Link
      {...rest}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300",
        className,
        variant === "drawer" && "py-4 text-xl",
      )}
    />
  );
};

export const NavLinks = ({
  className,
  variant = "default",
  onSubmit,
}: {
  className?: string;
  variant?: "drawer" | "default";
  onSubmit?: () => void;
}) => {
  return (
    <div
      className={cn(
        "rounded-full px-5 py-3",
        className,
        variant === "default" && "gradient-radial-dark hidden shadow md:block",
        variant === "drawer" && "block",
      )}
    >
      <div
        className={cn(
          "flex text-white uppercase",
          variant === "default" && "flex-row items-baseline space-x-4",
          variant === "drawer" && "flex flex-col items-center",
        )}
      >
        <LinkCustom variant={variant} href="#section-hero" onClick={onSubmit}>
          Inicio
        </LinkCustom>
        <LinkCustom variant={variant} href="#section-about" onClick={onSubmit}>
          Sobre nós
        </LinkCustom>
        <LinkCustom
          variant={variant}
          href="#section-courses"
          onClick={onSubmit}
        >
          Cursos
        </LinkCustom>
        <LinkCustom
          variant={variant}
          href="#section-teachers"
          onClick={onSubmit}
        >
          Professores
        </LinkCustom>
        <LinkCustom
          variant={variant}
          href="#section-pillars"
          onClick={onSubmit}
        >
          Pilares
        </LinkCustom>
      </div>
    </div>
  );
};

import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

/**
 * PageHeader - Componente de cabeçalho de página unificado
 *
 * @example
 * <PageHeader
 *   title="Gestão de Cursos"
 *   description="Gerencie seus cursos e acompanhe o desempenho"
 *   actions={[
 *     { label: "Criar Curso", href: "/create", variant: "success" }
 *   ]}
 * />
 */

type Action = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "success" | "destructive" | "outline" | "ghost";
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  className?: string;
};

type PageHeaderProps = {
  title: string | ReactNode;
  description?: string | ReactNode;
  actions?: Action[];
  className?: string;
  children?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "dark-glass dark-shadow-md rounded-2xl p-4 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          {typeof title === "string" ? (
            <h1 className="dark-text-primary mb-2 text-2xl font-bold sm:text-3xl">
              {title}
            </h1>
          ) : (
            title
          )}
          {description && (
            <>
              {typeof description === "string" ? (
                <p className="dark-text-secondary text-sm sm:text-base">
                  {description}
                </p>
              ) : (
                description
              )}
            </>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {actions.map((action, index) => {
              const ButtonContent = (
                <>
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </>
              );

              if (action.href) {
                return (
                  <Button
                    key={index}
                    asChild
                    variant={action.variant || "default"}
                    className={cn("w-full sm:w-auto", action.className)}
                  >
                    <Link href={action.href}>{ButtonContent}</Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || "default"}
                  className={cn("w-full sm:w-auto", action.className)}
                >
                  {ButtonContent}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

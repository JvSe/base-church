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
    <div className={cn("dark-glass dark-shadow-md rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {typeof title === "string" ? (
            <h1 className="dark-text-primary mb-2 text-3xl font-bold">
              {title}
            </h1>
          ) : (
            title
          )}
          {description && (
            <>
              {typeof description === "string" ? (
                <p className="dark-text-secondary">{description}</p>
              ) : (
                description
              )}
            </>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex gap-2">
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
                    className={action.className}
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
                  className={action.className}
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

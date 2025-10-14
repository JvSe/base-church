import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import Link from "next/link";

/**
 * EmptyState - Componente unificado para estados vazios
 *
 * Substituiu 8 duplicações em:
 * - dashboard/courses/components/courses-list-client.tsx
 * - community/page.tsx
 * - dashboard/students/page.tsx
 * - home/components/home-client-wrapper.tsx
 * - events/page.tsx
 * - forum/page.tsx
 * - contents/page.tsx
 * - profile/page.tsx
 *
 * @example
 * <EmptyState
 *   icon={BookOpen}
 *   title="Nenhum curso encontrado"
 *   description="Tente ajustar sua busca"
 *   action={{
 *     label: "Criar Curso",
 *     onClick: () => router.push('/create')
 *   }}
 * />
 */

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

type EmptyStateProps = {
  icon: IconComponent;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  variant?: "default" | "compact";
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "dark-card dark-shadow-sm rounded-xl text-center",
        isCompact ? "p-6" : "p-8",
        className,
      )}
    >
      <div
        className={cn(
          "dark-bg-secondary mx-auto mb-4 flex items-center justify-center rounded-full",
          isCompact ? "h-12 w-12" : "h-16 w-16",
        )}
      >
        <Icon className="dark-text-tertiary" size={isCompact ? 20 : 24} />
      </div>

      <h3
        className={cn(
          "dark-text-primary mb-2 font-semibold",
          isCompact ? "text-base" : "text-lg",
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "dark-text-tertiary mb-4",
          isCompact ? "text-xs" : "text-sm",
        )}
      >
        {description}
      </p>

      {action && (
        <>
          {action.href ? (
            <Link href={action.href}>
              <Button
                className="dark-btn-primary"
                size={isCompact ? "sm" : "default"}
              >
                {action.label}
              </Button>
            </Link>
          ) : action.onClick ? (
            <Button
              onClick={action.onClick}
              className="dark-btn-primary"
              size={isCompact ? "sm" : "default"}
            >
              {action.label}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}

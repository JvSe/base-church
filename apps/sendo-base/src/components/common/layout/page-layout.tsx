import { cn } from "@base-church/ui/lib/utils";
import { ReactNode } from "react";

/**
 * PageLayout - Layout padrão de páginas com background pattern
 *
 * Substituiu padrão duplicado em 19+ páginas
 *
 * @example
 * <PageLayout maxWidth="7xl">
 *   <PageHeader title="Minha Página" />
 *   <div>Conteúdo</div>
 * </PageLayout>
 */

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: "7xl" | "6xl" | "5xl" | "4xl" | "full";
  spacing?: "normal" | "compact" | "relaxed";
  className?: string;
  showPattern?: boolean;
};

const maxWidthClasses = {
  "7xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
  "4xl": "max-w-4xl",
  full: "max-w-full",
};

const spacingClasses = {
  compact: "space-y-4",
  normal: "space-y-6",
  relaxed: "space-y-8",
};

export function PageLayout({
  children,
  maxWidth = "7xl",
  spacing = "normal",
  className,
  showPattern = true,
}: PageLayoutProps) {
  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      {showPattern && (
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative mx-auto p-6",
          maxWidthClasses[maxWidth],
          spacingClasses[spacing],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

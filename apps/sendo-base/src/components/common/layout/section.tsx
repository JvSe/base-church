import { cn } from "@base-church/ui/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  title?: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  right?: ReactNode;
};

export function Section({
  title,
  description,
  right,
  className,
  headerClassName = "mb-6 flex items-center justify-between",
  contentClassName = "",
  children,
}: SectionProps) {
  return (
    <div
      className={cn(
        "dark-glass dark-shadow-sm rounded-xl p-4 md:p-6",
        className,
      )}
    >
      {(title || description || right) && (
        <div className={headerClassName}>
          <div>
            {title && (
              <h2 className="dark-text-primary text-xl font-bold">{title}</h2>
            )}
            {description && (
              <p className="dark-text-secondary mt-1 text-sm">{description}</p>
            )}
          </div>
          {right}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}

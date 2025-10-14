import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
};

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className = "",
  headerAction,
}: FormSectionProps) {
  return (
    <div className={`dark-glass dark-shadow-sm rounded-xl p-6 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
            {Icon && <Icon className="dark-primary" size={24} />}
            {title}
          </h2>
          {description && (
            <p className="dark-text-secondary mt-1 text-sm">{description}</p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      {children}
    </div>
  );
}

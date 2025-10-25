"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@base-church/ui/components/card";
import { cn } from "@base-church/ui/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "expanded";
  onClick?: () => void;
}

export function MobileCard({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  className,
  variant = "default",
  onClick,
}: MobileCardProps) {
  const isClickable = !!onClick;

  const cardVariants = {
    default: "p-4",
    compact: "p-3",
    expanded: "p-6",
  };

  return (
    <Card
      className={cn(
        "dark-bg-secondary border-0 transition-all duration-200",
        isClickable && "hover:dark-bg-tertiary cursor-pointer",
        cardVariants[variant],
        className,
      )}
      onClick={onClick}
    >
      {(title || subtitle || Icon) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center space-x-3">
              {Icon && (
                <div className="dark-primary-subtle-bg flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <Icon className="dark-primary h-4 w-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <CardTitle className="dark-text-primary truncate text-sm font-semibold">
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <p className="dark-text-tertiary mt-1 truncate text-xs">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="ml-2 flex-shrink-0">{actions}</div>}
          </div>
        </CardHeader>
      )}

      <CardContent
        className={cn(
          title || subtitle || Icon ? "pt-0" : "",
          variant === "compact" ? "py-2" : "",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MobileStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: MobileStatsCardProps) {
  return (
    <MobileCard
      title={title}
      subtitle={subtitle}
      icon={Icon}
      variant="compact"
      className={className}
    >
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="dark-text-primary text-2xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.value >= 0 ? "text-green-400" : "text-red-400",
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          )}
        </div>
        {subtitle && <p className="dark-text-tertiary text-xs">{subtitle}</p>}
      </div>
    </MobileCard>
  );
}

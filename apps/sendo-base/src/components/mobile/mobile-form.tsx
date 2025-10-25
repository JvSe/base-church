"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@base-church/ui/components/card";
import { cn } from "@base-church/ui/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileFormProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function MobileForm({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  className,
  onSubmit,
}: MobileFormProps) {
  return (
    <Card className={cn("dark-bg-secondary border-0", className)}>
      {(title || subtitle || Icon) && (
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="dark-primary-subtle-bg flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                <Icon className="dark-primary h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <CardTitle className="dark-text-primary text-lg font-semibold">
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <p className="dark-text-tertiary mt-1 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={title || subtitle || Icon ? "pt-0" : ""}>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          {actions && (
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row">
              {actions}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

interface MobileFormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
  error?: string;
}

export function MobileFormField({
  label,
  required = false,
  children,
  className,
  description,
  error,
}: MobileFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="dark-text-secondary text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {children}

      {description && (
        <p className="dark-text-tertiary text-xs">{description}</p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface MobileFormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileFormActions({
  children,
  className,
}: MobileFormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface MobileFormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function MobileFormGrid({
  children,
  columns = 1,
  className,
}: MobileFormGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

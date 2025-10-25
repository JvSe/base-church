"use client";

import { useResponsive } from "@/src/hooks";
import { cn } from "@base-church/ui/lib/utils";

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveForm({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 2 },
}: ResponsiveFormProps) {
  const { getGridCols } = useResponsive();

  const gridCols = getGridCols(columns.mobile, columns.tablet, columns.desktop);

  return (
    <div className={cn("grid gap-4", `grid-cols-${gridCols}`, className)}>
      {children}
    </div>
  );
}

interface ResponsiveFormFieldProps {
  children: React.ReactNode;
  className?: string;
  span?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveFormField({
  children,
  className,
  span = { mobile: 1 },
}: ResponsiveFormFieldProps) {
  const { getGridCols } = useResponsive();

  const colSpan = getGridCols(span.mobile || 1, span.tablet, span.desktop);

  return (
    <div className={cn("space-y-2", `col-span-${colSpan}`, className)}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    mobile: string;
    tablet?: string;
    desktop?: string;
  };
}

export function ResponsiveContainer({
  children,
  className,
  padding = { mobile: "p-4" },
}: ResponsiveContainerProps) {
  const { getPadding } = useResponsive();

  const containerPadding = getPadding(
    padding.mobile,
    padding.tablet,
    padding.desktop,
  );

  return <div className={cn(containerPadding, className)}>{children}</div>;
}

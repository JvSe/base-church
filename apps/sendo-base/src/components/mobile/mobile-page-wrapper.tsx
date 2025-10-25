"use client";

import { useResponsive } from "@/src/hooks";
import { cn } from "@base-church/ui/lib/utils";
import { MobileHeader } from "./mobile-header";

interface MobilePageWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function MobilePageWrapper({
  children,
  title,
  className,
}: MobilePageWrapperProps) {
  const { isMobile } = useResponsive();

  return (
    <div className={cn("min-h-screen", className)}>
      {/* Mobile Header - only shows on mobile */}
      {isMobile && <MobileHeader title={title} />}

      {/* Content */}
      <div
        className={cn(
          "w-full",
          isMobile ? "pt-16" : "", // Add padding top on mobile to account for fixed header
        )}
      >
        {children}
      </div>
    </div>
  );
}

"use client";

import { useBreakpoint } from "./use-breakpoint";

export function useResponsive() {
  const breakpoint = useBreakpoint();

  return {
    ...breakpoint,
    // Grid columns based on screen size
    getGridCols: (mobile: number, tablet?: number, desktop?: number) => {
      if (breakpoint.isMobile) return mobile;
      if (breakpoint.isTablet && tablet) return tablet;
      if (breakpoint.isDesktop && desktop) return desktop;
      return mobile;
    },

    // Spacing based on screen size
    getSpacing: (mobile: string, tablet?: string, desktop?: string) => {
      if (breakpoint.isMobile) return mobile;
      if (breakpoint.isTablet && tablet) return tablet;
      if (breakpoint.isDesktop && desktop) return desktop;
      return mobile;
    },

    // Text size based on screen size
    getTextSize: (mobile: string, tablet?: string, desktop?: string) => {
      if (breakpoint.isMobile) return mobile;
      if (breakpoint.isTablet && tablet) return tablet;
      if (breakpoint.isDesktop && desktop) return desktop;
      return mobile;
    },

    // Padding based on screen size
    getPadding: (mobile: string, tablet?: string, desktop?: string) => {
      if (breakpoint.isMobile) return mobile;
      if (breakpoint.isTablet && tablet) return tablet;
      if (breakpoint.isDesktop && desktop) return desktop;
      return mobile;
    },
  };
}

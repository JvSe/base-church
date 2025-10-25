"use client";

import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint("xs");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    currentBreakpoint,
    isMobile: currentBreakpoint === "xs" || currentBreakpoint === "sm",
    isTablet: currentBreakpoint === "md",
    isDesktop:
      currentBreakpoint === "lg" ||
      currentBreakpoint === "xl" ||
      currentBreakpoint === "2xl",
    isSmallScreen:
      currentBreakpoint === "xs" ||
      currentBreakpoint === "sm" ||
      currentBreakpoint === "md",
    isLargeScreen:
      currentBreakpoint === "lg" ||
      currentBreakpoint === "xl" ||
      currentBreakpoint === "2xl",
  };
}

"use client";

import { useEffect, useState } from "react";

type NavbarScrollWrapperProps = {
  children: (scrolled: boolean) => React.ReactNode;
};

export function NavbarScrollWrapper({ children }: NavbarScrollWrapperProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <>{children(scrolled)}</>;
}

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

// Helper to determine if a hex color is light or dark
function getContrastForeground(hexcolor: string) {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#121212" : "#E0E0E0";
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    const storedColor = localStorage.getItem("accent-color");
    if (storedColor) {
      document.documentElement.style.setProperty("--primary", storedColor);
      document.documentElement.style.setProperty("--primary-foreground", getContrastForeground(storedColor));
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

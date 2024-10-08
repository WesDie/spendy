"use client";
import * as React from "react";

import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const ThemeContext = React.createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export function ThemeDataProvider({ children }: ThemeProviderProps) {
  const getSavedThemeColor = () => {
    try {
      return localStorage.getItem("themeColor" as ThemeColors) || "Default";
    } catch (error) {
      "Default" as ThemeColors;
    }
  };

  const [themeColor, setThemeColor] = React.useState<ThemeColors>(
    getSavedThemeColor() as ThemeColors
  );
  const [isMounted, setIsMounted] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    setGlobalColorTheme(theme as "light" | "dark", themeColor);

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [theme, themeColor, isMounted]);

  if (!isMounted) return null;

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return React.useContext(ThemeContext);
}

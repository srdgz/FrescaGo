import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "frescago-theme";

const stored = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const systemTheme = (): Theme =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => stored() ?? systemTheme());

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage can be unavailable in private windows
    }
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }, [theme]);

  return { theme, toggle };
};

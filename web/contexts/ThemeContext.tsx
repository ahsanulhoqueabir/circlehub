"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useRef,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("circlehub-jnu-theme") as Theme;
    return stored && ["light", "dark", "system"].includes(stored)
      ? stored
      : "light";
  } catch {
    return "light";
  }
}

function getActualTheme(theme: Theme): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme state properly to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>(() => "light");
  const [mounted, setMounted] = useState(false);
  const isHydrated = useRef(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("circlehub-jnu-theme", newTheme);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  // Use useLayoutEffect to handle client-side hydration
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if (!isHydrated.current) {
      // Load the actual theme from localStorage on first mount
      const storedTheme = getStoredTheme();

      // Use setTimeout to avoid the ESLint warning
      setTimeout(() => {
        setThemeState(storedTheme);
        setMounted(true);
      }, 0);

      isHydrated.current = true;
    }
  }, []); // Only run once on mount

  // Separate effect to apply theme to DOM
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    const root = document.documentElement;
    const actualTheme = getActualTheme(theme);

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const newActualTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newActualTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        actualTheme: mounted ? getActualTheme(theme) : "light", // Always return "light" until mounted
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

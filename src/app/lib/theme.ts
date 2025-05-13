// lib/theme.ts
export type ColorTheme = {
  name: string;
  light: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  dark: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
};

export const THEMES: Record<string, ColorTheme> = {
  default: {
    name: "Default",
    light: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b",
      background: "#f9fafb",
      text: "#111827",
    },
    dark: {
      primary: "#60a5fa",
      secondary: "#34d399",
      accent: "#fbbf24",
      background: "#111827",
      text: "#f3f4f6",
    },
  },
  sunset: {
    name: "Sunset",
    light: {
      primary: "#f97316",
      secondary: "#e11d48",
      accent: "#f59e0b",
      background: "#fef2f2",
      text: "#1f2937",
    },
    dark: {
      primary: "#fb923c",
      secondary: "#f87171",
      accent: "#fbbf24",
      background: "#1c1917",
      text: "#f5f5f4",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      primary: "#06b6d4",
      secondary: "#0ea5e9",
      accent: "#6366f1",
      background: "#f0fdfa",
      text: "#164e63",
    },
    dark: {
      primary: "#22d3ee",
      secondary: "#38bdf8",
      accent: "#818cf8",
      background: "#083344",
      text: "#ecfeff",
    },
  },
};

export type ThemeKey = keyof typeof THEMES;
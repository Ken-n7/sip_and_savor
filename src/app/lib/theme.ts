export type ThemeKey =
  | "default"
  | "forest"
  | "ocean"
  | "sunset"
  | "lavender";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ThemeConfig {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  default: {
    name: "Default",
    light: {
      primary: "224, 76%, 48%",
      secondary: "142, 69%, 58%",
      accent: "38, 92%, 50%",
      background: "0, 0%, 100%",
      text: "222, 47%, 11%",
    },
    dark: {
      primary: "213, 94%, 68%",
      secondary: "142, 71%, 45%",
      accent: "38, 95%, 64%",
      background: "222, 47%, 11%",
      text: "213, 31%, 91%",
    },
  },
  forest: {
    name: "Forest",
    light: {
      primary: "150, 60%, 40%",
      secondary: "120, 60%, 70%",
      accent: "95, 80%, 60%",
      background: "80, 15%, 95%",
      text: "150, 40%, 20%",
    },
    dark: {
      primary: "150, 60%, 50%",
      secondary: "120, 70%, 40%",
      accent: "95, 90%, 50%",
      background: "150, 30%, 15%",
      text: "80, 30%, 95%",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      primary: "200, 80%, 50%",
      secondary: "180, 70%, 60%",
      accent: "220, 90%, 60%",
      background: "190, 15%, 97%",
      text: "210, 70%, 20%",
    },
    dark: {
      primary: "200, 80%, 60%",
      secondary: "180, 70%, 50%",
      accent: "220, 90%, 70%",
      background: "210, 40%, 15%",
      text: "190, 30%, 90%",
    },
  },
  sunset: {
    name: "Sunset",
    light: {
      primary: "25, 90%, 55%",
      secondary: "15, 80%, 70%",
      accent: "350, 85%, 65%",
      background: "35, 15%, 98%",
      text: "25, 60%, 20%",
    },
    dark: {
      primary: "25, 90%, 65%",
      secondary: "15, 80%, 60%",
      accent: "350, 85%, 75%",
      background: "25, 40%, 15%",
      text: "35, 30%, 90%",
    },
  },
  lavender: {
    name: "Lavender",
    light: {
      primary: "270, 70%, 60%",
      secondary: "290, 60%, 70%",
      accent: "320, 85%, 70%",
      background: "280, 15%, 98%",
      text: "270, 60%, 25%",
    },
    dark: {
      primary: "270, 70%, 70%",
      secondary: "290, 60%, 60%",
      accent: "320, 85%, 80%",
      background: "270, 40%, 15%",
      text: "280, 30%, 90%",
    },
  },
};
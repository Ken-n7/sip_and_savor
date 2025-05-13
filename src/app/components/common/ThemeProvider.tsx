// components/common/ThemeProvider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useEffect, useState } from 'react';
import { THEMES, ThemeKey } from '../../lib/theme';
 
interface CustomThemeProviderProps extends ThemeProviderProps {
  colorTheme?: ThemeKey;
}

export function ThemeProvider({ children, colorTheme = 'default', ...props }: CustomThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const theme = THEMES[colorTheme];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <NextThemesProvider disableTransitionOnChange storageKey="app-theme" {...props}>
      <div
        className="min-h-screen"
        style={{
          // CSS variables for theming
          '--primary-light': theme.light.primary,
          '--secondary-light': theme.light.secondary,
          '--accent-light': theme.light.accent,
          '--background-light': theme.light.background,
          '--text-light': theme.light.text,
          '--primary-dark': theme.dark.primary,
          '--secondary-dark': theme.dark.secondary,
          '--accent-dark': theme.dark.accent,
          '--background-dark': theme.dark.background,
          '--text-dark': theme.dark.text,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  return { theme, setTheme };
};
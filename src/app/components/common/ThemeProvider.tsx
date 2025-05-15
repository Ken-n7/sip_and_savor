'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useEffect, useState } from 'react';
import { THEMES, ThemeKey } from '../../lib/theme';
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState<ThemeKey>('default');

  useEffect(() => {
    // Set mounted state
    setMounted(true);
    
    // Get saved color theme from localStorage
    const savedColorTheme = localStorage.getItem('color-theme') as ThemeKey;
    if (savedColorTheme && THEMES[savedColorTheme]) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  // Apply CSS variables based on the selected color theme and current dark/light mode
  useEffect(() => {
    if (!mounted) return;
    
    const theme = THEMES[colorTheme];
    
    // Apply light theme variables
    document.documentElement.style.setProperty('--primary-light', theme.light.primary);
    document.documentElement.style.setProperty('--secondary-light', theme.light.secondary);
    document.documentElement.style.setProperty('--accent-light', theme.light.accent);
    document.documentElement.style.setProperty('--background-light', theme.light.background);
    document.documentElement.style.setProperty('--text-light', theme.light.text);
    
    // Apply dark theme variables
    document.documentElement.style.setProperty('--primary-dark', theme.dark.primary);
    document.documentElement.style.setProperty('--secondary-dark', theme.dark.secondary);
    document.documentElement.style.setProperty('--accent-dark', theme.dark.accent);
    document.documentElement.style.setProperty('--background-dark', theme.dark.background);
    document.documentElement.style.setProperty('--text-dark', theme.dark.text);
    
    // Update the actual CSS variables based on current mode
    updateThemeVariables();
    
  }, [colorTheme, mounted]);
  
  // Function to update theme variables based on current dark/light mode
  const updateThemeVariables = () => {
    // Detect if currently in dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Set the active variables based on current mode
    document.documentElement.style.setProperty('--primary', 
      isDarkMode ? 'var(--primary-dark)' : 'var(--primary-light)');
    document.documentElement.style.setProperty('--secondary', 
      isDarkMode ? 'var(--secondary-dark)' : 'var(--secondary-light)');
    document.documentElement.style.setProperty('--accent', 
      isDarkMode ? 'var(--accent-dark)' : 'var(--accent-light)');
    document.documentElement.style.setProperty('--background', 
      isDarkMode ? 'var(--background-dark)' : 'var(--background-light)');
    document.documentElement.style.setProperty('--foreground', 
      isDarkMode ? 'var(--text-dark)' : 'var(--text-light)');
  };
  
  // Monitor for theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Create a MutationObserver to watch for class changes on the HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'class'
        ) {
          // Update variables when dark mode class changes
          updateThemeVariables();
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });
    
    // Cleanup
    return () => observer.disconnect();
  }, [mounted]);

  // Context to share color theme state
  const colorThemeContext = React.useMemo(() => ({
    colorTheme,
    setColorTheme: (theme: ThemeKey) => {
      setColorTheme(theme);
      localStorage.setItem('color-theme', theme);
    }
  }), [colorTheme]);

  return (
    <ColorThemeContext.Provider value={colorThemeContext}>
      <NextThemesProvider disableTransitionOnChange {...props}>
        <div className="min-h-screen">
          {children}
        </div>
      </NextThemesProvider>
    </ColorThemeContext.Provider>
  );
}

// Context for color themes
type ColorThemeContextType = {
  colorTheme: ThemeKey;
  setColorTheme: (theme: ThemeKey) => void;
};

const ColorThemeContext = React.createContext<ColorThemeContextType>({
  colorTheme: 'default',
  setColorTheme: () => {},
});

// Custom hooks
export const useTheme = useNextTheme;

export const useColorTheme = () => {
  return React.useContext(ColorThemeContext);
};
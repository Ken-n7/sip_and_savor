'use client';

import { SunIcon, MoonIcon, ComputerDesktopIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';
import { useColorTheme } from './ThemeProvider';
import { THEMES, ThemeKey } from '../../lib/theme';
import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md">
          <div className="h-5 w-5"></div>
        </button>
        <button className="p-2 rounded-md">
          <div className="h-5 w-5"></div>
        </button>
      </div>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
    setTheme(newTheme);
  };

  const handleColorThemeChange = (newTheme: ThemeKey) => {
    setColorTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  // Function to determine current effective theme (light or dark)
  const getCurrentTheme = () => {
    if (theme === 'system') {
      // Check system preference when in system mode
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light'; // Default fallback
    }
    return theme;
  };

  const currentTheme = getCurrentTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-accent/10 focus:outline-none transition-colors"
        aria-label={`Toggle theme (current: ${theme})`}
      >
        {getThemeIcon()}
      </button>

      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            className="p-2 rounded-md hover:bg-accent/10 focus:outline-none transition-colors"
            aria-label="Change color theme"
          >
            <SwatchIcon className="h-5 w-5" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="min-w-[200px] solid-bg border border-border rounded-md shadow-lg p-2 space-y-1 z-50 animate-in fade-in zoom-in-95"
          >
            <DropdownMenu.Label className="px-2 py-1 text-sm font-medium text-muted-foreground">
              Color Themes
            </DropdownMenu.Label>
            {Object.entries(THEMES).map(([key, themeConfig]) => (
              <DropdownMenu.Item
                key={key}
                onClick={() => handleColorThemeChange(key as ThemeKey)}
                className={`flex items-center px-2 py-1.5 rounded text-sm cursor-pointer ${
                  colorTheme === key
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${currentTheme === 'dark' 
                        ? themeConfig.dark.primary 
                        : themeConfig.light.primary})`,
                    }}
                  />
                  {themeConfig.name}
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
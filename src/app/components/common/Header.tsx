'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { useColorTheme } from './ThemeProvider';
import { THEMES, ThemeKey } from '../../lib/theme';
import { SearchModal } from '../search/SearchModal';

const navLinks = [
  { name: 'Home', href: '/' },
  // { name: 'Cocktails', href: '/cocktail' },
  // { name: 'Meals', href: '/meal' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { resolvedTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setHasScrolled(scrollPosition > 10);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div className="h-16" aria-hidden="true"></div>

      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ${
          hasScrolled
            ? 'bg-background/90 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-background'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with theme switching */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold hover:text-primary transition-colors"
            >
              {mounted ? (
                <>
                  <div className="w-[50px] h-[50px]">
                    {resolvedTheme === 'dark' ? (
                      <Image
                        src="/app-logo-dark.webp"
                        alt="SipAndSavor Logo"
                        width={50}
                        height={50}
                        className="w-full h-full"
                      />
                    ) : (
                      <Image
                        src="/app-logo-light.webp"
                        alt="SipAndSavor Logo"
                        width={50}
                        height={50}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <span className="text-foreground">
                    SipAndSavor
                  </span>
                </>
              ) : (
                <>
                  <div className="w-[50px] h-[50px] bg-muted rounded animate-pulse" />
                  <span className="inline-block w-24 h-6 bg-muted rounded animate-pulse" />
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-1 py-3 transition-colors border-b-2 ${
                    pathname === link.href
                      ? 'border-primary text-foreground'
                      : 'border-transparent hover:border-border text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right-side items */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 min-h-[44px] text-sm text-foreground/60 hover:text-foreground border border-border rounded-full hover:bg-accent/10 transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-1 text-xs text-foreground/40">
                  <span>{isMac ? '⌘K' : 'Ctrl+K'}</span>
                </kbd>
              </button>
              <ThemeToggle />
              <button
                className="md:hidden p-[10px] rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-3 rounded-md text-base ${
                      pathname === link.href
                        ? 'bg-accent/10 text-foreground font-medium'
                        : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Color theme picker — only visible on mobile since swatch is hidden in header */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-foreground/50">
                  Color Theme
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {Object.entries(THEMES).map(([key, themeConfig]) => (
                    <button
                      key={key}
                      onClick={() => setColorTheme(key as ThemeKey)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors ${
                        colorTheme === key
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground/60 hover:bg-accent/10 hover:text-foreground'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: `hsl(${resolvedTheme === 'dark'
                            ? themeConfig.dark.primary
                            : themeConfig.light.primary})`,
                        }}
                      />
                      {themeConfig.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;

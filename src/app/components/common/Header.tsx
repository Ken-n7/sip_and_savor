'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';

const navLinks = [
  { name: 'Home', href: '/' },
  // { name: 'Cocktails', href: '/cocktail' },
  // { name: 'Meals', href: '/meal' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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
                        height={50 }
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <span 
                    className="text-foreground"
                    style={{
                      color: resolvedTheme === 'dark' 
                        ? 'var(--text-dark)' 
                        : 'var(--text-light)'
                    }}
                  >
                    SipAndSavor
                  </span>
                </>
              ) : (
                <>
                  <div className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <span className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-1 py-2 transition-colors border-b-2 ${
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
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
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
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-base ${
                      pathname === link.href
                        ? 'bg-accent/10 text-foreground font-medium'
                        : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

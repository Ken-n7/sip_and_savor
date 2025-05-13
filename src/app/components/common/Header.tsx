'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  // Memoized scroll handler with passive listener for better performance
  const handleScroll = useCallback(() => {
    setHasScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    // Using passive event listener for better scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cocktails', href: '/cocktails' },
    { name: 'Meals', href: '/meals' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-200 ${
        hasScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm' 
          : 'bg-white dark:bg-gray-900'
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with optimized contrast */}
          <Link 
            href="/" 
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Home"
            prefetch={false} // Disable prefetch for logo as it's likely above the fold
          >
            RecipeExplorer
          </Link>

          {/* Desktop Navigation - Optimized for performance */}
          <nav 
            className="hidden md:flex items-center space-x-6" 
            aria-label="Desktop navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false} // Disable prefetch for better performance
                className={`text-sm px-1 py-2 transition-colors border-b-2 ${
                  pathname === link.href
                    ? 'border-primary-500 dark:border-primary-400 text-gray-900 dark:text-gray-100'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle aria-label="Toggle dark mode" />
            
            {/* Optimized mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Optimized for performance */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden pb-4 transition-all duration-200 ease-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-label"
          >
            <h2 id="mobile-menu-label" className="sr-only">Mobile menu</h2>
            <nav className="flex flex-col space-y-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false} // Disable prefetch for mobile links
                  className={`px-3 py-2 rounded-md text-base ${
                    pathname === link.href
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
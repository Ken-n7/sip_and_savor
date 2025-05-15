// components/ThemeLogo.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we only render on the client
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Link href="/" className="flex items-center gap-3">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <span className="text-xl font-semibold bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded animate-pulse" />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <Image
        src={resolvedTheme === 'dark' ? '/app-logo-dark.png' : '/app-logo-light.png'}
        alt="SipAndSavor Logo"
        width={60}
        height={60}
        priority
        className="h-12 w-auto"
      />
      <span 
        className="text-xl font-semibold"
        style={{
          color: resolvedTheme === 'dark' 
            ? 'var(--text-dark)' 
            : 'var(--text-light)'
        }}
      >
        SipAndSavor
      </span>
    </Link>
  );
}
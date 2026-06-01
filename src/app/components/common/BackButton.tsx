'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function BackButton({ label = 'Back' }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={label}
    >
      <ArrowLeftIcon className="h-6 w-6 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
      <span className="font-semibold text-lg">{label}</span>
    </button>
  );
}

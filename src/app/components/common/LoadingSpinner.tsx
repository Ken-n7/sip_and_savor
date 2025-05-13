// src/components/common/LoadingSpinner.tsx
'use client';

interface LoadingSpinnerProps {
  size?: string; // Make it optional with '?'
}

export function LoadingSpinner({ size = 'h-12 w-12' }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-primary`}></div>
    </div>
  );
}
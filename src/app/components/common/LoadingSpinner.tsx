import React from "react";

interface LoadingSpinnerProps {
  size?: string;
  className?: string;
}

export const LoadingSpinner = ({
  size = "h-6 w-6",
  className = "",
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${size}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

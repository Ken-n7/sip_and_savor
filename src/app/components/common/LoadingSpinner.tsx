import React from "react";

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({
  size = "h-6 w-6",
  color = "text-primary",
  className = "",
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${size}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({
  message,
  className = "",
}: ErrorMessageProps) => {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>{message}</div>
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  "aria-label"?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = false,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    link: "text-primary hover:underline focus:ring-primary/40",
  };
  
  // Width class
  const widthClass = fullWidth ? "w-full" : "";
  
  // Disabled class
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
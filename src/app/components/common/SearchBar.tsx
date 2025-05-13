"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onSearch?: (term: string) => void;
}

export const SearchBar = ({
  className = "",
  placeholder = "Search for cocktails or meals...",
  initialValue = "",
  onSearch,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) return;

    if (onSearch) {
      onSearch(trimmedTerm);
    } else {
      // Default behavior: Navigate to search page
      router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <div className="relative flex-grow">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          aria-label="Search"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
};
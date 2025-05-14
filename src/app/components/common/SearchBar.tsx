"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchCocktailsByName, searchMealsByName } from "../../lib/api";
import type { Cocktail, Meal } from "@/types/recipe";

interface SearchSuggestion {
  id: string;
  name: string;
  category: "drink" | "meal";
  type: "cocktail" | "meal";
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onSearch?: (term: string, category?: "drink" | "meal") => void;
}



export const SearchBar = ({
  className = "",
  placeholder = "Search for cocktails or meals...",
  initialValue = "",
  onSearch,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // Search both APIs in parallel
        const [cocktails, meals] = await Promise.all([
          searchCocktailsByName(trimmedTerm),
          searchMealsByName(trimmedTerm),
        ]);

        const cocktailSuggestions: SearchSuggestion[] = cocktails.map((cocktail: Cocktail) => ({
          id: cocktail.idDrink,
          name: cocktail.strDrink,
          category: "drink",
          type: "cocktail",
        }));

        const mealSuggestions: SearchSuggestion[] = meals.map((meal: Meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          category: "meal",
          type: "meal",
        }));

        // Combine and sort by name
        const combined = [...cocktailSuggestions, ...mealSuggestions].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    setShowSuggestions(false);

    if (onSearch) {
      onSearch(trimmedTerm);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);

    if (onSearch) {
      onSearch(suggestion.name, suggestion.category);
    } else {
      // Navigate directly to the item page or category search
      router.push(`/${suggestion.type}/${suggestion.id}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "drink" ? "🍹" : "🍽️";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <div className="relative flex-grow" ref={searchRef}>
        <input
          type="search"
          role="combobox"  // Add this
          aria-haspopup="listbox"  // Add this
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.trim().length > 0);
          }}
          onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
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

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <ul
            id="search-suggestions"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {isLoading ? (
              <li className="px-4 py-2 text-gray-500 flex items-center">
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Searching...
              </li>
            ) : suggestions.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            ) : (
              suggestions.map((suggestion) => (
                <li
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  role="option"
                  aria-selected="false"
                >
                  <span className="mr-2">{getCategoryIcon(suggestion.category)}</span>
                  <span className="truncate">{suggestion.name}</span>
                  <span className="ml-auto text-xs text-gray-500 capitalize">
                    ({suggestion.category})
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
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
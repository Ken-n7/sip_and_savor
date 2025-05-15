"use client";

import { useState, useEffect } from "react";
import { Cocktail, Meal } from "@/types/recipe";
import { useRouter } from "next/navigation";

type RecentSearch = {
  query: string;
  timestamp: number;
};

const RECENT_SEARCHES_KEY = "recipe-explorer-recent-searches";
const MAX_RECENT_SEARCHES = 10;

export function useSearchHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        const parsedSearches: RecentSearch[] = JSON.parse(storedSearches);
        // Sort by most recent first
        parsedSearches.sort((a, b) => b.timestamp - a.timestamp);
        setRecentSearches(parsedSearches.map(item => item.query));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      // Reset in case of corruption
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  // Add a search term to history
  const addSearchTerm = (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Normalize query by trimming and converting to lowercase
      const normalizedQuery = query.trim().toLowerCase();
      
      // Get existing searches
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      let searches: RecentSearch[] = storedSearches ? JSON.parse(storedSearches) : [];
      
      // Remove the query if it already exists
      searches = searches.filter(item => item.query.toLowerCase() !== normalizedQuery);
      
      // Add the new search to the beginning
      searches.unshift({
        query: query.trim(),
        timestamp: Date.now()
      });
      
      // Limit to MAX_RECENT_SEARCHES
      if (searches.length > MAX_RECENT_SEARCHES) {
        searches = searches.slice(0, MAX_RECENT_SEARCHES);
      }
      
      // Save back to localStorage
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      
      // Update state
      setRecentSearches(searches.map(item => item.query));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Clear all search history
  const clearSearchHistory = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  return {
    recentSearches,
    addSearchTerm,
    clearSearchHistory
  };
}

export function useSearchNavigation() {
  const router = useRouter();
  
  const navigateToSearch = (query: string, filter: "all" | "cocktails" | "meals" = "all") => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filter !== "all") params.set("filter", filter);
    
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };
  
  const navigateToCocktail = (id: string) => {
    router.push(`/cocktail/${id}`);
  };
  
  const navigateToMeal = (id: string) => {
    router.push(`/meal/${id}`);
  };
  
  return {
    navigateToSearch,
    navigateToCocktail,
    navigateToMeal
  };
}

// Custom hook for caching popular recipes
export function usePopularRecipes(initialCocktails: Cocktail[] = [], initialMeals: Meal[] = []) {
  const [popularCocktails, setPopularCocktails] = useState<Cocktail[]>(initialCocktails);
  const [popularMeals, setPopularMeals] = useState<Meal[]>(initialMeals);
  
  const POPULAR_RECIPES_KEY = "recipe-explorer-popular-recipes";
  // const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Load popular recipes from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    try {
      const storedRecipes = localStorage.getItem(POPULAR_RECIPES_KEY);
      
      if (storedRecipes) {
        const parsedData = JSON.parse(storedRecipes);
        
        // Check if the cache is still valid
        const now = Date.now();
        if (parsedData.timestamp && now - parsedData.timestamp < CACHE_TTL) {
          if (parsedData.cocktails) setPopularCocktails(parsedData.cocktails);
          if (parsedData.meals) setPopularMeals(parsedData.meals);
        } else {
          // Cache is expired, will be refreshed when updatePopularRecipes is called
          localStorage.removeItem(POPULAR_RECIPES_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading popular recipes:", error);
      localStorage.removeItem(POPULAR_RECIPES_KEY);
    }
  }, []);
  
  // Update popular recipes
  const updatePopularRecipes = (cocktails: Cocktail[], meals: Meal[]) => {
    setPopularCocktails(cocktails);
    setPopularMeals(meals);
    
    try {
      localStorage.setItem(POPULAR_RECIPES_KEY, JSON.stringify({
        cocktails,
        meals,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error saving popular recipes:", error);
    }
  };
  
  return {
    popularCocktails,
    popularMeals,
    updatePopularRecipes
  };
}

// Helper function to track viewed recipes for "Recently Viewed" feature
export function trackViewedRecipe(type: "cocktail" | "meal", recipe: Cocktail | Meal) {
  if (typeof window === "undefined") return;
  
  const VIEWED_RECIPES_KEY = "recipe-explorer-viewed-recipes";
  const MAX_VIEWED_RECIPES = 10;
  
  try {
    const id = type === "cocktail" 
      ? (recipe as Cocktail).idDrink 
      : (recipe as Meal).idMeal;
    
    const name = type === "cocktail" 
      ? (recipe as Cocktail).strDrink 
      : (recipe as Meal).strMeal;
    
    const thumbnail = type === "cocktail" 
      ? (recipe as Cocktail).strDrinkThumb 
      : (recipe as Meal).strMealThumb;
    
    // Define a type for viewed recipe items
    type ViewedRecipe = {
      id: string;
      name: string;
      thumbnail: string;
      type: "cocktail" | "meal";
      timestamp: number;
    };
    
    // Get existing viewed recipes
    const stored = localStorage.getItem(VIEWED_RECIPES_KEY);
    let viewedRecipes: ViewedRecipe[] = stored ? JSON.parse(stored) : [];
    
    // Remove if it already exists
    viewedRecipes = viewedRecipes.filter((item) => 
      !(item.type === type && item.id === id)
    );
    
    // Add to the beginning
    viewedRecipes.unshift({
      id,
      name,
      thumbnail,
      type,
      timestamp: Date.now()
    });
    
    // Limit size
    if (viewedRecipes.length > MAX_VIEWED_RECIPES) {
      viewedRecipes = viewedRecipes.slice(0, MAX_VIEWED_RECIPES);
    }
    
    // Save back
    localStorage.setItem(VIEWED_RECIPES_KEY, JSON.stringify(viewedRecipes));
  } catch (error) {
    console.error("Error tracking viewed recipe:", error);
  }
}
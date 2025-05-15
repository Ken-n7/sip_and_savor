import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Cocktail, Meal, SearchFilters } from "@/types/recipe";
import { 
  searchCocktailsByName, 
  searchMealsByName, 
  fetchRandomCocktails, 
  fetchRandomMeals 
} from "@/app/lib/api";

interface UseSearchResultsOptions {
  initialCocktails?: Cocktail[];
  initialMeals?: Meal[];
  autoSearchOnMount?: boolean;
}

export function useSearchResults(options: UseSearchResultsOptions = {}) {
  const { 
    initialCocktails = [], 
    initialMeals = [], 
    autoSearchOnMount = true 
  } = options;
  
  const searchParams = useSearchParams();
  
  const [cocktails, setCocktails] = useState<Cocktail[]>(initialCocktails);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Current search filters state
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: searchParams?.get("q") || "",
    filterType: (searchParams?.get("filter") as "all" | "cocktails" | "meals") || "all"
  });
  
  // Run initial search if query is provided via URL
  useEffect(() => {
    if (autoSearchOnMount && searchParams && searchParams.get("q")) {
      const query = searchParams.get("q") || "";
      const filter = (searchParams.get("filter") as "all" | "cocktails" | "meals") || "all";
      
      setCurrentFilters({
        query,
        filterType: filter
      });
      
      performSearch(query, filter);
    }
  }, [autoSearchOnMount, searchParams]);
  
  // Handle the actual search functionality
  const performSearch = async (
    query: string, 
    filterType: "all" | "cocktails" | "meals" = "all"
  ) => {
    if (!query.trim()) {
      setCocktails([]);
      setMeals([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const shouldSearchCocktails = filterType === "all" || filterType === "cocktails";
      const shouldSearchMeals = filterType === "all" || filterType === "meals";
      
      // Run searches in parallel
      const [newCocktails, newMeals] = await Promise.all([
        shouldSearchCocktails ? searchCocktailsByName(query) : Promise.resolve([]),
        shouldSearchMeals ? searchMealsByName(query) : Promise.resolve([]),
      ]);
      
      setCocktails(newCocktails || []);
      setMeals(newMeals || []);
      setHasSearched(true);
    } catch (err) {
      console.error("Error performing search:", err);
      setError("Failed to complete search. Please try again.");
      setCocktails([]);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Advanced search with more filters
  const performAdvancedSearch = async (filters: SearchFilters) => {
    setCurrentFilters(filters);
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, just using the basic search - you can expand this later
      // to include filtering by categories, ingredients, etc.
      await performSearch(filters.query, filters.filterType);
    } catch (err) {
      console.error("Error performing advanced search:", err);
      setError("Failed to complete search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load random recipes for initial display or empty search
  const loadRandomRecipes = async (cocktailCount = 4, mealCount = 4) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [randomCocktails, randomMeals] = await Promise.all([
        fetchRandomCocktails(cocktailCount),
        fetchRandomMeals(mealCount)
      ]);
      
      setCocktails(randomCocktails || []);
      setMeals(randomMeals || []);
    } catch (err) {
      console.error("Error loading random recipes:", err);
      setError("Failed to load featured recipes. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    cocktails,
    meals,
    isLoading,
    error,
    hasSearched,
    currentFilters,
    performSearch,
    performAdvancedSearch,
    loadRandomRecipes
  };
}
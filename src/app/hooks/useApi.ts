"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Cocktail, Meal } from "@/types/recipe";
import { 
  fetchRandomCocktails, 
  fetchRandomMeals, 
  getCocktailById, 
  getMealById 
} from "../lib/api";

interface UseRandomRecipesResult {
  cocktails: Cocktail[];
  meals: Meal[];
  loading: boolean;
  error: string | null;
  refresh: (count?: number) => Promise<void>;
  isEmpty: boolean;
  getRecipeById: (type: 'cocktail' | 'meal', id: string) => Promise<Cocktail | Meal | null>;
}

interface RecipeState {
  cocktails: Cocktail[];
  meals: Meal[];
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export const useRandomRecipes = (initialCount = 4): UseRandomRecipesResult => {
  const [state, setState] = useState<RecipeState>({
    cocktails: [],
    meals: [],
    loading: true,
    error: null,
    retryCount: 0,
  });
  
  // Add a ref to track if data has been fetched
  const dataFetchedRef = useRef(false);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      if (error.message.includes("Network error")) {
        return "Network connection failed. Please check your internet.";
      }
      if (error.message.includes("timeout")) {
        return "Request took too long. Please try again.";
      }
      return error.message;
    }
    return "Failed to fetch recipes";
  };

  const fetchData = useCallback(async (count: number, retryAttempt = 0) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [cocktailsResult, mealsResult] = await Promise.allSettled([
        fetchRandomCocktails(count),
        fetchRandomMeals(count),
      ]);

      const cocktails =
        cocktailsResult.status === "fulfilled" ? cocktailsResult.value : [];
      const meals = mealsResult.status === "fulfilled" ? mealsResult.value : [];

      if (cocktails.length === 0 && meals.length === 0 && retryAttempt < 2) {
        // Retry if both requests failed
        return fetchData(count, retryAttempt + 1);
      }

      setState({
        cocktails,
        meals,
        loading: false,
        error: null,
        retryCount: retryAttempt,
      });
    } catch (error) {
      if (retryAttempt < 2) {
        // Auto-retry with exponential backoff
        const delay = 1000 * Math.pow(2, retryAttempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchData(count, retryAttempt + 1);
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
        retryCount: retryAttempt,
      }));
    }
  }, []);

  // New function to get a specific recipe by ID
  const getRecipeById = useCallback(async (type: 'cocktail' | 'meal', id: string): Promise<Cocktail | Meal | null> => {
    try {
      if (type === 'cocktail') {
        return await getCocktailById(id);
      } else {
        return await getMealById(id);
      }
    } catch (error) {
      console.error(`Error fetching ${type} with ID ${id}:`, error);
      setState(prev => ({
        ...prev,
        error: getErrorMessage(error)
      }));
      return null;
    }
  }, []);

  useEffect(() => {
    // Only fetch data if it hasn't been fetched yet
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchData(initialCount);
    }
    
    // Clean up function is not needed here since we're using the ref
  }, [fetchData, initialCount]);

  const refresh = useCallback(
    async (count = initialCount) => {
      await fetchData(count);
    },
    [fetchData, initialCount]
  );

  return {
    cocktails: state.cocktails,
    meals: state.meals,
    loading: state.loading,
    error: state.error,
    refresh,
    isEmpty:
      !state.loading &&
      state.cocktails.length === 0 &&
      state.meals.length === 0,
    getRecipeById,
  };
};
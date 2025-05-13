"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchRandomCocktails, fetchRandomMeals } from "../lib/api";

interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb?: string;
  [key: string]: any;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  [key: string]: any;
}

export const useRandomRecipes = (initialCount = 6) => {
  const [state, setState] = useState<{
    cocktails: Cocktail[];
    meals: Meal[];
    loading: boolean;
    error: string | null;
    retryCount: number;
  }>({
    cocktails: [],
    meals: [],
    loading: true,
    error: null,
    retryCount: 0,
  });

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

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      await fetchData(initialCount);
    };

    if (mounted) {
      loadData();
    }

    return () => {
      mounted = false;
    };
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
  };
};

import React from "react";
import { Cocktail, Meal } from "@/types/recipe";
import MealCard from "@/app/components/meals/MealCard";
import CocktailCard from "@/app/components/cocktails/CocktailCard";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResultsProps {
  cocktails: Cocktail[];
  meals: Meal[];
  isLoading: boolean;
  query: string;
  activeFilter: "all" | "cocktails" | "meals";
}

const SearchResults: React.FC<SearchResultsProps> = ({
  cocktails,
  meals,
  isLoading,
  query,
  activeFilter,
}) => {
  const hasQuery = query.trim().length > 0;

  const visibleCocktails = activeFilter !== "meals" ? cocktails : [];
  const visibleMeals = activeFilter !== "cocktails" ? meals : [];
  const totalCount = visibleCocktails.length + visibleMeals.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-sm text-foreground/60">Searching for recipes...</p>
      </div>
    );
  }

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-foreground/50">Start typing to search for cocktails and meals</p>
      </div>
    );
  }

  if (hasQuery && totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-xl font-medium text-foreground">No results found</h3>
        <p className="mt-2 text-foreground/60">
          No recipes matching &quot;{query}&quot;
        </p>
        <p className="mt-1 text-sm text-foreground/40">Try different keywords or check for typos.</p>
      </div>
    );
  }

  // Interleave cocktails and meals for the mixed grid
  const mixed: Array<{ type: "cocktail"; item: Cocktail } | { type: "meal"; item: Meal }> = [];
  const maxLen = Math.max(visibleCocktails.length, visibleMeals.length);
  for (let i = 0; i < maxLen; i++) {
    if (visibleCocktails[i]) mixed.push({ type: "cocktail", item: visibleCocktails[i] });
    if (visibleMeals[i]) mixed.push({ type: "meal", item: visibleMeals[i] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-foreground/50">
          {totalCount} result{totalCount !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
        {activeFilter === "all" && visibleCocktails.length > 0 && visibleMeals.length > 0 && (
          <p className="text-xs text-foreground/40">
            {visibleCocktails.length} cocktail{visibleCocktails.length !== 1 ? "s" : ""} · {visibleMeals.length} meal{visibleMeals.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${query}-${activeFilter}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {mixed.map((entry, i) =>
            entry.type === "cocktail" ? (
              <motion.div
                key={`cocktail-${entry.item.idDrink}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <CocktailCard cocktail={entry.item} />
              </motion.div>
            ) : (
              <motion.div
                key={`meal-${entry.item.idMeal}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <MealCard meal={entry.item} />
              </motion.div>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;

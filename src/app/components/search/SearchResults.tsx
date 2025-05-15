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
  const hasResults = cocktails.length > 0 || meals.length > 0;
  const hasQuery = query.trim().length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div 
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'hsl(var(--border))',
            borderTopColor: 'hsl(var(--primary))'
          }}
        ></div>
        <p className="mt-4" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
          Searching for recipes...
        </p>
      </div>
    );
  }

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
          Start typing to search for cocktails and meals
        </p>
      </div>
    );
  }

  if (hasQuery && !hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 
          className="text-xl font-medium"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          No results found
        </h3>
        <p className="mt-2" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
          We couldn&apos;t find any recipes matching &quot;{query}&quot;.
        </p>
        <p className="mt-4" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
          Try using different keywords or check for typos.
        </p>
      </div>
    );
  }

  const shouldShowCocktails = activeFilter !== "meals" && cocktails.length > 0;
  const shouldShowMeals = activeFilter !== "cocktails" && meals.length > 0;

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {shouldShowCocktails && (
          <motion.section
            key="cocktails"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 
              className="mb-4 text-2xl font-bold"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              Cocktails
              <span 
                className="ml-2 text-sm font-normal"
                style={{ color: 'hsl(var(--foreground) / 0.6)' }}
              >
                ({cocktails.length})
              </span>
            </h2>
            <motion.div 
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {cocktails.map((cocktail) => (
                <CocktailCard 
                  key={cocktail.idDrink}
                  cocktail={cocktail}
                />
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {shouldShowMeals && (
          <motion.section
            key="meals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 
              className="mb-4 text-2xl font-bold"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              Meals
              <span 
                className="ml-2 text-sm font-normal"
                style={{ color: 'hsl(var(--foreground) / 0.6)' }}
              >
                ({meals.length})
              </span>
            </h2>
            <motion.div 
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {meals.map((meal) => (
                <MealCard
                  key={meal.idMeal}
                  meal={meal}
                />
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
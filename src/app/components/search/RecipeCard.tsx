import React from "react";
import { Cocktail, Meal } from "@/types/recipe";
import Image from "next/image";
import Link from "next/link";

type RecipeCardVariant = "compact" | "standard";

interface RecipeCardProps {
  recipe: Cocktail | Meal;
  type: "cocktail" | "meal";
  variant?: RecipeCardVariant;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  type,
  variant = "standard",
  className = "",
}) => {
  const isCompact = variant === "compact";
  const isCocktail = type === "cocktail";
  
  // Use type guard to determine if we're dealing with a Cocktail or Meal
  const id = isCocktail 
    ? (recipe as Cocktail).idDrink 
    : (recipe as Meal).idMeal;
  
  const name = isCocktail 
    ? (recipe as Cocktail).strDrink 
    : (recipe as Meal).strMeal;
  
  const thumbnail = isCocktail 
    ? (recipe as Cocktail).strDrinkThumb 
    : (recipe as Meal).strMealThumb;
  
  const category = isCocktail 
    ? (recipe as Cocktail).strCategory 
    : (recipe as Meal).strCategory;

  const hrefPath = isCocktail ? "/cocktail" : "/meal";

  return (
    <Link href={`${hrefPath}/${id}`}>
      <div 
        className={`
          flex ${isCompact ? "flex-row" : "flex-col"} 
          bg-white dark:bg-gray-800 rounded-lg overflow-hidden
          border border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:scale-[1.02]
          ${className}
        `}
      >
        <div className={`
          ${isCompact ? "w-24 h-24" : "w-full aspect-square"} 
          relative overflow-hidden
        `}>
          <Image
            src={thumbnail || "/images/placeholder-recipe.jpg"}
            alt={name || "Recipe"}
            fill
            className="object-cover"
            sizes={isCompact ? "6rem" : "(max-width: 768px) 100vw, 33vw"}
          />
        </div>

        <div className={`p-4 flex flex-col ${isCompact ? "flex-1" : ""}`}>
          <h3 className={`font-medium text-gray-900 dark:text-white ${isCompact ? "text-sm" : "text-lg"}`}>
            {name}
          </h3>
          
          {category && (
            <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              {category}
            </span>
          )}

          {!isCompact && (
            <div className="mt-3">
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded-full
                ${isCocktail ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : 
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}
              `}>
                {isCocktail ? "Cocktail" : "Meal"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
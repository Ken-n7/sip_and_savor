'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Ingredient = {
  ingredient: string;
  measure?: string;
};

export const IngredientSection = ({
  ingredients,
  apiSource = 'themealdb'
}: {
  ingredients: Ingredient[];
  apiSource?: 'themealdb' | 'cocktaildb'
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // start expanded
  const [expandedIngredient, setExpandedIngredient] = useState<Ingredient | null>(null);

  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    checkIfMobile();
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkIfMobile, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [checkIfMobile]);

  useEffect(() => {
    if (!expandedIngredient) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIngredient(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [expandedIngredient]);

  const toggleCollapse = () => {
    if (isMobile) setIsCollapsed(prev => !prev);
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 lg:top-24">
        <div className="bg-background/80 dark:bg-background/60 backdrop-blur-lg rounded-2xl shadow-md border border-border animate-slide-up overflow-hidden">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-4 lg:px-6 lg:py-5 ${isMobile ? 'cursor-pointer hover:bg-accent/5 transition-colors' : ''}`}
            onClick={toggleCollapse}
            role={isMobile ? 'button' : undefined}
            aria-expanded={isMobile ? !isCollapsed : undefined}
          >
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">
              Ingredients
              <span className="ml-2 text-sm font-normal text-foreground/40">
                ({ingredients.length})
              </span>
            </h2>
            {isMobile && (
              isCollapsed
                ? <ChevronDownIcon className="w-5 h-5 text-foreground/50" />
                : <ChevronUpIcon className="w-5 h-5 text-foreground/50" />
            )}
          </div>

          {/* List */}
          <div className={`${isMobile && isCollapsed ? 'hidden' : 'block'} px-4 pb-4 lg:px-6 lg:pb-6`}>
            <IngredientList
              ingredients={ingredients}
              apiSource={apiSource}
              onIngredientClick={setExpandedIngredient}
            />
          </div>
        </div>
      </div>

      {/* Ingredient detail popup */}
      {expandedIngredient && (
        <IngredientPopup
          ingredient={expandedIngredient}
          apiSource={apiSource}
          onClose={() => setExpandedIngredient(null)}
        />
      )}
    </div>
  );
};

// ─── Ingredient popup ─────────────────────────────────────────────────────────
function IngredientPopup({
  ingredient,
  apiSource,
  onClose
}: {
  ingredient: Ingredient;
  apiSource: 'themealdb' | 'cocktaildb';
  onClose: () => void;
}) {
  const base = apiSource === 'cocktaildb'
    ? 'https://www.thecocktaildb.com/images/ingredients'
    : 'https://www.themealdb.com/images/ingredients';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-xs bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-foreground/50" />
        </button>

        <div className="flex flex-col items-center gap-4 px-6 py-5 pb-8 sm:py-6">
          {/* Ingredient image — larger and medium quality */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40">
            <Image
              src={`${base}/${ingredient.ingredient}-Medium.png`}
              alt={ingredient.ingredient}
              fill
              className="object-contain drop-shadow-md"
              sizes="160px"
              onError={e => {
                // Fall back to Small if Medium not available
                const img = e.target as HTMLImageElement;
                if (img.src.includes('-Medium.png')) {
                  img.src = `${base}/${ingredient.ingredient}-Small.png`;
                } else {
                  img.onerror = null;
                  img.style.display = 'none';
                }
              }}
            />
          </div>

          {/* Name */}
          <h3 className="text-2xl font-bold text-center text-foreground leading-tight">
            {ingredient.ingredient}
          </h3>

          {/* Measurement badge */}
          {ingredient.measure && (
            <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {ingredient.measure}
            </div>
          )}

          {!ingredient.measure && (
            <p className="text-sm text-foreground/40">No amount specified</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ingredient list ──────────────────────────────────────────────────────────
const IngredientList = ({
  ingredients,
  apiSource,
  onIngredientClick
}: {
  ingredients: Ingredient[];
  apiSource: 'themealdb' | 'cocktaildb';
  onIngredientClick: (ingredient: Ingredient) => void;
}) => {
  const getIngredientImage = (ingredient: string) => {
    const base = apiSource === 'cocktaildb'
      ? 'https://www.thecocktaildb.com/images/ingredients'
      : 'https://www.themealdb.com/images/ingredients';
    return `${base}/${ingredient}-Small.png`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3">
      {ingredients.map(item => (
        <button
          key={item.ingredient}
          className="flex items-center gap-3 p-2.5 lg:p-3 bg-background/60 dark:bg-background/40 border border-border rounded-xl hover:bg-accent/5 hover:border-primary/30 transition-all text-left w-full group"
          onClick={() => onIngredientClick(item)}
          aria-label={`${item.ingredient}${item.measure ? ` — ${item.measure}` : ''}`}
        >
          <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0 bg-background rounded-lg">
            <Image
              src={getIngredientImage(item.ingredient)}
              alt=""
              fill
              className="object-contain p-0.5"
              sizes="(max-width: 768px) 36px, 40px"
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors">
              {item.ingredient}
            </p>
            {item.measure && (
              <p className="text-xs text-foreground/50 truncate mt-0.5">
                {item.measure}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

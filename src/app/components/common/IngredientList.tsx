'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { QueueListIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedIngredient, setExpandedIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false); // Always show on desktop
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleCollapse = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    setExpandedIngredient(ingredient);
  };

  const closeExpandedView = () => {
    setExpandedIngredient(null);
  };

  return (
    <div className="lg:col-span-1">
      <div className={`sticky top-6 lg:top-24 ${isMobile ? '' : 'space-y-6'}`}>
        <div 
          className={`bg-background/80 dark:bg-background/60 backdrop-blur-lg rounded-2xl shadow-md border border-border animate-slide-up 
            ${isMobile ? 'overflow-hidden' : ''}`}
        >
          {/* Collapsible Header */}
          <div 
            className={`flex items-center justify-between p-4 lg:p-6 ${isMobile ? 'cursor-pointer hover:bg-accent/5' : ''}`}
            onClick={toggleCollapse}
          >
            <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-3">
              <QueueListIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" aria-hidden="true" />
              Ingredients
              <span className="text-sm font-normal text-foreground/60 ml-2">
                ({ingredients.length})
              </span>
            </h2>
            {isMobile && (
              isCollapsed ? (
                <ChevronDownIcon className="w-5 h-5 text-foreground/60" />
              ) : (
                <ChevronUpIcon className="w-5 h-5 text-foreground/60" />
              )
            )}
          </div>

          {/* Content */}
          <div className={`${isMobile && isCollapsed ? 'hidden' : 'block'} px-4 pb-4 lg:px-6 lg:pb-6`}>
            <IngredientList 
              ingredients={ingredients} 
              apiSource={apiSource}
              onIngredientClick={handleIngredientClick}
            />
          </div>
        </div>
      </div>

      {/* Expanded Ingredient View (Both mobile and desktop) */}
      {expandedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative solid-bg dark:solid-bg border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeExpandedView}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent/10"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6 text-foreground/70" />
            </button>
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <Image
                  src={apiSource === 'cocktaildb' 
                    ? `https://www.thecocktaildb.com/images/ingredients/${expandedIngredient.ingredient}-small.png`
                    : `https://www.themealdb.com/images/ingredients/${expandedIngredient.ingredient}-small.png`}
                  alt={expandedIngredient.ingredient}
                  fill
                  className="object-contain"
                  sizes="128px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-ingredient.png';
                  }}
                />
              </div>
              
              <h3 className="text-2xl font-bold text-center text-foreground">
                {expandedIngredient.ingredient}
              </h3>
              
              {expandedIngredient.measure && (
                <p className="text-lg text-foreground/80 text-center">
                  {expandedIngredient.measure}
                </p>
              )}
              
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(expandedIngredient.ingredient)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IngredientList = ({ 
  ingredients, 
  apiSource,
  onIngredientClick
}: { 
  ingredients: Ingredient[], 
  apiSource: 'themealdb' | 'cocktaildb',
  onIngredientClick: (ingredient: Ingredient) => void
}) => {
  const getIngredientImage = (ingredient: string) => {
    if (apiSource === 'cocktaildb') {
      return `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`;
    } else {
      return `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4">
      {ingredients.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 lg:p-3 bg-background/80 dark:bg-background/60 border border-border rounded-lg lg:rounded-xl hover:shadow-sm transition-all cursor-pointer"
          onClick={() => onIngredientClick(item)}
        >
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
            <Image
              src={getIngredientImage(item.ingredient)}
              alt={item.ingredient}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 32px, 40px"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-ingredient.png';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-sm lg:text-base truncate" title={item.ingredient}>
              {item.ingredient}
            </p>
            {item.measure && (
              <p className="text-xs lg:text-sm text-foreground/70 truncate" title={item.measure}>
                {item.measure}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
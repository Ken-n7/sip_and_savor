import Image from 'next/image';
import Link from 'next/link';
import { Meal } from '@/types/recipe';

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  return (
    <article 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden border border-gray-200 flex flex-col h-full"
      aria-labelledby={`meal-${meal.idMeal}-title`}
    >
      <Link 
        href={`/meals/${meal.idMeal}`} 
        className="flex flex-col h-full"
        prefetch={false}
        aria-label={`View details for ${meal.strMeal}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            // src={meal.strMealThumb || '/placeholder-meal.jpg'}
            src={meal.strMealThumb ? `${meal.strMealThumb}/medium` : '/placeholder-meal.jpg'}
            alt={meal.strMeal}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            decoding="async"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
          />
        </div>
        
        <div className="p-3 flex flex-col flex-grow">
          <div className="mb-1">
            {meal.strCategory && (
              <span className="inline-block text-xs font-medium text-emerald-700 uppercase tracking-wider">
                {meal.strCategory}
              </span>
            )}
            {meal.strArea && (
              <span className="inline-block text-xs font-medium text-gray-500 uppercase tracking-wider ml-2">
                {meal.strArea}
              </span>
            )}
          </div>
          
          <h3 
            id={`meal-${meal.idMeal}-title`}
            className="text-md font-semibold text-gray-800 line-clamp-1 mb-2"
          >
            {meal.strMeal}
          </h3>
          
          {meal.strInstructions && (
            <p className="text-gray-700 text-sm line-clamp-2 mb-3 flex-grow">
              {meal.strInstructions}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default MealCard;
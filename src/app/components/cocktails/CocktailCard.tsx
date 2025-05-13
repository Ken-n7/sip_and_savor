import Image from 'next/image';
import Link from 'next/link';
import { Cocktail } from '@/types/recipe';

interface CocktailCardProps {
  cocktail: Cocktail;
}

const CocktailCard = ({ cocktail }: CocktailCardProps) => {
  return (
    <article 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden border border-gray-200 flex flex-col h-full"
      aria-labelledby={`cocktail-${cocktail.idDrink}-title`}
    >
      <Link 
        href={`/cocktail/${cocktail.idDrink}`} 
        className="flex flex-col h-full"
        prefetch={false}
        aria-label={`View details for ${cocktail.strDrink}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={cocktail.strDrinkThumb || '/placeholder-cocktail.jpg'}
            alt={cocktail.strDrink}
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
            {cocktail.strCategory && (
              <span className="inline-block text-xs font-medium text-amber-700 uppercase tracking-wider">
                {cocktail.strCategory}
              </span>
            )}
          </div>
          
          <h3 
            id={`cocktail-${cocktail.idDrink}-title`}
            className="text-md font-semibold text-gray-800 line-clamp-1 mb-2"
          >
            {cocktail.strDrink}
          </h3>
          
          {cocktail.strInstructions && (
            <p className="text-gray-700 text-sm line-clamp-2 mb-3 flex-grow">
              {cocktail.strInstructions}
            </p>
          )}
          
          <div className="mt-auto">
            <span className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm group-hover:underline transition-colors">
              View recipe
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CocktailCard;
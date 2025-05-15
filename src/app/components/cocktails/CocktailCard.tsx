import Image from 'next/image';
import Link from 'next/link';
import { Cocktail } from '@/types/recipe';

interface CocktailCardProps {
  cocktail: Cocktail;
}

const CocktailCard = ({ cocktail }: CocktailCardProps) => {
  return (
    <article 
      className="group bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out overflow-hidden border border-border flex flex-col h-full"
      aria-labelledby={`cocktail-${cocktail.idDrink}-title`}
    >
      <Link 
        href={`/cocktail/${cocktail.idDrink}`} 
        className="flex flex-col h-full"
        prefetch={false}
        aria-label={`View details for ${cocktail.strDrink}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={cocktail.strDrinkThumb ? `${cocktail.strDrinkThumb}/medium` : '/placeholder-cocktail.jpg'}
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
              <span className="inline-block text-xs font-medium text-primary uppercase tracking-wider">
                {cocktail.strCategory}
              </span>
            )}
          </div>
          
          <h3 
            id={`cocktail-${cocktail.idDrink}-title`}
            className="text-md font-semibold text-foreground line-clamp-1 mb-2"
          >
            {cocktail.strDrink}
          </h3>
          
          {cocktail.strInstructions && (
            <p className="text-foreground/80 text-sm line-clamp-2 mb-3 flex-grow">
              {cocktail.strInstructions}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default CocktailCard;
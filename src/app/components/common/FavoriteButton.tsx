'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useFavorites, FavoriteItem } from '@/app/hooks/useFavorites';

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
}

export function FavoriteButton({ item, className = '' }: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(item.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item);
      }}
      className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${
        favorited
          ? 'text-red-500 hover:text-red-400'
          : 'text-foreground/40 hover:text-red-400 bg-background/70 backdrop-blur-sm'
      } ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Save'}
    >
      {favorited ? (
        <HeartSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
}

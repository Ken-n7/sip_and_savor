'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCocktailsByCategory, fetchMealsByCategory, fetchMealsByArea } from '@/app/lib/api';
import { Cocktail, Meal } from '@/types/recipe';

type RelatedItem = {
  id: string;
  name: string;
  thumb: string;
  href: string;
};

interface RelatedRecipesProps {
  type: 'cocktail' | 'meal';
  category?: string;
  area?: string;
  excludeId: string;
}

export function RelatedRecipes({ type, category, area, excludeId }: RelatedRecipesProps) {
  const [items, setItems] = useState<RelatedItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        let raw: RelatedItem[] = [];

        if (type === 'cocktail' && category) {
          const results = await fetchCocktailsByCategory(category);
          raw = results
            .filter((c: Cocktail) => c.idDrink !== excludeId)
            .slice(0, 6)
            .map((c: Cocktail) => ({
              id: c.idDrink,
              name: c.strDrink,
              thumb: c.strDrinkThumb,
              href: `/cocktail/${c.idDrink}`,
            }));
        } else if (type === 'meal') {
          const byArea = area ? await fetchMealsByArea(area) : [];
          const byCategory = category ? await fetchMealsByCategory(category) : [];
          const seen = new Set<string>();
          const merged: Meal[] = [];
          for (const m of [...byArea, ...byCategory]) {
            if (!seen.has(m.idMeal) && m.idMeal !== excludeId) {
              seen.add(m.idMeal);
              merged.push(m);
            }
          }
          raw = merged.slice(0, 6).map((m: Meal) => ({
            id: m.idMeal,
            name: m.strMeal,
            thumb: m.strMealThumb,
            href: `/meal/${m.idMeal}`,
          }));
        }

        setItems(raw);
      } catch {
        // silently skip if related fetch fails
      }
    };

    load();
  }, [type, category, area, excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-border animate-slide-up">
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">More like this</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {items.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col gap-2"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image
                src={item.thumb}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

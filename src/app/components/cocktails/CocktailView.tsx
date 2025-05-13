// app/components/cocktails/CocktailView.tsx
import Image from 'next/image';
import { Suspense } from 'react';
import { Cocktail } from '@/types/recipe';

interface CocktailViewProps {
  cocktail: Cocktail;
}

const IngredientsSection = ({ cocktail }: { cocktail: Cocktail }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
    <ul className="grid grid-cols-2 gap-2">
      {Array.from({ length: 20 }).map((_, i) => {
        const ingredient = cocktail[`strIngredient${i + 1}` as keyof Cocktail];
        const measure = cocktail[`strMeasure${i + 1}` as keyof Cocktail];
        return ingredient ? (
          <li key={i} className="flex items-baseline gap-2">
            <span className="text-muted-foreground text-sm">{measure}</span>
            <span className="text-sm">{ingredient}</span>
          </li>
        ) : null;
      })}
    </ul>
  </section>
);

const InstructionsSection = ({ instructions }: { instructions?: string | null }) => {
  if (!instructions) return null;
  
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Instructions</h2>
      <div className="prose max-w-none">
        {instructions.split('\r\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </section>
  );
};


export const CocktailView = ({ cocktail }: CocktailViewProps) => {
  return (
    <article className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{cocktail.strDrink}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{cocktail.strCategory}</span>
          {cocktail.strAlcoholic && <span>{cocktail.strIBA} Cuisine</span>}
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={cocktail.strDrinkThumb}
            alt={`${cocktail.strDrink} thumbnail`}
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />}>
          <IngredientsSection cocktail={cocktail} />
        </Suspense>
      </div>

        <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg mt-8" />}>
            <InstructionsSection instructions={cocktail.strInstructions} />
        </Suspense>
    </article>
  );
};
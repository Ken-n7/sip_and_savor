// app/cocktails/[id]/page.tsx
import { CocktailView } from '@/app/components/cocktails/CocktailView';
import { fetchCocktailById } from '@/app/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cocktail = await fetchCocktailById(params.id);
  
  return {
    title: `${cocktail?.strDrink || 'Drinks Not Found'} | Recipe App`,
    description: cocktail?.strInstructions?.substring(0, 160),
    openGraph: {
      images: cocktail?.strDrinkThumb ? [{ url: cocktail.strDrinkThumb }] : [],
    },
  };
}

export default async function CocktailPage({ params }: { params: { id: string } }) {
  const cocktail = await fetchCocktailById(params.id);
  
  if (!cocktail) {
    notFound();
  }

  return (
    <main className="container py-8">
      <CocktailView cocktail={cocktail} />
    </main>
  );
}
// app/meals/[id]/page.tsx
import { MealView } from '@/app/components/meals/MealView';
import { fetchMealById } from '@/app/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const meal = await fetchMealById(params.id);
  
  return {
    title: `${meal?.strMeal || 'Meal Not Found'} | Recipe App`,
    description: meal?.strInstructions?.substring(0, 160),
    openGraph: {
      images: meal?.strMealThumb ? [{ url: meal.strMealThumb }] : [],
    },
  };
}

export default async function MealPage({ params }: { params: { id: string } }) {
  const meal = await fetchMealById(params.id);
  
  if (!meal) {
    notFound();
  }

  return (
    <main className="container py-8">
      <MealView meal={meal} />
    </main>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cocktail } from '@/types/recipe';
import { Suspense } from 'react';
import { fetchCocktailById } from '@/app/lib/api';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export default async function CocktailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cocktail = await fetchCocktailById(id);

  if (!cocktail) {
    notFound();
  }

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}` as keyof Cocktail];
    const measure = cocktail[`strMeasure${i}` as keyof Cocktail];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <Suspense fallback={<CocktailSkeleton />}>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 text-sm font-medium transition-colors duration-200"
            aria-label="Back to cocktails"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cocktails
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Image Section - Left */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-4">
              <div className="relative h-80 md:h-96">
                <Image
                  src={cocktail.strDrinkThumb || '/placeholder-cocktail.jpg'}
                  alt={cocktail.strDrink}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{cocktail.strDrink}</h1>
                <div className="flex flex-wrap gap-2">
                  {cocktail.strCategory && (
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      {cocktail.strCategory}
                    </span>
                  )}
                  {cocktail.strAlcoholic && (
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      {cocktail.strAlcoholic}
                    </span>
                  )}
                  {cocktail.strGlass && (
                    <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      {cocktail.strGlass}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients Section - Right */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-3 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-gray-900 font-medium">{item.ingredient}</p>
                        {item.measure && (
                          <p className="text-sm text-gray-500">{item.measure}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Instructions Section - Below */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Instructions
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                {cocktail.strInstructions?.split('\n').map((step, index) => (
                  <p key={index} className="flex">
                    <span className="inline-block mr-3 text-emerald-600 font-medium">
                      {index + 1}.
                    </span>
                    {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Skeleton component for loading state
function CocktailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-32 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image Skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <Skeleton className="w-full h-80 md:h-96" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
          
          {/* Ingredients Skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 rounded-full mr-3 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Instructions Skeleton */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="h-4 w-4 mr-3 mt-0.5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
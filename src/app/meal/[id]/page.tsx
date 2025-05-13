import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Meal } from '@/types/recipe';
import { Suspense } from 'react';
import { fetchMealById } from '@/app/lib/api';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const YouTubeEmbed = ({ url }: { url: string }) => {
  // Extract video ID from YouTube URL
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

  return (
    <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        className="w-full h-[200px] sm:h-[300px] md:h-[350px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default async function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meal = await fetchMealById(id);

  if (!meal) {
    notFound();
  }

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <Suspense fallback={<MealSkeleton />}>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 text-sm font-medium transition-colors duration-200"
            aria-label="Back to recipes"
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
            Back to Recipes
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Image Section - Left */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-4">
              <div className="relative h-80 md:h-96">
                <Image
                  src={meal.strMealThumb || '/placeholder-meal.jpg'}
                  alt={meal.strMeal}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{meal.strMeal}</h1>
                <div className="flex flex-wrap gap-2">
                  {meal.strCategory && (
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      {meal.strArea}
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

          {/* Instructions Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Instructions
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                {meal.strInstructions?.split('\n').map((step, index) => (
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

          {/* YouTube Video Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Video Tutorial
              </h2>
              {meal.strYoutube ? (
                <>
                  <YouTubeEmbed url={meal.strYoutube} />
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Watch on YouTube
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Video Available
                  </h3>
                  <p className="text-gray-500">
                    We couldn&apos;t find a video tutorial for this recipe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Skeleton component for loading state
function MealSkeleton() {
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
                {Array(8).fill(0).map((_, i) => (
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="h-4 w-4 mr-3 mt-0.5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Video Skeleton */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="w-full h-48" />
          </div>
        </div>
        
        {/* Source Skeleton */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <Skeleton className="h-6 w-32 mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
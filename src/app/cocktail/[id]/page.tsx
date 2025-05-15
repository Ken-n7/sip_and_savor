import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cocktail } from '@/types/recipe';
import { Suspense } from 'react';
import { fetchCocktailById } from '@/app/lib/api';
import { IngredientSection } from '../../components/common/IngredientList';
// import { SearchBar } from '@/app/components/common/SearchBar';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  FireIcon,
  QueueListIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Skeleton loader with theme-aligned shimmer effect
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-background/50 dark:bg-background/30 rounded-lg ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-[shimmer_1.5s_infinite]" />
  </div>
);

// Extract ingredients with null checks
const extractIngredients = (cocktail: Cocktail) => {
  return Array.from({ length: 15 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: cocktail[`strIngredient${i}` as keyof Cocktail]?.trim() ?? '',
      measure: cocktail[`strMeasure${i}` as keyof Cocktail]?.trim()
    }))
    .filter((item) => item.ingredient !== '');
};

// Main image component with fade-in animation
const CocktailImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl">
    <Image
      src={src || '/placeholder-cocktail.jpg'}
      alt={alt}
      fill
      priority
      className="object-cover transition-transform hover:scale-105 duration-500 animate-fade-in"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
    />
  </div>
);

// Metadata chip component with theme-aligned styling
const MetaChip = ({ icon: Icon, value }: { icon: React.ComponentType<{ className?: string }>; value: string }) => (
  <div
    className="flex items-center gap-2 px-4 py-2 bg-background/80 dark:bg-background/60 rounded-full text-sm text-foreground/80 border border-border transition-all hover:bg-accent/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
    role="status"
    aria-label={value}
  >
    <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
    <span>{value}</span>
  </div>
);

// Back button with theme-aligned styling
const BackButton = () => (
  <Link
    href="/"
    className="group flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
    aria-label="Back to all cocktails"
  >
    <ArrowLeftIcon className="h-6 w-6 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
    <span className="font-semibold text-lg">All Cocktails</span>
  </Link>
);

// Instructions with collapsible sections for mobile
const Instructions = ({ instructions }: { instructions?: string }) => {
  if (!instructions) return null;

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <details className="group">
        <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-4 -m-4 hover:bg-accent/5 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 text-primary rounded-lg group-open:bg-primary/10 group-open:text-primary">
              <QueueListIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">View Instructions</h3>
          </div>
          <div className="text-foreground/60 group-open:rotate-180 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </summary>
        <div className="mt-6 pl-14 space-y-4 text-foreground/80">
          {instructions.split('\r\n').filter(Boolean).map((step, index) => (
            <div key={index} className="flex gap-4">
              <p>{step}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};


// Main page component
export default async function CocktailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cocktail = await fetchCocktailById(id);

  if (!cocktail) {
    notFound();
  }

  const ingredients = extractIngredients(cocktail);

  return (
    <Suspense fallback={<CocktailSkeleton />}>
      <div className="min-h-screen bg-background dark:bg-background transition-colors duration-500 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sticky top-0 z-10 flex justify-between items-center mb-10 py-4 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-xl px-6 shadow-sm border-b border-border">
            <BackButton />
            {/* <SearchBar placeholder='Search' /> */}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left column - Image and basic info */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight animate-fade-in">
                  {cocktail.strDrink}
                </h1>

                <div className="flex flex-wrap gap-3">
                  {cocktail.strCategory && (
                    <MetaChip icon={BookmarkIcon} value={cocktail.strCategory} />
                  )}
                  {cocktail.strAlcoholic && (
                    <MetaChip icon={FireIcon} value={cocktail.strAlcoholic} />
                  )}
                  {cocktail.strGlass && (
                    <MetaChip icon={BeakerIcon} value={cocktail.strGlass} />
                  )}
                </div>
              </div>

              <CocktailImage src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            </div>

            {/* Right column - Ingredients */}
            <IngredientSection ingredients={ingredients} />
          </div>

          {/* Instructions section */}
          <div className="mt-12 bg-background/80 dark:bg-background/60 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-md border border-border animate-slide-up">
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3">
              <QueueListIcon className="w-6 h-6 text-primary" aria-hidden="true" />
              Preparation
            </h2>
            <Instructions instructions={cocktail.strInstructions} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Enhanced skeleton loader with theme-aligned styling
function CocktailSkeleton() {
  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left column skeleton */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>

          {/* Right column skeleton */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions skeleton */}
        <div className="mt-12 space-y-6">
          <Skeleton className="h-8 w-40 mb-8" />
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
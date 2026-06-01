'use client'

import { useRandomRecipes } from './hooks/useApi';
import CocktailGrid from './components/cocktails/CocktailGrid';
import MealGrid from './components/meals/MealGrid';
import SearchBar from './components/search/SearchBar';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { Button } from './components/common/Button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { cocktails, meals, loading, error, refresh } = useRandomRecipes();
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="container mx-auto px-4 pt-8 sm:pt-12 md:pt-20 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-8 md:mb-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primary">
          Discover Culinary Delights
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8">
          Explore thousands of delicious recipes from around the world. Find inspiration for your next meal or cocktail.
        </p>

        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for cocktails or meals..."
            autoFocus
            className="mb-6"
          />
        </div>
      </section>

      {/* Content Sections */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4">
          <ErrorMessage message={error} />
          <Button variant="outline" onClick={() => refresh()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          <section className="mb-12 md:mb-20">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Today&apos;s Cocktails</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refresh()}
                  disabled={loading}
                  className="p-2 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors disabled:opacity-40"
                  aria-label="Shuffle cocktails"
                  title="Shuffle"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/search?filter=cocktails')}
                  aria-label="View all cocktails"
                >
                  View All
                </Button>
              </div>
            </div>
            <CocktailGrid cocktails={cocktails} />
          </section>

          <section className="mb-10 md:mb-16">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Today&apos;s Meals</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refresh()}
                  disabled={loading}
                  className="p-2 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors disabled:opacity-40"
                  aria-label="Shuffle meals"
                  title="Shuffle"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/search?filter=meals')}
                  aria-label="View all meals"
                >
                  View All
                </Button>
              </div>
            </div>
            <MealGrid meals={meals} />
          </section>
        </>
      )}
    </main>
  );
}
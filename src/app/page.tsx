'use client'

import { useRandomRecipes } from './hooks/useApi';
import CocktailGrid from './components/cocktails/CocktailGrid';
import MealGrid from './components/meals/MealGrid';
import { SearchBar } from './components/common/SearchBar';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { Button } from './components/common/Button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { cocktails, meals, loading, error } = useRandomRecipes();
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Discover Culinary Delights
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore thousands of delicious recipes from around the world. Find inspiration for your next meal or cocktail.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Content Sections */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner /> 
        </div>
      ) : error ? ( 
        <div className="flex justify-center">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <>
          <section className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Cocktails</h2>
              <Button 
                variant="outline" 
                onClick={() => router.push('/cocktails')}
                aria-label="View all cocktails"
              >
                View All
              </Button>
            </div>
            <CocktailGrid cocktails={cocktails} />
          </section>
          
          <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Meals</h2>
              <Button 
                variant="outline" 
                onClick={() => router.push('/meals')}
                aria-label="View all meals"
              >
                View All
              </Button>
            </div>
            <MealGrid meals={meals} />
          </section>

          {/* CTA Section */}
          <section className="bg-accent/10 rounded-xl p-8 text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Try our advanced search or browse by categories to discover more recipes.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="primary"
                onClick={() => router.push('/search')}
                aria-label="Advanced search"
              >
                Advanced Search
              </Button>
              <Button 
                variant="secondary"
                onClick={() => router.push('/categories')}
                aria-label="Browse categories"
              >
                Browse Categories
              </Button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
import { searchCocktailsByName, searchMealsByName } from '../../lib/api'
import CocktailCard from '../cocktails/CocktailCard'
import MealCard from '../meals/MealCard'
import SearchFeedback from './SearchFeedback'
import ResultsSkeleton from './ResultsSkeleton'
import { Suspense } from 'react'

type SearchCategory = 'drink' | 'meal' | 'all'

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: SearchCategory
  }
}

async function CocktailResults({ query }: { query: string }) {
  const cocktails = await searchCocktailsByName(query)
  if (cocktails.length === 0) return null

  return (
    <section aria-labelledby="cocktail-results">
      <h2 id="cocktail-results" className="text-2xl font-bold mb-4">
        Cocktails
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cocktails.map(cocktail => (
          <CocktailCard 
            key={cocktail.idDrink} 
            cocktail={cocktail} 
            // tabIndex={0} // Make cards keyboard navigable
          />
        ))}
      </div>
    </section>
  )
}

async function MealResults({ query }: { query: string }) {
  const meals = await searchMealsByName(query)
  if (meals.length === 0) return null

  return (
    <section aria-labelledby="meal-results">
      <h2 id="meal-results" className="text-2xl font-bold mb-4">
        Meals
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map(meal => (
          <MealCard 
            key={meal.idMeal} 
            meal={meal} 
            // tabIndex={0} // Make cards keyboard navigable
          />
        ))}
      </div>
    </section>
  )
}

export default async function SearchResults({ searchParams = {} }: SearchResultsProps) {
  const query = searchParams.q?.trim() || ''
  const category = searchParams.category || 'all'

  if (!query) {
    return (
      <SearchFeedback 
        title="Start Searching"
        message="Enter a search term to find cocktails and meals"
        status="neutral"
      />
    )
  }

  const shouldSearchCocktails = category === 'all' || category === 'drink'
  const shouldSearchMeals = category === 'all' || category === 'meal'

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Search Results for &quot;{query}&quot;
      </h1>

      <Suspense fallback={<ResultsSkeleton />}>
        {shouldSearchCocktails && <CocktailResults query={query} />}
        {shouldSearchMeals && <MealResults query={query} />}
      </Suspense>
    </div>
  )
}
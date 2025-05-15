// app/api/search/suggestions/route.ts
import { searchCocktailsByName, searchMealsByName } from '../../lib/api';
import { Cocktail, Meal } from '@/types/recipe';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Search both APIs in parallel
    const [cocktails, meals] = await Promise.all([
      searchCocktailsByName(query),
      searchMealsByName(query),
    ]);

    const cocktailSuggestions = cocktails.map((cocktail: Cocktail) => ({
      id: cocktail.idDrink,
      name: cocktail.strDrink,
      category: 'drink',
      type: 'cocktail',
    }));

    const mealSuggestions = meals.map((meal: Meal) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      category: 'meal',
      type: 'meal',
    }));

    // Combine and sort by name
    const combined = [...cocktailSuggestions, ...mealSuggestions].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return NextResponse.json(combined);
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return NextResponse.json([], { status: 500 });
  }
}
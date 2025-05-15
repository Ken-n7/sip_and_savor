"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchCocktailsByName, searchMealsByName } from "@/app/lib/api";
import { Cocktail, Meal } from "@/types/recipe";
import SearchBar from "@/app/components/search/SearchBar";
import SearchResults from "@/app/components/search/SearchResults";
import FilterBar from "@/app/components/search/FilterBar";
import Head from "next/head";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL query params with fallbacks
  const initialQuery = searchParams?.get("q") || "";
  const initialFilter = (searchParams?.get("filter") as "all" | "cocktails" | "meals") || "all";

  // State for search results and UI
  const [query, setQuery] = useState(initialQuery);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "cocktails" | "meals">(initialFilter);

  // Format title with query if present
  const pageTitle = query
    ? `Search results for "${query}" | Recipe Explorer`
    : "Search for recipes | Recipe Explorer";

  // Update URL when query or filter changes
  const updateUrl = useCallback((newQuery: string, newFilter: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newFilter !== "all") params.set("filter", newFilter);

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [router]);

  // Handle search action
  const handleSearch = useCallback(async (searchTerm: string) => {
    setQuery(searchTerm);
    updateUrl(searchTerm, activeFilter);

    if (!searchTerm.trim()) {
      setCocktails([]);
      setMeals([]);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch data based on active filter
      const [newCocktails, newMeals] = await Promise.all([
        activeFilter !== "meals" ? searchCocktailsByName(searchTerm) : Promise.resolve([]),
        activeFilter !== "cocktails" ? searchMealsByName(searchTerm) : Promise.resolve([]),
      ]);

      setCocktails(newCocktails || []);
      setMeals(newMeals || []);
    } catch (error) {
      console.error("Error searching recipes:", error);
      // Could add error state handling here
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, updateUrl]);

  // Handle filter changes
  const handleFilterChange = useCallback((filter: "all" | "cocktails" | "meals") => {
    setActiveFilter(filter);
    updateUrl(query, filter);

    // Re-run search with new filter if we have a query
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query, updateUrl, handleSearch]);

  // Run search on initial render if query provided
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Search for cocktails and meals recipes" />
      </Head>

      <main
        className="container max-w-6xl px-4 py-8 mx-auto"
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <div className="max-w-2xl mx-auto mb-10">
          <h1
            className="mb-8 text-3xl font-bold text-center"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Find Your Perfect Recipe
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for cocktails or meals..."
            initialValue={query}
            autoFocus
            className="mb-6"
          />
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        <SearchResults
          cocktails={cocktails}
          meals={meals}
          isLoading={isLoading}
          query={query}
          activeFilter={activeFilter}
        />
      </main>
    </>
  );
}
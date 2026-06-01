"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  searchCocktailsByName,
  searchMealsByName,
  fetchCocktailsByCategory,
  fetchMealsByCategory,
  fetchMealsByArea,
} from "@/app/lib/api";
import { Cocktail, Meal } from "@/types/recipe";
import SearchBar from "@/app/components/search/SearchBar";
import SearchResults from "@/app/components/search/SearchResults";

type FilterType = "all" | "cocktails" | "meals";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Cocktails", value: "cocktails" },
  { label: "Meals", value: "meals" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams?.get("q") || "";
  const initialFilter = (searchParams?.get("filter") as FilterType) || "all";
  const initialCategory = searchParams?.get("category") || "";
  const initialArea = searchParams?.get("area") || "";

  const [query, setQuery] = useState(initialQuery);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [browseLabel, setBrowseLabel] = useState<string>("");

  const updateUrl = useCallback(
    (newQuery: string, newFilter: FilterType) => {
      const params = new URLSearchParams();
      if (newQuery) params.set("q", newQuery);
      if (newFilter !== "all") params.set("filter", newFilter);
      router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    },
    [router]
  );

  const handleSearch = useCallback(
    async (searchTerm: string, filter: FilterType = activeFilter) => {
      setQuery(searchTerm);
      setBrowseLabel("");
      updateUrl(searchTerm, filter);

      if (!searchTerm.trim()) {
        setCocktails([]);
        setMeals([]);
        return;
      }

      setIsLoading(true);
      try {
        const [newCocktails, newMeals] = await Promise.all([
          filter !== "meals" ? searchCocktailsByName(searchTerm) : Promise.resolve([]),
          filter !== "cocktails" ? searchMealsByName(searchTerm) : Promise.resolve([]),
        ]);
        setCocktails(newCocktails || []);
        setMeals(newMeals || []);
      } catch (error) {
        console.error("Error searching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeFilter, updateUrl]
  );

  const handleFilterChange = useCallback(
    (filter: FilterType) => {
      setActiveFilter(filter);
      updateUrl(query, filter);
      if (query.trim()) handleSearch(query, filter);
    },
    [query, updateUrl, handleSearch]
  );

  // Browse by category or area (from chip links on detail pages)
  const handleBrowse = useCallback(
    async (category: string, area: string, filter: FilterType) => {
      setIsLoading(true);
      setActiveFilter(filter);
      setBrowseLabel(category || area);
      try {
        if (filter === "cocktails" && category) {
          const results = await fetchCocktailsByCategory(category);
          setCocktails(results);
          setMeals([]);
        } else if (filter === "meals" && area) {
          const results = await fetchMealsByArea(area);
          setMeals(results);
          setCocktails([]);
        } else if (filter === "meals" && category) {
          const results = await fetchMealsByCategory(category);
          setMeals(results);
          setCocktails([]);
        }
      } catch (error) {
        console.error("Error browsing by category:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (initialCategory || initialArea) {
      handleBrowse(initialCategory, initialArea, initialFilter);
    } else if (initialQuery) {
      handleSearch(initialQuery, initialFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container max-w-6xl px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="mb-6 text-3xl font-bold text-center text-foreground">
          {browseLabel ? (
            <>
              Browsing{" "}
              <span className="text-primary">{browseLabel}</span>
            </>
          ) : (
            "Find Your Perfect Recipe"
          )}
        </h1>

        <SearchBar
          onSearch={q => handleSearch(q, activeFilter)}
          placeholder="Search for cocktails or meals..."
          initialValue={query}
          autoFocus
          className="mb-3"
        />

        <div className="flex justify-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 text-sm font-medium rounded-full transition-colors ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground/60 hover:text-foreground hover:bg-accent/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <SearchResults
        cocktails={cocktails}
        meals={meals}
        isLoading={isLoading}
        query={browseLabel || query}
        activeFilter={activeFilter}
      />
    </main>
  );
}

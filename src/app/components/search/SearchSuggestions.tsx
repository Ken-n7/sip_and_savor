"use client";

import { useState, useEffect } from "react";

type RecentSearch = {
  query: string;
  timestamp: number;
};

const RECENT_SEARCHES_KEY = "recipe-explorer-recent-searches";
const MAX_RECENT_SEARCHES = 10;

export function useSearchHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed: RecentSearch[] = JSON.parse(stored);
        parsed.sort((a, b) => b.timestamp - a.timestamp);
        setRecentSearches(parsed.map((item) => item.query));
      }
    } catch {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  const addSearchTerm = (query: string) => {
    if (!query.trim()) return;
    try {
      const normalized = query.trim().toLowerCase();
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      let searches: RecentSearch[] = stored ? JSON.parse(stored) : [];
      searches = searches.filter((item) => item.query.toLowerCase() !== normalized);
      searches.unshift({ query: query.trim(), timestamp: Date.now() });
      if (searches.length > MAX_RECENT_SEARCHES) searches = searches.slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      setRecentSearches(searches.map((item) => item.query));
    } catch {
      // localStorage unavailable — silently ignore
    }
  };

  const clearSearchHistory = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // localStorage unavailable — silently ignore
    }
  };

  return { recentSearches, addSearchTerm, clearSearchHistory };
}

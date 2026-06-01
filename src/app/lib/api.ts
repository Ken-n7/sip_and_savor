import axios, { AxiosInstance, AxiosError } from "axios";
import { Cocktail, Meal } from "@/types/recipe";

interface CocktailResponse {
  drinks: Cocktail[];
}

interface MealResponse {
  meals: Meal[];
}

// API timeout constants
const API_TIMEOUT = 20000; // 20 seconds — free-tier APIs can be slow

const createApiClient = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor - only in development
  if (process.env.NODE_ENV === "development") {
    instance.interceptors.request.use((config) => {
      console.log(`Requesting: ${config.url}`);
      return config;
    });
  }

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout:", error.config?.url);
        throw new Error("Request timeout. Please try again.");
      }
      if (!error.response) {
        console.error("Network error:", error.message);
        throw new Error("Network error. Please check your connection.");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const cocktailApi = createApiClient(
  process.env.NEXT_PUBLIC_COCKTAILDB_API ??
    "https://www.thecocktaildb.com/api/json/v1/1"
);
const mealApi = createApiClient(
  process.env.NEXT_PUBLIC_MEALDB_API ??
    "https://www.themealdb.com/api/json/v1/1"
);

// Cache implementation with size limit and TTL
class ResponseCache {
  private cache = new Map<
    string,
    { data: CocktailResponse | MealResponse; timestamp: number }
  >();
  private maxSize = 50;
  private ttl = 30 * 60 * 1000; // 30 minutes TTL

  get(key: string): CocktailResponse | MealResponse | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  set(key: string, data: CocktailResponse | MealResponse): void {
    // Clean up before adding new entry
    if (this.cache.size >= this.maxSize) {
      // Find and delete the oldest entry
      let oldestKey: string | undefined;
      let oldestTimestamp = Infinity;

      this.cache.forEach((value, key) => {
        if (value.timestamp < oldestTimestamp) {
          oldestTimestamp = value.timestamp;
          oldestKey = key;
        }
      });

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

const responseCache = new ResponseCache();

// Helper function for making cached requests with proper typing
const cachedRequest = async <T extends CocktailResponse | MealResponse>(
  api: AxiosInstance,
  url: string,
  cacheKey: string,
  retries = 2
): Promise<T> => {
  const cachedData = responseCache.get(cacheKey);
  if (cachedData) {
    return cachedData as T;
  }

  try {
    const response = await api.get<T>(url);
    const data = response.data;
    responseCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (3 - retries)));
      return cachedRequest(api, url, cacheKey, retries - 1);
    }
    console.error(`Error in API request to ${url}:`, error);
    throw error;
  }
};

const throttleRequests = <T>(
  promises: (() => Promise<T>)[],
  maxConcurrent = 3
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = new Array(promises.length);
    let nextIndex = 0;
    let completed = 0;

    const runOne = (index: number) => {
      promises[index]()
        .then((result) => {
          results[index] = result;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          } else if (nextIndex < promises.length) {
            runOne(nextIndex++);
          }
        })
        .catch(reject);
    };

    const initial = Math.min(maxConcurrent, promises.length);
    for (let i = 0; i < initial; i++) {
      runOne(nextIndex++);
    }
  });
};


/**
 * Fetches multiple random cocktails
 */
export const fetchRandomCocktails = async (count = 0): Promise<Cocktail[]> => {
  try {
    const cacheKeys = Array.from(
      { length: count },
      (_, i) => `cocktail_random_${i}_${Math.floor(Date.now() / 60000)}`
    );

    const promises = cacheKeys.map(
      (cacheKey) => () =>
        cachedRequest<CocktailResponse>(
          cocktailApi,
          "/random.php",
          cacheKey
        ).then((res) => res.drinks[0])
    );

    const results = await throttleRequests(promises);
    return results.filter(Boolean) as Cocktail[];
  } catch (error) {
    console.error('Error fetching random cocktails:', error);
    throw error;
  }
};

/**
 * Fetches multiple random meals
 */
export const fetchRandomMeals = async (count = 0): Promise<Meal[]> => {
  try {
    const cacheKeys = Array.from(
      { length: count },
      (_, i) => `meal_random_${i}_${Math.floor(Date.now() / 60000)}`
    );

    const promises = cacheKeys.map(
      (cacheKey) => () =>
        cachedRequest<MealResponse>(mealApi, "/random.php", cacheKey).then(
          (res) => res.meals[0]
        )
    );

    const results = await throttleRequests(promises);
    return results.filter(Boolean) as Meal[];
  } catch (error) {
    console.error('Error fetching random meals:', error);
    throw error;
  }
};

/**
 * Gets cocktail details by ID
 */
export const getCocktailById = async (id: string): Promise<Cocktail | null> => {
  try {
    const cacheKey = `cocktail_${id}`;
    const data = await cachedRequest<CocktailResponse>(
      cocktailApi,
      `/lookup.php?i=${id}`,
      cacheKey
    );
    return data.drinks?.[0] || null;
  } catch (error) {
    console.error(`Error fetching cocktail details for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Gets meal details by ID
 */
export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const cacheKey = `meal_${id}`;
    const data = await cachedRequest<MealResponse>(
      mealApi,
      `/lookup.php?i=${id}`,
      cacheKey
    );
    return data.meals?.[0] || null;
  } catch (error) {
    console.error(`Error fetching meal details for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Searches for cocktails by name
 */
export const searchCocktailsByName = async (term: string): Promise<Cocktail[]> => {
  try {
    const normalizedQuery = term.trim().toLowerCase();
    if (!normalizedQuery) return [];
    
    const cacheKey = `cocktail_search_${normalizedQuery}`;
    const data = await cachedRequest<CocktailResponse>(
      cocktailApi,
      `/search.php?s=${encodeURIComponent(normalizedQuery)}`,
      cacheKey
    );
    return data.drinks || [];
  } catch (error) {
    console.error('Error searching cocktails:', error);
    throw error;
  }
};

/**
 * Searches for meals by name
 */
export const searchMealsByName = async (term: string): Promise<Meal[]> => {
  try {
    const normalizedQuery = term.trim().toLowerCase();
    if (!normalizedQuery) return [];
    
    const cacheKey = `meal_search_${normalizedQuery}`;
    const data = await cachedRequest<MealResponse>(
      mealApi,
      `/search.php?s=${encodeURIComponent(normalizedQuery)}`,
      cacheKey
    );
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals:', error);
    throw error;
  }
};

export const fetchCocktailsByCategory = async (category: string): Promise<Cocktail[]> => {
  try {
    const cacheKey = `cocktail_category_${category}`;
    const data = await cachedRequest<CocktailResponse>(
      cocktailApi,
      `/filter.php?c=${encodeURIComponent(category)}`,
      cacheKey
    );
    return data.drinks || [];
  } catch (error) {
    console.error('Error fetching cocktails by category:', error);
    return [];
  }
};

export const fetchMealsByCategory = async (category: string): Promise<Meal[]> => {
  try {
    const cacheKey = `meal_category_${category}`;
    const data = await cachedRequest<MealResponse>(
      mealApi,
      `/filter.php?c=${encodeURIComponent(category)}`,
      cacheKey
    );
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
};

export const fetchMealsByArea = async (area: string): Promise<Meal[]> => {
  try {
    const cacheKey = `meal_area_${area}`;
    const data = await cachedRequest<MealResponse>(
      mealApi,
      `/filter.php?a=${encodeURIComponent(area)}`,
      cacheKey
    );
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by area:', error);
    return [];
  }
};

// Aliases for backward compatibility
export const fetchCocktailById = getCocktailById;
export const fetchMealById = getMealById;
export const searchCocktails = searchCocktailsByName;
export const searchMeals = searchMealsByName;
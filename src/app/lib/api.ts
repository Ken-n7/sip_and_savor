import axios, { AxiosInstance, AxiosError } from "axios";
import { Cocktail, Meal } from "@/types/recipe";

interface CocktailResponse {
  drinks: Cocktail[];
}

interface MealResponse {
  meals: Meal[];
}

// API timeout constants
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Creates a promise that rejects after a specified timeout
 */
const timeout = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

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

// Update the createApiClient calls with proper type checking
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
    // Fix: Using await with proper type assertion for Promise.race
    const response = await Promise.race([
      api.get<T>(url),
      timeout(API_TIMEOUT)
    ]) as Awaited<ReturnType<typeof api.get<T>>>;
    
    // Now response is correctly typed as AxiosResponse<T>
    const data = response.data;
    responseCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (3 - retries))); // Exponential backoff
      return cachedRequest(api, url, cacheKey, retries - 1);
    }
    console.error(`Error in API request to ${url}:`, error);
    throw error;
  }
};

// Throttle function with improved concurrency control
const throttleRequests = <T>(
  promises: (() => Promise<T>)[],
  maxConcurrent = 3
): Promise<T[]> => {
  const results: T[] = [];
  let currentIndex = 0;
  let activePromises = 0;

  return new Promise((resolve, reject) => {
    const runNext = async () => {
      if (currentIndex >= promises.length && activePromises === 0) {
        resolve(results);
        return;
      }

      while (activePromises < maxConcurrent && currentIndex < promises.length) {
        activePromises++;
        const promiseIndex = currentIndex++;
        try {
          const result = await promises[promiseIndex]();
          results[promiseIndex] = result;
        } catch (error) {
          reject(error);
          return;
        } finally {
          activePromises--;
          runNext();
        }
      }
    };

    runNext();
  });
};

// Preconnect to API domains for better performance
export const preconnectAPIs = () => {
  if (typeof document !== "undefined") {
    const cocktailDomain = process.env.NEXT_PUBLIC_COCKTAILDB_API
      ? new URL(process.env.NEXT_PUBLIC_COCKTAILDB_API).origin
      : "https://www.thecocktaildb.com";

    const mealDomain = process.env.NEXT_PUBLIC_MEALDB_API
      ? new URL(process.env.NEXT_PUBLIC_MEALDB_API).origin
      : "https://www.themealdb.com";

    if (cocktailDomain) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = cocktailDomain;
      document.head.appendChild(link);
    }

    if (mealDomain) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = mealDomain;
      document.head.appendChild(link);
    }
  }
};

/**
 * Fetches a random cocktail from the API
 */
// const fetchRandomCocktail = async (): Promise<Cocktail | null> => {
//   try {
//     const cacheKey = `cocktail_random_${Math.floor(Date.now() / 60000)}`;
//     const data = await cachedRequest<CocktailResponse>(
//       cocktailApi,
//       "/random.php",
//       cacheKey
//     );
//     return data.drinks?.[0] || null;
//   } catch (error) {
//     console.error('Error fetching random cocktail:', error);
//     throw error;
//   }
// };

// /**
//  * Fetches a random meal from the API
//  */
// const fetchRandomMeal = async (): Promise<Meal | null> => {
//   try {
//     const cacheKey = `meal_random_${Math.floor(Date.now() / 60000)}`;
//     const data = await cachedRequest<MealResponse>(
//       mealApi,
//       "/random.php",
//       cacheKey
//     );
//     return data.meals?.[0] || null;
//   } catch (error) {
//     console.error('Error fetching random meal:', error);
//     throw error;
//   }
// };

/**
 * Fetches multiple random cocktails
 */
export const fetchRandomCocktails = async (count = 6): Promise<Cocktail[]> => {
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
export const fetchRandomMeals = async (count = 6): Promise<Meal[]> => {
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

// Aliases for backward compatibility
export const fetchCocktailById = getCocktailById;
export const fetchMealById = getMealById;
export const searchCocktails = searchCocktailsByName;
export const searchMeals = searchMealsByName;
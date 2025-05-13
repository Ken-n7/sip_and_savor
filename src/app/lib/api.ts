import axios, { AxiosInstance, AxiosError } from "axios";

// Define types for API responses
interface Cocktail {
  idDrink: string;
  strDrink: string;
  [key: string]: any;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  [key: string]: any;
}

interface CocktailResponse {
  drinks: Cocktail[];
}

interface MealResponse {
  meals: Meal[];
}

const createApiClient = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 5000, // Reduced timeout to 5 seconds
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
};

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
      await new Promise((resolve) => setTimeout(resolve, 1000 * (3 - retries))); // Exponential backoff
      return cachedRequest(api, url, cacheKey, retries - 1);
    }
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
// And update the preconnectAPIs function to handle undefined cases
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

export const fetchRandomCocktails = async (count = 6): Promise<Cocktail[]> => {
  const cacheKeys = Array.from(
    { length: count },
    (_, i) => `cocktail_random_${i}_${Math.floor(Date.now() / 60000)}`
  ); // Minute-based cache key

  const promises = cacheKeys.map(
    (cacheKey) => () =>
      cachedRequest<CocktailResponse>(
        cocktailApi,
        "/random.php",
        cacheKey
      ).then((res) => res.drinks[0])
  );

  return throttleRequests(promises);
};

export const fetchCocktailById = async (id: string): Promise<Cocktail> => {
  const cacheKey = `cocktail_${id}`;
  const data = await cachedRequest<CocktailResponse>(
    cocktailApi,
    `/lookup.php?i=${id}`,
    cacheKey
  );
  return data.drinks[0];
};

export const fetchRandomMeals = async (count = 6): Promise<Meal[]> => {
  const cacheKeys = Array.from(
    { length: count },
    (_, i) => `meal_random_${i}_${Math.floor(Date.now() / 60000)}`
  ); // Minute-based cache key

  const promises = cacheKeys.map(
    (cacheKey) => () =>
      cachedRequest<MealResponse>(mealApi, "/random.php", cacheKey).then(
        (res) => res.meals[0]
      )
  );

  return throttleRequests(promises);
};

export const fetchMealById = async (id: string): Promise<Meal> => {
  const cacheKey = `meal_${id}`;
  const data = await cachedRequest<MealResponse>(
    mealApi,
    `/lookup.php?i=${id}`,
    cacheKey
  );
  return data.meals[0];
};

export const searchCocktails = async (query: string): Promise<Cocktail[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const cacheKey = `cocktail_search_${normalizedQuery}`;
  const data = await cachedRequest<CocktailResponse>(
    cocktailApi,
    `/search.php?s=${encodeURIComponent(normalizedQuery)}`,
    cacheKey
  );
  return data.drinks || [];
};

export const searchMeals = async (query: string): Promise<Meal[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const cacheKey = `meal_search_${normalizedQuery}`;
  const data = await cachedRequest<MealResponse>(
    mealApi,
    `/search.php?s=${encodeURIComponent(normalizedQuery)}`,
    cacheKey
  );
  return data.meals || [];
};

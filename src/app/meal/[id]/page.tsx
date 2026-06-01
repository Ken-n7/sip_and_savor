import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Meal } from '@/types/recipe';
import { fetchMealById } from '@/app/lib/api';
import { IngredientSection } from '@/app/components/common/IngredientList';
import { BackButton } from '@/app/components/common/BackButton';
import { FavoriteButton } from '@/app/components/common/FavoriteButton';
import { RelatedRecipes } from '@/app/components/common/RelatedRecipes';
import { Instructions } from '@/app/components/common/Instructions';
import {
  BookmarkIcon,
  FireIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

// Extract ingredients with null checks
const extractIngredients = (meal: Meal) => {
  return Array.from({ length: 20 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: meal[`strIngredient${i}` as keyof Meal]?.trim() ?? '',
      measure: meal[`strMeasure${i}` as keyof Meal]?.trim()
    }))
    .filter((item) => item.ingredient !== '');
};

// Main image component with fade-in animation
const MealImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden shadow-xl">
    <Image
      src={src || '/placeholder-meal.jpg'}
      alt={alt}
      fill
      priority
      className="object-cover transition-transform hover:scale-105 duration-500 animate-fade-in"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
    />
  </div>
);

// Metadata chip — links to category/area browse on search page
const MetaChip = ({
  icon: Icon,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  href?: string;
}) => {
  const cls = "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 min-h-[44px] bg-background/80 dark:bg-background/60 rounded-full text-xs sm:text-sm text-foreground/80 border border-border transition-all hover:bg-accent/10 hover:text-foreground";
  const content = (
    <>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
      <span>{value}</span>
    </>
  );
  return href ? (
    <Link href={href} className={cls} aria-label={value}>{content}</Link>
  ) : (
    <div className={cls} aria-label={value}>{content}</div>
  );
};


// YouTube embed component
const YouTubeEmbed = ({ url }: { url: string }) => {
  const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1];

  if (!videoId) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        title="Recipe video tutorial"
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meal = await fetchMealById(id);
  if (!meal) return { title: 'Not Found — SipAndSavor' };
  return {
    title: `${meal.strMeal} — SipAndSavor`,
    description: meal.strInstructions?.slice(0, 150),
    openGraph: {
      title: meal.strMeal,
      images: [{ url: meal.strMealThumb }],
    },
  };
}

export default async function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meal = await fetchMealById(id);

  if (!meal) {
    notFound();
  }

  const ingredients = extractIngredients(meal);

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-500 py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-4 md:mb-10 py-1 md:py-4 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-xl px-3 md:px-6 shadow-sm border-b border-border">
          <BackButton label="Back" />
          <FavoriteButton
            item={{ id: meal.idMeal, type: 'meal', name: meal.strMeal, thumb: meal.strMealThumb }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Left column - Image and basic info */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight animate-fade-in">
                {meal.strMeal}
              </h1>

              <div className="flex flex-wrap gap-3">
                {meal.strCategory && (
                  <MetaChip
                    icon={BookmarkIcon}
                    value={meal.strCategory}
                    href={`/search?filter=meals&category=${encodeURIComponent(meal.strCategory)}`}
                  />
                )}
                {meal.strArea && (
                  <MetaChip
                    icon={FlagIcon}
                    value={meal.strArea}
                    href={`/search?filter=meals&area=${encodeURIComponent(meal.strArea)}`}
                  />
                )}
              </div>
            </div>

            <MealImage src={meal.strMealThumb} alt={meal.strMeal} />
          </div>

          {/* Right column - Ingredients */}
          <IngredientSection ingredients={ingredients} />
        </div>

        {/* Instructions section */}
        <Instructions instructions={meal.strInstructions} />

        {/* Source link */}
        {meal.strSource && (
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-foreground/50">Original recipe:</span>
            <a
              href={meal.strSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors underline underline-offset-2"
            >
              View source
            </a>
          </div>
        )}

        {/* YouTube Video Section */}
        {meal.strYoutube && (
          <div className="mt-12 bg-background/80 dark:bg-background/60 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-md border border-border animate-slide-up">
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3">
              <FireIcon className="w-6 h-6 text-primary" aria-hidden="true" />
              Video Tutorial
            </h2>
            <YouTubeEmbed url={meal.strYoutube} />
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 py-2.5 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Watch on YouTube
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Related recipes */}
        <RelatedRecipes
          type="meal"
          category={meal.strCategory}
          area={meal.strArea}
          excludeId={meal.idMeal}
        />
      </div>
    </div>
  );
}


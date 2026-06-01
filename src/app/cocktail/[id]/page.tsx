import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cocktail } from '@/types/recipe';
import { fetchCocktailById } from '@/app/lib/api';
import { IngredientSection } from '../../components/common/IngredientList';
import { BackButton } from '../../components/common/BackButton';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { RelatedRecipes } from '../../components/common/RelatedRecipes';
import { Instructions } from '../../components/common/Instructions';
import {
  BookmarkIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Extract ingredients with null checks
const extractIngredients = (cocktail: Cocktail) => {
  return Array.from({ length: 15 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: cocktail[`strIngredient${i}` as keyof Cocktail]?.trim() ?? '',
      measure: cocktail[`strMeasure${i}` as keyof Cocktail]?.trim()
    }))
    .filter((item) => item.ingredient !== '');
};

// Main image component with fade-in animation
const CocktailImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden shadow-xl">
    <Image
      src={src || '/placeholder-cocktail.jpg'}
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

// Metadata chip — links to category browse on search page
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



export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cocktail = await fetchCocktailById(id);
  if (!cocktail) return { title: 'Not Found — SipAndSavor' };
  return {
    title: `${cocktail.strDrink} — SipAndSavor`,
    description: cocktail.strInstructions?.slice(0, 150),
    openGraph: {
      title: cocktail.strDrink,
      images: [{ url: cocktail.strDrinkThumb }],
    },
  };
}

// Main page component
export default async function CocktailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cocktail = await fetchCocktailById(id);

  if (!cocktail) {
    notFound();
  }

  const ingredients = extractIngredients(cocktail);

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-500 py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-4 md:mb-10 py-1 md:py-4 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-xl px-3 md:px-6 shadow-sm border-b border-border">
          <BackButton label="Back" />
          <FavoriteButton
            item={{ id: cocktail.idDrink, type: 'cocktail', name: cocktail.strDrink, thumb: cocktail.strDrinkThumb }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Left column - Image and basic info */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6 md:space-y-10">
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight animate-fade-in">
                {cocktail.strDrink}
              </h1>

              <div className="flex flex-wrap gap-3">
                {cocktail.strCategory && (
                  <MetaChip
                    icon={BookmarkIcon}
                    value={cocktail.strCategory}
                    href={`/search?filter=cocktails&category=${encodeURIComponent(cocktail.strCategory)}`}
                  />
                )}
                {cocktail.strAlcoholic && (
                  <MetaChip icon={FireIcon} value={cocktail.strAlcoholic} />
                )}
                {cocktail.strGlass && (
                  <MetaChip icon={BeakerIcon} value={cocktail.strGlass} />
                )}
              </div>
            </div>

            <CocktailImage src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
          </div>

          {/* Right column - Ingredients */}
          <IngredientSection ingredients={ingredients} apiSource="cocktaildb" />
        </div>

        {/* Instructions section */}
        <Instructions instructions={cocktail.strInstructions} />

        {/* Related recipes */}
        <RelatedRecipes
          type="cocktail"
          category={cocktail.strCategory}
          excludeId={cocktail.idDrink}
        />
      </div>
    </div>
  );
}


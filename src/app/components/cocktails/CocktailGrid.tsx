import { motion } from 'framer-motion';
import { Cocktail } from '@/types/recipe';
import CocktailCard from './CocktailCard';

interface CocktailGridProps {
  cocktails: Cocktail[];
}

const CocktailGrid = ({ cocktails }: CocktailGridProps) => {
  const uniqueCocktails = cocktails.filter(
    (cocktail, index, self) =>
      index === self.findIndex((c) => c.idDrink === cocktail.idDrink)
  );

  if (uniqueCocktails.length === 0) {
    return (
      <p className="text-foreground/50 text-center py-8">No cocktails to display.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {uniqueCocktails.map((cocktail, index) => (
        <motion.div
          key={cocktail.idDrink}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
        >
          <CocktailCard cocktail={cocktail} />
        </motion.div>
      ))}
    </div>
  );
};

export default CocktailGrid;

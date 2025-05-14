import { motion } from 'framer-motion';
import { Cocktail } from '@/types/recipe';
import CocktailCard from './CocktailCard';

interface CocktailGridProps {
  cocktails: Cocktail[];
}

const CocktailGrid = ({ cocktails }: CocktailGridProps) => {
  // Remove duplicates by idDrink
  const uniqueCocktails = cocktails.filter(
    (cocktail, index, self) =>
      index === self.findIndex((c) => c.idDrink === cocktail.idDrink)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {uniqueCocktails.map((cocktail, index) => (
        <motion.div
          key={cocktail.idDrink}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <CocktailCard cocktail={cocktail} />
        </motion.div>
      ))}
    </div>
  );
};

export default CocktailGrid;
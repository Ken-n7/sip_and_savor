import { motion } from 'framer-motion';
import { Meal } from '@/types/recipe';
import MealCard from './MealCard';

interface MealGridProps {
  meals: Meal[];
}

const MealGrid = ({ meals }: MealGridProps) => {
  const uniqueMeals = meals.filter(
    (meal, index, self) =>
      index === self.findIndex((m) => m.idMeal === meal.idMeal)
  );

  if (uniqueMeals.length === 0) {
    return (
      <p className="text-foreground/50 text-center py-8">No meals to display.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {uniqueMeals.map((meal, index) => (
        <motion.div
          key={meal.idMeal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
        >
          <MealCard meal={meal} />
        </motion.div>
      ))}
    </div>
  );
};

export default MealGrid;

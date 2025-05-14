import { motion } from 'framer-motion';
import { Meal } from '@/types/recipe';
import MealCard from './MealCard';

interface MealGridProps {
  meals: Meal[];
}

const MealGrid = ({ meals }: MealGridProps) => {
  // Remove duplicates by idMeal
  const uniqueMeals = meals.filter(
    (meal, index, self) =>
      index === self.findIndex((m) => m.idMeal === meal.idMeal)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
      {uniqueMeals.map((meal, index) => (
        <motion.div
          key={meal.idMeal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <MealCard meal={meal} />
        </motion.div>
      ))}
    </div>
  );
};

export default MealGrid;
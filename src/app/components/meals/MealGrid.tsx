// src/components/meals/MealGrid.tsx
'use client';

import { motion } from 'framer-motion';
import MealCard from './MealCard';

// interface MealGridProps {
//   meals: {
//     idMeal: string;
//     strMeal: string;
//     strMealThumb?: string;
//     strInstructions?: string;
//     strArea?: string;
//     strCategory?: string;
//   }[];
// }

// export function MealGrid({ meals }: MealGridProps) {
//   // Check for duplicate IDs
//   const idCounts = meals.reduce((acc, meal) => {
//     acc[meal.idMeal] = (acc[meal.idMeal] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const duplicates = Object.entries(idCounts).filter(([_, count]) => count > 1);
//   if (duplicates.length > 0) {
//     console.warn('Duplicate meal IDs found:', duplicates);
//   }
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
//       {meals.map((meal, index) => (
//         <motion.div
//           key={meal.idMeal}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//         >
//           <MealCard meal={meal} />
//         </motion.div>
//       ))}
//     </div>
//   );
// }

interface MealGridProps {
  meals: any[];
}

const MealGrid = ({ meals }: MealGridProps) => {
  // Remove duplicates by idDrink
  const uniqueMeals = meals.filter(
    (meal, index, self) =>
      index === self.findIndex((c) => c.idMeal === meal.idMeal)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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
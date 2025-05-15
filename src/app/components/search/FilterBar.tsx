import React from "react";
import { motion } from "framer-motion";

interface FilterTagProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="px-3 py-1 text-sm font-medium rounded-full transition-colors relative"
      style={{
        backgroundColor: isActive 
          ? 'hsl(var(--primary))' 
          : 'hsl(var(--background) / 0.8)',
        color: isActive 
          ? 'hsl(var(--primary-foreground))' 
          : 'hsl(var(--foreground))',
        border: isActive 
          ? 'none' 
          : '1px solid hsl(var(--border))',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {isActive && (
        <motion.span
          layoutId="filterTagBg"
          className="absolute inset-0 rounded-full bg-primary"
          style={{ zIndex: -1 }}
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {label}
    </motion.button>
  );
};

interface FilterBarProps {
  activeFilter: "all" | "cocktails" | "meals";
  onFilterChange: (filter: "all" | "cocktails" | "meals") => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <FilterTag
        label="All"
        isActive={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
      />
      <FilterTag
        label="Cocktails"
        isActive={activeFilter === "cocktails"}
        onClick={() => onFilterChange("cocktails")}
      />
      <FilterTag
        label="Meals"
        isActive={activeFilter === "meals"}
        onClick={() => onFilterChange("meals")}
      />
    </div>
  );
};

export default FilterBar;
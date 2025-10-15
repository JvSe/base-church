"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Database, Grid, Palette, TrendingUp } from "lucide-react";

const categories = [
  { id: "all", name: "Todas", icon: Grid },
  { id: "CREATIVITY", name: "Criatividade", icon: Palette },
  { id: "PROVISION", name: "Provisão", icon: Database },
  { id: "MULTIPLICATION", name: "Multiplicação", icon: TrendingUp },
];

const levels = [
  { id: "all", name: "Todos os níveis" },
  { id: "beginner", name: "Iniciante" },
  { id: "intermediate", name: "Intermediário" },
  { id: "advanced", name: "Avançado" },
];

type CourseFiltersProps = {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
};

export function CourseFilters({
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
}: CourseFiltersProps) {
  return (
    <>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="dark-input h-12 w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent className="dark-bg-secondary dark-border">
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="dark-text-primary hover:dark-bg-tertiary"
            >
              <div className="flex items-center space-x-2">
                <category.icon size={16} />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedLevel} onValueChange={onLevelChange}>
        <SelectTrigger className="dark-input h-12 w-48">
          <SelectValue placeholder="Nível" />
        </SelectTrigger>
        <SelectContent className="dark-bg-secondary dark-border">
          {levels.map((level) => (
            <SelectItem
              key={level.id}
              value={level.id}
              className="dark-text-primary hover:dark-bg-tertiary"
            >
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

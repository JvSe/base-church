"use client";

import { Input } from "@base-church/ui/components/input";
import { Search } from "lucide-react";

type CourseSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function CourseSearchBar({
  value,
  onChange,
  placeholder = "Buscar por cursos, instrutores ou temas...",
}: CourseSearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
        size={20}
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dark-input h-12 pl-12 text-base"
      />
    </div>
  );
}

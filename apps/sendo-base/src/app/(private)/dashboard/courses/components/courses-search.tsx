"use client";

import { Input } from "@base-church/ui/components/input";
import { Search } from "lucide-react";

type CoursesSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CoursesSearch({ value, onChange }: CoursesSearchProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h2 className="dark-text-primary mb-4 flex items-center gap-2 text-xl font-bold">
        <Search className="dark-primary" size={24} />
        Buscar Cursos
      </h2>
      <div className="relative">
        <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por título, instrutor, categoria ou tags..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dark-input pl-10"
        />
      </div>
    </div>
  );
}

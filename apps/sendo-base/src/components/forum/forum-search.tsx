"use client";

import { Input } from "@base-church/ui/components/input";
import { Search } from "lucide-react";
import { useState } from "react";

type ForumSearchProps = {
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export function ForumSearch({
  onSearchChange,
  placeholder = "Buscar discussões, temas ministeriais ou dúvidas...",
}: ForumSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    onSearchChange(value);
  }

  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-4">
      <div className="relative">
        <Search
          className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
          size={20}
        />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="dark-input h-12 pl-12 text-base"
        />
      </div>
    </div>
  );
}

"use client";

import { Input } from "@base-church/ui/components/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HelpSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/help/articles?search=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
      <Search
        className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
        size={20}
      />
      <Input
        className="dark-input h-14 pl-12 text-lg"
        placeholder="Buscar ajuda..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e);
          }
        }}
      />
    </form>
  );
}

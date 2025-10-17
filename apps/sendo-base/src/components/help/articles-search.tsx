"use client";

import { Input } from "@base-church/ui/components/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ArticlesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Update local state when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    router.push(`/help/articles?${params.toString()}`);
  }

  function clearSearch() {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/help/articles?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search
        className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
        size={20}
      />
      <Input
        placeholder="Buscar artigos de ajuda..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="dark-input h-12 pr-20 pl-12 text-base"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          className="dark-text-tertiary hover:dark-text-primary absolute top-1/2 right-4 -translate-y-1/2 transform"
        >
          <X size={20} />
        </button>
      )}
    </form>
  );
}

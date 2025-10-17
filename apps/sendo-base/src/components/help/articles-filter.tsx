"use client";

import type { CategoryWithCount } from "@/src/lib/types/help";
import { Button } from "@base-church/ui/components/button";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type ArticlesFilterProps = {
  categoriesWithCount: CategoryWithCount[];
  currentCategory?: string;
};

export function ArticlesFilter({
  categoriesWithCount,
  currentCategory = "all",
}: ArticlesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/help/articles?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/help/articles");
  }

  const hasFilters = currentCategory !== "all" || searchParams.get("search");
  const totalArticles = categoriesWithCount.reduce(
    (sum, cat) => sum + cat.count,
    0,
  );

  return (
    <div className="dark-card dark-shadow-sm rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="dark-primary" size={20} />
          <h3 className="dark-text-primary font-semibold">Filtrar por</h3>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="dark-text-tertiary hover:dark-text-primary"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
            currentCategory === "all"
              ? "dark-btn-primary"
              : "dark-bg-secondary hover:dark-bg-tertiary dark-text-secondary"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>Todas as categorias</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                currentCategory === "all"
                  ? "bg-white/20"
                  : "dark-bg-tertiary dark-text-tertiary"
              }`}
            >
              {totalArticles}
            </span>
          </div>
        </button>
        {categoriesWithCount.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryChange(category.name)}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
              currentCategory === category.name
                ? "dark-btn-primary"
                : "dark-bg-secondary hover:dark-bg-tertiary dark-text-secondary"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{category.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  currentCategory === category.name
                    ? "bg-white/20"
                    : "dark-bg-tertiary dark-text-tertiary"
                }`}
              >
                {category.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

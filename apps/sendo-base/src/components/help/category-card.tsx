"use client";

import type { HelpCategoryWithQuestions } from "@/src/lib/types";
import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type CategoryCardProps = {
  category: HelpCategoryWithQuestions;
};

export function CategoryCard({ category }: CategoryCardProps) {
  // Get icon component dynamically
  const IconComponent =
    (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;

  return (
    <Link
      href={`/help/articles?category=${encodeURIComponent(category.title)}`}
    >
      <div className="dark-card dark-shadow-sm group hover:dark-shadow-md flex h-full min-h-[320px] cursor-pointer flex-col rounded-xl p-6 transition-all">
        <div className={`${category.bgColor} mb-4 w-fit rounded-xl p-4`}>
          <IconComponent className={category.color} size={32} />
        </div>
        <h3 className="dark-text-primary group-hover:dark-primary mb-3 text-lg font-semibold transition-colors">
          {category.title}
        </h3>
        <ul className="flex-1 space-y-2">
          {category.questions.map((question) => (
            <li
              key={question.id}
              className="dark-text-secondary group-hover:dark-text-primary flex items-center gap-2 text-sm transition-colors"
            >
              <ChevronRight size={14} />
              {question.question}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

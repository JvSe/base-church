"use client";

import type { HelpArticle } from "@/src/lib/types";
import { ThumbsUp } from "lucide-react";
import Link from "next/link";

type ArticleCardProps = {
  article: HelpArticle;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/help/article/${article.slug}`}>
      <div className="dark-bg-secondary hover:dark-bg-tertiary group cursor-pointer rounded-xl p-6 transition-all">
        <div className="mb-3 flex items-start justify-between">
          <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium">
            {article.category}
          </span>
          <div className="flex items-center gap-1">
            <ThumbsUp size={14} className="dark-success" />
            <span className="dark-success text-sm font-medium">
              {article.helpful}%
            </span>
          </div>
        </div>
        <h3 className="dark-text-primary group-hover:dark-primary mb-2 font-semibold transition-colors">
          {article.title}
        </h3>
        <p className="dark-text-tertiary text-sm">
          {article.views} visualizações
        </p>
      </div>
    </Link>
  );
}

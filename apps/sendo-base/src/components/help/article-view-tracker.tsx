"use client";

import { useAuth } from "@/src/hooks/auth";
import { registerArticleView } from "@/src/lib/actions";
import { useEffect, useRef } from "react";

type ArticleViewTrackerProps = {
  articleId: string;
};

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  const userId = useAuth((s) => s.user?.id);
  const hasRegistered = useRef(false);

  useEffect(() => {
    // Only register view once per session
    if (userId && !hasRegistered.current) {
      hasRegistered.current = true;
      registerArticleView(articleId, userId);
    }
  }, [articleId, userId]);

  return null; // This component doesn't render anything
}

"use client";

import { useAuth } from "@/src/hooks/auth";
import { registerForumPostView } from "@/src/lib/actions";
import { useEffect, useRef } from "react";

type ViewTrackerProps = {
  postId: string;
};

export function ViewTracker({ postId }: ViewTrackerProps) {
  const userId = useAuth((s) => s.user?.id);
  const hasRegistered = useRef(false);

  useEffect(() => {
    // Only register view once per session
    if (userId && !hasRegistered.current) {
      hasRegistered.current = true;
      registerForumPostView(postId, userId);
    }
  }, [postId, userId]);

  return null; // This component doesn't render anything
}

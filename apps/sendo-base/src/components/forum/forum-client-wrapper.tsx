"use client";

import { useAuth } from "@/src/hooks";
import type { ForumPost } from "@/src/lib/types/forum";
import { useState } from "react";
import { CreatePostModal } from "./create-post-modal";
import { ForumSearch } from "./forum-search";
import { ForumTabs } from "./forum-tabs";

type ForumClientWrapperProps = {
  initialPosts: ForumPost[];
};

export function ForumClientWrapper({ initialPosts }: ForumClientWrapperProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = useAuth((s) => s.user?.id);

  // Filter posts based on search
  const filteredPosts = initialPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <ForumSearch onSearchChange={setSearchQuery} />

      {showCreatePost && (
        <CreatePostModal
          userId={userId ?? ""}
          onClose={() => setShowCreatePost(false)}
        />
      )}

      <ForumTabs
        posts={filteredPosts}
        onCreatePost={() => setShowCreatePost(true)}
      />
    </>
  );
}

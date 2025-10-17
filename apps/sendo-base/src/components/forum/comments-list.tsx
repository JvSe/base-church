"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { useAuth } from "@/src/hooks/auth";
import type { ForumComment } from "@/src/lib/types/forum";
import { MessageCircle } from "lucide-react";
import { CommentCard } from "./comment-card";

type CommentsListProps = {
  comments: ForumComment[];
};

export function CommentsList({ comments }: CommentsListProps) {
  const currentUserId = useAuth((s) => s.user?.id);
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nenhum comentário ainda"
        description="Seja o primeiro a comentar nesta discussão!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="dark-text-primary text-lg font-semibold">
        {comments.length} {comments.length === 1 ? "Comentário" : "Comentários"}
      </h3>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

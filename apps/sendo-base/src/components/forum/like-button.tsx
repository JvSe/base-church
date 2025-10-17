"use client";

import { useAuth } from "@/src/hooks/auth";
import { toggleForumPostLike } from "@/src/lib/actions";
import { Heart } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

type LikeButtonProps = {
  postId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
};

type LikeState = {
  likesCount: number;
  isLiked: boolean;
};

export function LikeButton({
  postId,
  initialLikesCount,
  initialIsLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const userId = useAuth((s) => s.user?.id);

  // Estado local que sincroniza com as props
  const [currentState, setCurrentState] = useState<LikeState>({
    likesCount: initialLikesCount,
    isLiked: initialIsLiked,
  });

  // Sincroniza com props quando mudam (após revalidação)
  useEffect(() => {
    setCurrentState({
      likesCount: initialLikesCount,
      isLiked: initialIsLiked,
    });
  }, [initialLikesCount, initialIsLiked]);

  // Optimistic state baseado no estado local
  const [optimisticState, setOptimisticState] = useOptimistic<
    LikeState,
    "toggle"
  >(currentState, (state, action) => {
    if (action === "toggle") {
      return {
        likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
        isLiked: !state.isLiked,
      };
    }
    return state;
  });

  function handleLike(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigation if inside Link
    e.stopPropagation(); // Prevent event bubbling

    if (!userId) {
      toast.error("Faça login para curtir");
      return;
    }

    // Optimistic update
    startTransition(async () => {
      setOptimisticState("toggle");

      const result = await toggleForumPostLike(postId, userId);

      if (!result.success) {
        toast.error("Erro ao curtir post");
      }
    });
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center space-x-2 transition-colors ${
        optimisticState.isLiked
          ? "text-red-500"
          : "dark-text-tertiary hover:dark-text-primary"
      }`}
    >
      <Heart size={16} className={currentState.isLiked ? "fill-current" : ""} />
      <span className="text-sm font-medium">{optimisticState.likesCount}</span>
    </button>
  );
}

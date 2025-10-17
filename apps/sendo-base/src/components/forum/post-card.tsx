"use client";

import { formatRelativeDate } from "@/src/lib/helpers/date-helpers";
import type { ForumPost } from "@/src/lib/types/forum";
import { Button } from "@base-church/ui/components/button";
import {
  Bookmark,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Share,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LikeButton } from "./like-button";

type PostCardProps = {
  post: ForumPost;
  showActions?: boolean;
};

export function PostCard({ post, showActions = true }: PostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  }

  const displayName = post.user.name || "Usuário";
  const displayUsername =
    post.user.username ||
    `@${post.user.name?.toLowerCase().replace(/\s+/g, "") || "usuario"}`;

  return (
    <Link href={`/forum/${post.id}`}>
      <div className="dark-card dark-shadow-sm rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-3">
            <Users className="dark-primary" size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <h3 className="dark-text-primary hover:dark-primary cursor-pointer text-lg font-semibold transition-colors">
                    {post.title}
                  </h3>
                </div>

                <div className="dark-text-tertiary mb-3 flex items-center space-x-2 text-sm">
                  <span className="dark-text-secondary font-medium">
                    {displayName}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeDate(post.createdAt)}</span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium">
                        {post.category}
                      </span>
                    </>
                  )}
                </div>

                <p className="dark-text-secondary hover:dark-text-primary mb-4 line-clamp-3 cursor-pointer leading-relaxed transition-colors">
                  {post.content}
                </p>
              </div>

              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <MoreHorizontal className="dark-text-secondary" size={16} />
                </Button>
              )}
            </div>

            {showActions && (
              <div className="dark-border flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-6">
                  <LikeButton
                    postId={post.id}
                    initialLikesCount={post.likesCount}
                    initialIsLiked={post.isLikedByUser || false}
                  />

                  <button className="dark-text-tertiary hover:dark-text-primary flex items-center space-x-2 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm font-medium">
                      {post._count.comments}{" "}
                      {post._count.comments === 1 ? "resposta" : "respostas"}
                    </span>
                  </button>

                  <div className="dark-text-tertiary flex items-center space-x-1 text-sm">
                    <Eye size={16} />
                    <span>
                      {post.viewsCount}{" "}
                      {post.viewsCount === 1 ? "visualização" : "visualizações"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="dark-text-tertiary hover:dark-text-primary transition-colors"
                  >
                    <Share className="" size={16} />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`transition-colors ${
                      isBookmarked
                        ? "dark-secondary"
                        : "dark-text-tertiary hover:dark-text-primary"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      className={isBookmarked ? "fill-current" : ""}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

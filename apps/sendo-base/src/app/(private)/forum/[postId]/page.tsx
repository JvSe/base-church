import { ErrorState } from "@/src/components/common/feedback/error-state";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { CommentForm } from "@/src/components/forum/comment-form";
import { CommentsList } from "@/src/components/forum/comments-list";
import { LikeButton } from "@/src/components/forum/like-button";
import { ViewTracker } from "@/src/components/forum/view-tracker";
import { getForumPostById } from "@/src/lib/actions";
import { addPastorPrefix } from "@/src/lib/helpers";
import { formatRelativeDate } from "@/src/lib/helpers/date-helpers";
import { getSession } from "@/src/lib/helpers/session.helper";
import type { ForumComment, ForumPost } from "@/src/lib/types/forum";
import { Button } from "@base-church/ui/components/button";
import { ArrowLeft, Eye, MessageCircle, Share, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    postId: string;
  }>;
};

async function getPostData(postId: string) {
  const session = await getSession();
  const result = await getForumPostById(postId, session?.userId);

  if (!result.success || !result.post) {
    return null;
  }

  return {
    post: result.post as ForumPost & { comments: ForumComment[] },
  };
}

export default async function ForumPostPage({ params }: PageProps) {
  const { postId } = await params;
  const data = await getPostData(postId);

  if (!data) {
    return (
      <PageLayout>
        <ErrorState
          icon={MessageCircle}
          title="Discussão não encontrada"
          description="Esta discussão não existe ou foi removida."
          onRetry={() => {}}
        />
      </PageLayout>
    );
  }

  const { post } = data;
  const displayName =
    addPastorPrefix(post.user.name, post.user.isPastor) || "Usuário";
  const displayUsername =
    post.user.username ||
    `@${post.user.name?.toLowerCase().replace(/\s+/g, "") || "usuario"}`;

  return (
    <PageLayout>
      {/* View Tracker - registra visualização automaticamente */}
      <ViewTracker postId={postId} />

      {/* Header with back button */}
      <div className="mb-6">
        <Link href="/forum">
          <Button
            variant="ghost"
            className="dark-text-secondary hover:dark-text-primary mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Fórum
          </Button>
        </Link>
      </div>

      {/* Post Content */}
      <div className="dark-card dark-shadow-md mb-6 rounded-xl p-8">
        <div className="mb-6 flex items-start space-x-4">
          <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-4">
            <Users className="dark-primary" size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center space-x-2">
              <span className="dark-text-primary text-lg font-semibold">
                {displayName}
              </span>
              <span className="dark-text-tertiary text-sm">
                {displayUsername}
              </span>
              <span className="dark-text-tertiary text-sm">•</span>
              <span className="dark-text-tertiary text-sm">
                {formatRelativeDate(post.createdAt)}
              </span>
            </div>

            {post.category && (
              <span className="dark-primary-subtle-bg dark-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
                {post.category}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="dark-text-primary mb-4 text-3xl font-bold">
            {post.title}
          </h1>
          <p className="dark-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Post Stats */}
        <div className="dark-border flex items-center justify-between border-t pt-6">
          <div className="flex items-center space-x-6">
            <LikeButton
              postId={postId}
              initialLikesCount={post.likesCount}
              initialIsLiked={post.isLikedByUser || false}
            />

            <div className="dark-text-tertiary flex items-center space-x-2">
              <MessageCircle size={20} />
              <span className="font-medium">
                {post._count.comments}{" "}
                {post._count.comments === 1 ? "resposta" : "respostas"}
              </span>
            </div>

            <div className="dark-text-tertiary flex items-center space-x-2">
              <Eye size={20} />
              <span className="font-medium">
                {post.viewsCount}{" "}
                {post.viewsCount === 1 ? "visualização" : "visualizações"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="dark-text-tertiary hover:dark-text-primary"
          >
            <Share size={20} />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <CommentForm postId={postId} />
        <CommentsList comments={post.comments || []} />
      </div>
    </PageLayout>
  );
}

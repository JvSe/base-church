import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { ForumClientWrapper } from "@/src/components/forum/forum-client-wrapper";
import { getForumPosts } from "@/src/lib/actions";
import { getSession } from "@/src/lib/helpers/session.helper";
import type { ForumPost } from "@/src/lib/types/forum";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fórum",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getForumData() {
  const session = await getSession();
  const result = await getForumPosts(session?.userId);

  if (!result.success) {
    throw new Error(result.error);
  }

  return {
    posts: result.posts as ForumPost[],
  };
}

export default async function ForumPage() {
  const { posts } = await getForumData();

  // Calculate stats
  const totalDiscussions = posts.length;
  const totalResponses = posts.reduce(
    (acc, post) => acc + post._count.comments,
    0,
  );

  return (
    <PageLayout>
      <PageHeader
        title="Fórum Ministerial"
        description="Conecte-se, aprenda e compartilhe experiências ministeriais com nossa comunidade"
      >
        {/* Forum Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {totalDiscussions}
            </div>
            <div className="dark-text-tertiary text-sm">Discussões Ativas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">0</div>
            <div className="dark-text-tertiary text-sm">Resolvidas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {totalResponses}
            </div>
            <div className="dark-text-tertiary text-sm">Respostas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">0</div>
            <div className="dark-text-tertiary text-sm">Visualizações</div>
          </div>
        </div>
      </PageHeader>

      <ForumClientWrapper initialPosts={posts} />
    </PageLayout>
  );
}

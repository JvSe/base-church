"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import type { ForumPost } from "@/src/lib/types/forum";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Clock, MessageCircle, TrendingUp, Users } from "lucide-react";
import { PostCard } from "./post-card";

type ForumTabsProps = {
  posts: ForumPost[];
  onCreatePost: () => void;
};

export function ForumTabs({ posts, onCreatePost }: ForumTabsProps) {
  // Sort posts for different tabs
  const trendingPosts = [...posts]
    .sort((a, b) => b._count.comments - a._count.comments)
    .slice(0, 10);

  const recentPosts = [...posts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  // TODO: Implement solved status in database
  const solvedPosts: ForumPost[] = [];
  const unsolvedPosts = posts;

  return (
    <div className="dark-shadow-sm rounded-xl p-1">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="dark-bg-secondary mb-10 grid h-12 w-full grid-cols-2 gap-2 md:mb-0 md:grid-cols-5">
          <TabsTrigger
            value="all"
            className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
          >
            Todas ({posts.length})
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
          >
            <TrendingUp size={14} className="mr-1" />
            Em Alta
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
          >
            <Clock size={14} className="mr-1" />
            Recentes
          </TabsTrigger>
          <TabsTrigger
            value="solved"
            className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
          >
            <MessageCircle size={14} className="mr-1" />
            Resolvidas ({solvedPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="unsolved"
            className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
          >
            <Users size={14} className="mr-1" />
            Abertas ({unsolvedPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="Nenhuma discussão disponível"
              description="Não há discussões no momento"
              action={{
                label: "Iniciar Discussão",
                onClick: onCreatePost,
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          {trendingPosts.length > 0 ? (
            <div className="space-y-4">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="Nenhuma discussão em alta"
              description="Não há discussões populares no momento"
            />
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="Nenhuma discussão recente"
              description="Não há discussões recentes no momento"
              action={{
                label: "Iniciar Discussão",
                onClick: onCreatePost,
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="solved" className="mt-6">
          {solvedPosts.length > 0 ? (
            <div className="space-y-4">
              {solvedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="Nenhuma discussão resolvida"
              description="Não há discussões resolvidas no momento"
            />
          )}
        </TabsContent>

        <TabsContent value="unsolved" className="mt-6">
          {unsolvedPosts.length > 0 ? (
            <div className="space-y-4">
              {unsolvedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Nenhuma discussão aberta"
              description="Todas as discussões foram resolvidas!"
              action={{
                label: "Iniciar Nova Discussão",
                onClick: onCreatePost,
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

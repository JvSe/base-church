"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { getForumPosts } from "@/src/lib/actions";
import { formatDate } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Textarea } from "@base-church/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  Clock,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Share,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  // Fetch forum posts from database
  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forum-posts"],
    queryFn: getForumPosts,
    select: (data) => data.posts,
  });

  // Transform posts data for compatibility with existing components
  const posts =
    postsData?.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.user.id,
        name: post.user.name || "Usuário",
        username:
          post.user.username ||
          `@${post.user.name?.toLowerCase().replace(/\s+/g, "") || "usuario"}`,
        image: post.user.image || "/api/placeholder/40/40",
      },
      category: post.category || "Geral",
      tags: [], // TODO: Add tags to forum posts schema
      likes: 0, // TODO: Add likes to forum posts schema
      comments: post._count?.comments || 0,
      views: 0, // TODO: Add views to forum posts schema
      isLiked: false, // TODO: Implement user likes
      isBookmarked: false, // TODO: Implement user bookmarks
      createdAt: new Date(post.createdAt),
      isSolved: false, // TODO: Add solved status to forum posts schema
    })) || [];

  const categories = [
    { id: "all", name: "Todas", count: posts.length },
    {
      id: "frontend",
      name: "Frontend",
      count: posts.filter((p) => p.category === "Frontend").length,
    },
    {
      id: "backend",
      name: "Backend",
      count: posts.filter((p) => p.category === "Backend").length,
    },
    {
      id: "mobile",
      name: "Mobile",
      count: posts.filter((p) => p.category === "Mobile").length,
    },
    {
      id: "devops",
      name: "DevOps",
      count: posts.filter((p) => p.category === "DevOps").length,
    },
    {
      id: "testes",
      name: "Testes",
      count: posts.filter((p) => p.category === "Testes").length,
    },
    {
      id: "discussao",
      name: "Discussão",
      count: posts.filter((p) => p.category === "Discussão").length,
    },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const trendingPosts = posts
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 5);
  const recentPosts = posts.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const solvedPosts = posts.filter((post) => post.isSolved);
  const unsolvedPosts = posts.filter((post) => !post.isSolved);

  const handleCreatePost = () => {
    // In real app, this would call a server action
    console.log("Creating post:", newPost);
    setShowCreatePost(false);
    setNewPost({ title: "", content: "", category: "" });
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={MessageCircle}
          title="Carregando fórum..."
          description="Buscando discussões da comunidade"
        />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={MessageCircle}
          title="Erro ao carregar fórum"
          description="Não foi possível carregar as discussões. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Fórum Ministerial"
        description="Conecte-se, aprenda e compartilhe experiências ministeriais com nossa comunidade"
        actions={[
          {
            label: "Filtrar",
            icon: Filter,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
          {
            label: "Nova Discussão",
            icon: Plus,
            variant: "success",
            onClick: () => setShowCreatePost(true),
          },
        ]}
      >
        {/* Forum Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {posts.length}
            </div>
            <div className="dark-text-tertiary text-sm">Discussões Ativas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {solvedPosts.length}
            </div>
            <div className="dark-text-tertiary text-sm">Resolvidas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {posts.reduce((acc, post) => acc + post.comments, 0)}
            </div>
            <div className="dark-text-tertiary text-sm">Respostas</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {posts.reduce((acc, post) => acc + post.views, 0)}
            </div>
            <div className="dark-text-tertiary text-sm">Visualizações</div>
          </div>
        </div>
      </PageHeader>

      {/* Search */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-4">
        <div className="relative">
          <Search
            className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
            size={20}
          />
          <Input
            placeholder="Buscar discussões, temas ministeriais ou dúvidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark-input h-12 pl-12 text-base"
          />
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <h2 className="dark-text-primary mb-6 text-xl font-bold">
            Nova Discussão Ministerial
          </h2>
          <div className="space-y-4">
            <Input
              placeholder="Título da discussão (ex: Como melhorar o discipulado?)"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="dark-input h-12"
            />
            <Textarea
              placeholder="Compartilhe sua experiência, dúvida ou insight ministerial..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows={6}
              className="dark-input resize-none"
            />
            <Input
              placeholder="Categoria (Células, Discipulado, Cultos, etc.)"
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="dark-input h-12"
            />
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowCreatePost(false)}
                className="dark-glass dark-border hover:dark-border-hover"
              >
                Cancelar
              </Button>
              <Button onClick={handleCreatePost} className="dark-btn-primary">
                Publicar Discussão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="dark-shadow-sm rounded-xl p-1">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="dark-bg-secondary grid h-12 w-full grid-cols-5">
            <TabsTrigger
              value="all"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
            >
              Todas ({filteredPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
            >
              <TrendingUp size={14} className="mr-1" />
              Em Alta
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
            >
              <Clock size={14} className="mr-1" />
              Recentes
            </TabsTrigger>
            <TabsTrigger
              value="solved"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
            >
              <MessageCircle size={14} className="mr-1" />
              Resolvidas ({solvedPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value="unsolved"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
            >
              <Users size={14} className="mr-1" />
              Abertas ({unsolvedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MessageCircle}
                title={
                  searchQuery
                    ? "Nenhuma discussão encontrada"
                    : "Nenhuma discussão disponível"
                }
                description={
                  searchQuery
                    ? "Tente ajustar sua busca"
                    : "Não há discussões no momento"
                }
                action={{
                  label: searchQuery ? "Limpar Busca" : "Iniciar Discussão",
                  onClick: searchQuery
                    ? () => setSearchQuery("")
                    : () => setShowCreatePost(true),
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
                action={{
                  label: "Ver Todas as Discussões",
                  onClick: () => {},
                }}
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
                  onClick: () => setShowCreatePost(true),
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
                action={{
                  label: "Ver Todas as Discussões",
                  onClick: () => {},
                }}
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
                  onClick: () => setShowCreatePost(true),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function PostCard({ post }: { post: any }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
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
                {post.isSolved && (
                  <span className="dark-success-bg dark-success rounded-full px-2 py-1 text-xs font-medium">
                    ✅ Resolvida
                  </span>
                )}
              </div>

              <div className="dark-text-tertiary mb-3 flex items-center space-x-2 text-sm">
                <span className="dark-text-secondary font-medium">
                  {post.author.name}
                </span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium">
                  {post.category}
                </span>
              </div>

              <p className="dark-text-secondary mb-4 line-clamp-3 leading-relaxed">
                {post.content}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="dark-bg-tertiary dark-text-tertiary hover:dark-primary-subtle-bg hover:dark-primary cursor-pointer rounded-full px-2 py-1 text-xs transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="hover:dark-bg-tertiary"
            >
              <MoreHorizontal className="dark-text-secondary" size={16} />
            </Button>
          </div>

          <div className="dark-border flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked
                    ? "dark-error"
                    : "dark-text-tertiary hover:dark-text-primary"
                }`}
              >
                <Heart size={16} className={isLiked ? "fill-current" : ""} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button className="dark-text-tertiary hover:dark-text-primary flex items-center space-x-2 transition-colors">
                <MessageCircle size={16} />
                <span className="text-sm font-medium">
                  {post.comments} respostas
                </span>
              </button>

              <div className="dark-text-tertiary flex items-center space-x-1 text-sm">
                <Eye size={16} />
                <span>{post.views} visualizações</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="dark-text-tertiary hover:dark-text-primary transition-colors">
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
        </div>
      </div>
    </div>
  );
}

"use client";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { getCommunityData } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Bookmark,
  BookOpen,
  Calendar,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Smile,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";

export default function ComunidadePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [newPost, setNewPost] = useState("");

  // Fetch community data from database
  const {
    data: communityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["community-data"],
    queryFn: getCommunityData,
    select: (data) => data.data,
  });

  // Transform community data for compatibility with existing components
  const communityStats = [
    {
      title: "Membros Ativos",
      value: communityData?.stats?.totalUsers
        ? `${(communityData.stats.totalUsers / 1000).toFixed(1)}k`
        : "0",
      icon: Users,
      color: "dark-primary",
      bgColor: "dark-primary-subtle-bg",
      growth: "+15%",
    },
    {
      title: "Posts Esta Semana",
      value: communityData?.stats?.totalPosts?.toString() || "0",
      icon: MessageCircle,
      color: "dark-secondary",
      bgColor: "dark-secondary-subtle-bg",
      growth: "+8%",
    },
    {
      title: "Eventos Ativos",
      value: communityData?.stats?.totalEvents?.toString() || "0",
      icon: Calendar,
      color: "dark-info",
      bgColor: "dark-info-bg",
      growth: "+5",
    },
    {
      title: "Conquistas",
      value: communityData?.stats?.totalAchievements?.toString() || "0",
      icon: Award,
      color: "dark-warning",
      bgColor: "dark-warning-bg",
      growth: "+12",
    },
  ];

  // Transform recent posts for feed
  const feedPosts =
    communityData?.recentPosts?.map((post: any) => ({
      id: post.id,
      author: {
        name: post.user.name || "Usuário",
        role: post.user.role === "ADMIN" ? "Administrador" : "Membro",
        avatar: post.user.image,
      },
      content: post.content,
      timestamp: formatTimeAgo(new Date(post.createdAt)),
      likes: 0, // TODO: Add likes to forum posts
      comments: post._count?.comments || 0,
      shares: 0, // TODO: Add shares to forum posts
      isLiked: false, // TODO: Implement user likes
      tags: [], // TODO: Add tags to forum posts
      type: "text",
    })) || [];

  // Transform active users
  const activeMembers =
    communityData?.activeUsers?.map((user: any) => ({
      name: user.name || "Usuário",
      role: user.role === "ADMIN" ? "Administrador" : "Membro",
      online: true, // TODO: Implement online status
    })) || [];

  // Mock trending topics for now
  const trendingTopics = [
    { topic: "#fundamentos", posts: 45 },
    { topic: "#liderança", posts: 32 },
    { topic: "#discipulado", posts: 28 },
    { topic: "#cultura", posts: 24 },
    { topic: "#ministério", posts: 19 },
  ];

  // Helper function to format time ago
  function formatTimeAgo(date: Date) {
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
  }

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Users}
          title="Carregando comunidade..."
          description="Conectando com nossa família ministerial"
        />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={Users}
          title="Erro ao carregar comunidade"
          description="Não foi possível carregar os dados da comunidade. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout spacing="normal">
      <PageHeader
        title="Comunidade Base Church"
        description="Conecte-se, aprenda e cresça junto com nossa família ministerial"
        actions={[
          {
            label: "Novo Post",
            icon: Plus,
            variant: "success",
          },
        ]}
      >
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {communityStats.map((stat, index) => (
            <div key={index} className="dark-bg-secondary rounded-lg p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className={`${stat.bgColor} rounded-lg p-2`}>
                  <stat.icon className={stat.color} size={20} />
                </div>
                <span className="dark-success text-sm font-medium">
                  {stat.growth}
                </span>
              </div>
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {stat.value}
              </div>
              <div className="dark-text-tertiary text-sm">{stat.title}</div>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Feed */}
        <div className="space-y-6 lg:col-span-3">
          {/* Navigation Tabs */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-1">
            <div className="flex items-center space-x-1">
              {[
                { id: "feed", label: "Feed", icon: MessageCircle },
                { id: "eventos", label: "Eventos", icon: Calendar },
                { id: "recursos", label: "Recursos", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                    activeTab === tab.id
                      ? "dark-btn-primary"
                      : "dark-text-secondary hover:dark-text-primary hover:dark-bg-tertiary"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Create Post */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-3">
                <User className="dark-primary" size={20} />
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Compartilhe suas experiências, dúvidas ou insights..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="dark-input min-h-[100px] w-full resize-none"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:dark-bg-tertiary"
                    >
                      <ImageIcon className="dark-text-secondary" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:dark-bg-tertiary"
                    >
                      <Video className="dark-text-secondary" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:dark-bg-tertiary"
                    >
                      <Smile className="dark-text-secondary" size={16} />
                    </Button>
                  </div>
                  <Button className="dark-btn-primary gap-2">
                    <Send size={16} />
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {feedPosts.length > 0 ? (
              feedPosts.map((post) => (
                <div
                  key={post.id}
                  className="dark-card dark-shadow-sm rounded-xl p-6"
                >
                  {/* Post Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="dark-primary-subtle-bg rounded-full p-3">
                        <User className="dark-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="dark-text-primary font-semibold">
                          {post.author.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="dark-text-tertiary">
                            {post.author.role === "ADMIN"
                              ? "Administrador"
                              : "Membro"}
                          </span>
                          <span className="dark-text-tertiary">•</span>
                          <span className="dark-text-tertiary">
                            {post.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:dark-bg-tertiary"
                    >
                      <MoreHorizontal
                        className="dark-text-secondary"
                        size={16}
                      />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="dark-text-primary mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="dark-border flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-6">
                      <button
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked
                            ? "dark-error"
                            : "dark-text-tertiary hover:dark-text-primary"
                        }`}
                      >
                        <Heart
                          size={16}
                          className={post.isLiked ? "fill-current" : ""}
                        />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="dark-text-tertiary hover:dark-text-primary flex items-center space-x-2 transition-colors">
                        <MessageCircle size={16} />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="dark-text-tertiary hover:dark-text-primary flex items-center space-x-2 transition-colors">
                        <Share2 size={16} />
                        <span className="text-sm">{post.shares}</span>
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:dark-bg-tertiary"
                    >
                      <Bookmark className="dark-text-secondary" size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <MessageCircle className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  Nenhum post no feed
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Ainda não há posts da comunidade para exibir
                </p>
                <Button className="dark-btn-primary">
                  Criar Primeiro Post
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Members */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
              <Users size={18} />
              Membros Online
            </h3>
            <div className="space-y-3">
              {activeMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="dark-primary-subtle-bg rounded-full p-2">
                        <User className="dark-primary" size={16} />
                      </div>
                      <div
                        className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${
                          member.online
                            ? "dark-success-bg"
                            : "dark-text-disabled"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="dark-text-primary text-sm font-medium">
                        {member.name}
                      </p>
                      <p className="dark-text-tertiary text-xs">
                        {member.role === "ADMIN" ? "Administrador" : "Membro"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics - Only show if there are posts */}
          {feedPosts.length > 0 && (
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                <TrendingUp size={18} />
                Tópicos em Alta
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="dark-primary cursor-pointer font-medium hover:underline">
                      {topic.topic}
                    </span>
                    <span className="dark-text-tertiary text-sm">
                      {topic.posts} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <h3 className="dark-text-primary mb-4 font-semibold">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <Calendar className="mr-2" size={16} />
                Ver Eventos
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <MessageCircle className="mr-2" size={16} />
                Fórum
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <BookOpen className="mr-2" size={16} />
                Recursos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

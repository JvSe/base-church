"use client";

import { Button } from "@repo/ui/components/button";
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

  const communityStats = [
    {
      title: "Membros Ativos",
      value: "12.4k",
      icon: Users,
      color: "dark-primary",
      bgColor: "dark-primary-subtle-bg",
      growth: "+15%",
    },
    {
      title: "Posts Esta Semana",
      value: "847",
      icon: MessageCircle,
      color: "dark-secondary",
      bgColor: "dark-secondary-subtle-bg",
      growth: "+8%",
    },
    {
      title: "Eventos Ativos",
      value: "23",
      icon: Calendar,
      color: "dark-info",
      bgColor: "dark-info-bg",
      growth: "+5",
    },
    {
      title: "Conquistas",
      value: "156",
      icon: Award,
      color: "dark-warning",
      bgColor: "dark-warning-bg",
      growth: "+12",
    },
  ];

  const feedPosts = [
    {
      id: "1",
      author: {
        name: "João Silva",
        role: "Líder de Célula",
        avatar: null,
      },
      content:
        "Acabei de concluir o curso de Fundamentos Ministeriais! As aulas sobre princípios bíblicos foram transformadoras. Recomendo muito para quem está começando na liderança. 🙏",
      timestamp: "2 horas atrás",
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      tags: ["#fundamentos", "#liderança"],
      type: "text",
    },
    {
      id: "2",
      author: {
        name: "Maria Santos",
        role: "Pastora",
        avatar: null,
      },
      content:
        "Compartilhando algumas reflexões sobre o último módulo de Cultura da Igreja. Como vocês aplicam esses princípios no dia a dia do ministério?",
      timestamp: "4 horas atrás",
      likes: 18,
      comments: 12,
      shares: 5,
      isLiked: true,
      tags: ["#cultura", "#ministério"],
      type: "text",
    },
    {
      id: "3",
      author: {
        name: "Carlos Mendes",
        role: "Discipulador",
        avatar: null,
      },
      content:
        "Evento especial amanhã às 19h! Vamos discutir estratégias de discipulado para jovens. Quem vai participar? 🎯",
      timestamp: "6 horas atrás",
      likes: 32,
      comments: 15,
      shares: 8,
      isLiked: false,
      tags: ["#evento", "#discipulado", "#jovens"],
      type: "event",
    },
  ];

  const activeMembers = [
    { name: "Ana Costa", role: "Coordenadora", online: true },
    { name: "Pedro Lima", role: "Líder", online: true },
    { name: "Julia Rocha", role: "Discipuladora", online: false },
    { name: "Rafael Santos", role: "Pastor", online: true },
    { name: "Camila Dias", role: "Líder de Célula", online: false },
  ];

  const trendingTopics = [
    { topic: "#fundamentos", posts: 45 },
    { topic: "#liderança", posts: 32 },
    { topic: "#discipulado", posts: 28 },
    { topic: "#cultura", posts: 24 },
    { topic: "#ministério", posts: 19 },
  ];

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Comunidade Base Church
              </h1>
              <p className="dark-text-secondary">
                Conecte-se, aprenda e cresça junto com nossa família ministerial
              </p>
            </div>
            <Button className="dark-btn-primary gap-2">
              <Plus size={18} />
              Novo Post
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
        </div>

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
              {feedPosts.map((post) => (
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
                            {post.author.role}
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
              ))}
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
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
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
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
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
      </div>
    </div>
  );
}

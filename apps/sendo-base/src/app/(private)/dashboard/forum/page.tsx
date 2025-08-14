"use client";

import { formatDate } from "@/src/lib/formatters";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
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
  Tag,
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

  // Mock data - in real app this would come from server actions
  const posts = [
    {
      id: "1",
      title: "Como começar com células ministeriais?",
      content:
        "Olá pessoal! Sou iniciante no ministério e quero implementar células ministeriais. Alguém pode me dar algumas dicas de por onde começar? Quais são os pré-requisitos necessários?",
      author: {
        id: "1",
        name: "Pr. João Silva",
        username: "@joaosilva",
        image: "/api/placeholder/40/40",
      },
      category: "Células",
      tags: ["Células", "Ministério", "Dúvida"],
      likes: 24,
      comments: 12,
      views: 156,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date("2024-01-15T10:30:00"),
      isSolved: false,
    },
    {
      id: "2",
      title: "Problema com discipulado de novos convertidos",
      content:
        "Estou desenvolvendo um programa de discipulado, mas estou tendo problemas com a implementação para novos convertidos. O processo não está sendo eficaz. Alguém pode ajudar?",
      author: {
        id: "2",
        name: "Pr. Maria Santos",
        username: "@mariasantos",
        image: "/api/placeholder/40/40",
      },
      category: "Discipulado",
      tags: ["Discipulado", "Novos Convertidos", "Ministério"],
      likes: 18,
      comments: 8,
      views: 89,
      isLiked: true,
      isBookmarked: false,
      createdAt: new Date("2024-01-14T15:45:00"),
      isSolved: true,
    },
    {
      id: "3",
      title: "Dicas para melhorar impacto dos cultos",
      content:
        "Compartilhando algumas técnicas que aprendi para otimizar o impacto dos cultos: adoração, pregação, acolhimento, etc. Quais outras técnicas vocês usam?",
      author: {
        id: "3",
        name: "Pr. Carlos Oliveira",
        username: "@carlosoliveira",
        image: "/api/placeholder/40/40",
      },
      category: "Cultos",
      tags: ["Cultos", "Impacto", "Otimização", "Dicas"],
      likes: 45,
      comments: 23,
      views: 234,
      isLiked: false,
      isBookmarked: true,
      createdAt: new Date("2024-01-13T09:15:00"),
      isSolved: false,
    },
    {
      id: "4",
      title: "Como implementar testes unitários com Jest?",
      content:
        "Preciso implementar testes unitários no meu projeto. Estou usando Jest, mas não sei por onde começar. Alguém pode me dar um exemplo prático de como estruturar os testes?",
      author: {
        id: "4",
        name: "Ana Costa",
        username: "@anacosta",
        image: "/api/placeholder/40/40",
      },
      category: "Testes",
      tags: ["Jest", "Testes", "Unitários", "JavaScript"],
      likes: 32,
      comments: 15,
      views: 178,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date("2024-01-12T14:20:00"),
      isSolved: false,
    },
    {
      id: "5",
      title: "Melhores práticas para deploy de aplicações Next.js",
      content:
        "Quais são as melhores práticas para fazer deploy de aplicações Next.js? Estou usando Vercel, mas gostaria de saber sobre outras opções e como otimizar o processo.",
      author: {
        id: "5",
        name: "Pedro Lima",
        username: "@pedrolima",
        image: "/api/placeholder/40/40",
      },
      category: "DevOps",
      tags: ["Next.js", "Deploy", "Vercel", "DevOps"],
      likes: 28,
      comments: 11,
      views: 145,
      isLiked: true,
      isBookmarked: false,
      createdAt: new Date("2024-01-11T11:30:00"),
      isSolved: false,
    },
    {
      id: "6",
      title: "Como escolher entre TypeScript e JavaScript?",
      content:
        "Estou começando um novo projeto e não sei se devo usar TypeScript ou JavaScript. Quais são as vantagens e desvantagens de cada um? Quando usar cada um?",
      author: {
        id: "6",
        name: "Lucia Ferreira",
        username: "@luciaferreira",
        image: "/api/placeholder/40/40",
      },
      category: "Discussão",
      tags: ["TypeScript", "JavaScript", "Comparação", "Escolha"],
      likes: 56,
      comments: 34,
      views: 312,
      isLiked: false,
      isBookmarked: true,
      createdAt: new Date("2024-01-10T16:45:00"),
      isSolved: false,
    },
  ];

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
      post.tags.some((tag) =>
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

  return (
    <div className="bg-background space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Fórum da Comunidade
          </h1>
          <p className="text-muted-foreground">
            Conecte-se, aprenda e compartilhe conhecimento com outros
            desenvolvedores
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
          >
            <Filter size={16} className="mr-2" />
            Filtrar
          </Button>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            Nova Publicação
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
          size={20}
        />
        <Input
          placeholder="Buscar por títulos, conteúdo ou tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dark-1/30 border-dark-2 focus:border-primary/50 pl-10"
        />
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-foreground">Nova Publicação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Título da publicação"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="bg-dark-1/30 border-dark-2 focus:border-primary/50"
            />
            <Textarea
              placeholder="Conteúdo da publicação..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows={6}
              className="bg-dark-1/30 border-dark-2 focus:border-primary/50"
            />
            <Input
              placeholder="Categoria (opcional)"
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="bg-dark-1/30 border-dark-2 focus:border-primary/50"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreatePost(false)}
                className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePost}
                className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
              >
                Publicar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-dark-1/30 border-dark-1 grid w-full grid-cols-5">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Todas ({filteredPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <TrendingUp size={16} className="mr-2" />
            Em Alta
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Clock size={16} className="mr-2" />
            Recentes
          </TabsTrigger>
          <TabsTrigger
            value="solved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <MessageCircle size={16} className="mr-2" />
            Resolvidas ({solvedPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="unsolved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Users size={16} className="mr-2" />
            Não Resolvidas ({unsolvedPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="space-y-4">
            {trendingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solved" className="mt-6">
          <div className="space-y-4">
            {solvedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unsolved" className="mt-6">
          <div className="space-y-4">
            {unsolvedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
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
    <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="ring-primary/20 h-10 w-10 ring-4">
            <AvatarImage src={post.author.image} alt={post.author.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.author.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center space-x-2">
                  <h3 className="text-foreground hover:text-primary cursor-pointer font-semibold transition-colors">
                    {post.title}
                  </h3>
                  {post.isSolved && (
                    <Badge
                      variant="secondary"
                      className="from-secondary to-secondary-1 text-secondary-foreground bg-gradient-to-r text-xs shadow-lg"
                    >
                      Resolvido
                    </Badge>
                  )}
                </div>

                <div className="text-muted-foreground mb-2 flex items-center space-x-2 text-sm">
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>{post.author.username}</span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>

                <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                  {post.content}
                </p>

                <div className="mb-3 flex flex-wrap gap-1">
                  {post.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-dark-2 text-muted-foreground text-xs"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
                <MoreHorizontal size={16} />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={
                    isLiked
                      ? "text-red-500 hover:bg-red-500/10"
                      : "text-muted-foreground hover:bg-dark-2/50"
                  }
                >
                  <Heart size={16} className="mr-1" />
                  <span>{likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-dark-2/50"
                >
                  <MessageCircle size={16} className="mr-1" />
                  <span>{post.comments}</span>
                </Button>

                <div className="text-muted-foreground flex items-center text-sm">
                  <Eye size={16} className="mr-1" />
                  <span>{post.views}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-dark-2/50"
                >
                  <Share size={16} />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={
                  isBookmarked
                    ? "text-secondary hover:bg-secondary/10"
                    : "text-muted-foreground hover:bg-dark-2/50"
                }
              >
                <Bookmark size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

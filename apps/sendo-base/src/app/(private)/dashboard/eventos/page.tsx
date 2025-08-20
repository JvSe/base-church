"use client";

import { formatDateTime, formatTime } from "@/src/lib/formatters";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Grid,
  List,
  MapPin,
  Search,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EventosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - in real app this would come from server actions
  const events = [
    {
      id: "1",
      title: "Café com Pastores: Revisão de Perfis Ministeriais AO VIVO",
      description:
        "O Café com Pastores é um evento online, ao vivo e semanal que acontece às terças-feiras na comunidade. Nesta edição, vamos revisar e otimizar perfis ministeriais.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-16T19:00:00"),
      endDate: new Date("2024-01-16T20:30:00"),
      location: "Online, Palco de Líderes - Discord",
      isOnline: true,
      maxAttendees: 500,
      currentAttendees: 342,
      isEnrolled: true,
      isFeatured: true,
      tags: ["LÍDERES", "LIVE", "MINISTÉRIO"],
      instructor: "Pr. Robson",
    },
    {
      id: "2",
      title: "English Hub | General English: English Foundations",
      description:
        "Recomendado: A1 - B1. If you're just starting your English journey or want to strengthen your foundations, this is the perfect class for you.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-17T10:00:00"),
      endDate: new Date("2024-01-17T11:00:00"),
      location: "Online, Classroom do Discord",
      isOnline: true,
      maxAttendees: 100,
      currentAttendees: 78,
      isEnrolled: false,
      isFeatured: false,
      tags: ["ASSINANTES", "INICIANTE", "CARREIRA", "INGLÊS"],
      instructor: "Sarah Johnson",
    },
    {
      id: "3",
      title: "Desafio: Sua primeira célula com princípios bíblicos",
      description:
        "Construa uma célula do zero com princípios bíblicos e coloque em prática em apenas 4 aulas. Domine o discipulado na prática.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-18T19:00:00"),
      endDate: new Date("2024-01-18T20:00:00"),
      location: "Online, Discord",
      isOnline: true,
      maxAttendees: 200,
      currentAttendees: 156,
      isEnrolled: false,
      isFeatured: true,
      tags: ["CÉLULAS", "DISCIPULADO", "MINISTÉRIO"],
      instructor: "Pr. João",
    },
    {
      id: "4",
      title: "Workshop: Criando Cultos Modernos com Excelência",
      description:
        "Aprenda a criar cultos modernos e impactantes usando princípios bíblicos, tecnologia e criatividade.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-20T14:00:00"),
      endDate: new Date("2024-01-20T17:00:00"),
      location: "São Paulo, SP - Base Church",
      isOnline: false,
      maxAttendees: 50,
      currentAttendees: 32,
      isEnrolled: false,
      isFeatured: false,
      tags: ["CULTOS", "EXCELÊNCIA", "PRESENCIAL"],
      instructor: "Pr. Maria",
    },
    {
      id: "5",
      title: "Meetup: Ministério em Igreja - Como se destacar no chamado",
      description:
        "Um encontro presencial para discutir ministério em igreja, networking e oportunidades no Reino.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-25T18:00:00"),
      endDate: new Date("2024-01-25T21:00:00"),
      location: "Rio de Janeiro, RJ - Base Church",
      isOnline: false,
      maxAttendees: 80,
      currentAttendees: 45,
      isEnrolled: false,
      isFeatured: false,
      tags: ["MINISTÉRIO", "CHAMADO", "PRESENCIAL"],
      instructor: "Pr. Carlos",
    },
    {
      id: "6",
      title: "Live: Construindo uma igreja com princípios da Base",
      description:
        "Acompanhe em tempo real a construção de uma igreja completa usando princípios da Base Church.",
      image: "/api/placeholder/300/200",
      startDate: new Date("2024-01-30T20:00:00"),
      endDate: new Date("2024-01-30T22:00:00"),
      location: "Online, Twitch",
      isOnline: true,
      maxAttendees: 1000,
      currentAttendees: 567,
      isEnrolled: false,
      isFeatured: true,
      tags: ["NEXT.JS", "E-COMMERCE", "LIVE CODING"],
      instructor: "Rodrigo Gonçalves",
    },
  ];

  const getEventStatus = (event: any) => {
    const now = new Date();
    if (event.startDate > now) {
      return "upcoming";
    } else if (event.endDate > now) {
      return "ongoing";
    } else {
      return "past";
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const upcomingEvents = filteredEvents.filter(
    (event) => getEventStatus(event) === "upcoming",
  );
  const ongoingEvents = filteredEvents.filter(
    (event) => getEventStatus(event) === "ongoing",
  );
  const pastEvents = filteredEvents.filter(
    (event) => getEventStatus(event) === "past",
  );
  const enrolledEvents = filteredEvents.filter((event) => event.isEnrolled);
  const featuredEvents = filteredEvents.filter((event) => event.isFeatured);

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Eventos da Comunidade
              </h1>
              <p className="dark-text-secondary">
                Participe de eventos exclusivos e conecte-se com nossa família
                ministerial
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <Filter size={16} />
                Filtrar
              </Button>
              <div className="dark-bg-secondary flex items-center rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "dark-btn-primary"
                      : "dark-text-secondary hover:dark-text-primary"
                  }
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "dark-btn-primary"
                      : "dark-text-secondary hover:dark-text-primary"
                  }
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="dark-bg-secondary rounded-lg p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="dark-primary-subtle-bg rounded-lg p-2">
                  <Calendar className="dark-primary" size={20} />
                </div>
                <span className="dark-success text-sm font-medium">+3</span>
              </div>
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {upcomingEvents.length}
              </div>
              <div className="dark-text-tertiary text-sm">Próximos Eventos</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="dark-secondary-subtle-bg rounded-lg p-2">
                  <Zap className="dark-secondary" size={20} />
                </div>
                <span className="dark-error text-sm font-medium">LIVE</span>
              </div>
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {ongoingEvents.length}
              </div>
              <div className="dark-text-tertiary text-sm">Ao Vivo Agora</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="dark-info-bg rounded-lg p-2">
                  <CheckCircle className="dark-info" size={20} />
                </div>
                <span className="dark-success text-sm font-medium">
                  {enrolledEvents.length}
                </span>
              </div>
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                Inscritos
              </div>
              <div className="dark-text-tertiary text-sm">Seus Eventos</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="dark-warning-bg rounded-lg p-2">
                  <TrendingUp className="dark-warning" size={20} />
                </div>
                <span className="dark-primary text-sm font-medium">
                  {featuredEvents.length}
                </span>
              </div>
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                Destaque
              </div>
              <div className="dark-text-tertiary text-sm">Em Alta</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-4">
          <div className="relative">
            <Search
              className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
              size={20}
            />
            <Input
              placeholder="Buscar por eventos, instrutores ou temas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark-input h-12 pl-12 text-base"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-1">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="dark-bg-secondary grid h-12 w-full grid-cols-6">
              <TabsTrigger
                value="all"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Todos ({filteredEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                <Calendar size={14} className="mr-1" />
                Próximos ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="ongoing"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                <Zap size={14} className="mr-1" />
                Ao Vivo ({ongoingEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="enrolled"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                <CheckCircle size={14} className="mr-1" />
                Inscritos ({enrolledEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                <TrendingUp size={14} className="mr-1" />
                Destaques ({featuredEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                <X size={14} className="mr-1" />
                Passados ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <EventListCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ongoingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrolled" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const getEventStatus = (event: any) => {
    const now = new Date();
    if (event.startDate > now) {
      return "upcoming";
    } else if (event.endDate > now) {
      return "ongoing";
    } else {
      return "past";
    }
  };

  const status = getEventStatus(event);
  const attendancePercentage = Math.round(
    (event.currentAttendees / event.maxAttendees) * 100,
  );

  return (
    <div className="dark-card dark-shadow-sm group cursor-pointer overflow-hidden rounded-xl">
      <div className="relative">
        <div className="dark-bg-tertiary flex h-48 w-full items-center justify-center">
          <Calendar className="dark-text-tertiary" size={48} />
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium shadow-lg ${
              status === "ongoing"
                ? "dark-error-bg dark-error animate-pulse"
                : status === "upcoming"
                  ? "dark-success-bg dark-success"
                  : "dark-text-disabled bg-gray-600"
            }`}
          >
            {status === "ongoing"
              ? "🔴 AO VIVO"
              : status === "upcoming"
                ? "📅 EM BREVE"
                : "✅ FINALIZADO"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="dark-glass dark-primary rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {event.isOnline ? "🌐 ONLINE" : "📍 PRESENCIAL"}
          </span>
        </div>
        {event.isFeatured && (
          <div className="absolute bottom-3 left-3">
            <span className="dark-gradient-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg">
              <TrendingUp size={12} />
              Destaque
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="dark-text-primary group-hover:dark-primary line-clamp-2 font-semibold transition-colors">
            {event.title}
          </h3>
          <Button variant="ghost" size="sm" className="hover:dark-bg-tertiary">
            <ArrowRight className="dark-text-secondary" size={16} />
          </Button>
        </div>

        <p className="dark-text-secondary mb-4 line-clamp-2 text-sm">
          {event.description}
        </p>

        <div className="mb-4 space-y-2">
          <div className="dark-text-tertiary flex items-center text-sm">
            <Calendar size={14} className="mr-2" />
            <span>{formatDateTime(event.startDate)}</span>
          </div>

          <div className="dark-text-tertiary flex items-center text-sm">
            <Clock size={14} className="mr-2" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>

          <div className="dark-text-tertiary flex items-center text-sm">
            <MapPin size={14} className="mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="dark-text-tertiary flex items-center text-sm">
            <Users size={14} className="mr-2" />
            <span>{event.instructor}</span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {event.tags.map((tag: string) => (
            <span
              key={tag}
              className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="dark-text-tertiary">Inscrições</span>
            <span className="dark-primary font-semibold">
              {event.currentAttendees}/{event.maxAttendees}
            </span>
          </div>

          <div className="dark-bg-tertiary h-2 w-full rounded-full">
            <div
              className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="dark-text-tertiary text-xs">
              {attendancePercentage}% lotado
            </span>

            <Button
              asChild
              className={
                event.isEnrolled
                  ? "dark-gradient-secondary"
                  : "dark-btn-primary"
              }
              disabled={status === "past"}
            >
              <Link href={`/dashboard/eventos/${event.id}`}>
                {event.isEnrolled ? "Ver detalhes" : "Inscrever-se"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventListCard({ event }: { event: any }) {
  const getEventStatus = (event: any) => {
    const now = new Date();
    if (event.startDate > now) {
      return "upcoming";
    } else if (event.endDate > now) {
      return "ongoing";
    } else {
      return "past";
    }
  };

  const status = getEventStatus(event);
  const attendancePercentage = Math.round(
    (event.currentAttendees / event.maxAttendees) * 100,
  );

  return (
    <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={event.image}
            alt={event.title}
            className="h-20 w-20 rounded-lg object-cover"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`${
                      status === "ongoing"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                        : status === "upcoming"
                          ? "from-secondary to-secondary-1 text-secondary-foreground bg-gradient-to-r shadow-lg"
                          : "bg-dark-2 text-muted-foreground border-dark-1 border"
                    }`}
                  >
                    {status === "ongoing"
                      ? "AO VIVO"
                      : status === "upcoming"
                        ? "EM BREVE"
                        : "FINALIZADO"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-dark-2 text-muted-foreground text-xs"
                  >
                    {event.isOnline ? "ONLINE" : "PRESENCIAL"}
                  </Badge>
                </div>

                <h3 className="text-foreground mb-1 font-semibold">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  {event.description}
                </p>

                <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDateTime(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{event.instructor}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-primary mb-2 text-sm font-semibold">
                  {event.currentAttendees}/{event.maxAttendees} inscritos
                </div>
                <Button
                  asChild
                  size="sm"
                  className={
                    event.isEnrolled
                      ? "from-secondary to-secondary-1 hover:from-secondary/90 hover:to-secondary-1/90 text-secondary-foreground hover:shadow-secondary/25 bg-gradient-to-r shadow-lg"
                      : "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                  }
                  disabled={status === "past"}
                >
                  <Link href={`/dashboard/eventos/${event.id}`}>
                    {event.isEnrolled ? "Ver detalhes" : "Inscrever-se"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

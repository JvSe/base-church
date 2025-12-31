"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { usePageTitle } from "@/src/hooks";
import { getEvents } from "@/src/lib/actions";
import { formatDateTime, formatTime } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { useQuery } from "@tanstack/react-query";
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
  usePageTitle("Eventos");

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch events from database
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents({ filter: "all" }),
    select: (data) => data.events,
  });

  // Transform events data for compatibility with existing components
  const events =
    eventsData?.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      image: event.image || "/api/placeholder/300/200",
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location || "Local não definido",
      isOnline: event.isOnline,
      maxAttendees: event.maxAttendees || 100,
      currentAttendees: event.currentAttendees || 0,
      isEnrolled: false, // TODO: Implement user enrollment check
      isFeatured: event.isFeatured,
      tags: event.tags || [],
      instructor: event.instructor?.name || "Instrutor não definido",
      rating: event.rating || 0,
      price: event.price || 0,
    })) || [];

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
      event.tags.some((tag: string) =>
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

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Calendar}
          title="Carregando eventos..."
          description="Buscando eventos da comunidade"
        />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={Calendar}
          title="Erro ao carregar eventos"
          description="Não foi possível carregar os eventos. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Eventos da Comunidade"
        description="Participe de eventos exclusivos e conecte-se com nossa família ministerial"
        actions={[
          {
            label: "Filtrar",
            icon: Filter,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
        ]}
      >
        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center justify-between">
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

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
      </PageHeader>

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
      <div className="dark-shadow-sm rounded-xl p-1">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="dark-bg-secondary grid h-14 w-full grid-cols-6 gap-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <Calendar size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Todos
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({filteredEvents.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <Clock size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Próximos
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({upcomingEvents.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <Zap size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Ao Vivo
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({ongoingEvents.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="enrolled"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <CheckCircle size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Inscritos
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({enrolledEvents.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <TrendingUp size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Destaques
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({featuredEvents.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary flex items-center justify-center gap-1 px-1 text-sm transition-all"
            >
              <X size={14} className="shrink-0" />
              <span className="hidden text-xs font-medium md:inline">
                Passados
              </span>
              <span className="dark-text-tertiary text-xs font-normal">
                ({pastEvents.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredEvents.length > 0 ? (
              viewMode === "grid" ? (
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
              )
            ) : (
              <EmptyState
                icon={Calendar}
                title={
                  searchQuery
                    ? "Nenhum evento encontrado"
                    : "Nenhum evento disponível"
                }
                description={
                  searchQuery
                    ? "Tente ajustar sua busca"
                    : "Não há eventos disponíveis no momento"
                }
                action={{
                  label: searchQuery ? "Limpar Busca" : "Ver Eventos",
                  onClick: searchQuery ? () => setSearchQuery("") : () => {},
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="Nenhum evento próximo"
                description="Não há eventos programados para o futuro próximo"
                action={{
                  label: "Ver Todos os Eventos",
                  onClick: () => {},
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-6">
            {ongoingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ongoingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Zap}
                title="Nenhum evento ao vivo"
                description="Não há eventos acontecendo no momento"
                action={{
                  label: "Ver Próximos Eventos",
                  onClick: () => {},
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            {enrolledEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle}
                title="Nenhum evento inscrito"
                description="Você ainda não se inscreveu em nenhum evento"
                action={{
                  label: "Explorar Eventos",
                  onClick: () => {},
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            {featuredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="Nenhum evento em destaque"
                description="Não há eventos em destaque no momento"
                action={{
                  label: "Ver Todos os Eventos",
                  onClick: () => {},
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={X}
                title="Nenhum evento passado"
                description="Não há eventos passados registrados"
                action={{
                  label: "Ver Próximos Eventos",
                  onClick: () => {},
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
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
                  : "dark-bg-tertiary dark-text-disabled"
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
              <Link href={`/events/${event.id}`}>
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
    <div className="dark-card dark-shadow-sm group cursor-pointer overflow-hidden rounded-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="dark-bg-tertiary flex h-20 w-20 items-center justify-center rounded-lg">
              <Calendar className="dark-text-tertiary" size={24} />
            </div>
            {event.isFeatured && (
              <div className="absolute -top-2 -right-2">
                <div className="dark-gradient-primary flex h-6 w-6 items-center justify-center rounded-full">
                  <TrendingUp className="dark-text-primary" size={12} />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="dark-text-primary group-hover:dark-primary line-clamp-1 font-semibold transition-colors">
                    {event.title}
                  </h3>
                  <div className="ml-2 flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        status === "ongoing"
                          ? "dark-error-bg dark-error animate-pulse"
                          : status === "upcoming"
                            ? "dark-success-bg dark-success"
                            : "dark-text-disabled dark-bg-tertiary"
                      }`}
                    >
                      {status === "ongoing"
                        ? "AO VIVO"
                        : status === "upcoming"
                          ? "EM BREVE"
                          : "FINALIZADO"}
                    </span>
                  </div>
                </div>

                <p className="dark-text-secondary mb-3 line-clamp-1 text-sm">
                  {event.description}
                </p>

                <div className="dark-text-tertiary flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDateTime(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{event.instructor}</span>
                  </div>
                </div>
              </div>

              <div className="ml-6 text-right">
                <div className="dark-text-primary mb-3 text-sm font-medium">
                  {event.currentAttendees}/{event.maxAttendees}
                </div>
                <div className="dark-text-tertiary mb-3 text-xs">
                  {Math.round(
                    (event.currentAttendees / event.maxAttendees) * 100,
                  )}
                  % lotado
                </div>
                <Button
                  asChild
                  size="sm"
                  className={
                    event.isEnrolled
                      ? "dark-gradient-secondary"
                      : "dark-btn-primary"
                  }
                  disabled={status === "past"}
                >
                  <Link href={`/events/${event.id}`}>
                    {event.isEnrolled ? "Ver detalhes" : "Inscrever-se"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { StatsCard } from "@/src/components/common/data-display/stats-card";
import { getEvents } from "@/src/lib/actions/event";
import type { EventStatus, EventType } from "@/src/lib/helpers/event.helper";
import { getEventStatsIconConfig } from "@/src/lib/helpers/event.helper";
import { Button } from "@base-church/ui/components/button";
import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EventsListClient } from "./components/events-list-client";

export const metadata: Metadata = {
  title: "Gerenciar Eventos",
};

type DashboardEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: EventType;
  status: EventStatus;
  participantsRegistered: number;
  participantsAttended: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  capacity?: number;
  tags: string[];
};

export default async function EventsPage() {
  // Buscar eventos do banco
  const result = await getEvents({ filter: "all" });

  // Early return para erro
  if (!result.success || !result.events) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-7xl space-y-6 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Erro ao carregar eventos
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar os eventos. Tente novamente.
            </p>
            <Link href="/dashboard/events">
              <Button className="dark-btn-primary">Tentar Novamente</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Transformar dados para o formato esperado
  const events: DashboardEvent[] = result.events.map((event) => {
    // Determinar tipo de evento
    let eventType: EventType = "presential";
    if (event.isOnline) {
      eventType = "online";
    }

    // Determinar status
    let eventStatus: EventStatus = "draft";
    if (event.isPublished) {
      eventStatus = "published";
    }

    // Contar participantes
    const participantsRegistered = event._count?.enrollments || 0;
    const participantsAttended =
      (event as any).enrollments?.filter((e: any) => e.attended).length || 0;

    return {
      id: event.id,
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      type: eventType,
      status: eventStatus,
      participantsRegistered,
      participantsAttended,
      startDate: new Date(event.startDate),
      endDate: event.endDate
        ? new Date(event.endDate)
        : new Date(event.startDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      capacity: event.maxAttendees || undefined,
      tags: event.tags || [],
    };
  });

  // Calcular estatísticas
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + e.participantsRegistered,
    0,
  );
  const totalAttended = events.reduce(
    (sum, e) => sum + e.participantsAttended,
    0,
  );
  const upcomingEvents = events.filter(
    (e) => new Date(e.startDate) > new Date() && e.status === "published",
  ).length;

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Gestão de Eventos 📅
              </h1>
              <p className="dark-text-secondary">
                Gerencie seus eventos e acompanhe a participação
              </p>
            </div>
            <Link href="/dashboard/events/create">
              <Button variant="success">
                <Plus className="mr-2 h-4 w-4" />
                Criar Evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total de Eventos"
            value={totalEvents}
            iconConfig={getEventStatsIconConfig("events")}
            trend={{
              value: `${totalEvents} eventos criados`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Eventos Publicados"
            value={publishedEvents}
            iconConfig={getEventStatsIconConfig("published")}
            trend={{
              value: `${totalEvents > 0 ? Math.round((publishedEvents / totalEvents) * 100) : 0}% publicados`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Total de Inscrições"
            value={totalParticipants}
            iconConfig={getEventStatsIconConfig("participants")}
            trend={{
              value: `${totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0} por evento`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Próximos Eventos"
            value={upcomingEvents}
            iconConfig={getEventStatsIconConfig("upcoming")}
            trend={{
              value: `${totalParticipants > 0 ? Math.round((totalAttended / totalParticipants) * 100) : 0}% presença`,
              isPositive: true,
            }}
          />
        </div>

        {/* Client-side interactive components */}
        <EventsListClient events={events} />
      </div>
    </div>
  );
}

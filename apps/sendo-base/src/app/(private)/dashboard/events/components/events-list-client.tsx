"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { formatDate, formatDateTime } from "@/src/lib/formatters";
import {
  getEventStatusColor,
  getEventStatusIcon,
  getEventStatusText,
  getEventTypeInfo,
} from "@/src/lib/helpers/event.helper";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EventActions } from "./event-actions";
import { EventsSearch } from "./events-search";

type EventType = "online" | "presential" | "hybrid";
type EventStatus = "draft" | "published" | "archived" | "completed";

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

type EventsListClientProps = {
  events: DashboardEvent[];
};

export function EventsListClient({ events }: EventsListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [events, searchTerm]);

  return (
    <>
      {/* Search */}
      <EventsSearch value={searchTerm} onChange={setSearchTerm} />

      {/* Events List */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
          <Calendar className="dark-primary" size={24} />
          Lista de Eventos ({filteredEvents.length})
        </h2>

        <div className="flex flex-col gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const typeInfo = getEventTypeInfo(event.type);
              const TypeIcon = typeInfo.icon;

              return (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                >
                  <div
                    className={`dark-card dark-shadow-sm rounded-xl p-4 ${
                      event.status === "draft"
                        ? "border-l-4 border-l-yellow-400"
                        : event.status === "published"
                          ? "border-l-4 border-l-green-400"
                          : event.status === "completed"
                            ? "border-l-4 border-l-blue-400"
                            : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="dark-primary-subtle-bg flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        <Calendar className="dark-primary" size={20} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="dark-text-primary font-semibold">
                              {event.title}
                            </h3>
                            <p className="dark-text-secondary mt-1 text-sm">
                              {event.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {event.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                              {event.tags.length > 3 && (
                                <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">
                                  +{event.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getEventStatusColor(event.status)}`}
                            >
                              {(() => {
                                const StatusIcon = getEventStatusIcon(
                                  event.status,
                                );
                                return <StatusIcon size={12} />;
                              })()}
                              {getEventStatusText(event.status)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}
                            >
                              <TypeIcon size={12} />
                              {typeInfo.text}
                            </span>
                            <EventActions
                              eventId={event.id}
                              eventTitle={event.title}
                              onDelete={() => router.refresh()}
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                          <div className="space-y-1">
                            <div className="dark-text-secondary text-sm">
                              <Calendar className="mr-1 inline h-3 w-3" />
                              Início: {formatDateTime(event.startDate)}
                            </div>
                            <div className="dark-text-secondary text-sm">
                              <Clock className="mr-1 inline h-3 w-3" />
                              Fim: {formatDateTime(event.endDate)}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="dark-text-secondary text-sm">
                              <MapPin className="mr-1 inline h-3 w-3" />
                              Local: {event.location}
                            </div>
                            <div className="dark-text-secondary text-sm">
                              Capacidade:{" "}
                              {event.capacity
                                ? `${event.participantsRegistered}/${event.capacity}`
                                : "Ilimitada"}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="dark-text-secondary text-sm">
                              <Users className="mr-1 inline h-3 w-3" />
                              Inscritos: {event.participantsRegistered}
                            </div>
                            <div className="dark-text-secondary text-sm">
                              Presentes: {event.participantsAttended}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="dark-text-secondary text-sm">
                              Taxa de presença:{" "}
                              {event.participantsRegistered > 0
                                ? Math.round(
                                    (event.participantsAttended /
                                      event.participantsRegistered) *
                                      100,
                                  )
                                : 0}
                              %
                            </div>
                            <div className="dark-text-secondary text-sm">
                              Criado em {formatDate(event.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <EmptyState
              icon={Calendar}
              title={
                searchTerm
                  ? "Nenhum evento encontrado"
                  : "Nenhum evento criado"
              }
              description={
                searchTerm
                  ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                  : "Comece criando seu primeiro evento para compartilhar conhecimento"
              }
              action={{
                label: searchTerm ? "Limpar Busca" : "Criar Primeiro Evento",
                onClick: () => {
                  if (searchTerm) {
                    setSearchTerm("");
                  } else {
                    router.push("/dashboard/events/create");
                  }
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}


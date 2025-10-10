"use client";

import { formatTime } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  Play,
  Share,
  Star,
  Target,
  User,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage() {
  const eventId = 1;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from server actions
  const event = {
    id: eventId,
    title: "Café com Pastores: Revisão de Perfis Ministeriais AO VIVO",
    description:
      "O Café com Pastores é um evento online, ao vivo e semanal que acontece às terças-feiras na comunidade. Nesta edição, vamos revisar e otimizar perfis ministeriais com foco em liderança eficaz e crescimento espiritual.",
    longDescription:
      "Este evento especial foi desenvolvido para pastores, líderes ministeriais e pessoas em formação que desejam aprimorar seus perfis de liderança. Durante o encontro, abordaremos temas fundamentais como estruturação ministerial, desenvolvimento de equipes, comunicação eficaz e crescimento sustentável da igreja. O formato ao vivo permite interação direta com os participantes através de perguntas e respostas.",
    image: null,
    startDate: new Date("2024-02-20T19:00:00"),
    endDate: new Date("2024-02-20T21:00:00"),
    location: "Online, Palco de Líderes - Discord",
    isOnline: true,
    maxAttendees: 500,
    currentAttendees: 342,
    price: 0, // Free
    tags: ["LÍDERES", "LIVE", "MINISTÉRIO", "PERFIL MINISTERIAL"],
    isFeatured: true,
    isLive: false,
    category: "Workshop",
    language: "Português",
    requirements: [
      "Estar em posição de liderança ministerial ou em formação",
      "Ter perfil no Discord para participar da sala",
      "Disponibilidade completa durante o horário do evento",
      "Material para anotações (recomendado)",
    ],
    whatYouWillLearn: [
      "Como estruturar um perfil ministerial sólido e atrativo",
      "Técnicas de comunicação para líderes eficazes",
      "Estratégias de crescimento e desenvolvimento de equipes",
      "Ferramentas práticas para gestão ministerial",
      "Networking com outros líderes da comunidade",
    ],
    speakers: [
      {
        name: "Pr. Robson Silva",
        role: "Pastor Principal - Base Church",
        experience: "15 anos de ministério",
        avatar: null,
        bio: "Pastor principal da Base Church há mais de 15 anos, especialista em desenvolvimento de liderança ministerial e crescimento de igrejas.",
        social: {
          instagram: "@pr.robsonsilva",
          linkedin: "robson-silva-pastor",
        },
      },
      {
        name: "Pra. Ana Costa",
        role: "Coordenadora de Liderança",
        experience: "8 anos de ministério",
        avatar: null,
        bio: "Especialista em desenvolvimento de líderes e mentoria ministerial, com foco em crescimento pessoal e espiritual.",
        social: {
          instagram: "@pra.anacosta",
        },
      },
    ],
    agenda: [
      {
        time: "19:00",
        duration: 15,
        title: "Abertura e Boas-vindas",
        description: "Apresentação dos palestrantes e visão geral do evento",
        speaker: "Pr. Robson Silva",
      },
      {
        time: "19:15",
        duration: 30,
        title: "Fundamentos do Perfil Ministerial",
        description: "Base bíblica e princípios essenciais para liderança",
        speaker: "Pr. Robson Silva",
      },
      {
        time: "19:45",
        duration: 25,
        title: "Desenvolvimento de Equipes Eficazes",
        description: "Como formar, treinar e manter equipes ministeriais",
        speaker: "Pra. Ana Costa",
      },
      {
        time: "20:10",
        duration: 15,
        title: "Intervalo e Networking",
        description: "Momento para interação entre participantes",
        speaker: null,
      },
      {
        time: "20:25",
        duration: 25,
        title: "Revisão de Perfis ao Vivo",
        description: "Análise prática de perfis ministeriais dos participantes",
        speaker: "Pr. Robson Silva & Pra. Ana Costa",
      },
      {
        time: "20:50",
        duration: 10,
        title: "Q&A e Encerramento",
        description: "Perguntas e respostas com os participantes",
        speaker: "Todos os palestrantes",
      },
    ],
    rating: 4.9,
    reviewsCount: 89,
    certificate: true,
    recordingAvailable: true,
    materials: [
      "Template de Perfil Ministerial (PDF)",
      "Checklist de Liderança Eficaz",
      "Guia de Desenvolvimento de Equipes",
      "Links de Recursos Complementares",
    ],
  };

  const reviews = [
    {
      id: "1",
      author: "Pastor João Santos",
      role: "Pastor Auxiliar",
      rating: 5,
      comment:
        "Evento transformador! As dicas práticas me ajudaram muito a reestruturar minha abordagem ministerial. Recomendo fortemente!",
      date: new Date("2024-01-15"),
      avatar: null,
    },
    {
      id: "2",
      author: "Líder Maria Oliveira",
      role: "Coordenadora de Células",
      rating: 5,
      comment:
        "Pr. Robson e Pra. Ana têm uma didática excepcional. O formato ao vivo torna tudo mais dinâmico e prático.",
      date: new Date("2024-01-10"),
      avatar: null,
    },
    {
      id: "3",
      author: "Carlos Ferreira",
      role: "Líder em Formação",
      rating: 4,
      comment:
        "Muito bom para quem está começando no ministério. A revisão de perfis ao vivo foi o ponto alto!",
      date: new Date("2024-01-08"),
      avatar: null,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getEventStatus = () => {
    const now = new Date();
    if (event.startDate > now) {
      return "upcoming";
    } else if (event.endDate > now) {
      return "ongoing";
    } else {
      return "past";
    }
  };

  const status = getEventStatus();
  const attendancePercentage = Math.round(
    (event.currentAttendees / event.maxAttendees) * 100,
  );

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="opacity-3 fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Event Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-sm font-medium">
                    {event.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
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
                  <span className="dark-info-bg dark-info rounded-full px-3 py-1 text-sm font-medium">
                    {event.isOnline ? "🌐 Online" : "📍 Presencial"}
                  </span>
                  {event.price === 0 && (
                    <span className="dark-success-bg dark-success rounded-full px-3 py-1 text-sm font-medium">
                      Gratuito
                    </span>
                  )}
                  {event.certificate && (
                    <span className="dark-warning-bg dark-warning rounded-full px-3 py-1 text-sm font-medium">
                      📜 Certificado
                    </span>
                  )}
                </div>
                <h1 className="dark-text-primary mb-3 text-3xl font-bold">
                  {event.title}
                </h1>
                <p className="dark-text-secondary text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mb-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="dark-primary-subtle-bg rounded-full p-2">
                    <Calendar className="dark-primary" size={16} />
                  </div>
                  <div>
                    <div className="dark-text-primary text-sm font-medium">
                      {formatDate(event.startDate)}
                    </div>
                    <div className="dark-text-tertiary text-xs">
                      {formatTime(event.startDate)} -{" "}
                      {formatTime(event.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="dark-warning fill-current" size={16} />
                  <span className="dark-text-primary font-semibold">
                    {event.rating}
                  </span>
                  <span className="dark-text-tertiary text-sm">
                    ({event.reviewsCount} avaliações)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary text-sm">
                    {event.currentAttendees} inscritos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    {formatDuration(
                      (event.endDate.getTime() - event.startDate.getTime()) /
                        60000,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">{event.language}</span>
                </div>
                {event.recordingAvailable && (
                  <div className="flex items-center gap-1">
                    <Video className="dark-text-tertiary" size={16} />
                    <span className="dark-text-tertiary">
                      Gravação disponível
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Preview */}
            <div className="dark-card dark-shadow-sm rounded-xl p-6">
              <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
                {status === "ongoing" ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse rounded-full bg-red-500 p-2">
                      <Zap className="text-white" size={24} />
                    </div>
                    <span className="dark-text-primary font-semibold">
                      AO VIVO
                    </span>
                  </div>
                ) : (
                  <Calendar className="dark-text-tertiary" size={48} />
                )}
              </div>

              {status !== "past" ? (
                <div className="space-y-4">
                  <div className="mb-4 text-center">
                    <div className="dark-text-primary mb-1 text-2xl font-bold">
                      {event.currentAttendees}
                    </div>
                    <div className="dark-text-tertiary mb-2 text-sm">
                      Inscritos de {event.maxAttendees}
                    </div>
                    <div className="dark-bg-tertiary h-2 w-full rounded-full">
                      <div
                        className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${attendancePercentage}%` }}
                      />
                    </div>
                    <div className="dark-text-tertiary mt-1 text-xs">
                      {attendancePercentage}% lotado
                    </div>
                  </div>

                  {isEnrolled ? (
                    <>
                      <Button
                        asChild
                        className="dark-gradient-secondary w-full"
                      >
                        <Link href={status === "ongoing" ? "#" : "#"}>
                          {status === "ongoing" ? (
                            <>
                              <Zap className="mr-2" size={16} />
                              Entrar ao Vivo
                            </>
                          ) : (
                            <>
                              <Calendar className="mr-2" size={16} />
                              Evento Confirmado
                            </>
                          )}
                        </Link>
                      </Button>

                      <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                        <Download className="mr-2" size={16} />
                        Baixar Materiais
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="dark-btn-primary w-full"
                        onClick={() => setIsEnrolled(true)}
                        disabled={attendancePercentage >= 100}
                      >
                        {attendancePercentage >= 100 ? (
                          <>
                            <X className="mr-2" size={16} />
                            Lotado
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2" size={16} />
                            Inscrever-se Gratuitamente
                          </>
                        )}
                      </Button>

                      <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                        <Heart className="mr-2" size={16} />
                        Adicionar aos Favoritos
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="dark-bg-secondary rounded-lg p-4 text-center">
                    <CheckCircle
                      className="dark-success mx-auto mb-2"
                      size={32}
                    />
                    <div className="dark-text-primary font-semibold">
                      Evento Finalizado
                    </div>
                    <div className="dark-text-tertiary text-sm">
                      Obrigado pela participação!
                    </div>
                  </div>

                  {event.recordingAvailable && (
                    <Button asChild className="dark-btn-primary w-full">
                      <Link href="#">
                        <Play className="mr-2" size={16} />
                        Assistir Gravação
                      </Link>
                    </Button>
                  )}

                  <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                    <Download className="mr-2" size={16} />
                    Baixar Materiais
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <Share className="dark-text-secondary" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:dark-bg-tertiary"
                >
                  <MessageCircle className="dark-text-secondary" size={16} />
                </Button>
                {event.isOnline && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:dark-bg-tertiary"
                  >
                    <ExternalLink className="dark-text-secondary" size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Navigation */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-1">
          <div className="flex items-center space-x-1">
            {[
              { id: "overview", label: "Visão Geral" },
              { id: "agenda", label: "Programação" },
              { id: "speakers", label: "Palestrantes" },
              { id: "reviews", label: "Avaliações" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "dark-btn-primary"
                    : "dark-text-secondary hover:dark-text-primary"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                  <h2 className="dark-text-primary mb-4 text-xl font-bold">
                    Sobre este evento
                  </h2>
                  <p className="dark-text-secondary mb-6 leading-relaxed">
                    {event.longDescription}
                  </p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="dark-text-primary mb-3 font-semibold">
                        O que você aprenderá
                      </h3>
                      <ul className="space-y-2">
                        {event.whatYouWillLearn.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle
                              className="dark-success mt-0.5 flex-shrink-0"
                              size={16}
                            />
                            <span className="dark-text-secondary text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="dark-text-primary mb-3 font-semibold">
                        Pré-requisitos
                      </h3>
                      <ul className="space-y-2">
                        {event.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target
                              className="dark-primary mt-0.5 flex-shrink-0"
                              size={16}
                            />
                            <span className="dark-text-secondary text-sm">
                              {requirement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "agenda" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Programação do Evento
                </h2>

                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="dark-card rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="dark-primary-subtle-bg rounded-lg p-3 text-center">
                          <div className="dark-primary text-sm font-bold">
                            {item.time}
                          </div>
                          <div className="dark-text-tertiary text-xs">
                            {item.duration}min
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="dark-text-primary mb-1 font-semibold">
                            {item.title}
                          </h3>
                          <p className="dark-text-secondary mb-2 text-sm">
                            {item.description}
                          </p>
                          {item.speaker && (
                            <div className="flex items-center gap-2">
                              <User className="dark-text-tertiary" size={14} />
                              <span className="dark-text-tertiary text-sm">
                                {item.speaker}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "speakers" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Palestrantes
                </h2>

                <div className="space-y-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="dark-card rounded-xl p-6">
                      <div className="flex items-start gap-6">
                        <div className="dark-primary-subtle-bg rounded-full p-4">
                          <User className="dark-primary" size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="dark-text-primary mb-1 text-lg font-semibold">
                            {speaker.name}
                          </h3>
                          <p className="dark-text-secondary mb-2">
                            {speaker.role === "ADMIN"
                              ? "Administrador"
                              : "Membro"}
                          </p>
                          <p className="dark-text-tertiary mb-4 text-sm">
                            {speaker.experience}
                          </p>
                          <p className="dark-text-secondary mb-4 leading-relaxed">
                            {speaker.bio}
                          </p>
                          <div className="flex items-center gap-3">
                            {speaker.social.instagram && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:dark-bg-tertiary"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Instagram
                              </Button>
                            )}
                            {speaker.social.linkedin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:dark-bg-tertiary"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                LinkedIn
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="dark-text-primary text-xl font-bold">
                    Avaliações dos Participantes
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="dark-warning fill-current" size={20} />
                    <span className="dark-text-primary text-lg font-bold">
                      {event.rating}
                    </span>
                    <span className="dark-text-tertiary">
                      ({event.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="dark-card rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="dark-primary-subtle-bg rounded-full p-2">
                          <User className="dark-primary" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <div className="dark-text-primary text-sm font-medium">
                                {review.author}
                              </div>
                              <div className="dark-text-tertiary text-xs">
                                {review.role === "ADMIN"
                                  ? "Administrador"
                                  : "Membro"}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`${
                                    i < review.rating
                                      ? "dark-warning fill-current"
                                      : "dark-text-tertiary"
                                  }`}
                                  size={12}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="dark-text-secondary mb-2 text-sm">
                            {review.comment}
                          </p>
                          <p className="dark-text-tertiary text-xs">
                            {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Tags */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Event Info */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Informações
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">Duração</span>
                  <span className="dark-primary font-semibold">
                    {formatDuration(
                      (event.endDate.getTime() - event.startDate.getTime()) /
                        60000,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Vagas disponíveis
                  </span>
                  <span className="dark-primary font-semibold">
                    {event.maxAttendees - event.currentAttendees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Participantes
                  </span>
                  <span className="dark-primary font-semibold">
                    {event.currentAttendees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Nota média
                  </span>
                  <span className="dark-primary font-semibold">
                    {event.rating}/5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">Idioma</span>
                  <span className="dark-primary font-semibold">
                    {event.language}
                  </span>
                </div>
              </div>
            </div>

            {/* Materials */}
            {event.materials && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h3 className="dark-text-primary mb-4 font-semibold">
                  Materiais Inclusos
                </h3>
                <div className="space-y-2">
                  {event.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BookOpen className="dark-text-tertiary" size={14} />
                      <span className="dark-text-secondary text-sm">
                        {material}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Events */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Eventos Relacionados
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Workshop: Liderança Ministerial", date: "25 Jan" },
                  { title: "Live: Cultura da Igreja", date: "30 Jan" },
                  { title: "Meetup: Discipulado Prático", date: "05 Fev" },
                ].map((related, index) => (
                  <div key={index} className="dark-card rounded-lg p-3">
                    <h4 className="dark-text-primary mb-1 text-sm font-medium">
                      {related.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Calendar className="dark-text-tertiary" size={12} />
                      <span className="dark-text-tertiary text-xs">
                        {related.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

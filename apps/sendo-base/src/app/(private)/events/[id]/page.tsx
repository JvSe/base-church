"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { useAuth } from "@/src/hooks";
import {
  checkUserEventEnrollment,
  getEventById,
  getEventCertificateByCpf,
} from "@/src/lib/actions";
import { formatDate, formatTime } from "@/src/lib/formatters";
import { getEventTypeInfo } from "@/src/lib/helpers/event.helper";
import { Button } from "@base-church/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Award,
  Calendar,
  Clock,
  Download,
  Loader2,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage(props: EventPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const { id: eventId } = use(props.params);

  // Buscar dados do evento
  const {
    data: eventDataResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-event", eventId],
    queryFn: () => getEventById(eventId),
    select: (data) => data.event,
  });

  const eventData = eventDataResult;

  // Verificar se usuário está inscrito (apenas se estiver autenticado)
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["event-enrollment", eventId, user?.id],
    queryFn: () =>
      user?.id
        ? checkUserEventEnrollment(eventId, user.id)
        : Promise.resolve({ success: true, isEnrolled: false }),
    enabled: !!user?.id,
  });

  // Buscar certificado do usuário (se estiver autenticado e tiver CPF)
  const { data: certificateData, isLoading: certificateLoading } = useQuery({
    queryKey: ["user-event-certificate", eventId, user?.cpf],
    queryFn: () =>
      user?.cpf
        ? getEventCertificateByCpf(eventId, user.cpf)
        : Promise.resolve({ success: false, error: "CPF não fornecido" }),
    enabled: !!user?.cpf && !!eventData,
    select: (data) => data.certificate,
  });
  const isEnrolled = enrollmentData?.isEnrolled || false;
  const userCertificate = certificateData;

  // Verificar se evento tem certificado disponível
  const hasCertificate = (eventData as any)?.certificateTemplate?.isActive;

  // Preparar URL do PDF para miniatura
  const [pdfThumbnailUrl, setPdfThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userCertificate?.certificateBase64) {
      const base64Data = userCertificate.certificateBase64.includes(",")
        ? userCertificate.certificateBase64.split(",")[1]
        : userCertificate.certificateBase64;

      if (base64Data) {
        try {
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfThumbnailUrl(url);

          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.error("Erro ao criar URL do PDF:", error);
        }
      }
    } else {
      setPdfThumbnailUrl(null);
    }
  }, [userCertificate]);

  const handleDownloadCertificate = () => {
    if (!userCertificate?.certificateBase64) {
      return;
    }

    try {
      const base64Data = userCertificate.certificateBase64.includes(",")
        ? userCertificate.certificateBase64.split(",")[1]
        : userCertificate.certificateBase64;

      if (!base64Data) return;

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificado-${eventData?.title || "evento"}-${userCertificate.verificationCode || "certificado"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
    }
  };

  // Determinar tipo de evento
  let eventType: "online" | "presential" | "hybrid" = "presential";
  if (eventData?.isOnline) {
    eventType = "online";
  }
  const typeInfo = eventType ? getEventTypeInfo(eventType) : null;
  const TypeIcon = typeInfo?.icon;

  // Calcular duração
  const duration =
    eventData?.endDate && eventData?.startDate
      ? Math.round(
          (new Date(eventData.endDate).getTime() -
            new Date(eventData.startDate).getTime()) /
            60000,
        )
      : 0;

  if (isLoading || enrollmentLoading || certificateLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <LoadingState icon={Loader2} />
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <ErrorState
          icon={AlertCircle}
          title="Evento não encontrado"
          description="O evento que você está procurando não existe ou não está mais disponível."
        />
      </div>
    );
  }

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-8 p-6">
        {/* Event Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          {/* Banner do Evento */}
          {eventData.image && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <Image
                src={eventData.image}
                alt={eventData.title}
                width={1200}
                height={400}
                className="h-64 w-full object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {typeInfo && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${typeInfo.color}`}
                >
                  {TypeIcon && <TypeIcon size={14} />}
                  {typeInfo.text}
                </span>
              )}
              {hasCertificate && (
                <span className="dark-warning-bg dark-warning rounded-full px-3 py-1 text-sm font-medium">
                  <Award className="mr-1 inline" size={14} />
                  Certificado Disponível
                </span>
              )}
            </div>
            <h1 className="dark-text-primary mb-3 text-3xl font-bold">
              {eventData.title}
            </h1>
            <p className="dark-text-secondary text-lg leading-relaxed">
              {eventData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="dark-primary-subtle-bg rounded-lg p-2">
                <Calendar className="dark-primary" size={20} />
              </div>
              <div>
                <div className="dark-text-primary text-sm font-medium">
                  {formatDate(new Date(eventData.startDate))}
                </div>
                <div className="dark-text-tertiary text-xs">
                  {formatTime(new Date(eventData.startDate))} -{" "}
                  {eventData.endDate
                    ? formatTime(new Date(eventData.endDate))
                    : "Sem horário de término"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="dark-primary-subtle-bg rounded-lg p-2">
                <Clock className="dark-primary" size={20} />
              </div>
              <div>
                <div className="dark-text-primary text-sm font-medium">
                  Duração
                </div>
                <div className="dark-text-tertiary text-xs">
                  {duration > 0
                    ? `${Math.floor(duration / 60)}h ${duration % 60}min`
                    : "Não especificada"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="dark-primary-subtle-bg rounded-lg p-2">
                <MapPin className="dark-primary" size={20} />
              </div>
              <div>
                <div className="dark-text-primary text-sm font-medium">
                  Local
                </div>
                <div className="dark-text-tertiary text-xs">
                  {eventData.location || "Não especificado"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        {hasCertificate && (
          <div className="dark-glass dark-shadow-md rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="dark-warning-bg rounded-lg p-3">
                <Award className="dark-warning" size={24} />
              </div>
              <div>
                <h2 className="dark-text-primary text-2xl font-bold">
                  Certificado Disponível
                </h2>
                <p className="dark-text-secondary text-sm">
                  {userCertificate
                    ? "Seu certificado já foi gerado. Visualize ou baixe abaixo."
                    : isEnrolled
                      ? "Você está inscrito neste evento. Acesse seu certificado."
                      : "Solicite seu certificado de participação preenchendo seus dados."}
                </p>
              </div>
            </div>

            {/* Se o usuário já tem certificado, mostrar certificado completo */}
            {userCertificate && pdfThumbnailUrl ? (
              <div className="space-y-4">
                <div className="dark-card dark-shadow-sm overflow-hidden rounded-xl border">
                  <div className="relative w-full">
                    <iframe
                      src={`${pdfThumbnailUrl}#page=1`}
                      title="Certificado"
                      className="h-[800px] w-full"
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadCertificate}
                    variant="outline"
                    className="dark-glass dark-border hover:dark-border-hover flex-1"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push(`/events/${eventId}/certificate`)}
                className="dark-btn-primary w-full"
                size="lg"
              >
                <Award className="mr-2 h-4 w-4" />
                {isEnrolled ? "Acessar Certificado" : "Solicitar Certificado"}
              </Button>
            )}
          </div>
        )}

        {!hasCertificate && (
          <div className="dark-glass dark-shadow-md rounded-2xl p-8">
            <EmptyState
              icon={Award}
              title="Certificado não disponível"
              description="Este evento não possui certificado disponível no momento."
            />
          </div>
        )}
      </div>
    </div>
  );
}

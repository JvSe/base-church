"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { ImageViewer } from "@/src/components/image-viewer";
import {
  createEventCertificateTemplateWithStorage,
  deleteEvent,
  getEventById,
  updateEvent,
  updateEventCertificateTemplateWithStorage,
  updateEventStatus,
} from "@/src/lib/actions";
import { dayjs } from "@/src/lib/dayjs";
import { formatTime } from "@/src/lib/formatters";
import type { CertificateTemplateFormData } from "@/src/lib/forms/course-schemas";
import { certificateTemplateSchema } from "@/src/lib/forms/course-schemas";
import { eventSchema, type EventFormData } from "@/src/lib/forms/event-schemas";
import { Button } from "@base-church/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Calendar, CheckCircle, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EventCertificateForm,
  EventHeader,
  EventInfoForm,
} from "../components";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEventPage(props: EditEventPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [openEventInfo, setOpenEventInfo] = useState<string[]>([]);
  const [isEditingEventInfo, setIsEditingEventInfo] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { id: eventId } = use(props.params);

  // Buscar dados do evento
  const {
    data: eventDataResult,
    isLoading: eventLoading,
    error: eventError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
    select: (data) => data.event,
  });

  const eventData = eventDataResult;

  // Formulário do evento
  const eventForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "presential",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      capacity: null,
      tags: "",
    },
  });

  // Formulário do template de certificado
  const certificateTemplateForm = useForm<CertificateTemplateFormData>({
    resolver: zodResolver(certificateTemplateSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Watch event title to auto-generate certificate title
  const eventTitle = eventForm.watch("title");
  const eventDescription = eventForm.watch("description");

  // Atualizar formulário quando os dados chegarem
  useEffect(() => {
    if (eventData) {
      const startDate = new Date(eventData.startDate);
      const endDate = eventData.endDate
        ? new Date(eventData.endDate)
        : startDate;

      // Determinar tipo de evento
      let eventType: "online" | "presential" | "hybrid" = "presential";
      if (eventData.isOnline) {
        eventType = "online";
      }

      eventForm.reset({
        title: eventData.title,
        description: eventData.description || "",
        location: eventData.location || "",
        type: eventType,
        startDate: dayjs(startDate).format("YYYY-MM-DD"),
        startTime: formatTime(startDate),
        endDate: dayjs(endDate).format("YYYY-MM-DD"),
        endTime: formatTime(endDate),
        capacity: eventData.maxAttendees || null,
        tags: eventData.tags?.join(", ") || "",
      });
    }
  }, [eventData, eventForm]);

  // Atualizar template de certificado quando os dados chegarem
  useEffect(() => {
    if (eventData) {
      const certTemplate = (eventData as any).certificateTemplate;
      if (certTemplate) {
        certificateTemplateForm.setValue("title", certTemplate.title);
        certificateTemplateForm.setValue(
          "description",
          certTemplate.description || "",
        );
      } else {
        certificateTemplateForm.setValue(
          "title",
          `Certificado - ${eventData.title}`,
        );
        certificateTemplateForm.setValue(
          "description",
          eventData.description || "",
        );
      }
    }
  }, [eventData, certificateTemplateForm]);

  // Atualizar evento
  const handleUpdateEvent = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const result = await updateEvent(eventId, data);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar evento");
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar evento
  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEvent(eventId);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/events");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir evento");
    } finally {
      setIsDeleting(false);
    }
  };

  // Alternar status do evento (publicar/despublicar)
  const handleFinishEvent = async () => {
    if (!eventId || !eventData) return;

    const isCurrentlyPublished = eventData.isPublished;
    const newStatus = isCurrentlyPublished ? "draft" : "published";
    const actionText = isCurrentlyPublished ? "despublicar" : "publicar";

    // Confirmar despublicação
    if (isCurrentlyPublished) {
      if (
        !confirm(
          "Tem certeza que deseja voltar este evento para rascunho? Ele não estará mais visível para os participantes.",
        )
      ) {
        return;
      }
    }

    setIsLoading(true);
    try {
      const result = await updateEventStatus(eventId, newStatus);
      if (result.success) {
        toast.success(
          isCurrentlyPublished
            ? "Evento voltou para rascunho!"
            : "Evento publicado com sucesso!",
        );
        queryClient.invalidateQueries({
          queryKey: ["event", eventId],
        });
      } else {
        toast.error(result.error || `Erro ao ${actionText} evento`);
      }
    } catch (error) {
      toast.error(`Erro ao ${actionText} evento`);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar ou atualizar template de certificado
  const handleCreateCertificateTemplate = async (
    data: CertificateTemplateFormData,
  ) => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      if (!certificateFile) {
        toast.error("Por favor, selecione um arquivo de template");
        return;
      }

      const result = await createEventCertificateTemplateWithStorage(
        eventId,
        data.title,
        data.description,
        certificateFile,
        certificateFile.name,
      );

      if (result.success) {
        toast.success("Template de certificado criado com sucesso!");
        setShowCertificateForm(false);
        setIsEditingCertificate(false);
        certificateTemplateForm.reset();
        setCertificateFile(null);
        queryClient.invalidateQueries({
          queryKey: ["event", eventId],
        });
      } else {
        toast.error(
          "error" in result
            ? result.error
            : "Erro ao criar template de certificado",
        );
      }
    } catch (error) {
      toast.error("Erro ao criar template de certificado");
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar template de certificado
  const handleUpdateCertificateTemplate = async (
    data: CertificateTemplateFormData,
  ) => {
    if (!eventId || !(eventData as any)?.certificateTemplate) return;

    setIsLoading(true);
    try {
      const certTemplate = (eventData as any).certificateTemplate;
      const result = await updateEventCertificateTemplateWithStorage(
        certTemplate.id,
        data.title,
        data.description,
        certificateFile || undefined,
        certificateFile?.name,
      );

      if (result.success) {
        toast.success("Template de certificado atualizado com sucesso!");
        setShowCertificateForm(false);
        setIsEditingCertificate(false);
        setCertificateFile(null);
        queryClient.invalidateQueries({
          queryKey: ["event", eventId],
        });
      } else {
        toast.error(
          "error" in result
            ? result.error
            : "Erro ao atualizar template de certificado",
        );
      }
    } catch (error) {
      toast.error("Erro ao atualizar template de certificado");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (eventLoading) {
    return (
      <div className="dark-bg-primary min-h-screen pb-20">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Calendar className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Carregando evento...
            </h1>
            <p className="dark-text-secondary">
              Buscando informações do evento
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (eventError || !eventData) {
    return (
      <div className="dark-bg-primary min-h-screen pb-20">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Calendar className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Erro ao carregar evento
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar as informações do evento. Tente
              novamente.
            </p>
            <Button
              className="dark-btn-primary"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout maxWidth="6xl" spacing="relaxed">
      {/* Header */}
      <EventHeader
        eventId={eventId}
        isLoading={isLoading}
        isEditing={true}
        isDeleting={isDeleting}
        isPublished={eventData?.isPublished || false}
        onFinishEvent={handleFinishEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Event Form */}
      <EventInfoForm
        form={eventForm}
        eventId={eventId}
        isLoading={isLoading}
        isEditing={true}
        onSubmit={async (data) => {
          await handleUpdateEvent(data);
          setIsEditingEventInfo(false);
          setOpenEventInfo([]);
        }}
        accordionValue={openEventInfo}
        onAccordionChange={setOpenEventInfo}
        onToggleEdit={() => {
          setIsEditingEventInfo(!isEditingEventInfo);
          if (!isEditingEventInfo) {
            setOpenEventInfo(["event-info"]);
          }
        }}
        showEditButton={!isEditingEventInfo}
        bannerFile={bannerFile}
        setBannerFile={setBannerFile}
        existingBanner={eventData?.image || null}
      />

      {/* Certificate Section */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
            <Award className="dark-primary" size={24} />
            Template de Certificado
          </h2>
          {(eventData as any)?.certificateTemplate ? (
            <div className="flex gap-2">
              <Button
                variant="info"
                onClick={() => {
                  setShowCertificateForm(true);
                  setIsEditingCertificate(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Template
              </Button>
            </div>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                setShowCertificateForm(true);
                setIsEditingCertificate(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Template
            </Button>
          )}
        </div>

        {/* Mostrar template existente se não estiver editando */}
        {(eventData as any)?.certificateTemplate && !showCertificateForm && (
          <div className="mt-6">
            <div className="dark-card dark-shadow-sm rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                    {(eventData as any).certificateTemplate.title}
                  </h3>
                  <p className="dark-text-secondary mb-4 text-sm">
                    {(eventData as any).certificateTemplate.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        (eventData as any).certificateTemplate.isActive
                          ? "dark-success-bg dark-success"
                          : "dark-warning-bg dark-warning"
                      }`}
                    >
                      {(eventData as any).certificateTemplate.isActive
                        ? "Ativo"
                        : "Inativo"}
                    </div>
                    {(eventData as any).certificateTemplate.templateUrl && (
                      <div className="dark-info-bg dark-info rounded-full px-2 py-1 text-xs font-medium">
                        Certificado Disponível
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(eventData as any).certificateTemplate.templateUrl && (
                    <ImageViewer
                      imageBase64={
                        (eventData as any).certificateTemplate.templateUrl
                      }
                      imageUrl={
                        (eventData as any).certificateTemplate.templateUrl
                      }
                      title={`Template: ${(eventData as any).certificateTemplate.title}`}
                      fileName={`template-${(eventData as any).certificateTemplate.id}.png`}
                    >
                      <Button
                        className="dark-glass dark-border hover:dark-border-hover"
                        size="sm"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Ver Certificado
                      </Button>
                    </ImageViewer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Form */}
        {showCertificateForm && (
          <EventCertificateForm
            form={certificateTemplateForm}
            isLoading={isLoading}
            isEditing={isEditingCertificate}
            eventTitle={eventTitle}
            eventDescription={eventDescription}
            certificateFile={certificateFile}
            setCertificateFile={setCertificateFile}
            onSubmit={
              isEditingCertificate
                ? handleUpdateCertificateTemplate
                : handleCreateCertificateTemplate
            }
            onCancel={() => {
              setShowCertificateForm(false);
              setIsEditingCertificate(false);
              certificateTemplateForm.reset();
              setCertificateFile(null);
            }}
          />
        )}
      </div>
    </PageLayout>
  );
}

"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  createEvent,
  createEventCertificateTemplateWithStorage,
  updateEventStatus,
} from "@/src/lib/actions";
import type { CertificateTemplateFormData } from "@/src/lib/forms/course-schemas";
import { certificateTemplateSchema } from "@/src/lib/forms/course-schemas";
import { eventSchema, type EventFormData } from "@/src/lib/forms/event-schemas";
import { Button } from "@base-church/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EventCertificateForm,
  EventHeader,
  EventInfoForm,
} from "../components";

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [openEventInfo, setOpenEventInfo] = useState<string[]>(["event-info"]);
  const router = useRouter();

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

  // Criar evento
  const handleCreateEvent = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const result = await createEvent(data);

      if (result.success && result.event) {
        setEventId(result.event.id);
        toast.success(
          "Evento criado com sucesso! Agora você pode adicionar um certificado.",
        );
      } else {
        toast.error(result.error || "Erro ao criar evento");
      }
    } catch (error) {
      toast.error("Erro ao criar evento");
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar como rascunho
  const handleSaveDraft = async () => {
    if (!eventId) {
      const eventData = eventForm.getValues();
      await handleCreateEvent(eventData);
    } else {
      toast.success("Evento salvo como rascunho!");
      router.push("/dashboard/events");
    }
  };

  // Criar template de certificado
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
        certificateTemplateForm.reset();
        setCertificateFile(null);
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

  // Finalizar evento
  const handleFinishEvent = async () => {
    if (!eventId) {
      toast.error("Por favor, crie o evento primeiro");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateEventStatus(eventId, "published");
      if (result.success) {
        toast.success("Evento publicado com sucesso!");
        router.push("/dashboard/events");
      } else {
        toast.error(result.error || "Erro ao publicar evento");
      }
    } catch (error) {
      toast.error("Erro ao finalizar evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout maxWidth="6xl" spacing="relaxed">
      {/* Header */}
      <EventHeader
        eventId={eventId}
        isLoading={isLoading}
        onSaveDraft={handleSaveDraft}
        onFinishEvent={handleFinishEvent}
      />

      {/* Event Form */}
      <EventInfoForm
        form={eventForm}
        eventId={eventId}
        isLoading={isLoading}
        isEditing={!eventId}
        onSubmit={async (data) => {
          await handleCreateEvent(data);
          if (eventId) {
            setOpenEventInfo([]);
          }
        }}
        accordionValue={openEventInfo}
        onAccordionChange={setOpenEventInfo}
        bannerFile={bannerFile}
        setBannerFile={setBannerFile}
        existingBanner={null}
      />

      {/* Certificate Section */}
      {eventId && (
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
              <Award className="dark-primary" size={24} />
              Template de Certificado
            </h2>
            {!showCertificateForm ? (
              <Button
                variant="success"
                onClick={() => {
                  setShowCertificateForm(true);
                  setEditingCertificate(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Template
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="info"
                  onClick={() => {
                    setShowCertificateForm(true);
                    setEditingCertificate(true);
                  }}
                >
                  Editar Template
                </Button>
              </div>
            )}
          </div>

          {/* Certificate Form */}
          {showCertificateForm && (
            <EventCertificateForm
              form={certificateTemplateForm}
              isLoading={isLoading}
              isEditing={editingCertificate}
              eventTitle={eventTitle}
              eventDescription={eventDescription}
              certificateFile={certificateFile}
              setCertificateFile={setCertificateFile}
              onSubmit={handleCreateCertificateTemplate}
              onCancel={() => {
                setShowCertificateForm(false);
                setEditingCertificate(false);
                certificateTemplateForm.reset();
                setCertificateFile(null);
              }}
            />
          )}
        </div>
      )}
    </PageLayout>
  );
}

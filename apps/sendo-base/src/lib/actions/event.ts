"use server";

import { prisma } from "@base-church/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import type { EventFormData } from "../forms/event-schemas";
import { uploadCourseImage } from "../storage/image-storage";

// Alias para o banco de dados
const db = prisma;

// ========================================
// EVENT ACTIONS
// ========================================

// Buscar todos os eventos
export async function getEvents(
  options: {
    filter?: "all" | "published" | "draft";
  } = {},
) {
  const { filter = "published" } = options;
  try {
    let whereClause: { isPublished?: boolean } = {};

    if (filter === "published") {
      whereClause.isPublished = true;
    } else if (filter === "draft") {
      whereClause.isPublished = false;
    }

    const events = await db.event.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            isPastor: true,
          },
        },
        enrollments: {
          select: {
            attended: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcular média de avaliações
    const eventsWithRating = events.map((event) => {
      const ratings = event.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...event,
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: ratings.length,
      };
    });

    return { success: true, events: eventsWithRating };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return { success: false, error: "Erro ao buscar eventos" };
  }
}

// Verificar se usuário está inscrito no evento
export async function checkUserEventEnrollment(
  eventId: string,
  userId: string,
) {
  unstable_noStore(); // Desabilitar cache para rotas públicas
  try {
    const enrollment = await db.eventEnrollment.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    return {
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    };
  } catch (error) {
    console.error("Erro ao verificar inscrição no evento:", error);
    return {
      success: false,
      error: "Erro ao verificar inscrição no evento",
      isEnrolled: false,
    };
  }
}

// Buscar evento por ID
export async function getEventById(eventId: string) {
  unstable_noStore(); // Desabilitar cache para rotas públicas
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            isPastor: true,
          },
        },
        certificateTemplate: {
          select: {
            id: true,
            title: true,
            description: true,
            templateUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    // Calcular média de avaliações
    const ratings = event.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    return {
      success: true,
      event: {
        ...event,
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: ratings.length,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return {
      success: false,
      error: "Erro ao buscar evento",
    };
  }
}

// Criar evento
export async function createEvent(eventData: EventFormData) {
  try {
    // Validar dados obrigatórios
    if (!eventData.title || !eventData.description || !eventData.location) {
      return {
        success: false,
        error: "Título, descrição e local são obrigatórios",
      };
    }

    // Processar tags
    const tagsArray = eventData.tags
      ? eventData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Combinar data e hora para criar Date objects
    const startDateTime = new Date(
      `${eventData.startDate}T${eventData.startTime}`,
    );
    const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);

    // Determinar tipo de evento
    let isOnline = false;
    if (eventData.type === "online") {
      isOnline = true;
    } else if (eventData.type === "hybrid") {
      // Para híbrido, podemos considerar como online também
      isOnline = true;
    }

    let imageUrl = eventData.image || null;

    // Se tem imagem em base64, fazer upload
    if (eventData.image && eventData.image.startsWith("data:")) {
      // Criar evento temporário sem imagem
      const tempEvent = await db.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          startDate: startDateTime,
          endDate: endDateTime,
          location: eventData.location,
          isOnline,
          maxAttendees: eventData.capacity || null,
          price: 0,
          tags: tagsArray,
          isPublished: false,
          image: null,
        },
      });

      // Converter base64 para Buffer e fazer upload
      const base64Data = eventData.image.split(",")[1];
      if (!base64Data) {
        return {
          success: false,
          error: "Dados da imagem inválidos",
        };
      }
      const buffer = Buffer.from(base64Data, "base64");

      const uploadResult = await uploadCourseImage(
        buffer,
        tempEvent.id,
        null,
        "banner.png",
      );

      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
      }

      // Atualizar evento com a URL da imagem
      const event = await db.event.update({
        where: { id: tempEvent.id },
        data: { image: imageUrl },
      });

      revalidatePath("/dashboard/events");
      return {
        success: true,
        event,
        message: "Evento criado com sucesso",
      };
    }

    // Criar evento normalmente se não tem imagem ou já é URL
    const event = await db.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        location: eventData.location,
        isOnline,
        maxAttendees: eventData.capacity || null,
        price: 0,
        tags: tagsArray,
        isPublished: false,
        image: imageUrl,
      },
    });

    revalidatePath("/dashboard/events");
    return {
      success: true,
      event,
      message: "Evento criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar evento",
    };
  }
}

// Atualizar evento
export async function updateEvent(eventId: string, eventData: EventFormData) {
  try {
    // Verificar se o evento existe
    const existingEvent = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    // Processar tags
    const tagsArray = eventData.tags
      ? eventData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Combinar data e hora para criar Date objects
    const startDateTime = new Date(
      `${eventData.startDate}T${eventData.startTime}`,
    );
    const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);

    // Determinar tipo de evento
    let isOnline = false;
    if (eventData.type === "online") {
      isOnline = true;
    } else if (eventData.type === "hybrid") {
      isOnline = true;
    }

    let imageUrl = existingEvent.image || null;

    // Se tem nova imagem em base64, fazer upload
    if (eventData.image && eventData.image.startsWith("data:")) {
      const base64Data = eventData.image.split(",")[1];
      if (!base64Data) {
        return {
          success: false,
          error: "Dados da imagem inválidos",
        };
      }
      const buffer = Buffer.from(base64Data, "base64");

      const uploadResult = await uploadCourseImage(
        buffer,
        eventId,
        existingEvent.image,
        "banner.png",
      );

      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
      }
    }

    // Atualizar evento
    const event = await db.event.update({
      where: { id: eventId },
      data: {
        title: eventData.title,
        description: eventData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        location: eventData.location,
        isOnline,
        maxAttendees: eventData.capacity || null,
        tags: tagsArray,
        image: imageUrl,
      },
    });

    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${eventId}`);

    return {
      success: true,
      event,
      message: "Evento atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao atualizar evento",
    };
  }
}

// Deletar evento
export async function deleteEvent(eventId: string) {
  try {
    // Verificar se o evento existe
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Evento não encontrado",
      };
    }

    // Deletar evento (cascade vai deletar relacionamentos)
    await db.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/dashboard/events");

    return {
      success: true,
      message: "Evento excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir evento",
    };
  }
}

// Atualizar status do evento (publicar/despublicar)
export async function updateEventStatus(
  eventId: string,
  status: "published" | "draft",
) {
  try {
    const event = await db.event.update({
      where: { id: eventId },
      data: {
        isPublished: status === "published",
      },
    });

    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${eventId}`);

    return {
      success: true,
      event,
      message:
        status === "published"
          ? "Evento publicado com sucesso"
          : "Evento voltou para rascunho",
    };
  } catch (error) {
    console.error("Erro ao atualizar status do evento:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do evento",
    };
  }
}

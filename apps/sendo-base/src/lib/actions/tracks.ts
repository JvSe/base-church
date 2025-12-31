"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import { uploadTrackImage } from "../storage/image-storage";

type TrackCourseInput = {
  courseId: string;
  order: number;
  isRequired?: boolean;
};

type CreateTrackInput = {
  title: string;
  description?: string;
  slug: string;
  image?: string;
  category?: string;
  level?: string;
  objectives?: string[];
  requirements?: string[];
  courses: TrackCourseInput[];
};

type UpdateTrackInput = CreateTrackInput & {
  id: string;
  isPublished?: boolean;
  isFeatured?: boolean;
};

// Criar trilha
export async function createTrack(data: CreateTrackInput) {
  try {
    // Verificar se slug já existe
    const existingTrack = await prisma.track.findUnique({
      where: { slug: data.slug },
    });

    if (existingTrack) {
      return { success: false, error: "Já existe uma trilha com este slug" };
    }

    // Calcular duração total baseado nos cursos
    let totalDuration = 0;
    if (data.courses.length > 0) {
      const coursesData = await prisma.course.findMany({
        where: { id: { in: data.courses.map((c) => c.courseId) } },
        select: { duration: true },
      });
      totalDuration = coursesData.reduce(
        (sum, c) => sum + (c.duration || 0),
        0,
      );
    }

    let imageUrl = data.image || null;

    // Se tem imagem em base64, criar trilha primeiro e depois fazer upload
    if (data.image && data.image.startsWith("data:")) {
      console.log(
        "⬆️ Detectado base64, fazendo upload para Supabase Storage...",
      );

      // Criar trilha temporária sem imagem
      const tempTrack = await prisma.track.create({
        data: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          image: null,
          category: data.category,
          level: data.level,
          duration: totalDuration,
          objectives: data.objectives || [],
          requirements: data.requirements || [],
          courses: {
            create: data.courses.map((course) => ({
              courseId: course.courseId,
              order: course.order,
              isRequired: course.isRequired ?? true,
            })),
          },
        },
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  image: true,
                  duration: true,
                  level: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });

      // Converter base64 para Buffer e fazer upload
      const base64Data = data.image.split(",")[1];
      if (!base64Data) {
        return {
          success: false,
          error: "Dados da imagem inválidos",
        };
      }
      const buffer = Buffer.from(base64Data, "base64");

      const uploadResult = await uploadTrackImage(
        buffer,
        tempTrack.id,
        null,
        "cover.png",
      );

      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
      }

      // Atualizar trilha com a URL da imagem
      const track = await prisma.track.update({
        where: { id: tempTrack.id },
        data: { image: imageUrl },
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  image: true,
                  duration: true,
                  level: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });

      revalidatePath("/dashboard/tracks");
      revalidatePath("/journey");

      return { success: true, track };
    }

    // Criar trilha normalmente se não tem imagem ou já é URL
    const track = await prisma.track.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        image: imageUrl,
        category: data.category,
        level: data.level,
        duration: totalDuration,
        objectives: data.objectives || [],
        requirements: data.requirements || [],
        courses: {
          create: data.courses.map((course) => ({
            courseId: course.courseId,
            order: course.order,
            isRequired: course.isRequired ?? true,
          })),
        },
      },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                duration: true,
                level: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath("/dashboard/tracks");
    revalidatePath("/journey");

    return { success: true, track };
  } catch (error) {
    console.error("Create track error:", error);
    return { success: false, error: "Erro ao criar trilha" };
  }
}

// Atualizar trilha
export async function updateTrack(data: UpdateTrackInput) {
  try {
    // Verificar se slug já existe (exceto para a própria trilha)
    const existingTrack = await prisma.track.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: data.id },
      },
    });

    if (existingTrack) {
      return { success: false, error: "Já existe uma trilha com este slug" };
    }

    // Buscar trilha atual para pegar imagem antiga
    const currentTrack = await prisma.track.findUnique({
      where: { id: data.id },
      select: { image: true },
    });

    // Calcular duração total baseado nos cursos
    let totalDuration = 0;
    if (data.courses.length > 0) {
      const coursesData = await prisma.course.findMany({
        where: { id: { in: data.courses.map((c) => c.courseId) } },
        select: { duration: true },
      });
      totalDuration = coursesData.reduce(
        (sum, c) => sum + (c.duration || 0),
        0,
      );
    }

    let imageUrl = data.image || currentTrack?.image || null;

    // Se tem nova imagem em base64, fazer upload com substituição
    if (data.image && data.image.startsWith("data:")) {
      console.log("⬆️ Nova imagem detectada, fazendo upload...");

      // Converter base64 para Buffer
      const base64Data = data.image.split(",")[1];
      if (!base64Data) {
        return {
          success: false,
          error: "Dados da imagem inválidos",
        };
      }
      const buffer = Buffer.from(base64Data, "base64");

      // Upload com substituição automática da imagem antiga
      const uploadResult = await uploadTrackImage(
        buffer,
        data.id,
        currentTrack?.image, // Passa a imagem antiga para ser deletada
        "cover.png",
      );

      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
      } else {
        console.error("❌ Erro no upload:", uploadResult.error);
        // Manter imagem antiga em caso de erro
        imageUrl = currentTrack?.image || null;
      }
    }

    // Deletar cursos antigos e criar novos
    await prisma.trackCourse.deleteMany({
      where: { trackId: data.id },
    });

    const track = await prisma.track.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        image: imageUrl,
        category: data.category,
        level: data.level,
        duration: totalDuration,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        objectives: data.objectives || [],
        requirements: data.requirements || [],
        courses: {
          create: data.courses.map((course) => ({
            courseId: course.courseId,
            order: course.order,
            isRequired: course.isRequired ?? true,
          })),
        },
      },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                duration: true,
                level: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath("/dashboard/tracks");
    revalidatePath("/journey");

    return { success: true, track };
  } catch (error) {
    console.error("Update track error:", error);
    return { success: false, error: "Erro ao atualizar trilha" };
  }
}

// Buscar todas as trilhas
export async function getTracks(filter: "all" | "published" | "draft" = "all") {
  try {
    const where =
      filter === "published"
        ? { isPublished: true }
        : filter === "draft"
          ? { isPublished: false }
          : {};

    const tracks = await prisma.track.findMany({
      where,
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                duration: true,
                level: true,
                category: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return { success: true, tracks };
  } catch (error) {
    console.error("Get tracks error:", error);
    return { success: false, error: "Erro ao buscar trilhas", tracks: [] };
  }
}

// Buscar trilha por ID
export async function getTrackById(id: string) {
  try {
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                duration: true,
                level: true,
                category: true,
                totalLessons: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!track) {
      return { success: false, error: "Trilha não encontrada" };
    }

    return { success: true, track };
  } catch (error) {
    console.error("Get track by ID error:", error);
    return { success: false, error: "Erro ao buscar trilha" };
  }
}

// Deletar trilha
export async function deleteTrack(id: string) {
  try {
    await prisma.track.delete({
      where: { id },
    });

    revalidatePath("/dashboard/tracks");
    revalidatePath("/journey");

    return { success: true };
  } catch (error) {
    console.error("Delete track error:", error);
    return { success: false, error: "Erro ao deletar trilha" };
  }
}

// Atualizar status de publicação
export async function updateTrackStatus(id: string, isPublished: boolean) {
  try {
    const track = await prisma.track.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/dashboard/tracks");
    revalidatePath("/journey");

    return { success: true, track };
  } catch (error) {
    console.error("Update track status error:", error);
    return { success: false, error: "Erro ao atualizar status da trilha" };
  }
}

// Atualizar destaque
export async function updateTrackFeatured(id: string, isFeatured: boolean) {
  try {
    const track = await prisma.track.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/dashboard/tracks");
    revalidatePath("/journey");

    return { success: true, track };
  } catch (error) {
    console.error("Update track featured error:", error);
    return { success: false, error: "Erro ao atualizar destaque da trilha" };
  }
}

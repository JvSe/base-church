"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

// Alias para o banco de dados
const db = prisma;

// Course Actions
export async function getCourses({
  filter = "published",
}: {
  filter?: "all" | "published" | "draft";
} = {}) {
  try {
    // Construir o filtro baseado no parâmetro
    let whereClause: any = {};

    if (filter === "published") {
      whereClause.isPublished = true;
    } else if (filter === "draft") {
      whereClause.isPublished = false;
    }
    // Se filter === "all", não aplicamos nenhum filtro de isPublished

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
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

    // Calculate average rating for each course
    const coursesWithRating = courses.map((course) => {
      const ratings = course.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...course,
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewsCount: ratings.length,
      };
    });

    return { success: true, courses: coursesWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        slug,
        isPublished: true, // Apenas cursos publicados
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            role: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Calculate average rating
    const ratings = course.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const courseWithRating = {
      ...course,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: ratings.length,
    };

    return { success: true, course: courseWithRating };
  } catch (error) {
    return { success: false, error: "Failed to fetch course" };
  }
}

export async function getCourseById(courseId: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            role: true,
            isPastor: true,
            bio: true,
            image: true,
          },
        },
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                duration: true,
                type: true,
                order: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        enrollments: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                role: true,
                isPastor: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Calcular estatísticas
    const totalLessons = course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0,
    );
    const totalDuration = course.modules.reduce(
      (acc, module) =>
        acc +
        module.lessons.reduce(
          (lessonAcc, lesson) => lessonAcc + (lesson.duration || 0),
          0,
        ),
      0,
    );
    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) /
          course.reviews.length
        : 0;

    return {
      success: true,
      course: {
        ...course,
        totalLessons,
        totalDuration,
        averageRating: Math.round(averageRating * 10) / 10,
        studentsCount: course.enrollments.filter((e) => e.status === "approved")
          .length,
        reviews: course.reviews,
        instructor: course.instructor,
      },
    };
  } catch (error) {
    console.error("Error getting course by id:", error);
    return { success: false, error: "Erro ao buscar curso" };
  }
}

// CRUD de Cursos
export async function createCourse(courseData: {
  title: string;
  description: string;
  instructorId: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  category: string;
  tags: string;
}) {
  try {
    // Validar dados obrigatórios
    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.instructorId
    ) {
      return {
        success: false,
        error: "Título, descrição e instrutor são obrigatórios",
      };
    }

    // Processar tags
    const tagsArray = courseData.tags
      ? courseData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Gerar slug a partir do título
    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Criar curso
    const course = await db.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        slug: slug,
        instructorId: courseData.instructorId,
        duration: courseData.duration,
        level: courseData.level as any,
        price: courseData.price,
        category: courseData.category,
        tags: tagsArray,
        isFeatured: false,
        image: null,
      },
    });

    return {
      success: true,
      course,
      message: "Curso criado com sucesso",
    };
  } catch (error) {
    console.log("Create course error:", error);
    throw error;
  }
}

export async function updateCourseStatus(
  courseId: string,
  status: "draft" | "published" | "archived",
) {
  try {
    const course = await db.course.update({
      where: { id: courseId },
      data: { isPublished: status === "published" },
    });

    revalidatePath("/dashboard/courses");
    return {
      success: true,
      course,
      message: `Curso ${status === "published" ? "publicado" : "atualizado"} com sucesso`,
    };
  } catch (error) {
    console.error("Update course status error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateCourse(
  courseId: string,
  courseData: {
    title: string;
    description: string;
    instructorId: string;
    duration: number;
    level: string;
    status: string;
    price: number;
    category: any;
    tags: string;
  },
) {
  try {
    // Verificar se o curso existe
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Processar tags
    const tagsArray = courseData.tags
      ? courseData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Atualizar curso
    const course = await db.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        instructorId: courseData.instructorId,
        duration: courseData.duration,
        level: courseData.level as any,
        price: courseData.price,
        category: courseData.category,
        tags: tagsArray,
      },
    });

    return {
      success: true,
      course,
      message: "Curso atualizado com sucesso",
    };
  } catch (error) {
    console.error("Update course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // Verificar se o curso existe
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Verificar se há alunos matriculados
    if (existingCourse._count.enrollments > 0) {
      return {
        success: false,
        error: "Não é possível excluir um curso com alunos matriculados",
      };
    }

    // Excluir curso (cascade vai excluir módulos e lições)
    await db.course.delete({
      where: { id: courseId },
    });

    return {
      success: true,
      message: "Curso excluído com sucesso",
    };
  } catch (error) {
    console.error("Delete course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function duplicateCourse(courseId: string) {
  try {
    // Buscar curso original
    const originalCourse = await db.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!originalCourse) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Gerar slug para o curso duplicado
    const duplicatedSlug = `${originalCourse.slug}-copia-${Date.now()}`;

    // Criar curso duplicado
    const duplicatedCourse = await db.course.create({
      data: {
        title: `${originalCourse.title} (Cópia)`,
        description: originalCourse.description,
        slug: duplicatedSlug,
        instructorId: originalCourse.instructorId,
        duration: originalCourse.duration,
        level: originalCourse.level,
        price: originalCourse.price,
        category: originalCourse.category,
        tags: originalCourse.tags,
        isFeatured: false,
        image: originalCourse.image,
      },
    });

    // Duplicar módulos e lições
    for (const module of originalCourse.modules) {
      const duplicatedModule = await db.module.create({
        data: {
          title: module.title,
          description: module.description,
          order: module.order,
          courseId: duplicatedCourse.id,
        },
      });

      // Duplicar lições
      for (const lesson of module.lessons) {
        await db.lesson.create({
          data: {
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
            type: lesson.type,
            moduleId: duplicatedModule.id,
          },
        });
      }
    }

    return {
      success: true,
      course: duplicatedCourse,
      message: "Curso duplicado com sucesso",
    };
  } catch (error) {
    console.error("Duplicate course error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Módulos e Lições
export async function createModule(
  courseId: string,
  moduleData: {
    title: string;
    description: string;
    order: number;
  },
) {
  try {
    // Verificar se o curso existe
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Criar módulo
    const module = await db.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        courseId: courseId,
      },
    });

    return {
      success: true,
      module,
      message: "Módulo criado com sucesso",
    };
  } catch (error) {
    console.error("Create module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateModule(
  moduleId: string,
  moduleData: {
    title: string;
    description: string;
    order: number;
  },
) {
  try {
    // Verificar se o módulo existe
    const existingModule = await db.module.findUnique({
      where: { id: moduleId },
    });

    if (!existingModule) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Atualizar módulo
    const module = await db.module.update({
      where: { id: moduleId },
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
      },
    });

    return {
      success: true,
      module,
      message: "Módulo atualizado com sucesso",
    };
  } catch (error) {
    console.error("Update module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteModule(moduleId: string) {
  try {
    // Verificar se o módulo existe
    const existingModule = await db.module.findUnique({
      where: { id: moduleId },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!existingModule) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Excluir módulo (cascade vai excluir lições)
    await db.module.delete({
      where: { id: moduleId },
    });

    return {
      success: true,
      message: "Módulo excluído com sucesso",
    };
  } catch (error) {
    console.error("Delete module error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function createLesson(
  moduleId: string,
  lessonData: {
    title: string;
    description: string;
    content?: string;
    videoUrl?: string;
    duration: number;
    order: number;
    type: string;
  },
) {
  try {
    // Verificar se o módulo existe
    const module = await db.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      return { success: false, error: "Módulo não encontrado" };
    }

    // Criar lição
    const lesson = await db.lesson.create({
      data: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || null,
        videoUrl: lessonData.videoUrl || null,
        duration: lessonData.duration,
        order: lessonData.order,
        type: lessonData.type as any,
        moduleId: moduleId,
      },
    });

    return {
      success: true,
      lesson,
      message: "Lição criada com sucesso",
    };
  } catch (error) {
    console.error("Create lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function updateLesson(
  lessonId: string,
  lessonData: {
    title: string;
    description: string;
    content?: string;
    videoUrl?: string;
    duration: number;
    order: number;
    type: string;
  },
) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Atualizar lição
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || null,
        videoUrl: lessonData.videoUrl || null,
        duration: lessonData.duration,
        order: lessonData.order,
        type: lessonData.type as any,
      },
    });

    return {
      success: true,
      lesson,
      message: "Lição atualizada com sucesso",
    };
  } catch (error) {
    console.error("Update lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Excluir lição
    await db.lesson.delete({
      where: { id: lessonId },
    });

    return {
      success: true,
      message: "Lição excluída com sucesso",
    };
  } catch (error) {
    console.error("Delete lesson error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getCourseModules(courseId: string) {
  try {
    const modules = await db.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return { success: true, modules };
  } catch (error) {
    console.error("Get course modules error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    return { success: true, lesson };
  } catch (error) {
    console.error("Get lesson by id error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Lesson Actions
export async function getLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: {
                      orderBy: { order: "asc" },
                    },
                  },
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, lesson };
  } catch (error) {
    return { success: false, error: "Failed to fetch lesson" };
  }
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: {
    isCompleted?: boolean;
    watchedAt?: Date;
  },
) {
  try {
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        ...data,
        completedAt: data.isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        ...data,
        completedAt: data.isCompleted ? new Date() : undefined,
      },
    });

    // Update enrollment progress if lesson is completed
    if (data.isCompleted) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      });

      if (lesson) {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: lesson.module.course.id,
            },
          },
        });

        if (enrollment) {
          // Calculate new progress
          const totalLessons = await prisma.lesson.count({
            where: {
              module: {
                courseId: lesson.module.course.id,
              },
            },
          });

          const completedLessons = await prisma.lessonProgress.count({
            where: {
              userId,
              lesson: {
                module: {
                  courseId: lesson.module.course.id,
                },
              },
              isCompleted: true,
            },
          });

          const newProgress = Math.round(
            (completedLessons / totalLessons) * 100,
          );

          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              progress: newProgress,
              completedLessons,
              lastAccessedAt: new Date(),
            },
          });

          // Check if course is completed
          if (newProgress === 100) {
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: {
                completedAt: new Date(),
              },
            });

            // Create certificate if course has certificate enabled
            if (lesson.module.course.certificate) {
              await prisma.certificate.create({
                data: {
                  userId,
                  courseId: lesson.module.course.id,
                },
              });
            }
          }
        }
      }
    }

    revalidatePath("/contents");
    revalidatePath("/profile");
    return { success: true, progress };
  } catch (error) {
    return { success: false, error: "Failed to update progress" };
  }
}

export async function getUserProgress(userId: string) {
  try {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    return { success: true, progress };
  } catch (error) {
    return { success: false, error: "Failed to fetch progress" };
  }
}

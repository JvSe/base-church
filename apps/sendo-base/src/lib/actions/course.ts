"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";
import type { CourseFormData, LessonFormData } from "../forms/course-schemas";

// Alias para o banco de dados
const db = prisma;

type CourseWhereClause = {
  isPublished?: boolean;
};

// Course Actions
export async function getCourses({
  filter = "published",
}: {
  filter?: "all" | "published" | "draft";
} = {}) {
  try {
    // Construir o filtro baseado no parâmetro
    const whereClause: CourseWhereClause = {};

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
        certificateTemplate: true,
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

// Função auxiliar para calcular a duração total do curso
async function calculateCourseDuration(courseId: string): Promise<number> {
  const modules = await db.module.findMany({
    where: { courseId },
    include: {
      lessons: {
        select: {
          duration: true,
        },
      },
    },
  });

  const totalDuration = modules.reduce(
    (acc, module) =>
      acc +
      module.lessons.reduce(
        (lessonAcc, lesson) => lessonAcc + (lesson.duration || 0),
        0,
      ),
    0,
  );

  return totalDuration;
}

// CRUD de Cursos
export async function createCourse(courseData: CourseFormData) {
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

    // Criar curso com duração inicial 0 (será calculada quando houver lições)
    const course = await db.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        slug: slug,
        instructorId: courseData.instructorId,
        duration: 0, // Será calculado automaticamente quando houver lições
        level: courseData.level,
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
  courseData: CourseFormData,
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

    // Atualizar curso (duração é calculada automaticamente pelas lições)
    const course = await db.course.update({
      where: { id: courseId },
      data: {
        title: courseData.title,
        description: courseData.description,
        instructorId: courseData.instructorId,
        level: courseData.level,
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

    const courseId = existingModule.courseId;

    // Excluir módulo (cascade vai excluir lições)
    await db.module.delete({
      where: { id: moduleId },
    });

    // Recalcular e atualizar a duração do curso
    const totalDuration = await calculateCourseDuration(courseId);
    await db.course.update({
      where: { id: courseId },
      data: { duration: totalDuration },
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
  lessonData: LessonFormData,
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
        youtubeEmbedId: lessonData.youtubeEmbedId || null,
        duration: lessonData.duration,
        order: lessonData.order || 1,
        type: lessonData.type,
        moduleId: moduleId,
        isActivity: lessonData.isActivity || false,
      },
    });

    // Recalcular e atualizar a duração do curso
    const totalDuration = await calculateCourseDuration(module.courseId);
    await db.course.update({
      where: { id: module.courseId },
      data: { duration: totalDuration },
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
  lessonData: LessonFormData,
) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
      },
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
        youtubeEmbedId: lessonData.youtubeEmbedId || null,
        duration: lessonData.duration,
        order: lessonData.order || 1,
        type: lessonData.type,
      },
    });

    // Recalcular e atualizar a duração do curso
    const totalDuration = await calculateCourseDuration(
      existingLesson.module.courseId,
    );
    await db.course.update({
      where: { id: existingLesson.module.courseId },
      data: { duration: totalDuration },
    });

    return {
      success: true,
      lesson,
      message: "Lição atualizada com sucesso",
    };
  } catch (error) {
    console.error("Update lesson error:", JSON.stringify(error, null, 2));
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    // Verificar se a lição existe
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
      },
    });

    if (!existingLesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Excluir lição
    await db.lesson.delete({
      where: { id: lessonId },
    });

    // Recalcular e atualizar a duração do curso
    const totalDuration = await calculateCourseDuration(
      existingLesson.module.courseId,
    );
    await db.course.update({
      where: { id: existingLesson.module.courseId },
      data: { duration: totalDuration },
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
          include: {
            questions: {
              include: {
                options: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
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

            // Check if course has certificate template
            const courseWithTemplate = await prisma.course.findUnique({
              where: { id: lesson.module.course.id },
              include: {
                certificateTemplate: true,
              },
            });

            // Generate certificate if course has certificate template
            if (courseWithTemplate?.certificateTemplate) {
              // First, unlock the certificate module
              const unlockResult = await unlockCertificateModule(
                lesson.module.course.id,
              );

              if (unlockResult.success) {
                console.log("🔓 Módulo de certificado liberado!");
              }

              // Then generate the certificate
              const certificateResult =
                await generateCertificateForCompletedCourse(
                  userId,
                  lesson.module.course.id,
                );

              if (certificateResult.success) {
                console.log(
                  "🎉 Certificado gerado automaticamente para o curso completado!",
                );
              }
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

export async function getLessonWithProgress(lessonId: string, userId: string) {
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
                certificateTemplate: true,
              },
            },
          },
        },
        progress: {
          where: { userId },
        },
        questions: {
          include: {
            options: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    // Get user's progress for all lessons in the course
    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          module: {
            courseId: lesson.module.course.id,
          },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            youtubeEmbedId: true,
          },
        },
      },
    });

    // Create a map of lesson progress for easy lookup
    const progressMap = new Map();
    userProgress.forEach((progress) => {
      progressMap.set(progress.lessonId, {
        isCompleted: progress.isCompleted,
        isWatched: !!progress.watchedAt,
      });
    });

    // Add progress info to all lessons and check certificate module status
    const courseWithProgress = {
      ...lesson.module.course,
      modules: lesson.module.course.modules.map((module, moduleIndex) => {
        // Verificar se algum módulo anterior tem atividade não completada
        const hasPreviousIncompleteActivity = lesson.module.course.modules
          .slice(0, moduleIndex)
          .some((previousModule) =>
            previousModule.lessons.some((previousLesson) => {
              const lessonProgress = progressMap.get(previousLesson.id);
              return (
                previousLesson.isActivity &&
                (!lessonProgress || !lessonProgress.isCompleted)
              );
            }),
          );

        return {
          ...module,
          lessons: module.lessons.map((moduleLesson) => ({
            ...moduleLesson,
            ...(progressMap.get(moduleLesson.id) || {
              isCompleted: false,
              isWatched: false,
            }),
            // Add locked status for certificate lessons
            isLocked: hasPreviousIncompleteActivity,
          })),
          // Add locked status for certificate modules
          isLocked:
            module.title === "Certificado de Conclusão" ||
            hasPreviousIncompleteActivity,
        };
      }),
    };

    // Calculate course progress
    const allLessons = courseWithProgress.modules.flatMap(
      (module) => module.lessons,
    );
    const completedLessons = allLessons.filter((l) => l.isCompleted).length;
    const totalLessons = allLessons.length;
    const courseProgressPercentage =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Check if user has a certificate for this course
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        courseId: lesson.module.course.id,
      },
      include: {
        template: true,
      },
    });

    return {
      success: true,
      lesson: {
        ...lesson,
        isCompleted: lesson.progress[0]?.isCompleted || false,
        isWatched: !!lesson.progress[0]?.watchedAt,
      },
      course: {
        ...courseWithProgress,
        progress: courseProgressPercentage,
        completedLessons,
        totalLessons,
      },
      certificate: existingCertificate,
    };
  } catch (error) {
    console.error("Error fetching lesson with progress:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function createCertificateModule(courseId: string) {
  try {
    console.log("📜 Criando módulo de certificado para o curso:", courseId);

    // Check if certificate module already exists
    const existingModule = await prisma.module.findFirst({
      where: {
        courseId,
        title: "Certificado de Conclusão",
      },
    });

    if (existingModule) {
      console.log("📜 Módulo de certificado já existe:", existingModule.id);
      return { success: true, module: existingModule };
    }

    // Get the highest order number for modules in this course
    const lastModule = await prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (lastModule?.order || 0) + 1;

    // Create certificate module
    const certificateModule = await prisma.module.create({
      data: {
        courseId,
        title: "Certificado de Conclusão",
        description:
          "Parabéns! Você concluiu o curso e pode baixar seu certificado.",
        order: nextOrder,
      },
    });

    // Create certificate lesson
    const certificateLesson = await prisma.lesson.create({
      data: {
        moduleId: certificateModule.id,
        title: "Baixar Certificado",
        description:
          "Clique aqui para visualizar e baixar seu certificado de conclusão.",
        order: 1,
        isPublished: false, // Will be published when course is completed
        duration: 0, // No duration for certificate
      },
    });

    console.log("✅ Módulo de certificado criado:", certificateModule.id);
    console.log("✅ Lição de certificado criada:", certificateLesson.id);

    return {
      success: true,
      module: certificateModule,
      lesson: certificateLesson,
    };
  } catch (error) {
    console.error("❌ Error creating certificate module:", error);
    return { success: false, error: "Erro ao criar módulo de certificado" };
  }
}

export async function unlockCertificateModule(courseId: string) {
  try {
    console.log("🔓 Liberando módulo de certificado para o curso:", courseId);

    // Find certificate module
    const certificateModule = await prisma.module.findFirst({
      where: {
        courseId,
        title: "Certificado de Conclusão",
      },
      include: {
        lessons: true,
      },
    });

    if (!certificateModule) {
      return { success: false, error: "Módulo de certificado não encontrado" };
    }

    // Publish certificate lesson
    if (certificateModule.lessons.length > 0 && certificateModule.lessons[0]) {
      await prisma.lesson.update({
        where: { id: certificateModule.lessons[0].id },
        data: { isPublished: true },
      });
    }

    console.log("✅ Módulo de certificado liberado:", certificateModule.id);

    return { success: true, module: certificateModule };
  } catch (error) {
    console.error("❌ Error unlocking certificate module:", error);
    return { success: false, error: "Erro ao liberar módulo de certificado" };
  }
}

export async function saveQuizAnswers(
  userId: string,
  lessonId: string,
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>,
) {
  try {
    console.log("💾 Salvando respostas do quiz:", {
      userId,
      lessonId,
      answersCount: answers.length,
    });

    // Verificar se a lição é um quiz
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lição não encontrada" };
    }

    if (lesson.type !== "OBJECTIVE_QUIZ") {
      return { success: false, error: "Esta lição não é um quiz" };
    }

    // Calcular pontuação
    let totalScore = 0;
    let maxScore = 0;
    const results: Array<{
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      score: number;
    }> = [];

    for (const answer of answers) {
      const question = lesson.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      maxScore += question.points;
      const selectedOption = question.options.find(
        (opt) => opt.id === answer.selectedOptionId,
      );

      if (selectedOption?.isCorrect) {
        totalScore += question.points;
        results.push({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: true,
          score: question.points,
        });
      } else {
        results.push({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: false,
          score: 0,
        });
      }
    }

    const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = percentageScore >= 70;

    console.log("📊 Resultado do quiz:", {
      totalScore,
      maxScore,
      percentageScore,
      passed,
    });

    // Salvar respostas no banco
    const savedAnswers = await Promise.all(
      answers.map((answer) =>
        prisma.studentAnswer.upsert({
          where: {
            userId_questionId: {
              userId,
              questionId: answer.questionId,
            },
          },
          update: {
            selectedOptionId: answer.selectedOptionId,
            score:
              results.find((r) => r.questionId === answer.questionId)?.score ||
              0,
            status: passed ? "APPROVED" : "REJECTED",
            correctedAt: new Date(),
          },
          create: {
            userId,
            questionId: answer.questionId,
            lessonId,
            selectedOptionId: answer.selectedOptionId,
            score:
              results.find((r) => r.questionId === answer.questionId)?.score ||
              0,
            status: passed ? "APPROVED" : "REJECTED",
            correctedAt: new Date(),
          },
        }),
      ),
    );

    console.log("✅ Respostas salvas:", savedAnswers.length);

    return {
      success: true,
      data: {
        totalScore,
        maxScore,
        percentageScore,
        passed,
        results,
        savedAnswers,
      },
    };
  } catch (error) {
    console.error("❌ Erro ao salvar respostas do quiz:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function generateCertificateForCompletedCourse(
  userId: string,
  courseId: string,
) {
  try {
    console.log("🎯 Iniciando geração de certificado para:", {
      userId,
      courseId,
    });

    // Check if course has certificate template
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        certificateTemplate: true,
      },
    });

    console.log("📋 Curso encontrado:", !!course);
    console.log("📋 Template de certificado:", !!course?.certificateTemplate);

    if (!course || !course.certificateTemplate) {
      return {
        success: false,
        error: "Curso não possui template de certificado",
      };
    }

    // Check if user already has a certificate for this course
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        template: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (existingCertificate) {
      console.log("📜 Certificado já existe:", existingCertificate.id);
      return { success: true, certificate: existingCertificate };
    }

    // Generate verification code
    const verificationCode =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    console.log("🔑 Código de verificação gerado:", verificationCode);

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        templateId: course.certificateTemplate.id,
        verificationCode,
        status: "ISSUED",
        issuedAt: new Date(),
      },
      include: {
        template: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { success: true, certificate };
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    return { success: false, error: "Erro ao gerar certificado" };
  }
}

"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { ImageViewer } from "@/src/components/image-viewer";
import { useAccordionState } from "@/src/hooks/use-accordion-state";
import { useCourseLessons } from "@/src/hooks/use-course-lessons";
import { useCourseModules } from "@/src/hooks/use-course-modules";
import { useCourseQuestions } from "@/src/hooks/use-course-questions";
import {
  deleteCourse,
  getCourseById,
  getCourseModules,
  getLeaders,
  updateCourse,
  updateCourseStatus,
} from "@/src/lib/actions";
import {
  createCertificateTemplate,
  updateCertificateTemplate,
} from "@/src/lib/actions/certificate";
import {
  certificateTemplateSchema,
  courseSchema,
  lessonSchema,
  moduleSchema,
  type CertificateTemplateFormData,
  type CourseFormData,
  type LessonFormData,
  type ModuleFormData,
} from "@/src/lib/forms/course-schemas";
import {
  convertFileToBase64,
  getLessonTypeIcon,
  getLessonTypeText,
} from "@/src/lib/helpers/course.helper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CertificateForm,
  CourseHeader,
  CourseInfoForm,
  LessonForm,
  ModuleForm,
  QuestionList,
} from "../../components";

interface EditCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function EditCoursePage(props: EditCoursePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { courseId } = use(props.params);

  // Buscar dados do curso do banco
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    select: (data) => data.course,
  });

  // Buscar módulos do curso
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: () => getCourseModules(courseId),
    select: (data) => data.modules,
  });

  // Buscar líderes para o campo de instrutor
  const { data: leadersData, isLoading: leadersLoading } = useQuery({
    queryKey: ["leaders"],
    queryFn: getLeaders,
    select: (data) => data.leaders,
  });

  // Hooks personalizados para gerenciamento de módulos, lições e questões
  const {
    modules: modulesState,
    isLoading: isLoadingModules,
    showModuleForm,
    setShowModuleForm,
    editingModuleIndex,
    addModule,
    startEditModule,
    cancelEditModule,
    saveModule,
    removeModule,
    setModules: setModulesState,
  } = useCourseModules(courseId, {
    onModuleChange: () => {
      refetchModules();
    },
  });

  const {
    isLoading: isLoadingLessons,
    showLessonForm,
    setShowLessonForm,
    editingLesson,
    startEditLesson,
    cancelEditLesson,
    addLesson,
    saveLesson,
    removeLesson,
  } = useCourseLessons(modulesState, setModulesState, {
    onLessonChange: () => {
      refetchModules();
    },
  });

  const { addQuestion, removeQuestion } = useCourseQuestions(
    modulesState,
    setModulesState,
  );

  const { openItems: openModules, setItems: setOpenModules } =
    useAccordionState();

  const { openItems: openLessons, setItems: setOpenLessons } =
    useAccordionState();

  // Formulário do curso
  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      instructorId: "",
      level: "beginner",
      category: "CREATIVITY",
      tags: "",
      price: 0,
    },
  });

  // Formulário do módulo
  const moduleForm = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Formulário da lição
  const lessonForm = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      duration: 15,
      type: "VIDEO",
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

  // Watch course title to auto-generate certificate title
  const courseTitle = courseForm.watch("title");
  const courseDescription = courseForm.watch("description");

  // Atualizar formulário quando os dados chegarem
  useEffect(() => {
    if (courseData) {
      courseForm.reset({
        title: courseData.title,
        description: courseData.description || "",
        instructorId: courseData.instructorId || "",
        level:
          (courseData.level as "beginner" | "intermediate" | "advanced") ||
          "beginner",
        category: courseData.category || "CREATIVITY",
        tags: courseData.tags?.join(", ") || "",
        price: courseData.price || 0,
      });
    }
  }, [courseData, courseForm]);

  // Atualizar módulos quando os dados chegarem
  useEffect(() => {
    if (modulesData) {
      const transformedModules = modulesData.map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        order: module.order,
        lessons:
          module.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
            type: lesson.type,
            isActivity: lesson.isActivity,
            questions:
              lesson.questions?.map((question: any) => ({
                id: question.id,
                questionText: question.questionText,
                points: question.points,
                order: question.order,
                explanation: question.explanation,
                type:
                  question.type === "OBJECTIVE" ? "objective" : "subjective",
                subjectiveAnswerType:
                  question.subjectiveAnswerType?.toLowerCase(),
                correctAnswer: question.correctAnswer,
                options:
                  question.options?.map((option: any) => ({
                    id: option.id,
                    optionText: option.optionText,
                    isCorrect: option.isCorrect,
                    order: option.order,
                  })) || [],
              })) || [],
          })) || [],
      }));
      setModulesState(transformedModules);
    }
  }, [modulesData]);

  // Atualizar template de certificado quando os dados chegarem
  useEffect(() => {
    if (courseData) {
      if (courseData.certificateTemplate) {
        certificateTemplateForm.setValue(
          "title",
          courseData.certificateTemplate.title,
        );
        certificateTemplateForm.setValue(
          "description",
          courseData.certificateTemplate.description || "",
        );
      } else {
        certificateTemplateForm.setValue(
          "title",
          `Certificado - ${courseData.title}`,
        );
        certificateTemplateForm.setValue(
          "description",
          courseData.description || "",
        );
      }
    }
  }, [courseData]);

  // Atualizar curso
  const handleUpdateCourse = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const result = await updateCourse(courseId, data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar curso");
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar curso
  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCourse(courseId);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/courses");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir curso");
    } finally {
      setIsDeleting(false);
    }
  };

  // Alternar status do curso (publicar/despublicar)
  const handleFinishCourse = async () => {
    if (!courseId || !courseData) return;

    const isCurrentlyPublished = courseData.isPublished;
    const newStatus = isCurrentlyPublished ? "draft" : "published";
    const actionText = isCurrentlyPublished ? "despublicar" : "publicar";

    // Confirmar despublicação
    if (isCurrentlyPublished) {
      if (
        !confirm(
          "Tem certeza que deseja voltar este curso para rascunho? Ele não estará mais visível para os alunos.",
        )
      ) {
        return;
      }
    }

    setIsLoading(true);
    try {
      const result = await updateCourseStatus(courseId, newStatus);
      if (result.success) {
        toast.success(
          isCurrentlyPublished
            ? "Curso voltou para rascunho!"
            : "Curso publicado com sucesso!",
        );
        // Invalidar cache para atualizar o status na UI
        queryClient.invalidateQueries({
          queryKey: ["course", courseId],
        });
      } else {
        toast.error(result.error || `Erro ao ${actionText} curso`);
      }
    } catch (error) {
      toast.error(`Erro ao ${actionText} curso`);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar ou atualizar template de certificado
  const handleCreateCertificateTemplate = async (
    data: CertificateTemplateFormData,
  ) => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      let templateUrl = "";
      if (certificateFile) {
        templateUrl = await convertFileToBase64(certificateFile);
      }

      const result = await createCertificateTemplate({
        courseId,
        title: data.title,
        description: data.description,
        templateUrl,
      });

      if (result.success) {
        toast.success("Template de certificado criado com sucesso!");
        setShowCertificateForm(false);
        setIsEditingCertificate(false);
        certificateTemplateForm.reset();
        setCertificateFile(null);
        queryClient.invalidateQueries({
          queryKey: ["course", courseId],
        });
      } else {
        toast.error(result.error || "Erro ao criar template de certificado");
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
    if (!courseId || !courseData?.certificateTemplate) return;

    setIsLoading(true);
    try {
      let templateUrl = courseData.certificateTemplate.templateUrl || "";
      if (certificateFile) {
        templateUrl = await convertFileToBase64(certificateFile);
      }

      const result = await updateCertificateTemplate(
        courseData.certificateTemplate.id,
        {
          title: data.title,
          description: data.description,
          templateUrl,
          isActive: true,
        },
      );

      if (result.success) {
        toast.success("Template de certificado atualizado com sucesso!");
        setShowCertificateForm(false);
        setIsEditingCertificate(false);
        setCertificateFile(null);
        queryClient.invalidateQueries({
          queryKey: ["course", courseId],
        });
      } else {
        toast.error(
          result.error || "Erro ao atualizar template de certificado",
        );
      }
    } catch (error) {
      toast.error("Erro ao atualizar template de certificado");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (courseLoading || modulesLoading) {
    return (
      <div className="dark-bg-primary min-h-screen pb-20">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <BookOpen className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Carregando curso...
            </h1>
            <p className="dark-text-secondary">
              Buscando informações do curso e módulos
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || modulesError || !courseData) {
    return (
      <div className="dark-bg-primary min-h-screen pb-20">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <BookOpen className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Erro ao carregar curso
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar as informações do curso. Tente
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
      <CourseHeader
        courseId={courseId}
        hasModules={modulesState.length > 0}
        isLoading={isLoading}
        isEditing={true}
        isDeleting={isDeleting}
        isPublished={courseData?.isPublished || false}
        onFinishCourse={handleFinishCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      {/* Course Form */}
      <CourseInfoForm
        form={courseForm}
        courseId={courseId}
        isLoading={isLoading}
        isEditing={true}
        leadersData={leadersData || []}
        leadersLoading={leadersLoading}
        onSubmit={handleUpdateCourse}
      />

      {/* Modules Section */}
      <div className="space-y-6">
        {/* Add Module Button */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
              <Layers className="dark-primary" size={24} />
              Módulos do Curso ({modulesState.length})
            </h2>
            <Button
              variant="success"
              onClick={() => {
                setShowModuleForm(!showModuleForm);
                if (!showModuleForm) {
                  const newModuleIndex = modulesState.length;
                  setOpenModules([...openModules, `module-${newModuleIndex}`]);
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Módulo
            </Button>
          </div>

          {/* Module Form */}
          {showModuleForm && (
            <ModuleForm
              form={moduleForm}
              isLoading={isLoadingModules}
              onSubmit={(data) => addModule(data)}
              onCancel={() => {
                setShowModuleForm(false);
                moduleForm.reset();
              }}
            />
          )}
        </div>

        {/* Modules List */}
        {modulesState.length > 0 && (
          <Accordion
            type="multiple"
            className="space-y-4"
            value={openModules}
            onValueChange={setOpenModules}
          >
            {modulesState.map((module, moduleIndex) => (
              <AccordionItem
                key={moduleIndex}
                value={`module-${moduleIndex}`}
                className="dark-glass dark-shadow-sm rounded-xl"
              >
                <AccordionTrigger
                  arrow={false}
                  className="dark-card hover:dark-bg-secondary p-4 transition-all"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="dark-primary-subtle-bg rounded-xl p-2">
                        <Layers className="dark-primary" size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="dark-text-primary font-semibold">
                          {module.title}
                        </h3>
                        <p className="dark-text-secondary text-sm">
                          {module.description}
                        </p>
                        <p className="dark-text-tertiary mt-1 text-xs">
                          {module.lessons.length} lição(ões)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLessonForm(moduleIndex);
                          setOpenModules([
                            ...openModules,
                            `module-${moduleIndex}`,
                          ]);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar nova lição
                      </Button>
                      <Button
                        size="sm"
                        variant="info"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          const mod = modulesState[moduleIndex];
                          if (mod) {
                            moduleForm.reset({
                              title: mod.title,
                              description: mod.description,
                            });
                            startEditModule(moduleIndex);
                            setOpenModules([
                              ...openModules,
                              `module-${moduleIndex}`,
                            ]);
                          }
                        }}
                      >
                        <Edit className="h-3 w-3" />
                        Editar módulo
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeModule(module.id, moduleIndex);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                        Excluir módulo
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="dark-border">
                  {/* Module Edit Form */}
                  {editingModuleIndex === moduleIndex && (
                    <div className="dark-border border-b p-6">
                      <ModuleForm
                        form={moduleForm}
                        isLoading={isLoadingModules}
                        onSubmit={(data) => saveModule(data, moduleIndex)}
                        onCancel={() => {
                          cancelEditModule();
                          moduleForm.reset();
                        }}
                      />
                    </div>
                  )}

                  {/* Lesson Form */}
                  {showLessonForm === moduleIndex && (
                    <LessonForm
                      form={lessonForm}
                      isEditing={false}
                      isLoading={isLoadingLessons}
                      moduleIndex={moduleIndex}
                      onSubmit={async (data) => {
                        return await addLesson(data, moduleIndex);
                      }}
                      onCancel={() => {
                        setShowLessonForm(null);
                        lessonForm.reset();
                      }}
                    />
                  )}

                  {/* Lessons List */}
                  {module.lessons.length > 0 && (
                    <div className="p-4">
                      <h4 className="dark-text-primary mb-3 font-medium">
                        Lições ({module.lessons.length})
                      </h4>
                      <Accordion
                        type="multiple"
                        className="space-y-3"
                        value={openLessons.filter((lesson) =>
                          lesson.startsWith(`lesson-${moduleIndex}-`),
                        )}
                        onValueChange={(value) => {
                          const otherLessons = openLessons.filter(
                            (lesson) =>
                              !lesson.startsWith(`lesson-${moduleIndex}-`),
                          );
                          setOpenLessons([...otherLessons, ...value]);
                        }}
                      >
                        {module.lessons.map((lesson, lessonIndex) => (
                          <AccordionItem
                            key={lessonIndex}
                            value={`lesson-${moduleIndex}-${lessonIndex}`}
                            className="dark-card dark-shadow-sm rounded-lg"
                          >
                            <AccordionTrigger
                              arrow={false}
                              className="hover:dark-bg-secondary p-4 transition-colors"
                            >
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="dark-secondary-subtle-bg rounded-lg p-2">
                                    {(() => {
                                      const LessonIcon = getLessonTypeIcon(
                                        lesson.type,
                                      );
                                      return (
                                        <LessonIcon
                                          className="dark-secondary"
                                          size={16}
                                        />
                                      );
                                    })()}
                                  </div>
                                  <div className="text-left">
                                    <h5 className="dark-text-primary font-medium">
                                      {lesson.title}
                                    </h5>
                                    <p className="dark-text-secondary text-sm">
                                      {lesson.description}
                                    </p>
                                    <div className="mt-1 flex items-center gap-4">
                                      <span className="dark-text-tertiary text-xs">
                                        Tipo: {getLessonTypeText(lesson.type)}
                                      </span>
                                      <span className="dark-text-tertiary text-xs">
                                        Duração: {lesson.duration}min
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="info"
                                    className="gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const les =
                                        modulesState[moduleIndex]?.lessons[
                                          lessonIndex
                                        ];
                                      if (les) {
                                        lessonForm.reset({
                                          title: les.title,
                                          description: les.description,
                                          content: les.content || "",
                                          videoUrl: les.videoUrl || "",
                                          duration: les.duration,
                                          type: les.type as any,
                                        });
                                        startEditLesson(
                                          moduleIndex,
                                          lessonIndex,
                                        );
                                        setOpenModules([
                                          ...openModules,
                                          `module-${moduleIndex}`,
                                        ]);
                                        setOpenLessons([
                                          ...openLessons,
                                          `lesson-${moduleIndex}-${lessonIndex}`,
                                        ]);
                                      }
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                    Editar Lição
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLesson(
                                        lesson.id,
                                        moduleIndex,
                                        lessonIndex,
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Excluir Lição
                                  </Button>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                              {editingLesson?.moduleIndex === moduleIndex &&
                              editingLesson?.lessonIndex === lessonIndex ? (
                                // Formulário de edição
                                <LessonForm
                                  form={lessonForm}
                                  isEditing={true}
                                  isLoading={isLoadingLessons}
                                  moduleIndex={moduleIndex}
                                  lessonIndex={lessonIndex}
                                  onSubmit={async (data) => {
                                    return await saveLesson(
                                      data,
                                      moduleIndex,
                                      lessonIndex,
                                    );
                                  }}
                                  onCancel={() => {
                                    cancelEditLesson();
                                    lessonForm.reset();
                                  }}
                                  addQuestion={addQuestion}
                                  questions={lesson.questions || []}
                                  onDeleteQuestion={removeQuestion}
                                />
                              ) : (
                                // Visualização da lição
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                      <h6 className="dark-text-primary mb-2 font-medium">
                                        Tipo de Conteúdo
                                      </h6>
                                      <div className="flex items-center space-x-2">
                                        {(() => {
                                          const LessonIcon = getLessonTypeIcon(
                                            lesson.type,
                                          );
                                          return (
                                            <LessonIcon
                                              className="dark-secondary"
                                              size={16}
                                            />
                                          );
                                        })()}
                                        <span className="dark-text-secondary text-sm">
                                          {getLessonTypeText(lesson.type)}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="dark-text-primary mb-2 font-medium">
                                        Duração
                                      </h6>
                                      <p className="dark-text-secondary text-sm">
                                        {lesson.duration} minutos
                                      </p>
                                    </div>
                                  </div>

                                  {!lesson.content &&
                                    !lesson.videoUrl &&
                                    lesson.questions?.length === 0 && (
                                      <div className="dark-card dark-shadow-sm rounded-lg p-6 text-center">
                                        <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                                          <BookOpen
                                            className="dark-text-tertiary"
                                            size={20}
                                          />
                                        </div>
                                        <h6 className="dark-text-primary mb-2 font-medium">
                                          Conteúdo não definido
                                        </h6>
                                        <p className="dark-text-tertiary text-sm">
                                          Esta lição ainda não possui conteúdo
                                          específico definido.
                                        </p>
                                      </div>
                                    )}

                                  {lesson.videoUrl && (
                                    <div>
                                      <h6 className="dark-text-primary mb-2 font-medium">
                                        Vídeo da Lição
                                      </h6>
                                      <a
                                        href={lesson.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dark-text-secondary hover:dark-text-primary text-sm underline"
                                      >
                                        {lesson.videoUrl}
                                      </a>
                                    </div>
                                  )}

                                  {lesson.content && (
                                    <div>
                                      <h6 className="dark-text-primary mb-2 font-medium">
                                        Conteúdo da Lição
                                      </h6>
                                      <div className="dark-card dark-shadow-sm rounded-lg p-4">
                                        <p className="dark-text-secondary text-sm whitespace-pre-wrap">
                                          {lesson.content}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Questões (para atividades) */}
                                  {lesson.questions &&
                                    lesson.questions.length > 0 && (
                                      <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h6 className="dark-text-primary font-medium">
                                            Questões da Atividade
                                          </h6>
                                        </div>

                                        <QuestionList
                                          questions={lesson.questions || []}
                                          onDeleteQuestion={(index) => {
                                            removeQuestion(
                                              moduleIndex,
                                              lessonIndex,
                                              index,
                                            );
                                          }}
                                        />
                                      </div>
                                    )}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Certificate Section */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
              <Award className="dark-primary" size={24} />
              Template de Certificado
            </h2>
            {courseData?.certificateTemplate ? (
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
          {courseData?.certificateTemplate && !showCertificateForm && (
            <div className="mt-6">
              <div className="dark-card dark-shadow-sm rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                      {courseData.certificateTemplate.title}
                    </h3>
                    <p className="dark-text-secondary mb-4 text-sm">
                      {courseData.certificateTemplate.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          courseData.certificateTemplate.isActive
                            ? "dark-success-bg dark-success"
                            : "dark-warning-bg dark-warning"
                        }`}
                      >
                        {courseData.certificateTemplate.isActive
                          ? "Ativo"
                          : "Inativo"}
                      </div>
                      {courseData.certificateTemplate.templateUrl && (
                        <div className="dark-info-bg dark-info rounded-full px-2 py-1 text-xs font-medium">
                          Certificado Disponível
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {courseData.certificateTemplate.templateUrl && (
                      <ImageViewer
                        imageBase64={courseData.certificateTemplate.templateUrl}
                        imageUrl={courseData.certificateTemplate.templateUrl}
                        title={`Template: ${courseData.certificateTemplate.title}`}
                        fileName={`template-${courseData.certificateTemplate.id}.png`}
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
            <CertificateForm
              form={certificateTemplateForm}
              isLoading={isLoading}
              isEditing={isEditingCertificate}
              courseTitle={courseTitle}
              courseDescription={courseDescription}
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
      </div>
    </PageLayout>
  );
}

"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { useAccordionState } from "@/src/hooks/use-accordion-state";
import { useCourseLessons } from "@/src/hooks/use-course-lessons";
import { useCourseModules } from "@/src/hooks/use-course-modules";
import { useCourseQuestions } from "@/src/hooks/use-course-questions";
import {
  createCourse,
  getLeaders,
  updateCourseStatus,
} from "@/src/lib/actions";
import { createCertificateTemplate } from "@/src/lib/actions/certificate";
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
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, Edit, Layers, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CertificateForm,
  CourseHeader,
  CourseInfoForm,
  LessonForm,
  ModuleForm,
  QuestionForm,
  QuestionList,
} from "../components";

export default function CreateCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [openCourseInfo, setOpenCourseInfo] = useState<string[]>([
    "course-info",
  ]);
  const [isEditingCourseInfo, setIsEditingCourseInfo] = useState(false);
  const router = useRouter();

  // Hooks personalizados para gerenciamento de módulos, lições e questões
  const {
    modules,
    isLoading: isLoadingModules,
    showModuleForm,
    setShowModuleForm,
    editingModuleIndex,
    addModule,
    startEditModule,
    cancelEditModule,
    saveModule,
    removeModuleByIndex,
    setModules,
  } = useCourseModules(courseId || "", {});

  const {
    isLoading: isLoadingLessons,
    showLessonForm,
    setShowLessonForm,
    editingLesson,
    startEditLesson,
    cancelEditLesson,
    addLesson,
    saveLesson,
    removeLessonByIndex,
  } = useCourseLessons(modules, setModules);

  const {
    isLoading: isLoadingQuestions,
    showQuestionForm,
    setShowQuestionForm,
    addQuestion,
    removeQuestion,
  } = useCourseQuestions(modules, setModules);

  const { openItems: openModules, setItems: setOpenModules } =
    useAccordionState();
  const { openItems: openLessons, setItems: setOpenLessons } =
    useAccordionState();

  // Abrir seção de módulos por padrão quando curso for criado
  useEffect(() => {
    if (courseId && !openModules.includes("modules-section")) {
      setOpenModules(["modules-section"]);
    }
  }, [courseId]);

  // Buscar líderes para o campo de instrutor
  const { data: leadersData, isLoading: leadersLoading } = useQuery({
    queryKey: ["leaders"],
    queryFn: getLeaders,
    select: (data) => data.leaders,
  });

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

  // Watch lesson type for conditional fields
  const selectedLessonType = lessonForm.watch("type");

  // Watch course title to auto-generate certificate title
  const courseTitle = courseForm.watch("title");
  const courseDescription = courseForm.watch("description");

  // Criar curso
  const handleCreateCourse = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      // Converter banner para base64 se houver
      let bannerUrl = "";
      if (bannerFile) {
        bannerUrl = await convertFileToBase64(bannerFile);
      }

      const result = await createCourse({
        ...data,
        tags: data.tags || "",
        image: bannerUrl,
      });

      if (result.success && result.course) {
        setCourseId(result.course.id);
        toast.success(
          "Curso criado com sucesso! Agora você pode adicionar módulos.",
        );
      }
    } catch (error) {
      toast.error("Erro ao criar curso");
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar como rascunho
  const handleSaveDraft = async () => {
    if (!courseId) {
      const courseData = courseForm.getValues();
      await handleCreateCourse(courseData);
    } else {
      toast.success("Curso salvo como rascunho!");
      router.push("/dashboard/courses");
    }
  };

  // Criar template de certificado
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
        certificateTemplateForm.reset();
        setCertificateFile(null);
      } else {
        toast.error(result.error || "Erro ao criar template de certificado");
      }
    } catch (error) {
      toast.error("Erro ao criar template de certificado");
    } finally {
      setIsLoading(false);
    }
  };

  // Finalizar curso
  const handleFinishCourse = async () => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      const result = await updateCourseStatus(courseId, "published");
      if (result.success) {
        toast.success("Curso publicado com sucesso!");
        router.push("/dashboard/courses");
      } else {
        toast.error(result.error || "Erro ao publicar curso");
      }
    } catch (error) {
      toast.error("Erro ao finalizar curso");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout maxWidth="6xl" spacing="relaxed">
      {/* Header */}
      <CourseHeader
        courseId={courseId}
        hasModules={modules.length > 0}
        isLoading={isLoading}
        onSaveDraft={handleSaveDraft}
        onFinishCourse={handleFinishCourse}
      />

      {/* Course Form */}
      <CourseInfoForm
        form={courseForm}
        courseId={courseId}
        isLoading={isLoading}
        isEditing={isEditingCourseInfo || !courseId}
        leadersData={leadersData || []}
        leadersLoading={leadersLoading}
        onSubmit={async (data) => {
          await handleCreateCourse(data);
          if (courseId) {
            setIsEditingCourseInfo(false);
            setOpenCourseInfo([]);
          }
        }}
        accordionValue={openCourseInfo}
        onAccordionChange={setOpenCourseInfo}
        onToggleEdit={() => {
          setIsEditingCourseInfo(!isEditingCourseInfo);
          if (!isEditingCourseInfo) {
            setOpenCourseInfo(["course-info"]);
          }
        }}
        showEditButton={courseId ? !isEditingCourseInfo : false}
        bannerFile={bannerFile}
        setBannerFile={setBannerFile}
        existingBanner={null}
      />

      {/* Modules Section - Only show after course is created */}
      {courseId && (
        <div className="dark-glass dark-shadow-sm rounded-xl">
          <Accordion
            type="multiple"
            className="space-y-0"
            value={openModules}
            onValueChange={setOpenModules}
          >
            <AccordionItem value="modules-section" className="border-0">
              <AccordionTrigger
                arrow={false}
                className="dark-card hover:dark-bg-secondary p-6 transition-all"
              >
                <div className="flex w-full items-center justify-between">
                  <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                    <Layers className="dark-primary" size={24} />
                    Módulos do Curso ({modules.length})
                  </h2>
                  <Button
                    variant="success"
                    onClick={() => {
                      setShowModuleForm(!showModuleForm);
                      if (!showModuleForm) {
                        const newModuleIndex = modules.length;
                        setOpenModules([
                          ...openModules,
                          `module-${newModuleIndex}`,
                        ]);
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Módulo
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="dark-border p-4">
                <Accordion
                  type="multiple"
                  className="space-y-4"
                  value={openModules}
                  onValueChange={setOpenModules}
                >
                  {/* Module Form */}
                  {showModuleForm && (
                    <ModuleForm
                      form={moduleForm}
                      isLoading={isLoadingModules}
                      onSubmit={async (data) => {
                        const success = await addModule(data);
                        if (success) {
                          setShowModuleForm(false);
                          moduleForm.reset();
                          const newModuleIndex = modules.length;
                          setOpenModules([
                            "modules-section",
                            `module-${newModuleIndex}`,
                          ]);
                        }
                      }}
                      onCancel={() => {
                        setShowModuleForm(false);
                        moduleForm.reset();
                      }}
                    />
                  )}

                  {/* Existing Modules */}
                  {modules.length > 0 ? (
                    modules.map((module, moduleIndex) => (
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
                                    "modules-section",
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
                                  const mod = modules[moduleIndex];
                                  if (mod) {
                                    moduleForm.reset({
                                      title: mod.title,
                                      description: mod.description,
                                    });
                                    startEditModule(moduleIndex);
                                    setOpenModules([
                                      ...openModules,
                                      "modules-section",
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
                                  removeModuleByIndex(moduleIndex);
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
                                onSubmit={(data) =>
                                  saveModule(data, moduleIndex)
                                }
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
                                      !lesson.startsWith(
                                        `lesson-${moduleIndex}-`,
                                      ),
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
                                              const LessonIcon =
                                                getLessonTypeIcon(lesson.type);
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
                                                Tipo:{" "}
                                                {getLessonTypeText(lesson.type)}
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
                                                modules[moduleIndex]?.lessons[
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
                                                  "modules-section",
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
                                              removeLessonByIndex(
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
                                      {editingLesson?.moduleIndex ===
                                        moduleIndex &&
                                      editingLesson?.lessonIndex ===
                                        lessonIndex ? (
                                        // Formulário de edição
                                        <LessonForm
                                          form={lessonForm}
                                          isEditing={false}
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
                                                  const LessonIcon =
                                                    getLessonTypeIcon(
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
                                                  {getLessonTypeText(
                                                    lesson.type,
                                                  )}
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

                                          {lesson.videoUrl && (
                                            <div>
                                              <h6 className="dark-text-primary mb-2 font-medium">
                                                Vídeo da Lição
                                              </h6>
                                              <div className="space-y-2">
                                                <a
                                                  href={lesson.videoUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="dark-text-secondary hover:dark-text-primary text-sm underline"
                                                >
                                                  {lesson.videoUrl}
                                                </a>
                                              </div>
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

                                          {!lesson.content &&
                                            !lesson.videoUrl && (
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
                                                  Esta lição ainda não possui
                                                  conteúdo específico definido.
                                                </p>
                                              </div>
                                            )}

                                          {/* Questões (para atividades) */}
                                          {lesson.isActivity && (
                                            <div className="mt-6 space-y-4">
                                              <div className="flex items-center justify-between">
                                                <h6 className="dark-text-primary font-medium">
                                                  Questões da Atividade
                                                </h6>
                                                {!showQuestionForm ||
                                                showQuestionForm.moduleIndex !==
                                                  moduleIndex ||
                                                showQuestionForm.lessonIndex !==
                                                  lessonIndex ? (
                                                  <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() =>
                                                      setShowQuestionForm({
                                                        moduleIndex,
                                                        lessonIndex,
                                                      })
                                                    }
                                                  >
                                                    <Plus className="mr-2 h-3 w-3" />
                                                    Adicionar Questão
                                                  </Button>
                                                ) : null}
                                              </div>

                                              {/* Formulário de Questão */}
                                              {showQuestionForm &&
                                                showQuestionForm.moduleIndex ===
                                                  moduleIndex &&
                                                showQuestionForm.lessonIndex ===
                                                  lessonIndex &&
                                                lesson.id && (
                                                  <QuestionForm
                                                    currentQuestionsCount={
                                                      lesson.questions
                                                        ?.length || 0
                                                    }
                                                    onSuccess={async (
                                                      question,
                                                    ) => {
                                                      await addQuestion(
                                                        question,
                                                        moduleIndex,
                                                        lessonIndex,
                                                      );
                                                    }}
                                                    onCancel={() => {
                                                      setShowQuestionForm(null);
                                                    }}
                                                  />
                                                )}

                                              {/* Lista de Questões */}
                                              <QuestionList
                                                questions={
                                                  lesson.questions || []
                                                }
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
                    ))
                  ) : (
                    <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                      <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Layers className="dark-text-tertiary" size={32} />
                      </div>
                      <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                        Nenhum módulo cadastrado
                      </h3>
                      <p className="dark-text-secondary mb-4 text-sm">
                        Comece adicionando o primeiro módulo ao curso
                      </p>
                      <Button
                        variant="success"
                        onClick={() => {
                          setShowModuleForm(true);
                          setOpenModules(["modules-section"]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Primeiro Módulo
                      </Button>
                    </div>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Certificate Section */}
      {courseId && (
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
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Template
                </Button>
              </div>
            )}
          </div>

          {/* Certificate Form */}
          {showCertificateForm && (
            <CertificateForm
              form={certificateTemplateForm}
              isLoading={isLoading}
              isEditing={editingCertificate}
              courseTitle={courseTitle}
              courseDescription={courseDescription}
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

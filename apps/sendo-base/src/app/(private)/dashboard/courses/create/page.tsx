"use client";

import {
  createCourse,
  createLesson,
  createModule,
  createObjectiveQuestion,
  createSubjectiveQuestion,
  getLeaders,
  updateCourseStatus,
} from "@/src/lib/actions";
import { createCertificateTemplate } from "@/src/lib/actions/certificate";
import { extractYouTubeEmbedId } from "@/src/lib/helpers/youtube";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  Layers,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CertificateForm,
  CourseHeader,
  CourseInfoForm,
  LessonForm,
  ModuleForm,
  QuestionForm,
  QuestionList,
} from "../components";

// Schemas de validação
const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  instructorId: z.string().min(1, "Instrutor é obrigatório"),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Nível é obrigatório",
  }),
  category: z.string().min(1, "Categoria é obrigatória"),
  tags: z.string().optional(),
  price: z.number().min(0, "Preço não pode ser negativo"),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Título do módulo é obrigatório"),
  description: z.string().min(1, "Descrição do módulo é obrigatória"),
});

const lessonSchema = z.object({
  title: z.string().min(1, "Título da lição é obrigatório"),
  description: z.string().min(1, "Descrição da lição é obrigatória"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  type: z.enum(["video", "text", "objective_quiz", "subjective_quiz"], {
    required_error: "Tipo é obrigatório",
  }),
  isActivity: z.boolean().optional(),
});

const certificateTemplateSchema = z.object({
  title: z.string().min(1, "Título do certificado é obrigatório"),
  description: z.string().min(1, "Descrição do certificado é obrigatória"),
  pdfFile: z.any().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;
type ModuleFormData = z.infer<typeof moduleSchema>;
type LessonFormData = z.infer<typeof lessonSchema>;
type CertificateTemplateFormData = z.infer<typeof certificateTemplateSchema>;

interface Module {
  id?: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Question {
  id?: string;
  questionText: string;
  points: number;
  order: number;
  explanation?: string;
  type: "objective" | "subjective";
  subjectiveAnswerType?: "text" | "file";
  correctAnswer?: string;
  options?: {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }[];
}

interface Lesson {
  id?: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  youtubeEmbedId?: string;
  duration: number;
  order: number;
  type: "video" | "text" | "objective_quiz" | "subjective_quiz";
  isActivity?: boolean;
  questions?: Question[];
}

export default function CreateCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
  const router = useRouter();

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
      duration: 120,
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
      type: "video",
      isActivity: false,
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
      const result = await createCourse({
        ...data,
        tags: data.tags || "",
        status: "draft",
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

  // Adicionar módulo
  const handleAddModule = async (data: ModuleFormData) => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      const result = await createModule(courseId, {
        ...data,
        order: modules.length + 1,
      });

      if (result.success && result.module) {
        const newModule: Module = {
          id: result.module.id,
          title: data.title,
          description: data.description,
          order: modules.length + 1,
          lessons: [],
        };
        setModules([...modules, newModule]);
        moduleForm.reset();
        setShowModuleForm(false);
        toast.success("Módulo adicionado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao criar módulo");
      }
    } catch (error) {
      toast.error("Erro ao criar módulo");
    } finally {
      setIsLoading(false);
    }
  };

  // Editar módulo
  const handleEditModule = (moduleIndex: number) => {
    const module = modules[moduleIndex];
    if (module) {
      moduleForm.reset({
        title: module.title,
        description: module.description,
      });
      setEditingModule(moduleIndex);
    }
  };

  // Salvar edição do módulo
  const handleSaveModuleEdit = async (
    data: ModuleFormData,
    moduleIndex: number,
  ) => {
    const updatedModules = [...modules];
    if (updatedModules[moduleIndex]) {
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        title: data.title,
        description: data.description,
      };
      setModules(updatedModules);
      setEditingModule(null);
      toast.success("Módulo atualizado com sucesso!");
    }
  };

  // Editar lição
  const handleEditLesson = (moduleIndex: number, lessonIndex: number) => {
    const lesson = modules[moduleIndex]?.lessons[lessonIndex];
    if (lesson) {
      lessonForm.reset({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content || "",
        videoUrl: lesson.videoUrl || "",
        duration: lesson.duration,
        type: lesson.type,
      });
      setEditingLesson({ moduleIndex, lessonIndex });
    }
  };

  const handleSaveLessonEdit = async (
    data: LessonFormData,
    moduleIndex: number,
    lessonIndex: number,
  ) => {
    const module = modules[moduleIndex];
    if (!module || !module.id) return;

    setIsLoading(true);
    try {
      const updatedModules = [...modules];
      if (updatedModules[moduleIndex]?.lessons[lessonIndex]) {
        updatedModules[moduleIndex].lessons[lessonIndex] = {
          ...updatedModules[moduleIndex].lessons[lessonIndex],
          title: data.title,
          description: data.description,
          content: data.content,
          videoUrl: data.videoUrl,
          duration: data.duration,
          type: data.type,
        };
        setModules(updatedModules);
        setEditingLesson(null);
        toast.success("Lição atualizada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar lição");
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar lição
  const handleAddLesson = async (data: LessonFormData, moduleIndex: number) => {
    if (!courseId) return;

    const module = modules[moduleIndex];
    if (!module || !module.id) return;

    // Validar se está tentando adicionar uma atividade que não seja a última lição
    const isQuiz =
      data.type === "objective_quiz" || data.type === "subjective_quiz";
    if (isQuiz && module.lessons.length > 0) {
      const hasActivity = module.lessons.some((l) => l.isActivity);
      if (hasActivity) {
        toast.error(
          "Este módulo já possui uma atividade. Cada módulo pode ter apenas uma atividade como última lição.",
        );
        return;
      }
    }

    setIsLoading(true);
    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    // Mapear os tipos para o formato do banco
    let lessonType: "VIDEO" | "TEXT" | "OBJECTIVE_QUIZ" | "SUBJECTIVE_QUIZ" =
      "VIDEO";
    if (data.type === "video") lessonType = "VIDEO";
    else if (data.type === "text") lessonType = "TEXT";
    else if (data.type === "objective_quiz") lessonType = "OBJECTIVE_QUIZ";
    else if (data.type === "subjective_quiz") lessonType = "SUBJECTIVE_QUIZ";

    try {
      const result = await createLesson(module.id, {
        ...data,
        type: lessonType,
        youtubeEmbedId: youtubeEmbedId || undefined,
        order: module.lessons.length + 1,
        isActivity: isQuiz,
      });

      if (result.success && result.lesson) {
        const newLesson: Lesson = {
          id: result.lesson.id,
          title: data.title,
          description: data.description,
          content: data.content,
          videoUrl: data.videoUrl,
          youtubeEmbedId: youtubeEmbedId || undefined,
          duration: data.duration,
          order: module.lessons.length + 1,
          type: data.type,
          isActivity: isQuiz,
          questions: [],
        };

        const updatedModules = [...modules];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].lessons.push(newLesson);
          setModules(updatedModules);
        }
        lessonForm.reset();
        setShowLessonForm(null);

        if (isQuiz) {
          toast.success("Atividade criada! Agora adicione as questões.");
          // Abrir formulário de questões para a nova atividade
          setShowQuestionForm({
            moduleIndex,
            lessonIndex: module.lessons.length,
          });
        } else {
          toast.success("Lição adicionada com sucesso!");
        }
      } else {
        toast.error(result.error || "Erro ao criar lição");
      }
    } catch (error) {
      toast.error("Erro ao criar lição");
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

  // Converter arquivo para base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "text":
        return FileText;
      case "objective_quiz":
      case "subjective_quiz":
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "text":
        return "Texto";
      case "objective_quiz":
        return "Atividade Objetiva";
      case "subjective_quiz":
        return "Atividade Subjetiva";
      default:
        return "Texto";
    }
  };

  return (
    <div className="dark-bg-primary min-h-screen pb-20">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 p-6">
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
          leadersData={leadersData || []}
          leadersLoading={leadersLoading}
          onSubmit={handleCreateCourse}
        />

        {/* Modules Section - Only show after course is created */}
        {courseId && (
          <div className="space-y-6">
            {/* Add Module Button */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Layers className="dark-primary" size={24} />
                  Módulos do Curso ({modules.length})
                </h2>
                <Button
                  variant="success"
                  onClick={() => setShowModuleForm(!showModuleForm)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Módulo
                </Button>
              </div>

              {/* Module Form */}
              {showModuleForm && (
                <ModuleForm
                  form={moduleForm}
                  isLoading={isLoading}
                  onSubmit={handleAddModule}
                  onCancel={() => {
                    setShowModuleForm(false);
                    moduleForm.reset();
                  }}
                />
              )}
            </div>

            {/* Modules List */}
            {modules.length > 0 && (
              <Accordion
                type="multiple"
                className="space-y-4"
                value={openModules}
                onValueChange={setOpenModules}
              >
                {modules.map((module, moduleIndex) => (
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
                              handleEditModule(moduleIndex);
                              setOpenModules([
                                ...openModules,
                                `module-${moduleIndex}`,
                              ]);
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
                              const updatedModules = modules.filter(
                                (_, i) => i !== moduleIndex,
                              );
                              setModules(updatedModules);
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
                      {editingModule === moduleIndex && (
                        <div className="dark-border border-b p-6">
                          <ModuleForm
                            form={moduleForm}
                            isLoading={isLoading}
                            onSubmit={(data) =>
                              handleSaveModuleEdit(data, moduleIndex)
                            }
                            onCancel={() => {
                              setEditingModule(null);
                              moduleForm.reset();
                            }}
                          />
                        </div>
                      )}

                      {/* Lesson Form */}
                      {showLessonForm === moduleIndex && (
                        <LessonForm
                          form={lessonForm}
                          isLoading={isLoading}
                          onSubmit={(data) =>
                            handleAddLesson(data, moduleIndex)
                          }
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
                          <Accordion type="multiple" className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <AccordionItem
                                key={lessonIndex}
                                value={`lesson-${moduleIndex}-${lessonIndex}`}
                                className="dark-card dark-shadow-sm rounded-lg"
                              >
                                <AccordionTrigger className="hover:dark-bg-secondary p-4 transition-colors">
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditLesson(
                                            moduleIndex,
                                            lessonIndex,
                                          );
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updatedModules = [...modules];
                                          if (updatedModules[moduleIndex]) {
                                            updatedModules[
                                              moduleIndex
                                            ].lessons = updatedModules[
                                              moduleIndex
                                            ].lessons.filter(
                                              (_, i) => i !== lessonIndex,
                                            );
                                            setModules(updatedModules);
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
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
                                      isLoading={isLoading}
                                      onSubmit={(data) =>
                                        handleSaveLessonEdit(
                                          data,
                                          moduleIndex,
                                          lessonIndex,
                                        )
                                      }
                                      onCancel={() => {
                                        setEditingLesson(null);
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
                                                getLessonTypeIcon(lesson.type);
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

                                      {!lesson.content && !lesson.videoUrl && (
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
                                                  lesson.questions?.length || 0
                                                }
                                                onSuccess={async (question) => {
                                                  // Verificar se a lição tem ID
                                                  if (!lesson.id) {
                                                    toast.error(
                                                      "Lição precisa ser criada primeiro",
                                                    );
                                                    return;
                                                  }

                                                  // Criar a questão no banco
                                                  setIsLoading(true);
                                                  try {
                                                    let result;
                                                    if (
                                                      question.type ===
                                                      "objective"
                                                    ) {
                                                      result =
                                                        await createObjectiveQuestion(
                                                          {
                                                            lessonId: lesson.id,
                                                            questionText:
                                                              question.questionText,
                                                            points:
                                                              question.points,
                                                            order:
                                                              question.order,
                                                            explanation:
                                                              question.explanation,
                                                            options:
                                                              question.options ||
                                                              [],
                                                          },
                                                        );
                                                    } else {
                                                      result =
                                                        await createSubjectiveQuestion(
                                                          {
                                                            lessonId: lesson.id,
                                                            questionText:
                                                              question.questionText,
                                                            points:
                                                              question.points,
                                                            order:
                                                              question.order,
                                                            explanation:
                                                              question.explanation,
                                                            subjectiveAnswerType:
                                                              question.subjectiveAnswerType as
                                                                | "TEXT"
                                                                | "FILE",
                                                            correctAnswer:
                                                              question.correctAnswer,
                                                          },
                                                        );
                                                    }

                                                    if (
                                                      result.success &&
                                                      result.question
                                                    ) {
                                                      // Atualizar o estado local com a questão criada
                                                      const updatedModules = [
                                                        ...modules,
                                                      ];
                                                      if (
                                                        !updatedModules[
                                                          moduleIndex
                                                        ]?.lessons[lessonIndex]
                                                          ?.questions
                                                      ) {
                                                        updatedModules[
                                                          moduleIndex
                                                        ]!.lessons[
                                                          lessonIndex
                                                        ]!.questions = [];
                                                      }

                                                      updatedModules[
                                                        moduleIndex
                                                      ]?.lessons[
                                                        lessonIndex
                                                      ]?.questions!.push({
                                                        ...question,
                                                        id: result.question.id,
                                                      });

                                                      setModules(
                                                        updatedModules,
                                                      );
                                                      setShowQuestionForm(null);
                                                    } else {
                                                      toast.error(
                                                        result.error ||
                                                          "Erro ao criar questão no banco",
                                                      );
                                                    }
                                                  } catch (error) {
                                                    toast.error(
                                                      "Erro ao criar questão",
                                                    );
                                                  } finally {
                                                    setIsLoading(false);
                                                  }
                                                }}
                                                onCancel={() => {
                                                  setShowQuestionForm(null);
                                                }}
                                              />
                                            )}

                                          {/* Lista de Questões */}
                                          <QuestionList
                                            questions={lesson.questions || []}
                                            onDeleteQuestion={(index) => {
                                              const updatedModules = [
                                                ...modules,
                                              ];
                                              if (
                                                updatedModules[moduleIndex]
                                                  ?.lessons[lessonIndex]
                                                  ?.questions
                                              ) {
                                                updatedModules[
                                                  moduleIndex
                                                ].lessons[
                                                  lessonIndex
                                                ].questions = updatedModules[
                                                  moduleIndex
                                                ].lessons[
                                                  lessonIndex
                                                ].questions!.filter(
                                                  (_, i) => i !== index,
                                                );
                                                setModules(updatedModules);
                                                toast.success(
                                                  "Questão removida com sucesso!",
                                                );
                                              }
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
          </div>
        )}
      </div>
    </div>
  );
}

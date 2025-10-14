"use client";

import { PdfViewer } from "@/src/components/pdf-viewer";
import {
  createLesson,
  createModule,
  createObjectiveQuestion,
  createSubjectiveQuestion,
  deleteCourse,
  deleteLesson,
  deleteModule,
  getCourseById,
  getCourseModules,
  getLeaders,
  updateCourse,
  updateCourseStatus,
  updateLesson,
  updateModule,
} from "@/src/lib/actions";
import {
  createCertificateTemplate,
  updateCertificateTemplate,
} from "@/src/lib/actions/certificate";
import { extractYouTubeEmbedId } from "@/src/lib/helpers/youtube";
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
  FileText,
  Layers,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
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
} from "../../components";

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
  type: z.enum(["VIDEO", "TEXT", "OBJECTIVE_QUIZ", "SUBJECTIVE_QUIZ"], {
    required_error: "Tipo é obrigatório",
  }),
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
  id: string;
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
  id: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  youtubeEmbedId?: string;
  duration: number;
  order: number;
  type: "VIDEO" | "TEXT" | "OBJECTIVE_QUIZ" | "SUBJECTIVE_QUIZ";
  isActivity?: boolean;
  questions?: Question[];
}

interface EditCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function EditCoursePage(props: EditCoursePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modulesState, setModulesState] = useState<Module[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [openLessons, setOpenLessons] = useState<string[]>([]);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
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
      type: "VIDEO",
    },
  });

  // Formulário do template de certificado
  const certificateTemplateForm = useForm<CertificateTemplateFormData>({
    resolver: zodResolver(certificateTemplateSchema),
  });

  // Watch lesson type for conditional fields
  const selectedLessonType = lessonForm.watch("type");

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
        duration: courseData.duration || 120,
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
      const result = await updateCourse(courseId, {
        ...data,
        tags: data.tags || "",
        status: "draft",
      });

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

  // Adicionar módulo
  const handleAddModule = async (data: ModuleFormData) => {
    setIsLoading(true);
    try {
      const result = await createModule(courseId, {
        ...data,
        order: modulesState.length + 1,
      });

      if (result.success && result.module) {
        const newModule: Module = {
          id: result.module.id,
          title: data.title,
          description: data.description,
          order: modulesState.length + 1,
          lessons: [],
        };
        setModulesState([...modulesState, newModule]);
        moduleForm.reset();
        setShowModuleForm(false);
        toast.success("Módulo adicionado com sucesso!");
        refetchModules();
      } else {
        toast.error(result.error || "Erro ao criar módulo");
      }
    } catch (error) {
      toast.error("Erro ao criar módulo");
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar módulo
  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Tem certeza que deseja excluir este módulo?")) {
      try {
        const result = await deleteModule(moduleId);
        if (result.success) {
          const updatedModules = modulesState.filter((m) => m.id !== moduleId);
          setModulesState(updatedModules);
          toast.success(result.message);
          refetchModules();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Erro ao excluir módulo");
      }
    }
  };

  // Editar módulo
  const handleEditModule = (moduleIndex: number) => {
    const module = modulesState[moduleIndex];
    if (module) {
      moduleForm.reset({
        title: module.title,
        description: module.description,
      });
      setEditingModule(moduleIndex);
      setOpenModules([...openModules, `module-${moduleIndex}`]);
    }
  };

  // Salvar edição de módulo
  const handleSaveModuleEdit = async (
    data: ModuleFormData,
    moduleIndex: number,
  ) => {
    setIsLoading(true);
    try {
      const module = modulesState[moduleIndex];
      if (!module) {
        toast.error("Módulo não encontrado");
        return;
      }

      const result = await updateModule(module.id, {
        title: data.title,
        description: data.description,
        order: module.order,
      });

      if (result.success) {
        const updatedModules = [...modulesState];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].title = data.title;
          updatedModules[moduleIndex].description = data.description;
        }
        setModulesState(updatedModules);
        setEditingModule(null);
        moduleForm.reset();
        toast.success("Módulo atualizado com sucesso!");
        refetchModules();
      } else {
        toast.error(result.error || "Erro ao atualizar módulo");
      }
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error);
      toast.error("Erro ao atualizar módulo");
    } finally {
      setIsLoading(false);
    }
  };

  // Editar lição
  const handleEditLesson = (moduleIndex: number, lessonIndex: number) => {
    const lesson = modulesState[moduleIndex]?.lessons[lessonIndex];
    if (lesson) {
      lessonForm.reset({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content || "",
        videoUrl: lesson.videoUrl || "",
        duration: lesson.duration,
        type: lesson.type as any,
      });
      setEditingLesson({ moduleIndex, lessonIndex });
      setOpenModules([...openModules, `module-${moduleIndex}`]);
      setOpenLessons([...openLessons, `lesson-${moduleIndex}-${lessonIndex}`]);
    }
  };

  // Salvar edição de lição
  const handleSaveLessonEdit = async (
    data: LessonFormData,
    moduleIndex: number,
    lessonIndex: number,
  ) => {
    const lesson = modulesState[moduleIndex]?.lessons[lessonIndex];
    if (!lesson) return;

    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    setIsLoading(true);
    try {
      const result = await updateLesson(lesson.id, {
        ...data,
        youtubeEmbedId: youtubeEmbedId || "",
        order: lesson.order,
      });
      if (result.success) {
        const updatedModules = [...modulesState];
        if (updatedModules[moduleIndex]?.lessons[lessonIndex]) {
          updatedModules[moduleIndex].lessons[lessonIndex] = {
            ...updatedModules[moduleIndex].lessons[lessonIndex],
            title: data.title,
            description: data.description,
            content: data.content,
            videoUrl: data.videoUrl,
            youtubeEmbedId: youtubeEmbedId || "",
            duration: data.duration,
            type: data.type,
          };
          setModulesState(updatedModules);
        }
        setEditingLesson(null);
        toast.success("Lição atualizada com sucesso!");
        refetchModules();
      } else {
        toast.error(result.error || "Erro ao atualizar lição");
      }
    } catch (error) {
      toast.error("Erro ao atualizar lição");
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar lição
  const handleDeleteLesson = async (
    lessonId: string,
    moduleIndex: number,
    lessonIndex: number,
  ) => {
    if (confirm("Tem certeza que deseja excluir esta lição?")) {
      try {
        const result = await deleteLesson(lessonId);
        if (result.success) {
          const updatedModules = [...modulesState];
          if (updatedModules[moduleIndex]) {
            updatedModules[moduleIndex].lessons = updatedModules[
              moduleIndex
            ].lessons.filter((_, i) => i !== lessonIndex);
            setModulesState(updatedModules);
          }
          toast.success(result.message);
          refetchModules();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Erro ao excluir lição");
      }
    }
  };

  // Adicionar lição
  const handleAddLesson = async (data: LessonFormData, moduleIndex: number) => {
    const module = modulesState[moduleIndex];
    if (!module) return;

    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    setIsLoading(true);
    try {
      const result = await createLesson(module.id, {
        ...data,
        youtubeEmbedId: youtubeEmbedId || "",
        order: module.lessons.length + 1,
      });

      if (result.success && result.lesson) {
        const newLesson: Lesson = {
          id: result.lesson.id,
          title: data.title,
          description: data.description,
          content: data.content,
          videoUrl: data.videoUrl,
          youtubeEmbedId: youtubeEmbedId || "",
          duration: data.duration,
          order: module.lessons.length + 1,
          type: data.type,
        };

        const updatedModules = [...modulesState];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].lessons.push(newLesson);
          setModulesState(updatedModules);
        }
        lessonForm.reset();
        setShowLessonForm(null);
        toast.success("Lição adicionada com sucesso!");
        refetchModules();
      } else {
        toast.error(result.error || "Erro ao criar lição");
      }
    } catch (error) {
      toast.error("Erro ao criar lição");
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

  // Converter arquivo para base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Play className="dark-secondary" size={16} />;
      case "TEXT":
        return <FileText className="dark-secondary" size={16} />;
      case "OBJECTIVE_QUIZ":
        return <CheckCircle className="dark-secondary" size={16} />;
      case "SUBJECTIVE_QUIZ":
        return <CheckCircle className="dark-secondary" size={16} />;
      default:
        return <FileText className="dark-secondary" size={16} />;
    }
  };

  const getLessonTypeText = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "Vídeo";
      case "TEXT":
        return "Texto";
      case "OBJECTIVE_QUIZ":
        return "Atividade Objetiva";
      case "SUBJECTIVE_QUIZ":
        return "Atividade Subjetiva";
      default:
        return "Texto";
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
    <div className="dark-bg-primary min-h-screen pb-20">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 p-6">
        {/* Header */}
        <CourseHeader
          courseId={courseId}
          hasModules={modulesState.length > 0}
          isLoading={isLoading}
          isEditing={true}
          isDeleting={isDeleting}
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
                            handleEditModule(moduleIndex);
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
                            handleDeleteModule(module.id);
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
                        onSubmit={(data) => handleAddLesson(data, moduleIndex)}
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
                                      <span className="text-lg">
                                        {getLessonTypeIcon(lesson.type)}
                                      </span>
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
                                        handleEditLesson(
                                          moduleIndex,
                                          lessonIndex,
                                        );
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
                                        handleDeleteLesson(
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
                                          <span className="text-lg">
                                            {getLessonTypeIcon(lesson.type)}
                                          </span>
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
                                            lessonIndex && (
                                            <QuestionForm
                                              currentQuestionsCount={
                                                lesson.questions?.length || 0
                                              }
                                              onSuccess={async (question) => {
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
                                                          order: question.order,
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
                                                          order: question.order,
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
                                                      ...modulesState,
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

                                                    setModulesState(
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
                                              ...modulesState,
                                            ];
                                            if (
                                              updatedModules[moduleIndex]
                                                ?.lessons[lessonIndex]
                                                ?.questions
                                            ) {
                                              updatedModules[
                                                moduleIndex
                                              ].lessons[lessonIndex].questions =
                                                updatedModules[
                                                  moduleIndex
                                                ].lessons[
                                                  lessonIndex
                                                ].questions!.filter(
                                                  (_, i) => i !== index,
                                                );
                                              setModulesState(updatedModules);
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
                            PDF Disponível
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {courseData.certificateTemplate.templateUrl && (
                        <PdfViewer
                          pdfBase64={courseData.certificateTemplate.templateUrl}
                          certificateUrl={
                            courseData.certificateTemplate.templateUrl
                          }
                          title={`Template: ${courseData.certificateTemplate.title}`}
                          fileName={`template-${courseData.certificateTemplate.id}.pdf`}
                        >
                          <Button
                            className="dark-glass dark-border hover:dark-border-hover"
                            size="sm"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Ver PDF
                          </Button>
                        </PdfViewer>
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
      </div>
    </div>
  );
}

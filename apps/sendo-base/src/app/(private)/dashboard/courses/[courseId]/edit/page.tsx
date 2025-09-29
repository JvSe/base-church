"use client";

import {
  createLesson,
  createModule,
  deleteCourse,
  deleteLesson,
  deleteModule,
  getCourseById,
  getCourseModules,
  getLeaders,
  updateCourse,
  updateCourseStatus,
  updateLesson,
} from "@/src/lib/actions";
import { createCertificateTemplate } from "@/src/lib/actions/certificate";
import { COURSE_CATEGORIES } from "@/src/lib/constants";
import { extractYouTubeEmbedId } from "@/src/lib/helpers/youtube";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@base-church/ui/components/form";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Textarea } from "@base-church/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  Layers,
  Play,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  type: z.enum(["video", "text", "quiz"], {
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

interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  youtubeEmbedId?: string;
  duration: number;
  order: number;
  type: "video" | "text" | "quiz";
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
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const router = useRouter();

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

  // Transformar dados do banco para o formato da interface
  const modules: Module[] =
    modulesData?.map((module: any) => ({
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
    })) || [];

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

  // Atualizar curso
  const handleUpdateCourse = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const result = await updateCourse(courseId, {
        ...data,
        tags: data.tags || "",
        status: "draft", // Sempre manter como draft na edição
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
        type: lesson.type,
      });
      setEditingLesson({ moduleIndex, lessonIndex });
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

    // Extrair YouTube Embed ID da URL fornecida
    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    console.log("🔍 Debug - videoUrl:", data.videoUrl);
    console.log("🔍 Debug - youtubeEmbedId extraído:", youtubeEmbedId);

    if (youtubeEmbedId) {
      toast.success(`YouTube ID extraído: ${youtubeEmbedId}`);
    } else if (data.videoUrl) {
      toast.error("Não foi possível extrair o YouTube ID da URL fornecida");
    }

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
          console.log(
            "🔍 Debug - Estado local atualizado com youtubeEmbedId:",
            youtubeEmbedId,
          );
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

    // Extrair YouTube Embed ID da URL fornecida
    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    console.log("🔍 Debug - videoUrl:", data.videoUrl);
    console.log("🔍 Debug - youtubeEmbedId extraído:", youtubeEmbedId);

    if (youtubeEmbedId) {
      toast.success(`YouTube ID extraído: ${youtubeEmbedId}`);
    } else if (data.videoUrl) {
      toast.error("Não foi possível extrair o YouTube ID da URL fornecida");
    }

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
          console.log(
            "🔍 Debug - Nova lição criada com youtubeEmbedId:",
            youtubeEmbedId,
          );
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
      // Converter arquivo PDF para base64 se existir
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

  useEffect(() => {
    if (courseData) {
      certificateTemplateForm.setValue(
        "title",
        `Certificado - ${courseData.title}`,
      );
      certificateTemplateForm.setValue(
        "description",
        courseData.description || "",
      );
    }
  }, [courseData]);

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
      case "video":
        return Play;
      case "text":
        return FileText;
      case "quiz":
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
      case "quiz":
        return "Quiz";
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
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <Button
              className="dark-glass dark-border hover:dark-border-hover"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="dark-text-primary text-3xl font-bold">
                Editar Curso 📚
              </h1>
              <p className="dark-text-secondary mt-2">
                Edite seu curso com módulos e lições em uma única tela
              </p>
            </div>
            <div className="flex gap-2">
              {courseId && modules.length > 0 && (
                <Button
                  type="button"
                  className="dark-btn-primary"
                  onClick={handleFinishCourse}
                  disabled={isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finalizar Curso
                </Button>
              )}
              <Button
                onClick={handleDeleteCourse}
                className="dark-error-bg dark-error hover:dark-error-bg"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir Curso"}
              </Button>
            </div>
          </div>
        </div>
        {/* Course Form */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 text-xl font-bold">
            Informações do Curso
          </h2>
          <Form {...courseForm}>
            <form
              onSubmit={courseForm.handleSubmit(handleUpdateCourse)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={courseForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Título do Curso *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Fundamentos da Fé Cristã"
                          className="dark-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={courseForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Descrição *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva o conteúdo bíblico e espiritual que será ensinado neste curso..."
                          className="dark-input min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={courseForm.control}
                    name="instructorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Instrutor (Líder) *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={leadersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="dark-input h-10">
                              <SelectValue
                                placeholder={
                                  leadersLoading
                                    ? "Carregando líderes..."
                                    : "Selecione um líder como instrutor"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark-bg-secondary dark-border">
                            {leadersData?.map((leader: any) => (
                              <SelectItem
                                key={leader.id}
                                value={leader.id}
                                className="dark-text-primary hover:dark-bg-tertiary"
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{leader.name}</span>
                                  {leader.isPastor && (
                                    <span className="dark-primary text-xs font-medium">
                                      (Pastor)
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Duração (minutos) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="60"
                            className="dark-input"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={courseForm.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Nível *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="dark-input h-10">
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediário
                            </SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Categoria *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="dark-input h-10">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark-bg-secondary dark-border">
                            {COURSE_CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                                className="dark-text-primary hover:dark-bg-tertiary"
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{category.icon}</span>
                                  <span>{category.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={courseForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Tags (separadas por vírgula)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Fé, Bíblia, Liderança, Ministério"
                            className="dark-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Preço (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0"
                            className="dark-input"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="dark-btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        {/* Modules Section */}
        {
          <div className="space-y-6">
            {/* Add Module Button */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Layers className="dark-primary" size={24} />
                  Módulos do Curso ({modulesState.length})
                </h2>
                <Button
                  className="dark-btn-primary"
                  onClick={() => setShowModuleForm(!showModuleForm)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Módulo
                </Button>
              </div>

              {/* Module Form */}
              {showModuleForm && (
                <div className="mt-6">
                  <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                    <h3 className="dark-text-primary mb-6 text-xl font-bold">
                      Adicionar Novo Módulo
                    </h3>
                    <Form {...moduleForm}>
                      <form
                        onSubmit={moduleForm.handleSubmit(handleAddModule)}
                        className="space-y-6"
                      >
                        <FormField
                          control={moduleForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                Título do Módulo *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ex: Introdução à Fé Cristã"
                                  className="dark-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={moduleForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                Descrição *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Descreva o que será abordado neste módulo..."
                                  className="dark-input min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-4 pt-6">
                          <Button
                            type="button"
                            className="dark-glass dark-border hover:dark-border-hover"
                            variant="outline"
                            onClick={() => {
                              setShowModuleForm(false);
                              moduleForm.reset();
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="dark-btn-primary"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            {isLoading ? "Adicionando..." : "Adicionar Módulo"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}
            </div>

            {/* Modules List */}
            {modulesState.length > 0 && (
              <Accordion type="multiple" className="space-y-4">
                {modulesState.map((module, moduleIndex) => (
                  <AccordionItem
                    key={moduleIndex}
                    value={`module-${moduleIndex}`}
                    className="dark-glass dark-shadow-sm rounded-xl"
                  >
                    <AccordionTrigger className="dark-card hover:dark-bg-secondary p-4 transition-all">
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
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLessonForm(moduleIndex);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(module.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="dark-border">
                      {/* Lesson Form */}
                      {showLessonForm === moduleIndex && (
                        <div className="dark-border border-b p-6">
                          <Form {...lessonForm}>
                            <form
                              onSubmit={lessonForm.handleSubmit((data) =>
                                handleAddLesson(data, moduleIndex),
                              )}
                              className="space-y-6"
                            >
                              <h4 className="dark-text-primary mb-6 text-xl font-bold">
                                Adicionar Nova Lição
                              </h4>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                  control={lessonForm.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="dark-text-secondary text-sm font-medium">
                                        Título da Lição *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Ex: O que é a Fé Cristã"
                                          className="dark-input"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={lessonForm.control}
                                  name="duration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="dark-text-secondary text-sm font-medium">
                                        Duração (minutos) *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="number"
                                          placeholder="15"
                                          className="dark-input"
                                          onChange={(e) =>
                                            field.onChange(
                                              parseInt(e.target.value) || 0,
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={lessonForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="dark-text-secondary text-sm font-medium">
                                      Descrição *
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder="Descreva o que será abordado nesta lição..."
                                        className="dark-input min-h-[100px]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={lessonForm.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="dark-text-secondary text-sm font-medium">
                                      Tipo de Conteúdo *
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="dark-input">
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="video">
                                          <div className="flex items-center space-x-2">
                                            <Video className="h-4 w-4" />
                                            <span>Vídeo</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="text">
                                          <div className="flex items-center space-x-2">
                                            <span>📄</span>
                                            <span>Texto</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="quiz">
                                          <div className="flex items-center space-x-2">
                                            <span>❓</span>
                                            <span>Quiz</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Conditional fields based on type */}
                              {selectedLessonType === "video" && (
                                <FormField
                                  control={lessonForm.control}
                                  name="videoUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="dark-text-secondary text-sm font-medium">
                                        URL do Vídeo (YouTube)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="https://youtu.be/VIDEO_ID"
                                          className="dark-input"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}

                              {(selectedLessonType === "text" ||
                                selectedLessonType === "quiz") && (
                                <FormField
                                  control={lessonForm.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="dark-text-secondary text-sm font-medium">
                                        Conteúdo{" "}
                                        {selectedLessonType === "quiz"
                                          ? "do Quiz"
                                          : "da Lição"}
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          placeholder={
                                            selectedLessonType === "quiz"
                                              ? "Digite as perguntas e respostas do quiz..."
                                              : "Digite o conteúdo da lição..."
                                          }
                                          className="dark-input min-h-[200px]"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}

                              {/* File Upload Section */}
                              <div className="dark-card dark-shadow-sm rounded-lg p-4">
                                <h3 className="dark-text-primary mb-3 font-semibold">
                                  Materiais Complementares
                                </h3>
                                <div className="space-y-3">
                                  <div className="dark-bg-secondary rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                                    <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                                    <p className="dark-text-secondary text-sm">
                                      Arraste arquivos aqui ou clique para
                                      selecionar
                                    </p>
                                    <p className="dark-text-tertiary text-xs">
                                      PDF, DOC, PPT, imagens (máx. 10MB)
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    className="dark-glass dark-border hover:dark-border-hover w-full"
                                    variant="outline"
                                    onClick={() => {
                                      toast.info(
                                        "Funcionalidade de upload em desenvolvimento",
                                      );
                                    }}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Selecionar Arquivos
                                  </Button>
                                </div>
                              </div>

                              <div className="flex justify-end space-x-4 pt-6">
                                <Button
                                  type="button"
                                  className="dark-glass dark-border hover:dark-border-hover"
                                  variant="outline"
                                  onClick={() => {
                                    setShowLessonForm(null);
                                    lessonForm.reset();
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={isLoading}
                                  className="dark-btn-primary"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  {isLoading
                                    ? "Adicionando..."
                                    : "Adicionar Lição"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
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
                                        className="dark-glass dark-border hover:dark-border-hover"
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
                                        className="dark-glass dark-border hover:dark-border-hover"
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
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                  {editingLesson?.moduleIndex === moduleIndex &&
                                  editingLesson?.lessonIndex === lessonIndex ? (
                                    // Formulário de edição
                                    <Form {...lessonForm}>
                                      <form
                                        onSubmit={lessonForm.handleSubmit(
                                          (data) =>
                                            handleSaveLessonEdit(
                                              data,
                                              moduleIndex,
                                              lessonIndex,
                                            ),
                                        )}
                                        className="space-y-6"
                                      >
                                        <h6 className="dark-text-primary mb-6 text-xl font-bold">
                                          Editar Lição
                                        </h6>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                          <FormField
                                            control={lessonForm.control}
                                            name="title"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="dark-text-secondary text-sm font-medium">
                                                  Título da Lição *
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    placeholder="Ex: O que é a Fé Cristã"
                                                    className="dark-input"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={lessonForm.control}
                                            name="duration"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="dark-text-secondary text-sm font-medium">
                                                  Duração (minutos) *
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="15"
                                                    className="dark-input"
                                                    onChange={(e) =>
                                                      field.onChange(
                                                        parseInt(
                                                          e.target.value,
                                                        ) || 0,
                                                      )
                                                    }
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <FormField
                                          control={lessonForm.control}
                                          name="description"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                                Descrição *
                                              </FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  {...field}
                                                  placeholder="Descreva o que será abordado nesta lição..."
                                                  className="dark-input min-h-[100px]"
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={lessonForm.control}
                                          name="type"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                                Tipo de Conteúdo *
                                              </FormLabel>
                                              <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                              >
                                                <FormControl>
                                                  <SelectTrigger className="dark-input">
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="video">
                                                    <div className="flex items-center space-x-2">
                                                      <Video className="h-4 w-4" />
                                                      <span>Vídeo</span>
                                                    </div>
                                                  </SelectItem>
                                                  <SelectItem value="text">
                                                    <div className="flex items-center space-x-2">
                                                      <span>📄</span>
                                                      <span>Texto</span>
                                                    </div>
                                                  </SelectItem>
                                                  <SelectItem value="quiz">
                                                    <div className="flex items-center space-x-2">
                                                      <span>❓</span>
                                                      <span>Quiz</span>
                                                    </div>
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        {/* Conditional fields based on type */}
                                        {selectedLessonType === "video" && (
                                          <FormField
                                            control={lessonForm.control}
                                            name="videoUrl"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="dark-text-secondary text-sm font-medium">
                                                  URL do Vídeo (YouTube)
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    placeholder="https://youtu.be/VIDEO_ID"
                                                    className="dark-input"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {(selectedLessonType === "text" ||
                                          selectedLessonType === "quiz") && (
                                          <FormField
                                            control={lessonForm.control}
                                            name="content"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="dark-text-secondary text-sm font-medium">
                                                  Conteúdo{" "}
                                                  {selectedLessonType === "quiz"
                                                    ? "do Quiz"
                                                    : "da Lição"}
                                                </FormLabel>
                                                <FormControl>
                                                  <Textarea
                                                    {...field}
                                                    placeholder={
                                                      selectedLessonType ===
                                                      "quiz"
                                                        ? "Digite as perguntas e respostas do quiz..."
                                                        : "Digite o conteúdo da lição..."
                                                    }
                                                    className="dark-input min-h-[200px]"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {/* File Upload Section */}
                                        <div className="dark-card dark-shadow-sm rounded-lg p-4">
                                          <h3 className="dark-text-primary mb-3 font-semibold">
                                            Materiais Complementares
                                          </h3>
                                          <div className="space-y-3">
                                            <div className="dark-bg-secondary rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                                              <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                                              <p className="dark-text-secondary text-sm">
                                                Arraste arquivos aqui ou clique
                                                para selecionar
                                              </p>
                                              <p className="dark-text-tertiary text-xs">
                                                PDF, DOC, PPT, imagens (máx.
                                                10MB)
                                              </p>
                                            </div>
                                            <Button
                                              type="button"
                                              className="dark-glass dark-border hover:dark-border-hover w-full"
                                              variant="outline"
                                              onClick={() => {
                                                toast.info(
                                                  "Funcionalidade de upload em desenvolvimento",
                                                );
                                              }}
                                            >
                                              <Upload className="mr-2 h-4 w-4" />
                                              Selecionar Arquivos
                                            </Button>
                                          </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 pt-6">
                                          <Button
                                            type="button"
                                            className="dark-glass dark-border hover:dark-border-hover"
                                            variant="outline"
                                            onClick={() => {
                                              setEditingLesson(null);
                                              lessonForm.reset();
                                            }}
                                          >
                                            Cancelar
                                          </Button>
                                          <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="dark-btn-primary"
                                          >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {isLoading
                                              ? "Atualizando..."
                                              : "Atualizar Lição"}
                                          </Button>
                                        </div>
                                      </form>
                                    </Form>
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
                <Button
                  className="dark-btn-primary"
                  onClick={() => setShowCertificateForm(!showCertificateForm)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Template
                </Button>
              </div>

              {/* Certificate Form */}
              {showCertificateForm && (
                <div className="mt-6">
                  <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                    <h3 className="dark-text-primary mb-6 text-xl font-bold">
                      Configurar Template de Certificado
                    </h3>
                    <Form {...certificateTemplateForm}>
                      <form
                        onSubmit={certificateTemplateForm.handleSubmit(
                          handleCreateCertificateTemplate,
                        )}
                        className="space-y-6"
                      >
                        <FormField
                          control={certificateTemplateForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                Título do Template *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    courseTitle
                                      ? `${courseTitle} - Certificado`
                                      : "Ex: Fundamentos da Fé Cristã - Certificado"
                                  }
                                  className="dark-input"
                                  value={
                                    field.value ||
                                    (courseTitle
                                      ? `${courseTitle} - Certificado`
                                      : "")
                                  }
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={certificateTemplateForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark-text-secondary text-sm font-medium">
                                Descrição do Template *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder={
                                    courseDescription ||
                                    "Certificado de conclusão do curso..."
                                  }
                                  className="dark-input min-h-[100px]"
                                  value={field.value || courseDescription || ""}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* File Upload Section */}
                        <div className="dark-card dark-shadow-sm rounded-lg p-4">
                          <h3 className="dark-text-primary mb-3 font-semibold">
                            Template do Certificado (PDF)
                          </h3>
                          <div className="space-y-3">
                            <div className="dark-bg-secondary rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                              <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                              <p className="dark-text-secondary text-sm">
                                {certificateFile
                                  ? certificateFile.name
                                  : "Arraste o arquivo PDF aqui ou clique para selecionar"}
                              </p>
                              <p className="dark-text-tertiary text-xs">
                                Apenas arquivos PDF (máx. 10MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.type === "application/pdf") {
                                    setCertificateFile(file);
                                  } else {
                                    toast.error(
                                      "Por favor, selecione apenas arquivos PDF",
                                    );
                                  }
                                }
                              }}
                              className="hidden"
                              id="certificate-upload"
                            />
                            <Button
                              type="button"
                              className="dark-glass dark-border hover:dark-border-hover w-full"
                              variant="outline"
                              onClick={() => {
                                document
                                  .getElementById("certificate-upload")
                                  ?.click();
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {certificateFile
                                ? "Alterar Arquivo"
                                : "Selecionar PDF"}
                            </Button>
                            {certificateFile && (
                              <div className="flex items-center justify-between rounded-lg bg-green-900/20 p-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-green-400">
                                    {certificateFile.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => setCertificateFile(null)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                          <Button
                            type="button"
                            className="dark-glass dark-border hover:dark-border-hover"
                            variant="outline"
                            onClick={() => {
                              setShowCertificateForm(false);
                              certificateTemplateForm.reset();
                              setCertificateFile(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="dark-btn-primary"
                          >
                            <Award className="mr-2 h-4 w-4" />
                            {isLoading ? "Criando..." : "Criar Template"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}

"use client";

import { deleteCourse, getCourseById, updateCourse } from "@/src/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Usable, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  instructor: z.string().min(1, "Instrutor é obrigatório"),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["draft", "published", "archived"]),
  price: z.number().min(0, "Preço não pode ser negativo"),
  category: z.string().min(1, "Categoria é obrigatória"),
  tags: z.string().optional(), // Will be parsed as string, then split
});

type CourseFormData = z.infer<typeof courseSchema>;

interface EditCoursePageProps {
  params: {
    courseId: string;
  };
}

export default function EditCoursePage(props: EditCoursePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const params = use(props.params as unknown as Usable<{ courseId: string }>);

  // Buscar dados do curso do banco
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => getCourseById(params.courseId),
    select: (data) => data.course,
  });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      duration: 120,
      level: "beginner",
      status: "draft",
      price: 0,
      category: "",
      tags: "",
    },
  });

  // Atualizar formulário quando os dados chegarem
  useEffect(() => {
    if (courseData) {
      form.reset({
        title: courseData.title,
        description: courseData.description || "",
        instructor: "", // TODO: Implementar busca do instrutor por instructorId
        duration: courseData.duration || 120,
        level:
          (courseData.level as "beginner" | "intermediate" | "advanced") ||
          "beginner",
        status: "draft", // Sempre começar como draft na edição
        price: courseData.price || 0,
        category: courseData.category || "",
        tags: courseData.tags?.join(", ") || "",
      });
    }
  }, [courseData, form]);

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const result = await updateCourse(params.courseId, {
        ...data,
        tags: data.tags || "", // Garantir que tags seja string
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/courses");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar curso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCourse(params.courseId);

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

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Iniciante";
      case "intermediate":
        return "Intermediário";
      case "advanced":
        return "Avançado";
      default:
        return "Iniciante";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "published":
        return "Publicado";
      case "archived":
        return "Arquivado";
      default:
        return "Rascunho";
    }
  };

  // Loading state
  if (courseLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Save className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Carregando curso...
            </h1>
            <p className="dark-text-secondary">Buscando informações do curso</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || !courseData) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-4xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Save className="dark-text-tertiary" size={32} />
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
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                className="dark-glass dark-border hover:dark-border-hover"
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                  Editar Curso
                </h1>
                <p className="dark-text-secondary">
                  Atualize as informações do seu curso
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => router.push(`/courses/${params.courseId}`)}
                className="dark-glass dark-border hover:dark-border-hover"
                variant="outline"
                size="sm"
              >
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </Button>
              <Button
                onClick={handleDelete}
                className="dark-error-bg dark-error hover:dark-error-bg"
                variant="outline"
                size="sm"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
                  control={form.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Instrutor *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Pastor João Silva"
                          className="dark-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                          placeholder="120"
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
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
                          <SelectTrigger className="dark-input">
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
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Status *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="dark-input">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Categoria *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Doutrina, Liderança, Evangelismo, Estudo Bíblico"
                          className="dark-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="dark-glass dark-border hover:dark-border-hover"
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="dark-btn-primary"
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

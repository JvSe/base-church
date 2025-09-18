"use client";

import { createCourse } from "@/src/lib/actions";
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
import { ArrowLeft, Eye, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Nível é obrigatório",
  }),
  category: z.string().min(1, "Categoria é obrigatória"),
  tags: z.string().optional(),
  price: z.number().min(0, "Preço não pode ser negativo"),
  status: z.enum(["draft", "published"], {
    required_error: "Status é obrigatório",
  }),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      duration: 120,
      level: "beginner",
      category: "",
      tags: "",
      price: 0,
      status: "draft",
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const result = await createCourse({
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
      toast.error("Erro ao criar curso");
    } finally {
      setIsLoading(false);
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
      default:
        return "Rascunho";
    }
  };

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-8 p-6">
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
            <div>
              <h1 className="dark-text-primary text-3xl font-bold">
                Criar Novo Curso 📚
              </h1>
              <p className="dark-text-secondary mt-2">
                Preencha as informações básicas do seu curso
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
                <Plus className="dark-primary" size={24} />
                Informações Básicas
              </h2>
              <div className="space-y-4">
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
              </div>
            </div>

            {/* Course Details */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
                <Eye className="dark-primary" size={24} />
                Detalhes do Curso
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                </div>

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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  className="dark-glass dark-border hover:dark-border-hover"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="dark-glass dark-border hover:dark-border-hover"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="dark-btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Criando..." : "Criar Curso"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

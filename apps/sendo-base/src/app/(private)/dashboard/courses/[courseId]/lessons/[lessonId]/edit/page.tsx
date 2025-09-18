"use client";

import { getLessonById, updateLesson } from "@/src/lib/actions";
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
import { ArrowLeft, Save, Upload, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  type: z.enum(["video", "text", "quiz"]),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  order: z.number().min(1, "Ordem deve ser maior que 0"),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface EditLessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Buscar dados da lição do banco
  const {
    data: lessonData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useQuery({
    queryKey: ["lesson", params.lessonId],
    queryFn: () => getLessonById(params.lessonId),
    select: (data) => data.lesson,
  });

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 15,
      type: "video",
      content: "",
      videoUrl: "",
      order: 1,
    },
  });

  // Atualizar formulário quando os dados chegarem
  useEffect(() => {
    if (lessonData) {
      form.reset({
        title: lessonData.title,
        description: lessonData.description,
        duration: lessonData.duration,
        type: lessonData.type,
        content: lessonData.content || "",
        videoUrl: lessonData.videoUrl || "",
        order: lessonData.order,
      });
    }
  }, [lessonData, form]);

  const onSubmit = async (data: LessonFormData) => {
    setIsLoading(true);
    try {
      const result = await updateLesson(params.lessonId, data);

      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/courses/${params.courseId}/modules`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar lição");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "text":
        return "Texto";
      case "quiz":
        return "Quiz";
      default:
        return "Conteúdo";
    }
  };

  const selectedType = form.watch("type");

  // Loading state
  if (lessonLoading) {
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
              Carregando lição...
            </h1>
            <p className="dark-text-secondary">Buscando informações da lição</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (lessonError || !lessonData) {
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
              Erro ao carregar lição
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar as informações da lição. Tente
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
                  Editar Lição
                </h1>
                <p className="dark-text-secondary">
                  Configure o conteúdo e detalhes da lição
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Ordem *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="1"
                          className="dark-input"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="Descreva o que será abordado nesta lição..."
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
                          placeholder="15"
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

              {/* Conditional fields based on type */}
              {selectedType === "video" && (
                <FormField
                  control={form.control}
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

              {(selectedType === "text" || selectedType === "quiz") && (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Conteúdo{" "}
                        {selectedType === "quiz" ? "do Quiz" : "da Lição"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={
                            selectedType === "quiz"
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
                      Arraste arquivos aqui ou clique para selecionar
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
                      // TODO: Implementar upload de arquivos
                      toast.info("Funcionalidade de upload em desenvolvimento");
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
                  {isLoading ? "Salvando..." : "Salvar Lição"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

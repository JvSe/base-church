"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { usePageTitle } from "@/src/hooks";
import { getCourses } from "@/src/lib/actions";
import { createTrack } from "@/src/lib/actions/tracks";
import { trackSchema, type TrackFormData } from "@/src/lib/forms/track-schemas";
import { convertFileToBase64 } from "@/src/lib/helpers/course.helper";
import { generateSlug } from "@/src/lib/helpers/track.helper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { Label } from "@base-church/ui/components/label";
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
  BookOpen,
  GripVertical,
  Plus,
  Save,
  Target,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TrackCourse = {
  courseId: string;
  order: number;
  isRequired: boolean;
};

export default function NewTrackPage() {
  usePageTitle("Nova Trilha");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [trackCourses, setTrackCourses] = useState<TrackCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Fetch courses
  const { data: coursesData } = useQuery({
    queryKey: ["courses", "published"],
    queryFn: () => getCourses({ filter: "published" }),
    select: (data) => data.courses,
  });

  const form = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      category: "",
      level: "beginner",
      objectives: "",
      requirements: "",
    },
  });

  const title = form.watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(title));
    }
  }, [title]);

  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add course to track
  const handleAddCourse = () => {
    if (!selectedCourseId) {
      toast.error("Selecione um curso");
      return;
    }

    if (trackCourses.some((c) => c.courseId === selectedCourseId)) {
      toast.error("Este curso já foi adicionado");
      return;
    }

    setTrackCourses([
      ...trackCourses,
      {
        courseId: selectedCourseId,
        order: trackCourses.length,
        isRequired: true,
      },
    ]);
    setSelectedCourseId("");
  };

  // Remove course from track
  const handleRemoveCourse = (courseId: string) => {
    const newCourses = trackCourses
      .filter((c) => c.courseId !== courseId)
      .map((c, index) => ({ ...c, order: index }));
    setTrackCourses(newCourses);
  };

  // Move course up
  const handleMoveCourseUp = (index: number) => {
    if (index === 0) return;
    const newCourses = [...trackCourses];
    const prevCourse = newCourses[index - 1];
    const currentCourse = newCourses[index];
    if (prevCourse && currentCourse) {
      [newCourses[index - 1], newCourses[index]] = [
        currentCourse,
        prevCourse,
      ];
      setTrackCourses(newCourses.map((c, i) => ({ ...c, order: i })));
    }
  };

  // Move course down
  const handleMoveCourseDown = (index: number) => {
    if (index === trackCourses.length - 1) return;
    const newCourses = [...trackCourses];
    const currentCourse = newCourses[index];
    const nextCourse = newCourses[index + 1];
    if (currentCourse && nextCourse) {
      [newCourses[index], newCourses[index + 1]] = [
        nextCourse,
        currentCourse,
      ];
      setTrackCourses(newCourses.map((c, i) => ({ ...c, order: i })));
    }
  };

  // Submit form
  const handleSubmit = async (data: TrackFormData) => {
    if (trackCourses.length === 0) {
      toast.error("Adicione pelo menos um curso à trilha");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = "";
      if (bannerFile) {
        imageUrl = await convertFileToBase64(bannerFile);
      }

      const objectives = data.objectives
        ? data.objectives.split("\n").filter((o) => o.trim())
        : [];
      const requirements = data.requirements
        ? data.requirements.split("\n").filter((r) => r.trim())
        : [];

      const result = await createTrack({
        title: data.title,
        description: data.description,
        slug: data.slug,
        image: imageUrl,
        category: data.category,
        level: data.level,
        objectives,
        requirements,
        courses: trackCourses,
      });

      if (result.success) {
        toast.success("Trilha criada com sucesso!");
        router.push("/dashboard/tracks");
      } else {
        toast.error(result.error || "Erro ao criar trilha");
      }
    } catch (error) {
      toast.error("Erro ao criar trilha");
    } finally {
      setIsLoading(false);
    }
  };

  const courses = coursesData || [];
  const availableCourses = courses.filter(
    (c: any) => !trackCourses.some((tc) => tc.courseId === c.id),
  );

  return (
    <PageLayout maxWidth="6xl" spacing="relaxed">
      {/* Header */}
      <div className="dark-glass dark-shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/tracks")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
            <h1 className="dark-text-primary mb-2 text-3xl font-bold">
              Criar Nova Trilha 🎯
            </h1>
            <p className="dark-text-secondary">
              Crie uma sequência de cursos para guiar o aprendizado dos alunos
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Track Info */}
        <div className="dark-glass dark-shadow-sm rounded-xl">
          <Accordion type="multiple" defaultValue={["track-info"]}>
            <AccordionItem value="track-info" className="border-0">
              <AccordionTrigger
                arrow={false}
                className="dark-card hover:dark-bg-secondary p-6 transition-all"
              >
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Target className="dark-primary" size={24} />
                  Informações da Trilha
                </h2>
              </AccordionTrigger>
              <AccordionContent className="p-6">
                <div className="space-y-6">
                  {/* Title and Slug */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        {...form.register("title")}
                        placeholder="Ex: Fundamentos Ministeriais"
                      />
                      {form.formState.errors.title && (
                        <p className="dark-error text-sm">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        {...form.register("slug")}
                        placeholder="fundamentos-ministeriais"
                      />
                      {form.formState.errors.slug && (
                        <p className="dark-error text-sm">
                          {form.formState.errors.slug.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Descreva o objetivo desta trilha..."
                      rows={4}
                    />
                  </div>

                  {/* Category and Level */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        {...form.register("category")}
                        placeholder="Ex: Fundamentos, Discipulado, Liderança"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Nível</Label>
                      <Select
                        value={form.watch("level")}
                        onValueChange={(value: any) =>
                          form.setValue("level", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediário
                          </SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Banner */}
                  <div className="space-y-2">
                    <Label>Banner da Trilha</Label>
                    <div className="space-y-4">
                      {bannerPreview && (
                        <div className="relative">
                          <img
                            src={bannerPreview}
                            alt="Preview"
                            className="h-48 w-full rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setBannerFile(null);
                              setBannerPreview("");
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                          id="banner-upload"
                        />
                        <Label
                          htmlFor="banner-upload"
                          className="dark-card dark-border hover:dark-bg-secondary flex cursor-pointer items-center justify-center gap-2 rounded-lg p-6 transition-colors"
                        >
                          <Upload className="dark-text-tertiary" size={20} />
                          <span className="dark-text-secondary">
                            Clique para fazer upload da imagem
                          </span>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objetivos de Aprendizado</Label>
                    <Textarea
                      id="objectives"
                      {...form.register("objectives")}
                      placeholder="Um objetivo por linha..."
                      rows={4}
                    />
                    <p className="dark-text-tertiary text-xs">
                      Digite um objetivo por linha
                    </p>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requisitos</Label>
                    <Textarea
                      id="requirements"
                      {...form.register("requirements")}
                      placeholder="Um requisito por linha..."
                      rows={3}
                    />
                    <p className="dark-text-tertiary text-xs">
                      Digite um requisito por linha
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Courses */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <BookOpen className="dark-secondary" size={24} />
            Cursos da Trilha ({trackCourses.length})
          </h2>

          {/* Add Course */}
          <div className="mb-6 flex gap-3">
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um curso..." />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddCourse}
              disabled={!selectedCourseId}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {/* Courses List */}
          {trackCourses.length > 0 ? (
            <div className="space-y-3">
              {trackCourses.map((trackCourse, index) => {
                const course = courses.find(
                  (c: any) => c.id === trackCourse.courseId,
                );
                if (!course) return null;

                return (
                  <div
                    key={trackCourse.courseId}
                    className="dark-card dark-shadow-sm flex items-center gap-4 rounded-xl p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveCourseUp(index)}
                        disabled={index === 0}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <span className="dark-text-tertiary text-center text-xs">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="dark-text-primary font-medium">
                        {course.title}
                      </h4>
                      <p className="dark-text-tertiary text-sm">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveCourseUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveCourseDown(index)}
                        disabled={index === trackCourses.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveCourse(trackCourse.courseId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
              <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <BookOpen className="dark-text-tertiary" size={24} />
              </div>
              <h3 className="dark-text-primary mb-2 font-semibold">
                Nenhum curso adicionado
              </h3>
              <p className="dark-text-secondary text-sm">
                Adicione cursos à trilha usando o seletor acima
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/tracks")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Salvando..." : "Criar Trilha"}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}

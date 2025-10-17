"use client";

import { COURSE_CATEGORIES } from "@/src/lib/constants";
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
import { MoneyInput } from "@base-church/ui/components/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Textarea } from "@base-church/ui/components/textarea";
import {
  BookOpen,
  Edit,
  ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface CourseInfoFormProps {
  form: UseFormReturn<any>;
  courseId: string | null;
  isLoading: boolean;
  leadersData: any[];
  leadersLoading: boolean;
  isEditing?: boolean;
  onSubmit: (data: any) => void;
  accordionValue?: string[];
  onAccordionChange?: (value: string[]) => void;
  onToggleEdit?: () => void;
  showEditButton?: boolean;
  bannerFile?: File | null;
  setBannerFile?: (file: File | null) => void;
  existingBanner?: string | null;
}

export function CourseInfoForm({
  form,
  courseId,
  isLoading,
  leadersData,
  leadersLoading,
  isEditing = false,
  onSubmit,
  accordionValue = ["course-info"],
  onAccordionChange,
  onToggleEdit,
  showEditButton = false,
  bannerFile,
  setBannerFile,
  existingBanner,
}: CourseInfoFormProps) {
  const courseTitle = form.watch("title") || "Novo Curso";
  const courseDescription = form.watch("description") || "Sem descrição";
  const instructorId = form.watch("instructorId");
  const instructor = leadersData?.find((l) => l.id === instructorId);
  const instructorName = instructor?.name || "Instrutor não definido";
  const level = form.watch("level");
  const category = form.watch("category");
  const price = form.watch("price");

  const levelLabels: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  };

  const categoryLabel = COURSE_CATEGORIES.find((cat) => cat.value === category);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione uma imagem válida");
        return;
      }
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }
      setBannerFile?.(file);
    }
  };

  const bannerPreview = bannerFile
    ? URL.createObjectURL(bannerFile)
    : existingBanner || null;

  return (
    <div className="dark-glass dark-shadow-sm rounded-xl">
      <Accordion
        type="multiple"
        value={accordionValue}
        onValueChange={onAccordionChange}
      >
        <AccordionItem value="course-info" className="border-0">
          <AccordionTrigger
            arrow={false}
            className="dark-card hover:dark-bg-secondary p-6 transition-all"
          >
            <div className="flex w-full items-center justify-between gap-6">
              <div className="flex flex-1 items-start gap-4">
                <div className="dark-primary-subtle-bg flex-shrink-0 rounded-xl p-3">
                  <BookOpen className="dark-primary" size={28} />
                </div>
                <div className="flex-1 text-left">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="dark-text-primary text-xl font-bold">
                      {courseTitle}
                    </h2>
                    {price > 0 && (
                      <span className="dark-success-bg dark-success rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        R$ {price.toFixed(2)}
                      </span>
                    )}
                    {price === 0 && (
                      <span className="dark-info-bg dark-info rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        Gratuito
                      </span>
                    )}
                  </div>
                  <p className="dark-text-secondary mb-3 line-clamp-2 text-sm leading-relaxed">
                    {courseDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {instructorName && (
                      <div className="flex items-center gap-1.5">
                        <User className="dark-text-tertiary" size={14} />
                        <span className="dark-text-tertiary text-xs font-medium">
                          {instructorName}
                        </span>
                      </div>
                    )}
                    {categoryLabel && (
                      <div className="dark-bg-tertiary rounded-md px-2 py-1">
                        <span className="dark-text-secondary text-xs">
                          {categoryLabel.icon} {categoryLabel.label}
                        </span>
                      </div>
                    )}
                    {level && (
                      <div className="dark-bg-tertiary rounded-md px-2 py-1">
                        <span className="dark-text-secondary text-xs">
                          {levelLabels[level] || level}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {showEditButton && onToggleEdit && (
                <Button
                  variant="info"
                  size="sm"
                  className="flex-shrink-0 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEdit();
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Editar Módulo
                </Button>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="dark-border px-6 py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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

                  {/* Banner Image Upload */}
                  <div className="space-y-3">
                    <FormLabel className="dark-text-secondary text-sm font-medium">
                      Imagem de Banner (Opcional)
                    </FormLabel>

                    {bannerPreview ? (
                      <div className="dark-card dark-border group relative h-40 overflow-hidden rounded-lg border">
                        <Image
                          src={bannerPreview}
                          alt="Preview do banner"
                          fill
                          className="object-cover"
                        />
                        {/* Overlay com ações */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              asChild
                            >
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Alterar
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleBannerChange}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setBannerFile?.(null)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="dark-card dark-border hover:dark-border-hover flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors">
                        <div className="dark-bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
                          <ImageIcon className="dark-text-tertiary" size={20} />
                        </div>
                        <div className="text-center">
                          <p className="dark-text-primary text-sm font-medium">
                            Adicionar imagem de banner
                          </p>
                          <p className="dark-text-tertiary mt-1 text-xs">
                            PNG, JPG ou WEBP até 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBannerChange}
                        />
                      </label>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="instructorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Instrutor *
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
                                    ? "Carregando..."
                                    : "Selecione um instrutor"
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
                              <SelectTrigger className="dark-input h-10">
                                <SelectValue placeholder="Selecione o nível" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">
                                Iniciante
                              </SelectItem>
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

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark-text-secondary text-sm font-medium">
                            Preço (R$)
                          </FormLabel>
                          <FormControl>
                            <MoneyInput
                              {...field}
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
                    {courseId ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        {isLoading ? "Criando..." : "Criar Curso"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

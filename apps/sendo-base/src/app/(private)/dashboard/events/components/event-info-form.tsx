"use client";

import { getEventTypeInfo } from "@/src/lib/helpers/event.helper";
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
import {
  Calendar,
  Edit,
  ImageIcon,
  MapPin,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface EventInfoFormProps {
  form: UseFormReturn<any>;
  eventId: string | null;
  isLoading: boolean;
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

export function EventInfoForm({
  form,
  eventId,
  isLoading,
  isEditing = false,
  onSubmit,
  accordionValue = ["event-info"],
  onAccordionChange,
  onToggleEdit,
  showEditButton = false,
  bannerFile,
  setBannerFile,
  existingBanner,
}: EventInfoFormProps) {
  const eventTitle = form.watch("title") || "Novo Evento";
  const eventDescription = form.watch("description") || "Sem descrição";
  const eventType = form.watch("type");
  const eventLocation = form.watch("location");
  const eventCapacity = form.watch("capacity");

  const typeInfo = eventType ? getEventTypeInfo(eventType) : null;
  const TypeIcon = typeInfo?.icon;

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
        <AccordionItem value="event-info" className="border-0">
          <AccordionTrigger
            arrow={false}
            className="dark-card hover:dark-bg-secondary p-6 transition-all"
          >
            <div className="flex w-full items-center justify-between gap-6">
              <div className="flex flex-1 items-start gap-4">
                <div className="dark-primary-subtle-bg flex-shrink-0 rounded-xl p-3">
                  <Calendar className="dark-primary" size={28} />
                </div>
                <div className="flex-1 text-left">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="dark-text-primary text-xl font-bold">
                      {eventTitle}
                    </h2>
                    {typeInfo && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}
                      >
                        {TypeIcon && <TypeIcon size={12} />}
                        {typeInfo.text}
                      </span>
                    )}
                  </div>
                  <p className="dark-text-secondary mb-3 line-clamp-2 text-sm leading-relaxed">
                    {eventDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {eventLocation && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="dark-text-tertiary" size={14} />
                        <span className="dark-text-tertiary text-xs font-medium">
                          {eventLocation}
                        </span>
                      </div>
                    )}
                    {eventCapacity && (
                      <div className="flex items-center gap-1.5">
                        <Users className="dark-text-tertiary" size={14} />
                        <span className="dark-text-tertiary text-xs font-medium">
                          Capacidade: {eventCapacity} pessoas
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
                  Editar Evento
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
                          Título do Evento *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Conferência de Liderança 2024"
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
                            placeholder="Descreva o evento, sua programação e objetivos..."
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Tipo de Evento *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="dark-input h-10">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="presential">Presencial</SelectItem>
                            <SelectItem value="hybrid">Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Local *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Centro de Convenções - São Paulo, SP"
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark-text-secondary text-sm font-medium">
                            Data de Início *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="dark-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark-text-secondary text-sm font-medium">
                            Hora de Início *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              className="dark-input"
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark-text-secondary text-sm font-medium">
                            Data de Fim *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="dark-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark-text-secondary text-sm font-medium">
                            Hora de Fim *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
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
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark-text-secondary text-sm font-medium">
                          Capacidade (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Ex: 100 (deixe vazio para ilimitado)"
                            className="dark-input"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              )
                            }
                            value={field.value || ""}
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
                            placeholder="Conferência, Liderança, Workshop"
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
                    type="submit"
                    disabled={isLoading}
                    className="dark-btn-primary"
                  >
                    {eventId ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        {isLoading ? "Criando..." : "Criar Evento"}
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


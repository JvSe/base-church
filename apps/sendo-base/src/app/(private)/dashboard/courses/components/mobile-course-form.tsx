"use client";

import {
  MobileForm,
  MobileFormActions,
  MobileFormField,
  MobileFormGrid,
} from "@/src/components/mobile";
import { Badge } from "@base-church/ui/components/badge";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Textarea } from "@base-church/ui/components/textarea";
import { BookOpen, Plus, Upload, X } from "lucide-react";
import { useState } from "react";

interface MobileCourseFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function MobileCourseForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: MobileCourseFormProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  return (
    <MobileForm
      title={isEditing ? "Editar Curso" : "Criar Novo Curso"}
      subtitle="Preencha as informações básicas do curso"
      icon={BookOpen}
    >
      <MobileFormGrid columns={1}>
        <MobileFormField label="Título do Curso" required>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Fundamentos da Fé Cristã"
            className="dark-input"
          />
        </MobileFormField>

        <MobileFormField label="Descrição" required>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descreva o conteúdo bíblico e espiritual que será ensinado neste curso..."
            className="dark-input min-h-[120px]"
          />
        </MobileFormField>

        <MobileFormField label="Banner do Curso">
          <div className="space-y-3">
            {bannerPreview ? (
              <div className="relative">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="h-32 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeBanner}
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                <p className="dark-text-secondary mb-2 text-sm">
                  Clique para fazer upload do banner
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="inline-flex cursor-pointer items-center rounded-md border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                </label>
              </div>
            )}
          </div>
        </MobileFormField>

        <MobileFormField label="Categoria">
          <Select>
            <SelectTrigger className="dark-input">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biblical">Bíblico</SelectItem>
              <SelectItem value="theological">Teológico</SelectItem>
              <SelectItem value="practical">Prático</SelectItem>
              <SelectItem value="leadership">Liderança</SelectItem>
            </SelectContent>
          </Select>
        </MobileFormField>

        <MobileFormField label="Nível">
          <Select>
            <SelectTrigger className="dark-input">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </MobileFormField>

        <MobileFormField label="Duração Estimada">
          <Input placeholder="Ex: 8 semanas" className="dark-input" />
        </MobileFormField>

        <MobileFormField label="Tags">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer">
              Fé Cristã
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              Bíblia
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              Teologia
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              Adicionar
            </Button>
          </div>
        </MobileFormField>
      </MobileFormGrid>

      <MobileFormActions>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading
            ? "Salvando..."
            : isEditing
              ? "Atualizar Curso"
              : "Criar Curso"}
        </Button>
      </MobileFormActions>
    </MobileForm>
  );
}

"use client";

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
import { Textarea } from "@base-church/ui/components/textarea";
import { Award, FileImage, Trash2, Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface CertificateFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  isEditing: boolean;
  courseTitle: string;
  courseDescription: string;
  certificateFile: File | null;
  setCertificateFile: (file: File | null) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CertificateForm({
  form,
  isLoading,
  isEditing,
  courseTitle,
  courseDescription,
  certificateFile,
  setCertificateFile,
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  return (
    <div className="mt-6">
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h3 className="dark-text-primary mb-6 text-xl font-bold">
          {isEditing
            ? "Editar Template de Certificado"
            : "Configurar Template de Certificado"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
                        (courseTitle ? `${courseTitle} - Certificado` : "")
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
              control={form.control}
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
                Template do Certificado (PNG)
              </h3>
              <div className="space-y-3">
                <div className="dark-bg-secondary rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                  <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                  <p className="dark-text-secondary text-sm">
                    {certificateFile
                      ? certificateFile.name
                      : "Arraste a imagem PNG aqui ou clique para selecionar"}
                  </p>
                  <p className="dark-text-tertiary text-xs">
                    Apenas imagens PNG (máx. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".png,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type === "image/png") {
                        setCertificateFile(file);
                      } else {
                        toast.error("Por favor, selecione apenas imagens PNG");
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
                    document.getElementById("certificate-upload")?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {certificateFile ? "Alterar Imagem" : "Selecionar PNG"}
                </Button>
                {certificateFile && (
                  <div className="flex items-center justify-between rounded-lg bg-green-900/20 p-3">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-green-400" />
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
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="dark-btn-primary"
              >
                <Award className="mr-2 h-4 w-4" />
                {isLoading
                  ? isEditing
                    ? "Atualizando..."
                    : "Criando..."
                  : isEditing
                    ? "Atualizar Template"
                    : "Criar Template"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

"use client";

import { FormSection } from "@/src/components/common/forms/form-section";
import { COURSE_CATEGORIES } from "@/src/lib/constants";
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
import { BookOpen, Plus, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface CourseInfoFormProps {
  form: UseFormReturn<any>;
  courseId: string | null;
  isLoading: boolean;
  leadersData: any[];
  leadersLoading: boolean;
  isEditing?: boolean;
  onSubmit: (data: any) => void;
}

export function CourseInfoForm({
  form,
  courseId,
  isLoading,
  leadersData,
  leadersLoading,
  isEditing = false,
  onSubmit,
}: CourseInfoFormProps) {
  return (
    <FormSection title="Informações do Curso" icon={BookOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {(!courseId || isEditing) && (
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="dark-btn-primary"
              >
                {isEditing ? (
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
          )}
        </form>
      </Form>
    </FormSection>
  );
}

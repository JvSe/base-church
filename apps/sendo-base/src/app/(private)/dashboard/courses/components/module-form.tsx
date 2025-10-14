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
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ModuleFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ModuleForm({
  form,
  isLoading,
  onSubmit,
  onCancel,
}: ModuleFormProps) {
  return (
    <div className="mt-6">
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h3 className="dark-text-primary mb-6 text-xl font-bold">
          Adicionar Novo Módulo
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} variant="success">
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? "Adicionando..." : "Adicionar Módulo"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

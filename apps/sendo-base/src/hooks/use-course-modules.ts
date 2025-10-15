import { createModule, deleteModule, updateModule } from "@/src/lib/actions";
import type { ModuleFormData } from "@/src/lib/forms/course-schemas";
import type { Module } from "@/src/lib/types/course.types";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook para gerenciar operações de módulos de curso
 *
 * Substituiu lógica duplicada em:
 * - create/page.tsx (~200 linhas)
 * - [courseId]/edit/page.tsx (~200 linhas)
 *
 * @example
 * const { modules, isLoading, addModule, editModule, deleteModule } = useCourseModules(courseId);
 */

type UseCourseModulesOptions = {
  initialModules?: Module[];
  onModuleChange?: (modules: Module[]) => void;
};

export function useCourseModules(
  courseId: string,
  options: UseCourseModulesOptions = {},
) {
  const { initialModules = [], onModuleChange } = options;

  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isLoading, setIsLoading] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(
    null,
  );
  const [showModuleForm, setShowModuleForm] = useState(false);

  // Atualizar módulos quando initialModules mudar
  const updateModules = (newModules: Module[]) => {
    setModules(newModules);
    onModuleChange?.(newModules);
  };

  /**
   * Adiciona um novo módulo
   */
  const addModule = async (data: ModuleFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await createModule(courseId, {
        ...data,
        order: modules.length + 1,
      });

      if (result.success && result.module) {
        const newModule: Module = {
          id: result.module.id,
          title: data.title,
          description: data.description,
          order: modules.length + 1,
          lessons: [],
        };

        updateModules([...modules, newModule]);
        setShowModuleForm(false);
        toast.success("Módulo adicionado com sucesso!");
        return true;
      }

      toast.error(result.error || "Erro ao criar módulo");
      return false;
    } catch (error) {
      toast.error("Erro ao criar módulo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia edição de um módulo
   */
  const startEditModule = (moduleIndex: number) => {
    setEditingModuleIndex(moduleIndex);
  };

  /**
   * Cancela edição de módulo
   */
  const cancelEditModule = () => {
    setEditingModuleIndex(null);
  };

  /**
   * Salva edição de um módulo
   */
  const saveModule = async (
    data: ModuleFormData,
    moduleIndex: number,
  ): Promise<boolean> => {
    const module = modules[moduleIndex];
    if (!module) {
      toast.error("Módulo não encontrado");
      return false;
    }

    setIsLoading(true);
    try {
      const result = await updateModule(module.id, {
        title: data.title,
        description: data.description,
        order: module.order,
      });

      if (result.success) {
        const updatedModules = [...modules];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].title = data.title;
          updatedModules[moduleIndex].description = data.description;
        }

        updateModules(updatedModules);
        setEditingModuleIndex(null);
        toast.success("Módulo atualizado com sucesso!");
        return true;
      }

      toast.error(result.error || "Erro ao atualizar módulo");
      return false;
    } catch (error) {
      toast.error("Erro ao atualizar módulo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove um módulo
   */
  const removeModule = async (
    moduleId: string,
    moduleIndex: number,
  ): Promise<boolean> => {
    if (!confirm("Tem certeza que deseja excluir este módulo?")) {
      return false;
    }

    try {
      const result = await deleteModule(moduleId);
      if (result.success) {
        const updatedModules = modules.filter((_, i) => i !== moduleIndex);
        updateModules(updatedModules);
        toast.success(result.message);
        return true;
      }

      toast.error(result.error);
      return false;
    } catch (error) {
      toast.error("Erro ao excluir módulo");
      return false;
    }
  };

  /**
   * Remove módulo por índice (para modo create onde não há ID ainda)
   */
  const removeModuleByIndex = (moduleIndex: number) => {
    const updatedModules = modules.filter((_, i) => i !== moduleIndex);
    updateModules(updatedModules);
    toast.success("Módulo removido!");
  };

  /**
   * Atualiza lições de um módulo específico
   */
  const updateModuleLessons = (moduleIndex: number, lessons: any[]) => {
    const updatedModules = [...modules];
    if (updatedModules[moduleIndex]) {
      updatedModules[moduleIndex].lessons = lessons;
      updateModules(updatedModules);
    }
  };

  return {
    modules,
    isLoading,
    editingModuleIndex,
    showModuleForm,
    setShowModuleForm,
    addModule,
    startEditModule,
    cancelEditModule,
    saveModule,
    removeModule,
    removeModuleByIndex,
    updateModuleLessons,
    setModules: updateModules,
  };
}

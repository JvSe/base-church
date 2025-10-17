import {
  createObjectiveQuestion,
  createSubjectiveQuestion,
  deleteQuestion,
} from "@/src/lib/actions";
import type { Lesson, Question } from "@/src/lib/types/course.types";
import { useState } from "react";
import { toast } from "sonner";

type UseCourseQuestionsOptions = {
  onQuestionChange?: () => void;
};

export function useCourseQuestions(
  modules: any[],
  setModules: (modules: any[]) => void,
  options: UseCourseQuestionsOptions = {},
) {
  const { onQuestionChange } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);

  /**
   * Adiciona uma nova questão a uma lição
   */
  const addQuestion = async (
    question: Question,
    moduleIndex: number,
    lessonIndex: number,
    lessonProps?: Lesson | null,
  ): Promise<boolean> => {
    const lesson = lessonProps ?? modules[moduleIndex]?.lessons[lessonIndex];

    if (!lesson || !lesson.id) {
      toast.error("Lição precisa ser criada primeiro");
      return false;
    }

    setIsLoading(true);
    try {
      let result;

      if (question.type === "objective") {
        result = await createObjectiveQuestion({
          lessonId: lesson.id,
          questionText: question.questionText,
          points: question.points,
          order: question.order,
          explanation: question.explanation,
          options: question.options || [],
        });
      } else {
        result = await createSubjectiveQuestion({
          lessonId: lesson.id,
          questionText: question.questionText,
          points: question.points,
          order: question.order,
          explanation: question.explanation,
          subjectiveAnswerType: question.subjectiveAnswerType as
            | "TEXT"
            | "FILE",
          correctAnswer: question.correctAnswer,
        });
      }

      if (result.success && result.question) {
        // Atualizar o estado local com a questão criada
        // const updatedModules = [...modules];

        // if (!updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions) {
        //   updatedModules[moduleIndex]!.lessons[lessonIndex]!.questions = [];
        // }

        // updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions!.push({
        //   ...question,
        //   id: result.question.id,
        // });

        // setModules(updatedModules);
        setShowQuestionForm(null);
        onQuestionChange?.();
        toast.success("Questão adicionada com sucesso!");
        return true;
      }

      console.log("acabei caindo aqui");
      toast.error(result.error || "Erro ao criar questão no banco");
      return false;
    } catch (error) {
      console.log("acabei caindo aqui 2", error);
      toast.error("Erro ao criar questão");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove uma questão
   */
  const removeQuestion = async (
    moduleIndex: number,
    lessonIndex: number,
    questionIndex: number,
  ) => {
    const question =
      modules[moduleIndex]?.lessons[lessonIndex]?.questions?.[questionIndex];

    if (!question) {
      toast.error("Questão não encontrada");
      return;
    }

    // Se a questão tem ID, precisa deletar do banco
    if (question.id) {
      if (
        !confirm(
          "Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.",
        )
      ) {
        return;
      }

      setIsLoading(true);
      try {
        const result = await deleteQuestion(question.id);

        if (result.success) {
          // Atualizar o estado local após deletar do banco
          // const updatedModules = [...modules];
          // if (updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions) {
          //   updatedModules[moduleIndex].lessons[lessonIndex].questions =
          //     updatedModules[moduleIndex].lessons[
          //       lessonIndex
          //     ].questions!.filter((_: any, i: number) => i !== questionIndex);
          //   setModules(updatedModules);
          // }

          onQuestionChange?.();
          toast.success("Questão removida com sucesso!");
        } else {
          toast.error(result.error || "Erro ao deletar questão");
        }
      } catch (error) {
        toast.error("Erro ao deletar questão");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Se não tem ID, apenas remove localmente
      const updatedModules = [...modules];
      if (updatedModules[moduleIndex]?.lessons[lessonIndex]?.questions) {
        updatedModules[moduleIndex].lessons[lessonIndex].questions =
          updatedModules[moduleIndex].lessons[lessonIndex].questions!.filter(
            (_: any, i: number) => i !== questionIndex,
          );
        setModules(updatedModules);
        toast.success("Questão removida!");
      }
    }
  };

  /**
   * Abre formulário de questão para uma lição específica
   */
  const openQuestionForm = (moduleIndex: number, lessonIndex: number) => {
    setShowQuestionForm({ moduleIndex, lessonIndex });
  };

  /**
   * Fecha formulário de questão
   */
  const closeQuestionForm = () => {
    setShowQuestionForm(null);
  };

  return {
    isLoading,
    showQuestionForm,
    openQuestionForm,
    closeQuestionForm,
    setShowQuestionForm,
    addQuestion,
    removeQuestion,
  };
}

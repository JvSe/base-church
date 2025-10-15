"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";

// Tipos
export type QuestionType = "OBJECTIVE" | "SUBJECTIVE";
export type SubjectiveAnswerType = "TEXT" | "FILE";

export interface CreateObjectiveQuestionInput {
  lessonId: string;
  questionText: string;
  points?: number;
  order: number;
  explanation?: string;
  options: {
    optionText: string;
    isCorrect: boolean;
    order: number;
  }[];
}

export interface CreateSubjectiveQuestionInput {
  lessonId: string;
  questionText: string;
  points?: number;
  order: number;
  explanation?: string;
  subjectiveAnswerType: SubjectiveAnswerType;
  correctAnswer?: string;
}

// Criar questão objetiva
export async function createObjectiveQuestion(
  data: CreateObjectiveQuestionInput,
) {
  console.log("TO VINDO AQUI", data);
  try {
    // Validar que pelo menos uma opção está marcada como correta
    const hasCorrectAnswer = data.options.some((option) => option.isCorrect);
    if (!hasCorrectAnswer) {
      return {
        success: false,
        error: "Pelo menos uma opção deve ser marcada como correta",
      };
    }

    const question = await prisma.question.create({
      data: {
        lessonId: data.lessonId,
        type: "OBJECTIVE",
        questionText: data.questionText,
        points: data.points || 10,
        order: data.order,
        explanation: data.explanation,
        options: {
          create: data.options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            order: option.order,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, question };
  } catch (error) {
    console.error("Error creating objective question:", error);
    return { success: false, error: "Erro ao criar questão objetiva" };
  }
}

// Criar questão subjetiva
export async function createSubjectiveQuestion(
  data: CreateSubjectiveQuestionInput,
) {
  try {
    const question = await prisma.question.create({
      data: {
        lessonId: data.lessonId,
        type: "SUBJECTIVE",
        questionText: data.questionText,
        points: data.points || 10,
        order: data.order,
        explanation: data.explanation,
        subjectiveAnswerType: data.subjectiveAnswerType,
        correctAnswer: data.correctAnswer,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, question };
  } catch (error) {
    console.error("Error creating subjective question:", error);
    return { success: false, error: "Erro ao criar questão subjetiva" };
  }
}

// Atualizar questão objetiva
export async function updateObjectiveQuestion(
  questionId: string,
  data: CreateObjectiveQuestionInput,
) {
  try {
    // Validar que pelo menos uma opção está marcada como correta
    const hasCorrectAnswer = data.options.some((option) => option.isCorrect);
    if (!hasCorrectAnswer) {
      return {
        success: false,
        error: "Pelo menos uma opção deve ser marcada como correta",
      };
    }

    // Deletar opções antigas e criar novas
    await prisma.questionOption.deleteMany({
      where: { questionId },
    });

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        questionText: data.questionText,
        points: data.points || 10,
        order: data.order,
        explanation: data.explanation,
        options: {
          create: data.options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            order: option.order,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, question };
  } catch (error) {
    console.error("Error updating objective question:", error);
    return { success: false, error: "Erro ao atualizar questão objetiva" };
  }
}

// Atualizar questão subjetiva
export async function updateSubjectiveQuestion(
  questionId: string,
  data: CreateSubjectiveQuestionInput,
) {
  try {
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        questionText: data.questionText,
        points: data.points || 10,
        order: data.order,
        explanation: data.explanation,
        subjectiveAnswerType: data.subjectiveAnswerType,
        correctAnswer: data.correctAnswer,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, question };
  } catch (error) {
    console.error("Error updating subjective question:", error);
    return { success: false, error: "Erro ao atualizar questão subjetiva" };
  }
}

// Deletar questão
export async function deleteQuestion(questionId: string) {
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, message: "Questão deletada com sucesso" };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { success: false, error: "Erro ao deletar questão" };
  }
}

// Buscar questões de uma lição
export async function getQuestionsByLesson(lessonId: string) {
  try {
    const questions = await prisma.question.findMany({
      where: { lessonId },
      include: {
        options: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return { success: true, questions };
  } catch (error) {
    console.error("Error getting questions:", error);
    return { success: false, error: "Erro ao buscar questões" };
  }
}

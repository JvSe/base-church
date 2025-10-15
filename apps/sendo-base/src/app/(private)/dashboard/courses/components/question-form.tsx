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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Textarea } from "@base-church/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Question {
  id?: string;
  questionText: string;
  points: number;
  order: number;
  explanation?: string;
  type: "objective" | "subjective";
  subjectiveAnswerType?: "text" | "file";
  correctAnswer?: string;
  options?: {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }[];
}

// Schema de validação para questões
const questionSchema = z.object({
  questionText: z.string().min(1, "Texto da questão é obrigatório"),
  points: z.number().min(1, "Pontuação deve ser maior que 0").optional(),
  explanation: z.string().optional(),
  type: z.enum(["objective", "subjective"]),
  subjectiveAnswerType: z.enum(["text", "file"]).optional(),
  correctAnswer: z.string().optional(),
  options: z
    .array(
      z.object({
        optionText: z.string().min(1, "Texto da opção é obrigatório"),
        isCorrect: z.boolean(),
      }),
    )
    .optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  currentQuestionsCount: number;
  onSuccess: (question: Question) => void;
  onCancel: () => void;
}

export function QuestionForm({
  currentQuestionsCount,
  onSuccess,
  onCancel,
}: QuestionFormProps) {
  // Estados internos
  const [questionType, setQuestionType] = useState<"objective" | "subjective">(
    "objective",
  );
  const [questionOptions, setQuestionOptions] = useState<
    { optionText: string; isCorrect: boolean }[]
  >([
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);

  // Formulário de questões
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: "",
      points: 10,
      explanation: "",
      type: "objective",
      subjectiveAnswerType: "text",
      correctAnswer: "",
      options: [],
    },
  });

  // Watchers
  const selectedSubjectiveAnswerType = form.watch("subjectiveAnswerType");

  // Handlers
  const handleAddQuestion = (data: QuestionFormData) => {
    if (questionType === "objective") {
      // Validar opções
      if (questionOptions.length < 2) {
        toast.error("Adicione pelo menos 2 opções");
        return;
      }

      const hasCorrectAnswer = questionOptions.some((opt) => opt.isCorrect);
      if (!hasCorrectAnswer) {
        toast.error("Marque pelo menos uma opção como correta");
        return;
      }

      // Criar objeto da questão objetiva
      const newQuestion: Question = {
        questionText: data.questionText,
        points: data.points || 10,
        order: currentQuestionsCount + 1,
        explanation: data.explanation,
        type: "objective",
        options: questionOptions.map((opt, idx) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          order: idx + 1,
        })),
      };

      onSuccess(newQuestion);
      handleReset();
      toast.success("Questão objetiva adicionada!");
    } else {
      // Criar objeto da questão subjetiva
      const newQuestion: Question = {
        questionText: data.questionText,
        points: data.points || 10,
        order: currentQuestionsCount + 1,
        explanation: data.explanation,
        type: "subjective",
        subjectiveAnswerType: data.subjectiveAnswerType,
        correctAnswer: data.correctAnswer,
      };

      onSuccess(newQuestion);
      handleReset();
      toast.success("Questão subjetiva adicionada!");
    }
  };

  const handleReset = () => {
    form.reset();
    setQuestionOptions([
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
    ]);
    setQuestionType("objective");
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };
  return (
    <div className="dark-border border-b p-6">
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h4 className="dark-text-primary mb-6 text-xl font-bold">
          Adicionar Nova Questão
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddQuestion)}
            className="space-y-6"
          >
            {/* Texto da Questão */}
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Texto da Questão *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Digite a pergunta da questão..."
                      className="dark-input min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Explicação (Opcional) */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Explicação (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Explicação da resposta correta..."
                      className="dark-input min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opções para Questões Objetivas */}
            {questionType === "objective" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="dark-text-primary font-medium">
                    Opções de Resposta
                  </h5>
                  <Button
                    type="button"
                    size="sm"
                    variant="success"
                    onClick={() => {
                      setQuestionOptions([
                        ...questionOptions,
                        { optionText: "", isCorrect: false },
                      ]);
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Adicionar Opção
                  </Button>
                </div>

                {questionOptions.map((option, index) => (
                  <div
                    key={index}
                    className="dark-card dark-shadow-sm flex items-start gap-3 rounded-lg p-4"
                  >
                    <div className="flex-1">
                      <Input
                        placeholder={`Opção ${index + 1}`}
                        value={option.optionText}
                        onChange={(e) => {
                          const updated = [...questionOptions];
                          if (updated[index]) {
                            updated[index].optionText = e.target.value;
                            setQuestionOptions(updated);
                          }
                        }}
                        className="dark-input mb-2"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const updated = [...questionOptions];
                            if (updated[index]) {
                              updated[index].isCorrect = e.target.checked;
                              setQuestionOptions(updated);
                            }
                          }}
                          className="dark-checkbox"
                        />
                        <span className="dark-text-secondary text-sm">
                          Resposta Correta
                        </span>
                      </label>
                    </div>
                    {questionOptions.length > 2 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setQuestionOptions(
                            questionOptions.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}

                {questionOptions.length < 2 && (
                  <div className="dark-warning-bg dark-warning rounded-lg p-3 text-sm">
                    ⚠️ Adicione pelo menos 2 opções de resposta
                  </div>
                )}
              </div>
            )}

            {/* Configurações para Questões Subjetivas */}
            {questionType === "subjective" && (
              <div className="space-y-4">
                <div>
                  <label className="dark-text-secondary mb-2 block text-sm font-medium">
                    Tipo de Resposta *
                  </label>
                  <Select
                    value={selectedSubjectiveAnswerType}
                    onValueChange={(value: "text" | "file") => {
                      form.setValue("subjectiveAnswerType", value);
                    }}
                  >
                    <SelectTrigger className="dark-input">
                      <SelectValue placeholder="Selecione o tipo de resposta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center space-x-2">
                          <Type className="h-4 w-4" />
                          <span>Resposta em Texto</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="file">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Upload de Arquivo</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark-text-secondary text-sm font-medium">
                        Resposta Esperada (Opcional - para referência)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Digite a resposta esperada para esta questão..."
                          className="dark-input min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                className="dark-glass dark-border hover:dark-border-hover"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                onClick={form.handleSubmit(handleAddQuestion)}
                variant="success"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Questão
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

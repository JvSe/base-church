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
import { FileText, Plus, Trash2, Type } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface QuestionFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  questionType: "objective" | "subjective";
  subjectiveAnswerType?: "text" | "file";
  questionOptions: { optionText: string; isCorrect: boolean }[];
  onQuestionTypeChange: (type: "objective" | "subjective") => void;
  onSubjectiveAnswerTypeChange: (type: "text" | "file") => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionTextChange: (index: number, text: string) => void;
  onOptionCorrectChange: (index: number, isCorrect: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function QuestionForm({
  form,
  isLoading,
  questionType,
  subjectiveAnswerType = "text",
  questionOptions,
  onQuestionTypeChange,
  onSubjectiveAnswerTypeChange,
  onAddOption,
  onRemoveOption,
  onOptionTextChange,
  onOptionCorrectChange,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  return (
    <div className="dark-border border-b p-6">
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h4 className="dark-text-primary mb-6 text-xl font-bold">
          Adicionar Nova Questão
        </h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    onClick={onAddOption}
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
                        onChange={(e) =>
                          onOptionTextChange(index, e.target.value)
                        }
                        className="dark-input mb-2"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) =>
                            onOptionCorrectChange(index, e.target.checked)
                          }
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
                        onClick={() => onRemoveOption(index)}
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
                    value={subjectiveAnswerType}
                    onValueChange={(value: "text" | "file") =>
                      onSubjectiveAnswerTypeChange(value)
                    }
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
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} variant="success">
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? "Adicionando..." : "Adicionar Questão"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

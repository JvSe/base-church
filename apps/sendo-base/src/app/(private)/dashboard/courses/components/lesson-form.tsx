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
import { CheckCircle, Edit, FileText, Plus, Upload, Video } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { QuestionForm } from "./question-form";
import { QuestionList } from "./question-list";

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

interface LessonFormProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  onSubmit: (data: any, questions: Question[]) => void;
  onCancel: () => void;
}

export function LessonForm({
  form,
  isLoading,
  onSubmit,
  onCancel,
}: LessonFormProps) {
  // Estados internos para gerenciar questões
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Watchers
  const selectedLessonType = form.watch("type");

  const isActivity =
    selectedLessonType === "objective_quiz" ||
    selectedLessonType === "subjective_quiz";

  // Handlers de questões
  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success("Questão removida!");
  };

  const handleSubmitLesson = (data: any) => {
    // Validar se é atividade e não tem questões
    // if (isActivity && questions.length === 0) {
    //   toast.error("Adicione pelo menos uma questão para esta atividade!");
    //   return;
    // }

    // Chamar o callback com os dados da lição e as questões
    onSubmit(data, questions);
  };

  const handleCancel = () => {
    // Limpar questões ao cancelar
    setQuestions([]);
    setShowQuestionForm(false);
    onCancel();
  };
  return (
    <div className="dark-border border-b p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitLesson)}
          className="space-y-6"
        >
          <h4 className="dark-text-primary mb-6 text-xl font-bold">
            Adicionar Nova Lição
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Título da Lição *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: O que é a Fé Cristã"
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Duração (minutos) *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="15"
                      className="dark-input"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    placeholder="Descreva o que será abordado nesta lição..."
                    className="dark-input min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark-text-secondary text-sm font-medium">
                  Tipo de Conteúdo *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="dark-input">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VIDEO">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Vídeo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TEXT">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Texto/Leitura</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="OBJECTIVE_QUIZ">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Atividade Objetiva (Múltipla Escolha)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SUBJECTIVE_QUIZ">
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Atividade Subjetiva (Dissertativa)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional fields based on type */}
          {selectedLessonType === "video" && (
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    URL do Vídeo (YouTube) *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://youtu.be/VIDEO_ID"
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedLessonType === "text" && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-secondary text-sm font-medium">
                    Conteúdo da Lição *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Digite o conteúdo completo da lição em texto. Você pode incluir referências bíblicas, explicações, exemplos..."
                      className="dark-input min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isActivity && (
            <div className="space-y-6">
              {/* Aviso sobre Atividade */}
              <div className="dark-card dark-shadow-sm rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="dark-warning-subtle-bg rounded-lg p-2">
                    <CheckCircle className="dark-warning" size={20} />
                  </div>
                  <div>
                    <h4 className="dark-text-primary mb-1 font-medium">
                      Atividade de Avaliação
                    </h4>
                    <p className="dark-text-secondary text-sm">
                      Esta lição será uma atividade que bloqueará o próximo
                      módulo até ser concluída
                      {selectedLessonType === "subjective_quiz"
                        ? " e corrigida"
                        : ""}
                      . Adicione as questões abaixo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção de Questões */}
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h5 className="dark-text-primary font-medium">
                    Questões da Atividade
                  </h5>

                  {!showQuestionForm && (
                    <Button
                      type="button"
                      size="sm"
                      variant="success"
                      onClick={() => setShowQuestionForm(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Adicionar Questão
                    </Button>
                  )}
                </div>

                {/* Formulário de Questão */}
                {showQuestionForm && (
                  <div className="mb-6">
                    <QuestionForm
                      currentQuestionsCount={questions.length}
                      onSuccess={(question) => {
                        setQuestions([...questions, question]);
                        setShowQuestionForm(false);
                      }}
                      onCancel={() => {
                        setShowQuestionForm(false);
                      }}
                    />
                  </div>
                )}

                {/* Lista de Questões */}
                <QuestionList
                  questions={questions}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div className="dark-card dark-shadow-sm rounded-lg p-4">
            <h3 className="dark-text-primary mb-3 font-semibold">
              Materiais Complementares
            </h3>
            <div className="space-y-3">
              <div className="dark-bg-secondary rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
                <Upload className="dark-text-tertiary mx-auto mb-2 h-8 w-8" />
                <p className="dark-text-secondary text-sm">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="dark-text-tertiary text-xs">
                  PDF, DOC, PPT, imagens (máx. 10MB)
                </p>
              </div>
              <Button
                disabled
                type="button"
                className="dark-glass dark-border hover:dark-border-hover w-full"
                variant="outline"
                onClick={() => {
                  toast.info("Funcionalidade de upload em desenvolvimento");
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Arquivos
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              className="dark-glass dark-border hover:dark-border-hover"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} variant="success">
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Adicionando..." : "Adicionar Lição"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

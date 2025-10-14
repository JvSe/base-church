"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import { CheckCircle, FileText, Trash2 } from "lucide-react";

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

interface QuestionListProps {
  questions: Question[];
  onDeleteQuestion?: (index: number) => void;
}

export function QuestionList({
  questions,
  onDeleteQuestion,
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="dark-card dark-shadow-sm rounded-lg p-6 text-center">
        <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle className="dark-text-tertiary" size={20} />
        </div>
        <h6 className="dark-text-primary mb-2 font-medium">
          Nenhuma questão adicionada
        </h6>
        <p className="dark-text-tertiary text-sm">
          Clique em "Adicionar Questão" para criar questões para esta atividade.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h5 className="dark-text-primary font-medium">
        Questões ({questions.length})
      </h5>
      <Accordion type="multiple" className="space-y-3">
        {questions.map((question, index) => (
          <AccordionItem
            key={index}
            value={`question-${index}`}
            className="dark-card dark-shadow-sm rounded-lg"
          >
            <AccordionTrigger className="hover:dark-bg-secondary p-4 transition-colors">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="dark-secondary-subtle-bg rounded-lg p-2">
                    {question.type === "objective" ? (
                      <CheckCircle className="dark-secondary" size={16} />
                    ) : (
                      <FileText className="dark-secondary" size={16} />
                    )}
                  </div>
                  <div className="text-left">
                    <h6 className="dark-text-primary font-medium">
                      Questão {index + 1}
                    </h6>
                    <p className="dark-text-secondary text-sm">
                      {question.type === "objective"
                        ? "Múltipla Escolha"
                        : question.subjectiveAnswerType === "text"
                          ? "Resposta em Texto"
                          : "Upload de Arquivo"}
                    </p>
                    <span className="dark-text-tertiary text-xs">
                      {question.points} pontos
                    </span>
                  </div>
                </div>
                {onDeleteQuestion && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm("Tem certeza que deseja excluir esta questão?")
                      ) {
                        onDeleteQuestion(index);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </Button>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-4">
                {/* Texto da Questão */}
                <div>
                  <h6 className="dark-text-primary mb-2 font-medium">
                    Pergunta
                  </h6>
                  <div className="dark-card dark-shadow-sm rounded-lg p-4">
                    <p className="dark-text-secondary text-sm whitespace-pre-wrap">
                      {question.questionText}
                    </p>
                  </div>
                </div>

                {/* Opções (para questões objetivas) */}
                {question.type === "objective" && question.options && (
                  <div>
                    <h6 className="dark-text-primary mb-2 font-medium">
                      Opções de Resposta
                    </h6>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`dark-card dark-shadow-sm rounded-lg p-3 ${
                            option.isCorrect
                              ? "dark-success-bg border-2 border-green-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="dark-text-secondary font-medium">
                                {String.fromCharCode(65 + optionIndex)})
                              </span>
                              <p className="dark-text-secondary text-sm">
                                {option.optionText}
                              </p>
                            </div>
                            {option.isCorrect && (
                              <span className="dark-success flex items-center gap-1 text-xs font-medium">
                                <CheckCircle className="h-3 w-3" />
                                Correta
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tipo de Resposta (para questões subjetivas) */}
                {question.type === "subjective" && (
                  <div>
                    <h6 className="dark-text-primary mb-2 font-medium">
                      Tipo de Resposta
                    </h6>
                    <div className="dark-card dark-shadow-sm rounded-lg p-3">
                      <p className="dark-text-secondary text-sm">
                        {question.subjectiveAnswerType === "text"
                          ? "✍️ O aluno deverá escrever sua resposta em um campo de texto"
                          : "📎 O aluno deverá fazer upload de um arquivo"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resposta Esperada (para questões subjetivas) */}
                {question.type === "subjective" && question.correctAnswer && (
                  <div>
                    <h6 className="dark-text-primary mb-2 font-medium">
                      Resposta Esperada (Referência)
                    </h6>
                    <div className="dark-card dark-shadow-sm rounded-lg p-4">
                      <p className="dark-text-secondary text-sm whitespace-pre-wrap">
                        {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explicação */}
                {question.explanation && (
                  <div>
                    <h6 className="dark-text-primary mb-2 font-medium">
                      Explicação
                    </h6>
                    <div className="dark-card dark-shadow-sm rounded-lg p-4">
                      <p className="dark-text-secondary text-sm whitespace-pre-wrap">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

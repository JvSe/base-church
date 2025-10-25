"use client";

import { Button } from "@base-church/ui/components/button";
import { Card } from "@base-church/ui/components/card";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useState } from "react";

type Question = {
  id: string;
  questionText: string;
  points: number;
  order: number;
  options: QuestionOption[];
};

type QuestionOption = {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
};

type QuizLessonContentProps = {
  questions: Question[];
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  onComplete: (
    answers: Array<{ questionId: string; selectedOptionId: string }>,
  ) => Promise<any>;
};

export function QuizLessonContent({
  questions,
  lessonId,
  userId,
  isCompleted,
  onComplete,
}: QuizLessonContentProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(null);

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (showResults) return; // Não permitir mudanças após submissão

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    // Verificar se todas as questões foram respondidas
    const allAnswered = sortedQuestions.every(
      (q) => selectedAnswers[q.id] !== undefined,
    );

    if (!allAnswered) {
      alert("Por favor, responda todas as questões antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar respostas para envio
      const answers = sortedQuestions.map((question) => ({
        questionId: question.id,
        selectedOptionId: selectedAnswers[question.id]!,
      }));

      // Enviar respostas e obter resultado
      const result = await onComplete(answers);

      if (result) {
        setScore(result.percentageScore);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Erro ao enviar quiz:", error);
      alert("Erro ao enviar respostas. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(null);
  };

  return (
    <div className="dark-bg-secondary flex h-full flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="dark-bg-primary dark-border rounded-lg border p-4 sm:p-6">
            <h2 className="dark-text-primary mb-2 text-2xl font-bold">
              Avaliação Objetiva
            </h2>
            <p className="dark-text-secondary">
              Responda todas as questões abaixo. É necessário atingir 70% de
              acertos para concluir esta lição.
            </p>
            {showResults && score !== null && (
              <div
                className={`mt-4 rounded-lg p-4 ${
                  score >= 70
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                <p className="text-lg font-semibold">
                  {score >= 70 ? "✓ Aprovado!" : "✗ Não aprovado"}
                </p>
                <p className="text-sm">Sua pontuação: {score}% (mínimo: 70%)</p>
              </div>
            )}
          </div>

          {/* Questions */}
          {sortedQuestions.map((question, index) => {
            const selectedOptionId = selectedAnswers[question.id];
            const selectedOption = question.options.find(
              (opt) => opt.id === selectedOptionId,
            );
            const correctOption = question.options.find((opt) => opt.isCorrect);
            const sortedOptions = [...question.options].sort(
              (a, b) => a.order - b.order,
            );

            return (
              <Card key={question.id} className="dark-bg-primary dark-border">
                <div className="p-6">
                  {/* Question Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="dark-text-primary flex-1 text-lg font-semibold">
                      <span className="dark-text-secondary mr-2">
                        {index + 1}.
                      </span>
                      {question.questionText}
                    </h3>
                    <span className="dark-text-secondary ml-4 text-sm">
                      {question.points} pts
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {sortedOptions.map((option) => {
                      const isSelected = selectedOptionId === option.id;
                      const isCorrect = option.isCorrect;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect =
                        showResults && isSelected && !isCorrect;

                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleSelectOption(question.id, option.id)
                          }
                          disabled={showResults}
                          className={`dark-border w-full rounded-lg border p-4 text-left transition-all ${
                            showCorrect
                              ? "border-green-500 bg-green-500/10"
                              : showIncorrect
                                ? "border-red-500 bg-red-500/10"
                                : isSelected
                                  ? "dark-border-primary bg-blue-500/10"
                                  : "dark-border hover:dark-border-primary"
                          } ${showResults ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {showCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : showIncorrect ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : isSelected ? (
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Circle className="dark-text-secondary h-5 w-5" />
                              )}
                            </div>
                            <span
                              className={`dark-text-primary flex-1 ${
                                showCorrect
                                  ? "font-semibold text-green-500"
                                  : showIncorrect
                                    ? "text-red-500"
                                    : ""
                              }`}
                            >
                              {option.optionText}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Show correct answer if wrong was selected */}
                  {showResults &&
                    selectedOption &&
                    !selectedOption.isCorrect && (
                      <div className="mt-3 rounded-lg bg-green-500/10 p-3">
                        <p className="text-sm text-green-500">
                          ✓ Resposta correta: {correctOption?.optionText}
                        </p>
                      </div>
                    )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dark-bg-primary dark-border flex-shrink-0 p-4">
        <div className="mx-auto max-w-4xl">
          {!showResults ? (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                sortedQuestions.length !== Object.keys(selectedAnswers).length
              }
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Enviar Respostas
                </>
              )}
            </Button>
          ) : score !== null && score < 70 ? (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Tentar Novamente
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

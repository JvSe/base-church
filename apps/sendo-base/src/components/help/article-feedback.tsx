"use client";

import { useAuth } from "@/src/hooks/auth";
import { checkArticleFeedback, markArticleAsHelpful } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type ArticleFeedbackProps = {
  articleId: string;
};

export function ArticleFeedback({ articleId }: ArticleFeedbackProps) {
  const [isPending, startTransition] = useTransition();
  const [isChecking, setIsChecking] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const userId = useAuth((s) => s.user?.id);

  // Check if user already voted
  useEffect(() => {
    async function checkVote() {
      if (userId) {
        const result = await checkArticleFeedback(articleId, userId);
        if (result.hasVoted) {
          setFeedbackGiven(true);
          setUserVote(result.vote ?? null);
        }
      }
      setIsChecking(false);
    }
    checkVote();
  }, [articleId, userId]);

  function handleFeedback(isHelpful: boolean) {
    if (!userId) {
      toast.error("Faça login para avaliar");
      return;
    }

    startTransition(async () => {
      const result = await markArticleAsHelpful(articleId, userId, isHelpful);

      if (result.success) {
        setFeedbackGiven(true);
        setUserVote(isHelpful);
        toast.success(
          isHelpful
            ? "Obrigado pelo feedback positivo!"
            : "Obrigado pelo feedback. Vamos melhorar!",
        );
      } else {
        toast.error(result.error || "Erro ao enviar feedback");
      }
    });
  }

  // Loading state while checking vote
  if (isChecking) {
    return (
      <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
        <div className="dark-text-tertiary flex items-center justify-center space-x-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  // Already voted state
  if (feedbackGiven) {
    const isPositive = userVote === true;
    return (
      <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
        <div
          className={`${isPositive ? "dark-success-bg" : "dark-warning-bg"} mx-auto mb-4 w-fit rounded-full p-4`}
        >
          {isPositive ? (
            <ThumbsUp className="dark-success" size={32} />
          ) : (
            <ThumbsDown className="dark-warning" size={32} />
          )}
        </div>
        <h3 className="dark-text-primary mb-2 text-xl font-semibold">
          Obrigado pelo seu feedback!
        </h3>
        <p className="dark-text-secondary">
          {isPositive
            ? "Sua opinião nos ajuda a melhorar nosso conteúdo"
            : "Vamos trabalhar para melhorar este artigo"}
        </p>
      </div>
    );
  }

  // Vote form
  return (
    <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
      <h3 className="dark-text-primary mb-4 text-xl font-semibold">
        Este artigo foi útil?
      </h3>
      <p className="dark-text-secondary mb-6">
        Ajude-nos a melhorar nossa base de conhecimento
      </p>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => handleFeedback(true)}
          disabled={isPending}
          className="dark-btn-primary flex items-center space-x-2"
        >
          <ThumbsUp size={18} />
          <span>{isPending ? "Enviando..." : "Sim, foi útil"}</span>
        </Button>
        <Button
          onClick={() => handleFeedback(false)}
          disabled={isPending}
          variant="ghost"
          className="dark-glass dark-border hover:dark-border-hover flex items-center space-x-2"
        >
          <ThumbsDown size={18} />
          <span>{isPending ? "Enviando..." : "Não ajudou"}</span>
        </Button>
      </div>
    </div>
  );
}

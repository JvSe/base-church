"use client";

import { useAuth } from "@/src/hooks/auth";
import { createForumComment } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Textarea } from "@base-church/ui/components/textarea";
import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const userId = useAuth((s) => s.user?.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Digite um comentário");
      return;
    }

    startTransition(async () => {
      const result = await createForumComment(userId!, postId, content);

      if (result.success) {
        toast.success("Comentário adicionado!");
        setContent("");
      } else {
        toast.error("Erro ao adicionar comentário");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="dark-glass dark-shadow-sm rounded-xl p-6"
    >
      <h3 className="dark-text-primary mb-4 text-lg font-semibold">
        Adicionar Comentário
      </h3>
      <div className="space-y-4">
        <Textarea
          placeholder="Compartilhe sua opinião ou experiência..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="dark-input resize-none"
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || !content.trim()}
            className="dark-btn-primary"
          >
            <Send className="mr-2 h-4 w-4" />
            {isPending ? "Enviando..." : "Enviar Comentário"}
          </Button>
        </div>
      </div>
    </form>
  );
}

"use client";

import { createForumPost } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { Textarea } from "@base-church/ui/components/textarea";
import { Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CreatePostModalProps = {
  userId: string;
  onClose: () => void;
};

export function CreatePostModal({ userId, onClose }: CreatePostModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  function handleSubmit() {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Preencha título e conteúdo");
      return;
    }

    startTransition(async () => {
      const result = await createForumPost(userId, {
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
      });

      if (result.success) {
        toast.success("Discussão criada com sucesso!");
        setFormData({ title: "", content: "", category: "" });
        onClose();
      } else {
        toast.error("Erro ao criar discussão");
      }
    });
  }

  return (
    <div className="dark-glass dark-shadow-md rounded-2xl p-6">
      <h2 className="dark-text-primary mb-6 text-xl font-bold">
        Nova Discussão Ministerial
      </h2>
      <div className="space-y-4">
        <Input
          placeholder="Título da discussão (ex: Como melhorar o discipulado?)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="dark-input h-12"
          disabled={isPending}
        />
        <Textarea
          placeholder="Compartilhe sua experiência, dúvida ou insight ministerial..."
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={6}
          className="dark-input resize-none"
          disabled={isPending}
        />
        <Input
          placeholder="Categoria (Células, Discipulado, Cultos, etc.)"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="dark-input h-12"
          disabled={isPending}
        />
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="bg-destructive border-destructive hover:bg-destructive/80 hover:border-destructive/80 text-white"
            disabled={isPending}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="dark-btn-primary"
            disabled={isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Publicando..." : "Publicar Discussão"}
          </Button>
        </div>
      </div>
    </div>
  );
}

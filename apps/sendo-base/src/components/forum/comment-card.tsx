"use client";

import { deleteForumComment, updateForumComment } from "@/src/lib/actions";
import { formatRelativeDate } from "@/src/lib/helpers/date-helpers";
import type { ForumComment } from "@/src/lib/types/forum";
import { Button } from "@base-church/ui/components/button";
import { Textarea } from "@base-church/ui/components/textarea";
import { Edit2, Save, Trash2, User, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CommentCardProps = {
  comment: ForumComment;
  currentUserId?: string;
};

export function CommentCard({ comment, currentUserId }: CommentCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isOwner = currentUserId === comment.userId;

  const displayName = comment.user.name || "Usuário";
  const displayUsername =
    comment.user.username ||
    `@${comment.user.name?.toLowerCase().replace(/\s+/g, "") || "usuario"}`;

  function handleEdit() {
    setIsEditing(true);
    setEditContent(comment.content);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditContent(comment.content);
  }

  function handleSaveEdit() {
    if (!editContent.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    if (editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updateForumComment(
        comment.id,
        currentUserId!,
        editContent,
      );

      if (result.success) {
        toast.success("Comentário atualizado!");
        setIsEditing(false);
      } else {
        toast.error("Erro ao atualizar comentário");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;

    startTransition(async () => {
      const result = await deleteForumComment(comment.id, currentUserId!);

      if (result.success) {
        toast.success("Comentário excluído!");
      } else {
        toast.error("Erro ao excluir comentário");
      }
    });
  }

  return (
    <div className="dark-card dark-shadow-sm rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-3">
          <User className="dark-primary" size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="dark-text-primary font-semibold">
                  {displayName}
                </span>
                <span className="dark-text-tertiary text-sm">
                  {displayUsername}
                </span>
                <span className="dark-text-tertiary text-sm">•</span>
                <span className="dark-text-tertiary text-sm">
                  {formatRelativeDate(comment.createdAt)}
                </span>
              </div>
            </div>

            {isOwner && !isEditing && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isPending}
                  className="hover:dark-bg-tertiary hover:text-dark-in"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="hover:dark-bg-tertiary hover:text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="dark-input resize-none"
                disabled={isPending}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="dark-glass dark-border hover:dark-border-hover"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isPending}
                  className="dark-btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="dark-text-secondary leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

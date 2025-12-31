"use client";

import { Button } from "@base-church/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EventActionsProps = {
  eventId: string;
  eventTitle: string;
  onDelete?: () => void;
};

export function EventActions({
  eventId,
  eventTitle,
  onDelete,
}: EventActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir o evento "${eventTitle}"?`)) {
      return;
    }

    try {
      // TODO: Implementar integração com backend
      toast.success(`Evento "${eventTitle}" excluído com sucesso`);
      onDelete?.();
      router.refresh();
    } catch (error) {
      toast.error("Erro ao excluir evento");
    }
  }

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="info"
        onClick={() => router.push(`/dashboard/events/${eventId}`)}
        title="Editar evento"
      >
        <Edit className="h-3 w-3" />
      </Button>

      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        title="Excluir evento"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}


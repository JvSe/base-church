"use client";

import { deleteCourse } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CourseActionsProps = {
  courseId: string;
  courseTitle: string;
  onDelete?: () => void;
};

export function CourseActions({
  courseId,
  courseTitle,
  onDelete,
}: CourseActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir o curso "${courseTitle}"?`)) {
      return;
    }

    try {
      const result = await deleteCourse(courseId);

      if (result.success) {
        toast.success(result.message);
        onDelete?.();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir curso");
    }
  }

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="info"
        onClick={() => router.push(`/dashboard/courses/${courseId}/edit`)}
        title="Editar curso"
      >
        <Edit className="h-3 w-3" />
      </Button>

      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        title="Excluir curso"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

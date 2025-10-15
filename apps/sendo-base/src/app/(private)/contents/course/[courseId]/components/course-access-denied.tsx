import { Button } from "@base-church/ui/components/button";
import { Lock } from "lucide-react";
import Link from "next/link";

type CourseAccessDeniedProps = {
  status?: string;
  rejectionReason?: string | null;
};

export function CourseAccessDenied({
  status,
  rejectionReason,
}: CourseAccessDeniedProps) {
  const getMessage = () => {
    if (status === "pending") {
      return "Sua matrícula está pendente de aprovação";
    }
    if (status === "rejected") {
      return `Sua matrícula foi rejeitada: ${rejectionReason || "Motivo não informado"}`;
    }
    return "Você precisa estar matriculado para acessar este curso";
  };

  return (
    <div className="dark-bg-primary min-h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
          <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Lock className="dark-warning" size={32} />
          </div>
          <div className="dark-text-primary mb-2 text-lg font-semibold">
            Acesso Negado
          </div>
          <div className="dark-text-secondary mb-4 text-sm">{getMessage()}</div>
          <Button asChild className="dark-btn-primary">
            <Link href="/catalog">Ver Catálogo de Cursos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

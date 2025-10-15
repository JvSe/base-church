import { Button } from "@base-church/ui/components/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

type CourseErrorProps = {
  message?: string;
};

export function CourseError({ message }: CourseErrorProps) {
  return (
    <div className="dark-bg-primary min-h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
          <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <div className="dark-text-primary mb-2 text-lg font-semibold">
            {message || "Curso não encontrado"}
          </div>
          <div className="dark-text-secondary mb-4 text-sm">
            O curso que você está procurando não existe ou foi removido
          </div>
          <Button asChild className="dark-btn-primary">
            <Link href="/contents">Voltar aos Conteúdos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

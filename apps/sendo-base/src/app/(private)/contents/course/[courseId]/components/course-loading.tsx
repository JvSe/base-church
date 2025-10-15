import { BookOpen } from "lucide-react";

export function CourseLoading() {
  return (
    <div className="dark-bg-primary min-h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
          <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <BookOpen className="dark-text-tertiary animate-pulse" size={32} />
          </div>
          <div className="dark-text-primary mb-2 text-lg font-semibold">
            Carregando curso...
          </div>
          <div className="dark-text-secondary text-sm">
            Aguarde enquanto buscamos as informações
          </div>
        </div>
      </div>
    </div>
  );
}

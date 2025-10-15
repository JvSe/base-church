import { formatDuration } from "@/src/lib/formatters";
import { BookOpen, CheckCircle, FileText, Target, Video } from "lucide-react";

type CatalogCurriculumProps = {
  modules: any[];
};

const iconMap = {
  VIDEO: Video,
  TEXT: FileText,
  OBJECTIVE_QUIZ: CheckCircle,
  SUBJECTIVE_QUIZ: Target,
  video: Video,
  reading: FileText,
  exercise: Target,
  quiz: CheckCircle,
};

function getTypeIcon(type: string) {
  return iconMap[type as keyof typeof iconMap] || BookOpen;
}

export function CatalogCurriculum({ modules }: CatalogCurriculumProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h2 className="dark-text-primary mb-6 text-xl font-bold">
        Conteúdo do Curso
      </h2>

      <div className="space-y-4">
        {modules.map((module) => {
          const moduleLessons = module.lessons || [];
          const totalDuration = moduleLessons.reduce(
            (total: number, l: any) => total + (l.duration || 0),
            0,
          );

          return (
            <div key={module.id} className="dark-card rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="dark-text-primary font-semibold">
                  {module.title}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="dark-text-tertiary">
                    {moduleLessons.length} aulas
                  </span>
                  <span className="dark-text-tertiary">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>
              <p className="dark-text-secondary mb-4 text-sm">
                {module.description}
              </p>

              <div className="space-y-2">
                {moduleLessons.length > 0 ? (
                  moduleLessons.map((lesson: any) => {
                    const Icon = getTypeIcon(lesson.type || "video");
                    return (
                      <div
                        key={lesson.id}
                        className="hover:dark-bg-secondary flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="dark-text-tertiary" size={16} />
                          <span className="dark-text-primary text-sm">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="dark-text-tertiary text-xs">
                          {formatDuration(lesson.duration || 0)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="dark-text-tertiary py-4 text-center text-sm">
                    Nenhuma lição disponível
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

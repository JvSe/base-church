"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Card } from "@base-church/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Award, CheckCircle, Lock } from "lucide-react";
import { CourseContentList } from "./course-content-list";
import { DownloadMaterials } from "./download-materials";

type CourseTabsProps = {
  course: any;
  currentLessonId: string;
  certificate: any;
};

export function CourseTabs({
  course,
  currentLessonId,
  certificate,
}: CourseTabsProps) {
  const completedLessons =
    course.modules?.reduce((total: number, module: any) => {
      return (
        total +
        (module.lessons?.filter((lesson: any) => lesson.isCompleted)?.length ||
          0)
      );
    }, 0) || 0;

  const totalLessons =
    course.modules?.reduce((total: number, module: any) => {
      return total + (module.lessons?.length || 0);
    }, 0) || 0;

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="mt-6 space-y-4 lg:hidden">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-2 grid w-full grid-cols-3">
          <TabsTrigger className="p-2" value="info">
            Informações
          </TabsTrigger>
          <TabsTrigger className="p-2" value="content">
            Conteúdos
          </TabsTrigger>
          <TabsTrigger className="p-2" value="materials">
            Materiais
          </TabsTrigger>
        </TabsList>

        {/* Informações Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card className="dark-bg-primary dark-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dark-text-primary text-lg font-semibold">
                Progresso do Curso
              </h3>
              <div className="flex items-center space-x-2">
                <span className="dark-text-primary text-sm font-medium">
                  {progressPercentage}%
                </span>
                <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="dark-bg-secondary rounded-lg p-3">
                <div className="dark-text-primary font-medium">
                  Aulas Concluídas
                </div>
                <div className="dark-text-secondary">
                  {completedLessons} de {totalLessons}
                </div>
              </div>
              <div className="dark-bg-secondary rounded-lg p-3">
                <div className="dark-text-primary font-medium">
                  Duração Total
                </div>
                <div className="dark-text-secondary">
                  {formatDuration(course.totalDuration || 0)}
                </div>
              </div>
            </div>
          </Card>

          {/* Certificate Card */}
          {course.certificateTemplate && (
            <Card className="dark-bg-primary dark-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="dark-text-primary text-sm font-medium sm:text-base">
                  Certificado de Conclusão
                </h4>
                {certificate ? (
                  <Award size={16} className="dark-success" />
                ) : (
                  <Lock size={16} className="dark-text-tertiary" />
                )}
              </div>

              {certificate ? (
                <div className="rounded-lg bg-green-500/10 p-3">
                  <div className="mb-2 flex items-center space-x-2">
                    <CheckCircle size={16} className="dark-success" />
                    <span className="dark-text-success text-sm font-medium">
                      🎉 Certificado Disponível!
                    </span>
                  </div>
                  <p className="dark-text-secondary text-xs">
                    Parabéns! Você concluiu o curso e pode baixar seu
                    certificado.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-500/10 p-3">
                  <div className="mb-2 flex items-center space-x-2">
                    <Lock size={16} className="dark-text-tertiary" />
                    <span className="dark-text-tertiary text-sm font-medium">
                      Certificado Bloqueado
                    </span>
                  </div>
                  <p className="dark-text-secondary text-xs">
                    Complete todas as aulas para desbloquear seu certificado.
                  </p>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Conteúdos Tab */}
        <TabsContent value="content" className="space-y-4">
          <CourseContentList
            course={course}
            currentLessonId={currentLessonId}
          />
        </TabsContent>

        {/* Materiais Tab */}
        <TabsContent value="materials" className="space-y-4">
          <DownloadMaterials
            materials={course.materials || []}
            courseTitle={course.title}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

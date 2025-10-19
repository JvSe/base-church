"use client";

import { useAuth } from "@/src/hooks";
import { Button } from "@base-church/ui/components/button";
import { PanelRightOpen } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useLessonProgress } from "../../../hooks/use-lesson-progress";
import {
  CertificateCard,
  LessonContent,
  LessonHeader,
  LessonInfo,
  LessonSidebar,
} from "./components";

type LessonPageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

export default function LessonPage(props: LessonPageProps) {
  const { courseId, lessonId } = use(props.params);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const {
    lesson,
    course,
    certificate,
    isLoading,
    error,
    isUpdatingProgress,
    showSuccessFeedback,
    showCertificateNotification,
    handleCompleteLesson,
    handleCompleteQuiz,
  } = useLessonProgress({ courseId, lessonId });

  // Loading state
  if (isLoading) {
    return (
      <div className="dark-bg-primary flex h-screen items-center justify-center">
        <div className="dark-text-primary text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p>Carregando lição...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lesson || !course) {
    return (
      <div className="dark-bg-primary flex h-screen items-center justify-center">
        <div className="dark-text-primary text-center">
          <p className="mb-4 text-red-500">
            {error instanceof Error ? error.message : "Lição não encontrada"}
          </p>
          <Button asChild>
            <Link href="/contents">Voltar aos Conteúdos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-bg-primary flex h-screen flex-col overflow-hidden">
      {/* Header Navigation */}
      <LessonHeader
        courseId={course.id}
        courseTitle={course.title}
        moduleTitle={lesson.module.title}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden p-8 pt-0">
          {/* Lesson Content */}
          <div className="flex-1 overflow-hidden">
            <LessonContent
              lesson={lesson}
              userId={user?.id || ""}
              isCompleted={lesson.isCompleted || false}
              isUpdatingProgress={isUpdatingProgress}
              onCompleteLesson={handleCompleteLesson}
              onCompleteQuiz={handleCompleteQuiz}
            />
          </div>

          {/* Lesson Info */}
          <LessonInfo
            lesson={lesson}
            isCompleted={lesson.isCompleted || false}
            isUpdatingProgress={isUpdatingProgress}
            showSuccessFeedback={showSuccessFeedback}
            showCertificateNotification={showCertificateNotification}
            onCompleteLesson={handleCompleteLesson}
          />
        </div>

        {/* Sidebar */}
        {isSidebarOpen ? (
          <div className="flex flex-col overflow-hidden">
            <LessonSidebar
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              course={course}
              currentLessonId={lessonId}
            />
            <CertificateCard course={course} certificate={certificate} />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="dark-text-secondary hover:dark-text-primary mr-4 -ml-4"
          >
            <PanelRightOpen size={24} />
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  CourseDetailHeader,
  CourseDetailTabs,
  CourseStatsSidebar,
} from "@/src/components/course-detail";
import { use, useState } from "react";
import {
  calculateCourseProgress,
  findNextIncompleteLesson,
} from "../../helpers/course.helpers";
import { useCourseData } from "../../hooks/use-course-data";
import { CourseAccessDenied } from "./course-access-denied";
import { CourseCurriculum } from "./course-curriculum";
import { CourseError } from "./course-error";
import { CourseInstructor } from "./course-instructor";
import { CourseLoading } from "./course-loading";
import { CourseOverview } from "./course-overview";
import { CourseProgressCard } from "./course-progress-card";
import { CourseReviews } from "./course-reviews";

type CourseClientWrapperProps = {
  params: Promise<{ courseId: string }>;
};

export function CourseClientWrapper({ params }: CourseClientWrapperProps) {
  const { courseId } = use(params);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");

  const {
    course,
    enrollment,
    completedLessonIds,
    isEnrolled,
    enrollmentStatus,
    isLoading,
    error,
  } = useCourseData({ courseId });

  // Estados de loading e error
  if (isLoading) return <CourseLoading />;

  if (error || !course) return <CourseError />;

  // Verificar se o usuário tem acesso ao curso
  if (!isEnrolled) {
    return (
      <CourseAccessDenied
        status={enrollmentStatus}
        rejectionReason={enrollment?.rejectionReason ?? undefined}
      />
    );
  }

  const modules = course.modules || [];
  const reviews = course.reviews || [];
  const courseProgress = calculateCourseProgress(modules, completedLessonIds);
  const nextLesson = findNextIncompleteLesson(modules, completedLessonIds);

  const completedModules = modules.filter((module: any) => {
    const moduleLessons = module.lessons || [];
    return (
      moduleLessons.length > 0 &&
      moduleLessons.every((lesson: any) =>
        completedLessonIds.includes(lesson.id),
      )
    );
  });

  // Progress Stats Component
  const progressStats = (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h3 className="dark-text-primary mb-4 font-semibold">Seu Progresso</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="dark-text-secondary text-sm">Progresso geral</span>
          <span className="dark-success font-semibold">{courseProgress}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="dark-text-secondary text-sm">Aulas concluídas</span>
          <span className="dark-success font-semibold">
            {completedLessonIds.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="dark-text-secondary text-sm">
            Módulos concluídos
          </span>
          <span className="dark-success font-semibold">
            {completedModules.length}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Course Header with Progress Card */}
        <CourseDetailHeader course={course} reviewsCount={reviews.length}>
          <CourseProgressCard
            courseId={courseId}
            progress={courseProgress}
            nextLessonId={nextLesson?.id || null}
            isCompleted={courseProgress === 100}
          />
        </CourseDetailHeader>

        {/* Course Navigation */}
        <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Course Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <CourseOverview
                description={course.description}
                objectives={course.objectives}
                requirements={course.requirements}
              />
            )}

            {activeTab === "curriculum" && (
              <CourseCurriculum
                courseId={courseId}
                modules={modules}
                completedLessonIds={completedLessonIds}
              />
            )}

            {activeTab === "instructor" && (
              <CourseInstructor instructor={course.instructor} />
            )}

            {activeTab === "reviews" && (
              <CourseReviews
                reviews={reviews}
                averageRating={course.averageRating || 0}
              />
            )}
          </div>

          {/* Sidebar */}
          <CourseStatsSidebar course={course} additionalStats={progressStats} />
        </div>
      </div>
    </div>
  );
}

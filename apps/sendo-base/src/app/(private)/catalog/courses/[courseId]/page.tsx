"use client";

import {
  CourseInstructor,
  CourseLoading,
  CourseOverview,
  CourseReviews,
} from "@/src/app/(private)/contents/course/[courseId]/components";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  CourseDetailHeader,
  CourseDetailTabs,
  CourseStatsSidebar,
} from "@/src/components/course-detail";
import { useAuth, useCourseDetail } from "@/src/hooks";
import { createEnrollmentRequest } from "@/src/lib/actions";
import { use, useState } from "react";
import { toast } from "sonner";
import {
  CatalogCurriculum,
  EnrollmentCard,
  EnrollmentProcess,
} from "./components";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default function CoursePage({ params }: CoursePageProps) {
  const { courseId } = use(params);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const {
    course,
    enrollment,
    modules,
    reviews,
    enrollmentStatus,
    isLoading,
    error,
    refetchEnrollment,
  } = useCourseDetail({ courseId });

  const handleEnrollmentRequest = async () => {
    if (!courseId || !user?.id) {
      toast.error("Você precisa estar logado para solicitar matrícula");
      return;
    }

    setIsEnrolling(true);
    try {
      const result = await createEnrollmentRequest(courseId, user.id);

      if (result.success) {
        toast.success(result.message || "Solicitação enviada com sucesso!");
        refetchEnrollment();
      } else {
        toast.error(result.error || "Erro ao enviar solicitação");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar solicitação de matrícula");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Loading state
  if (isLoading) return <CourseLoading />;

  // Error state
  if (error || !course) {
    return (
      <PageLayout>
        <div className="dark-bg-primary min-h-screen">
          <div className="flex min-h-screen items-center justify-center">
            <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
              <div className="dark-text-primary mb-4 text-lg font-semibold">
                Curso não encontrado
              </div>
              <div className="dark-text-secondary text-sm">
                O curso que você está procurando não existe ou foi removido
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout spacing="normal">
      {/* Course Header with Enrollment Card */}
      <CourseDetailHeader course={course} reviewsCount={reviews.length}>
        <EnrollmentCard
          status={enrollmentStatus as any}
          rejectionReason={enrollment?.rejectionReason || undefined}
          onEnroll={handleEnrollmentRequest}
          isLoading={isEnrolling}
        />
      </CourseDetailHeader>

      {/* Course Navigation */}
      <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Course Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <CourseOverview
                description={course.description || ""}
                objectives={course.objectives}
                requirements={course.requirements}
              />
              <EnrollmentProcess />
            </div>
          )}

          {activeTab === "curriculum" && (
            <CatalogCurriculum modules={modules} />
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
        <CourseStatsSidebar course={course} />
      </div>
    </PageLayout>
  );
}

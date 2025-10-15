"use client";

import { Button } from "@base-church/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type LessonHeaderProps = {
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
};

export function LessonHeader({
  courseId,
  courseTitle,
  moduleTitle,
}: LessonHeaderProps) {
  return (
    <div className="dark-bg-secondary dark-border-b flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="dark-text-secondary hover:dark-text-primary"
        >
          <Link href={`/contents/course/${courseId}`}>
            <ArrowLeft size={16} className="mr-2" />
            {courseTitle}
          </Link>
        </Button>
        <span className="dark-text-tertiary text-sm">/</span>
        <span className="dark-text-secondary text-sm">{moduleTitle}</span>
      </div>
    </div>
  );
}

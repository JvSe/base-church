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
    <div className="dark-bg-secondary dark-border-b flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="dark-text-secondary hover:dark-text-primary"
        >
          <Link href={`/contents/course/${courseId}`}>
            <ArrowLeft size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{courseTitle}</span>
            <span className="max-w-32 truncate sm:hidden">{courseTitle}</span>
          </Link>
        </Button>
        <span className="dark-text-tertiary hidden text-sm sm:inline">/</span>
        <span className="dark-text-secondary truncate text-sm">
          {moduleTitle}
        </span>
      </div>
    </div>
  );
}

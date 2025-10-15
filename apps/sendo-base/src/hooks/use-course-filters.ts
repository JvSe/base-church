import { useState } from "react";

type CourseFiltersOptions = {
  searchFields?: string[];
};

export function useCourseFilters<T extends Record<string, any>>(
  courses: T[],
  options: CourseFiltersOptions = {},
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();

    // Search filter
    const matchesSearch =
      !searchQuery ||
      course.title?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.instructor?.toLowerCase().includes(searchLower) ||
      course.category?.toLowerCase().includes(searchLower) ||
      course.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchLower),
      );

    // Category filter
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;

    // Level filter
    const matchesLevel =
      selectedLevel === "all" || course.level?.toLowerCase() === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    viewMode,
    setViewMode,
    filteredCourses,
  };
}

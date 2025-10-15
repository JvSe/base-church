import { CourseCard } from "../common/data-display/course-card";

type CourseGridProps = {
  courses: any[];
  variant: "catalog" | "contents";
  layout?: "grid" | "list";
  disabled?: boolean;
};

export function CourseGrid({
  courses,
  variant,
  layout = "grid",
  disabled = false,
}: CourseGridProps) {
  if (layout === "list") {
    return (
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            layout="list"
            variant={variant}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          layout="grid"
          variant={variant}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

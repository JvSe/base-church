import { formatDuration } from "../../app/(private)/contents/course/helpers/course.helpers";

type CourseStatsSidebarProps = {
  course: any;
  additionalStats?: React.ReactNode;
};

export function CourseStatsSidebar({
  course,
  additionalStats,
}: CourseStatsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Course Tags */}
      {course.tags && course.tags.length > 0 && (
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h3 className="dark-text-primary mb-4 font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag: string) => (
              <span
                key={tag}
                className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Stats */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h3 className="dark-text-primary mb-4 font-semibold">Estatísticas</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="dark-text-secondary text-sm">Total de aulas</span>
            <span className="dark-primary font-semibold">
              {course.totalLessons || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="dark-text-secondary text-sm">Duração total</span>
            <span className="dark-primary font-semibold">
              {formatDuration(course.totalDuration || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="dark-text-secondary text-sm">
              Alunos matriculados
            </span>
            <span className="dark-primary font-semibold">
              {course.studentsCount?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="dark-text-secondary text-sm">Nota média</span>
            <span className="dark-primary font-semibold">
              {course.averageRating || 0}/5
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats (progress for contents) */}
      {additionalStats}
    </div>
  );
}

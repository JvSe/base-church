import { User } from "lucide-react";
import { getUserRoleLabel } from "../../helpers/course.helpers";

type CourseInstructorProps = {
  instructor: any;
};

export function CourseInstructor({ instructor }: CourseInstructorProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h2 className="dark-text-primary mb-6 text-xl font-bold">
        Seu Instrutor
      </h2>

      <div className="flex items-start gap-6">
        <div className="dark-primary-subtle-bg rounded-full p-4">
          <User className="dark-primary" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="dark-text-primary mb-1 text-lg font-semibold">
            {instructor?.name || "Instrutor não informado"}
          </h3>
          <p className="dark-text-secondary mb-2">
            {getUserRoleLabel(instructor?.role, instructor?.isPastor)}
          </p>
          <p className="dark-text-secondary leading-relaxed">
            {instructor?.bio || "Biografia não disponível"}
          </p>
        </div>
      </div>
    </div>
  );
}

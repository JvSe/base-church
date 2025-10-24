import { formatDate } from "@/src/lib/formatters";
import { addPastorPrefix } from "@/src/lib/helpers";
import { getLevelFormatted } from "@/src/lib/helpers/level.helper";
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Star,
  User,
  Users,
} from "lucide-react";
import { formatDuration } from "../../app/(private)/contents/course/helpers/course.helpers";

type CourseDetailHeaderProps = {
  course: any;
  reviewsCount: number;
  children?: React.ReactNode;
};

export function CourseDetailHeader({
  course,
  reviewsCount,
  children,
}: CourseDetailHeaderProps) {
  return (
    <div className="dark-glass dark-shadow-md rounded-2xl p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-sm font-medium">
                {getLevelFormatted(course.level).text || "Iniciante"}
              </span>
              <span className="dark-success-bg dark-success rounded-full px-3 py-1 text-sm font-medium">
                Gratuito
              </span>
              {course.certificate && (
                <span className="dark-warning-bg dark-warning rounded-full px-3 py-1 text-sm font-medium">
                  📜 Certificado
                </span>
              )}
            </div>
            <h1 className="dark-text-primary mb-3 text-3xl font-bold">
              {course.title}
            </h1>
            <p className="dark-text-secondary text-lg leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="mb-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="dark-primary-subtle-bg rounded-full p-2">
                <User className="dark-primary" size={16} />
              </div>
              <div>
                <div className="dark-text-primary text-sm font-medium">
                  {addPastorPrefix(
                    course.instructor?.name,
                    course.instructor?.isPastor,
                  ) || "Instrutor não informado"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Star className="dark-warning fill-current" size={16} />
              <span className="dark-text-primary font-semibold">
                {course.averageRating || 0}
              </span>
              <span className="dark-text-tertiary text-sm">
                ({reviewsCount} avaliações)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="dark-text-tertiary" size={16} />
              <span className="dark-text-tertiary text-sm">
                {course.studentsCount?.toLocaleString() || 0} alunos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="dark-text-tertiary" size={16} />
              <span className="dark-text-tertiary">
                {formatDuration(course.totalDuration || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="dark-text-tertiary" size={16} />
              <span className="dark-text-tertiary">
                {course.totalLessons || 0} aulas
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="dark-text-tertiary" size={16} />
              <span className="dark-text-tertiary">Acesso vitalício</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="dark-text-tertiary" size={16} />
              <span className="dark-text-tertiary">
                Atualizado em {formatDate(course.lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Card (slot for enrollment or progress card) */}
        {children}
      </div>
    </div>
  );
}

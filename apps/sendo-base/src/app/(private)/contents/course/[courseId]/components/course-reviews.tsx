import { formatDate } from "@/src/lib/formatters";
import { Star, User } from "lucide-react";
import { getUserRoleLabel } from "../../helpers/course.helpers";

type CourseReviewsProps = {
  reviews: any[];
  averageRating: number;
};

export function CourseReviews({ reviews, averageRating }: CourseReviewsProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="dark-text-primary text-xl font-bold">
          Avaliações dos Alunos
        </h2>
        <div className="flex items-center gap-2">
          <Star className="dark-warning fill-current" size={20} />
          <span className="dark-text-primary text-lg font-bold">
            {averageRating || 0}
          </span>
          <span className="dark-text-tertiary">
            ({reviews.length} avaliações)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="dark-card rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="dark-primary-subtle-bg rounded-full p-2">
                  <User className="dark-primary" size={16} />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="dark-text-primary text-sm font-medium">
                        {review.user?.name || "Usuário"}
                      </div>
                      <div className="dark-text-tertiary text-xs">
                        {getUserRoleLabel(
                          review.user?.role,
                          review.user?.isPastor,
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`${
                            i < review.rating
                              ? "dark-warning fill-current"
                              : "dark-text-tertiary"
                          }`}
                          size={12}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="dark-text-secondary mb-2 text-sm">
                    {review.comment}
                  </p>
                  <p className="dark-text-tertiary text-xs">
                    {formatDate(new Date(review.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="dark-card rounded-xl p-8 text-center">
            <div className="dark-text-tertiary text-sm">
              Nenhuma avaliação disponível ainda
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

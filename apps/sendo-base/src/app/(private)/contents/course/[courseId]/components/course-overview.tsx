import { CheckCircle, Target } from "lucide-react";

type CourseOverviewProps = {
  description: string | null;
  objectives?: string[];
  requirements?: string[];
};

export function CourseOverview({
  description,
  objectives = [],
  requirements = [],
}: CourseOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h2 className="dark-text-primary mb-4 text-xl font-bold">
          Sobre este curso
        </h2>
        <p className="dark-text-secondary mb-6 leading-relaxed">
          {description}
        </p>

        {objectives.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="dark-text-primary mb-3 font-semibold">
                O que você aprenderá
              </h3>
              <ul className="space-y-2">
                {objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle
                      className="dark-success mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <span className="dark-text-secondary text-sm">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {requirements.length > 0 && (
              <div>
                <h3 className="dark-text-primary mb-3 font-semibold">
                  Pré-requisitos
                </h3>
                <ul className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target
                        className="dark-primary mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <span className="dark-text-secondary text-sm">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

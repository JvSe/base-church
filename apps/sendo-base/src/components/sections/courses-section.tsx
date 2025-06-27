import { Teacher } from "@/src/lib/types";
import { CouseCard } from "../course-card";

export const CourseSection = () => {
  const teachers: Teacher[] = [
    {
      name: "Robson Correa",
      avatar_url:
        "https://ui-avatars.com/api/?name=Robson+Correa&background=random",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Jefferson Leal",
      avatar_url:
        "https://ui-avatars.com/api/?name=Jefferson+Leal&background=random",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Patrick Nascimento",
      avatar_url:
        "https://ui-avatars.com/api/?name=Patrick+Nascimento&background=random",
      description: "description",
      prefix: "PR.",
    },
  ];
  return (
    <div
      id="section-courses"
      className="relative flex min-h-dvh w-dvw flex-col items-center"
    >
      <h1 className="font-surgena mb-10 text-4xl font-bold md:mb-20 md:text-5xl">
        Conheça nossos Cursos
      </h1>

      <div className="grid h-full w-full grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-16">
        <CouseCard title="Sendo Base" variant="provision" teachers={teachers} />
        <CouseCard
          title="Base de Ministérios"
          variant="creativity"
          teachers={teachers}
        />
        <CouseCard
          title="Discipulado"
          variant="multiplication"
          teachers={teachers}
        />
        <CouseCard
          title="Base Vida"
          variant="multiplication"
          teachers={teachers}
        />
        <CouseCard
          title="Familia para Sempre"
          variant="provision"
          teachers={teachers}
        />
        <CouseCard title="Missões" variant="creativity" teachers={teachers} />
      </div>
    </div>
  );
};

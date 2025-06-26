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
    <div className="relative flex flex-col items-center w-dvw min-h-dvh">
      <h1 className="font-surgena font-bold text-5xl mb-20">
        Conheça nossos Cursos
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(424px,1fr))]  w-full h-full px-16 gap-5">
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

import { Teacher } from "@/src/lib/types";
import { TeacherCard } from "../teacher-card";

export const TeachersSection = () => {
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
      id="section-teachers"
      className="relative flex min-h-full w-dvw flex-col items-center pt-12 md:pt-24"
    >
      <h1 className="font-surgena mb-10 text-4xl font-bold md:mb-20 md:text-5xl">
        Nossos Professores
      </h1>

      <div className="md:animate-right-to-left flex h-full w-full flex-col gap-5 px-4 md:flex-row">
        {teachers.map((t, index) => (
          <TeacherCard key={t.name + index} teacher={t} />
        ))}
      </div>
    </div>
  );
};

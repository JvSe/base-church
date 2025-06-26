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
    <div className="relative flex pt-24 flex-col items-center w-dvw min-h-full">
      <h1 className="font-surgena font-bold text-5xl mb-20">
        Nossos Professores
      </h1>

      <div className="flex animate-right-to-left w-full h-full gap-5">
        {teachers.map((t, index) => (
          <TeacherCard key={t.name + index} teacher={t} />
        ))}
      </div>
    </div>
  );
};

import { Teacher } from "@/src/lib/types";
import { CourseCard } from "../course-card";
import { CourseSlides } from "../course-slides";

export type CoursesType = {
  title: string;
  variant: "multiplication" | "provision" | "creativity";
  teachers: Teacher[];
};

export const CourseSection = () => {
  const teachers: Teacher[] = [
    {
      name: "Robson Correa",
      avatar_url:
        "https://ui-avatars.com/api/?name=Robson+Correa&background=random&color=fff",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Jefferson Leal",
      avatar_url:
        "https://ui-avatars.com/api/?name=Jefferson+Leal&background=random&color=fff",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Patrick Nascimento",
      avatar_url:
        "https://ui-avatars.com/api/?name=Patrick+Nascimento&background=random&color=fff",
      description: "description",
      prefix: "PR.",
    },
  ];
  const courses: CoursesType[] = [
    { title: "Sendo Base", variant: "provision", teachers },
    { title: "Base de Ministérios", variant: "creativity", teachers },
    { title: "Discipulado", variant: "multiplication", teachers },
    { title: "Base Vida", variant: "multiplication", teachers },
    { title: "Familia para Sempre", variant: "provision", teachers },
    { title: "Missões", variant: "creativity", teachers },
  ];

  return (
    <div
      id="section-courses"
      className="relative flex h-full w-dvw flex-col items-center pb-10 md:min-h-dvh md:pb-0"
    >
      <h1 className="font-surgena mb-10 px-4 text-center text-4xl font-bold md:mb-20 md:text-5xl">
        Conheça nossos Cursos
      </h1>

      <div className="hidden h-full w-full grid-cols-1 gap-5 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:px-16">
        {courses.map((c, index) => (
          <CourseCard
            key={c.title + index}
            title={c.title}
            variant={c.variant}
            teachers={c.teachers}
          />
        ))}
      </div>

      <div className="w-full md:hidden">
        <CourseSlides courses={courses} />
      </div>
    </div>
  );
};

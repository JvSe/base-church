import { cn } from "@repo/ui/lib/utils";

type TeachersCourseCard = {
  name: string;
  avatar_url: string;
  description: string;
  prefix: "PRA." | "PR."
}

type CourseCardProps = {
  variant: "multiplication" | "provision" | "creativity";
  title: string;
  teachers: TeachersCourseCard[];
};

export const CouseCard = ({ title, teachers, variant }: CourseCardProps) => {

  const teachersTitle = teachers.map(t => `${t.prefix} ${t.name}`).join(", ");

  return (
    <div
      className={cn(
        " py-5 px-4 items-center rounded-lg flex flex-col h-[429px] w-full",
        variant === "creativity" && "bg-emerald-500",
        variant === "provision" && "bg-[#3ED8E199]",
        variant === "provision" && "bg-[#6D19F766]"
      )}
    >
      <div className="flex-1 w-full h-full bg-primary rounded-xl"></div>
      <div className="w-full flex-[0.4] mt-4">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex gap-4 items-center">
          <div className="w-12  h-12 rounded-lg bg-red-100"></div>
          <div className="w-12 h-12 -ml-8 rounded-lg bg-green-100"></div>
          <div className="w-12 h-12 -ml-8 rounded-lg bg-yellow-100"></div>

          <p className="font-roboto text-xl">Prs. Robson, Jeff, Patrick</p>
        </div>
      </div>
    </div>
  );
};

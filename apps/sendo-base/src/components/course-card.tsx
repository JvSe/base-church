import { cn } from "@repo/ui/lib/utils";
import { BookOpen, User } from "lucide-react";
import Image from "next/image";
import { Teacher } from "../lib/types";

type CourseCardProps = {
  variant: "multiplication" | "provision" | "creativity";
  title: string;
  teachers: Teacher[];
};

export const CourseCard = ({ title, teachers, variant }: CourseCardProps) => {
  const teachersTitle = teachers
    .map((t) => `${t.prefix} ${t.name.split(" ")[0]}`)
    .join(", ");

  const teachersImgs = teachers.map((t) => t.avatar_url);

  return (
    <div
      className={cn(
        "flex h-[400px] flex-col items-center gap-2 rounded-lg px-4 pt-5 md:w-full md:gap-4",
        variant === "creativity" && "bg-[#6D19F766]",
        variant === "multiplication" && "bg-[#3ED8E199]",
        variant === "provision" && "bg-emerald-500",
      )}
    >
      <div className="bg-primary from-primary/80 to-primary flex h-full w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br">
        <div className="text-center">
          <div className="bg-foreground/10 mx-auto mb-4 w-fit rounded-full p-8">
            <BookOpen className="text-foreground" size={56} />
          </div>
          <div className="text-foreground/80 text-lg font-medium">Curso</div>
        </div>
      </div>
      <div className="w-full flex-[0.4]">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex items-center gap-4">
          {teachersImgs.splice(0, 5).map((i, index) => (
            <div
              key={index}
              className={cn(
                "bg-primary/20 flex min-h-12 min-w-12 items-center justify-center overflow-hidden rounded-lg",
                index > 0 && "-ml-6",
              )}
            >
              {i ? (
                <Image
                  src={i}
                  alt="imgs pastors"
                  width={50}
                  height={50}
                  className="min-h-12 min-w-12 scale-125 object-cover"
                />
              ) : (
                <User className="text-primary" size={20} />
              )}
            </div>
          ))}

          <p className="font-roboto truncate text-xl capitalize">
            {teachersTitle.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

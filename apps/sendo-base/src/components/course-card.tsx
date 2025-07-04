import { cn } from "@repo/ui/lib/utils";
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
        "flex h-[400px] w-full flex-col items-center gap-2 rounded-lg px-4 pt-5 md:gap-4",
        variant === "creativity" && "bg-[#6D19F766]",
        variant === "multiplication" && "bg-[#3ED8E199]",
        variant === "provision" && "bg-emerald-500",
      )}
    >
      <div className="bg-primary h-full w-full flex-1 overflow-hidden rounded-xl">
        <Image
          src="/assets/svg/dots.svg"
          alt="dots"
          width={200}
          height={200}
          className="h-full w-full scale-150"
        />
      </div>
      <div className="w-full flex-[0.4]">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex items-center gap-4">
          {teachersImgs.splice(0, 5).map((i, index) => (
            <div
              key={index}
              className={cn(
                "min-h-12 min-w-12 overflow-hidden rounded-lg",
                index > 0 && "-ml-6",
              )}
            >
              <Image
                src={i}
                alt="imgs pastors"
                width={50}
                height={50}
                className="min-h-12 min-w-12 scale-125 object-cover"
              />
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

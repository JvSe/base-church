import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import { Teacher } from "../lib/types";

type CourseCardProps = {
  variant: "multiplication" | "provision" | "creativity";
  title: string;
  teachers: Teacher[];
};

export const CouseCard = ({ title, teachers, variant }: CourseCardProps) => {
  const teachersTitle = teachers
    .map((t) => `${t.prefix} ${t.name.split(" ")[0]}`)
    .join(", ");

  const teachersImgs = teachers.map((t) => t.avatar_url);

  return (
    <div
      className={cn(
        "pt-5 px-4 items-center rounded-lg flex flex-col h-[429px] w-full",
        variant === "creativity" && " bg-[#6D19F766]",
        variant === "multiplication" && "bg-[#3ED8E199]",
        variant === "provision" && "bg-emerald-500"
      )}
    >
      <div className="flex-1 w-full h-full bg-primary overflow-hidden rounded-xl">
        <Image
          src="/assets/svg/dots.svg"
          alt="dots"
          width={200}
          height={200}
          className="w-full h-full scale-150"
        />
      </div>
      <div className="w-full flex-[0.4] mt-4">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex gap-4 items-center">
          {teachersImgs.splice(0, 5).map((i, index) => (
            <div
              key={index}
              className={cn(
                "min-w-12 min-h-12 rounded-lg overflow-hidden",
                index > 0 && "-ml-6"
              )}
            >
              <Image
                src={i}
                alt="img pastors"
                width={50}
                height={50}
                className="min-w-12 min-h-12 object-contain"
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

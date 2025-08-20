import { GraduationCap } from "lucide-react";
import { Teacher } from "../lib/types";

export const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#7D12FF]/50 to-white/20 to-100% p-px md:h-[532px] md:min-w-[400px]">
      <div className="bg-primary/95 h-full w-full overflow-hidden rounded-[calc(0.75rem-0.1px)] p-6">
        <div className="from-secondary/20 to-primary/30 flex h-[230px] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br md:h-[333px]">
          <div className="text-center">
            <div className="bg-foreground/10 mx-auto mb-4 w-fit rounded-full p-6">
              <GraduationCap className="text-foreground" size={48} />
            </div>
            <div className="text-foreground/80 font-medium">Professor(a)</div>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <h1 className="text-2xl font-bold capitalize">
            {teacher.prefix.toLowerCase()} {teacher.name}
          </h1>
          <p className="font-roboto line-clamp-3 text-justify text-sm md:line-clamp-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </div>
  );
};

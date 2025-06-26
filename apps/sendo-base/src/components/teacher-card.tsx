import { Teacher } from "../lib/types";

export const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  return (
    <div className="min-w-[400px] h-[532px] rounded-xl p-px bg-gradient-to-b to-100% from-[#7D12FF]/50 to-white/20">
      <div className="w-full overflow-hidden  h-full bg-primary/95 rounded-[calc(0.75rem-0.1px)] p-6">
        <div className="w-full h-[333px] bg-red-100 rounded-lg"></div>
        <div className="space-y-3 mt-5">
          <h1 className="text-2xl font-bold capitalize">
            {teacher.prefix.toLowerCase()} {teacher.name}
          </h1>
          <p className="text-sm font-roboto line-clamp-4 text-justify">
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

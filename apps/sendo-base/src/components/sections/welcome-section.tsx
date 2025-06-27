import { Play } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <div
      id="section-about"
      className="flex w-dvw items-center justify-center pb-20"
    >
      <div className="bg-primary-2/50 mx-4 flex h-[263px] w-full items-center justify-center rounded-2xl md:h-[563px] md:w-9/12 2xl:w-7/12">
        <div className="gradient-yellow flex h-16 w-16 items-center justify-center rounded-full md:h-24 md:w-24">
          <Play className="size-8 md:size-14" />
        </div>
      </div>
    </div>
  );
};

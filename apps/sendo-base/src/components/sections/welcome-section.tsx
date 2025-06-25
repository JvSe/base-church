import { Play } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <div className="flex items-center justify-center w-dvw pb-20">
      <div className="w-9/12 2xl:w-7/12 rounded-2xl h-[563px] flex items-center justify-center bg-primary-2/50">
        <div className="w-24 h-24 flex items-center justify-center rounded-full gradient-yellow">
          <Play size={50} />
        </div>
      </div>
    </div>
  );
};

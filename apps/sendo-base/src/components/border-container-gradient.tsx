import { PropsWithChildren } from "react";

export const BorderContainerGradient = ({ children }: PropsWithChildren) => {
  return (
    <div className="border-dark-2 h-min w-max rounded-lg border px-4 py-2 md:px-8">
      <p className="gradient-text-dark text-base font-bold md:text-xl">
        {children}
      </p>
    </div>
  );
};

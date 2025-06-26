import { PropsWithChildren } from "react";

export const BorderContainerGradient = ({ children }: PropsWithChildren) => {
  return (
    <div className="border w-max h-min px-8 py-2 rounded-lg border-dark-2">
      <p className="text-xl font-bold gradient-text-dark">{children}</p>
    </div>
  );
};

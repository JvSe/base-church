import * as React from "react";

import { cn } from "../lib/utils.ts";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg dark-border dark-bg-secondary px-4 py-3 text-sm dark-text-primary shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:dark-text-tertiary hover:dark-border-hover hover:dark-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:dark-primary-border disabled:cursor-not-allowed disabled:opacity-50 disabled:dark-bg-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

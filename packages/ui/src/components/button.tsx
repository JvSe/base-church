import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "dark-btn-primary shadow-lg btn-hover-lift",
        destructive: "dark-btn-destructive shadow-lg btn-hover-lift",
        outline: "dark-btn-outline shadow-sm btn-hover-lift",
        secondary: "dark-btn-secondary shadow-lg btn-hover-lift",
        ghost: "dark-btn-ghost transition-colors",
        link: "dark-text-primary underline-offset-4 hover:underline hover:dark-primary",
        clean: "text-inherit p-0",
        gradient:
          "dark-gradient-primary dark-text-primary shadow-lg btn-hover-lift btn-hover-glow",
        "gradient-secondary":
          "dark-gradient-secondary dark-text-primary shadow-lg btn-hover-lift",
        glass:
          "dark-glass dark-text-primary shadow-lg hover:dark-bg-tertiary btn-hover-lift",
        success: "dark-btn-success shadow-lg btn-hover-lift",
        warning: "dark-btn-warning shadow-lg btn-hover-lift",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
        clean: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

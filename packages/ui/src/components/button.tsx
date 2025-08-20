import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover hover:shadow-primary/25 active:bg-primary-active btn-hover-lift",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-destructive/25 btn-hover-lift",
        outline:
          "border border-border bg-background shadow-sm hover:bg-accent-hover hover:text-accent-foreground hover:border-border-hover btn-hover-lift",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary-hover hover:shadow-secondary/25 active:bg-secondary-active btn-hover-lift",
        ghost:
          "hover:bg-accent-hover hover:text-accent-foreground transition-colors",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        clean: "text-inherit p-0",
        gradient:
          "gradient-primary text-primary-foreground shadow-lg btn-hover-lift btn-hover-glow",
        "gradient-secondary":
          "gradient-secondary text-secondary-foreground shadow-lg btn-hover-lift",
        glass:
          "glass-dark text-foreground shadow-lg hover:bg-background-tertiary btn-hover-lift",
        success:
          "bg-success text-success-foreground shadow-lg hover:shadow-success/25 btn-hover-lift",
        warning:
          "bg-warning text-warning-foreground shadow-lg hover:shadow-warning/25 btn-hover-lift",
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

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@base-church/ui/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent dark-primary-subtle-bg dark-primary [a&]:hover:dark-primary/90",
        secondary:
          "border-transparent dark-secondary-subtle-bg dark-secondary [a&]:hover:dark-secondary/90",
        destructive:
          "border-transparent dark-error-subtle-bg dark-error [a&]:hover:dark-error/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "dark-text-primary dark-border [a&]:hover:dark-bg-tertiary [a&]:hover:dark-text-primary",
        success:
          "border-transparent dark-success-subtle-bg dark-success [a&]:hover:dark-success/90",
        warning:
          "border-transparent dark-warning-subtle-bg dark-warning [a&]:hover:dark-warning/90",
        info:
          "border-transparent dark-info-subtle-bg dark-info [a&]:hover:dark-info/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

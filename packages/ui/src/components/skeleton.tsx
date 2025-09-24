import { cn } from "@base-church/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("dark-bg-tertiary animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }

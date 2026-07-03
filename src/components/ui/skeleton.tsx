import { cn } from "@/lib/utils";

/**
 * Loading placeholder. Compose these to mirror the final layout so pages settle
 * without shifting — never a full-page spinner.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };

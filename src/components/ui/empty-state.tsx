import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * A designed empty state — an invitation to act, not an apology. Use for
 * zero-data views (and adapt for errors). Copy should say what to do next.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface-2/50 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <div className="border-border bg-surface text-muted-foreground mb-4 flex size-11 items-center justify-center rounded-lg border shadow-xs">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      ) : null}
      <p className="font-display text-foreground text-sm font-semibold">
        {title}
      </p>
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export { EmptyState };

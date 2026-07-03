"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Error boundary scoped to the authenticated app. Renders inside the shell so
 * the sidebar and topbar stay put while a single view recovers.
 */
export default function AppError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <EmptyState
        icon={TriangleAlert}
        title="This view failed to load"
        description={
          error.digest
            ? `An unexpected error occurred (ref: ${error.digest}).`
            : "An unexpected error occurred while loading this view."
        }
        action={
          retry ? (
            <Button onClick={() => retry()}>
              <RotateCcw />
              Try again
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

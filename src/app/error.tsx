"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Root error boundary for the (marketing) + top-level segments. Next 16 passes
 * `unstable_retry`; we accept `reset` too for forward/backward compatibility.
 */
export default function RootError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // Surface to the console; a real app forwards this to its error reporter.
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Error</p>
      <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
        Something went wrong.
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The page hit an unexpected error. You can try again — if it keeps
        happening, the issue is on our side.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground mt-3 font-mono text-xs">
          Ref: {error.digest}
        </p>
      ) : null}
      {retry ? (
        <Button className="mt-6" onClick={() => retry()}>
          <RotateCcw />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

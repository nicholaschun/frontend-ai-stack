import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The page may have moved, or the link might be out of date.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}

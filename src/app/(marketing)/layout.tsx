import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-30 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" aria-label={`${siteConfig.name} home`}>
            <Brand />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/dashboard">Open app</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-border border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 sm:px-6">
          <p className="eyebrow">{siteConfig.name}</p>
          <p className="text-muted-foreground text-sm">
            {siteConfig.description}
          </p>
        </div>
      </footer>
    </div>
  );
}

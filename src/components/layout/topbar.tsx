import { Search } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

/**
 * Page chrome across the top of the authenticated app: mobile nav trigger,
 * a page title slot, and utility actions.
 */
export function Topbar({ title }: { title?: string }) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-sm">
      <MobileNav />
      {title ? (
        <h1 className="font-display text-sm font-semibold tracking-tight">
          {title}
        </h1>
      ) : null}

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="text-muted-foreground"
        >
          <Search />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

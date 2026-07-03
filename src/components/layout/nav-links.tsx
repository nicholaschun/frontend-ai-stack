"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { mainNav } from "@/config/nav";

/**
 * Shared primary navigation, used by both the desktop sidebar and the mobile
 * drawer. Active state is derived from the current pathname.
 */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Primary">
      {mainNav.map((item) => {
        const Icon = item.icon;
        const active = item.href
          ? pathname === item.href || pathname.startsWith(`${item.href}/`)
          : false;

        const content = (
          <>
            <Icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.title}</span>
            {item.soon ? (
              <span className="eyebrow ml-auto text-[0.625rem] tracking-wider">
                Soon
              </span>
            ) : null}
          </>
        );

        const base =
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150";

        if (!item.href) {
          return (
            <span
              key={item.title}
              aria-disabled="true"
              className={cn(
                base,
                "text-muted-foreground/60 cursor-not-allowed",
              )}
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              base,
              active
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

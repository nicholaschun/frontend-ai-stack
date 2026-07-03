"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";

/**
 * Mobile navigation: a left slide-over drawer built on the Dialog primitive.
 * Closes automatically on navigation.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-foreground/40 fixed inset-0 z-50 backdrop-blur-[2px] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:hidden" />
        <DialogPrimitive.Content
          className="border-border bg-surface fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r shadow-lg transition-transform duration-200 ease-[var(--ease-out)] data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 md:hidden"
          aria-label="Navigation"
        >
          <DialogPrimitive.Title className="sr-only">
            Navigation
          </DialogPrimitive.Title>
          <div className="border-border flex h-14 items-center border-b px-4">
            <Link
              href="/"
              aria-label="Keystone home"
              onClick={() => setOpen(false)}
            >
              <Brand />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <p className="eyebrow px-2.5 pb-2">Workspace</p>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

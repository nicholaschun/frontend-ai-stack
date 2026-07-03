import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";

/**
 * Desktop sidebar. Hidden below `md`; the same nav appears in the mobile drawer.
 */
export function Sidebar() {
  return (
    <aside className="border-border bg-surface fixed inset-y-0 left-0 hidden w-60 flex-col border-r md:flex">
      <div className="border-border flex h-14 items-center border-b px-4">
        <Link href="/" aria-label="Keystone home">
          <Brand />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="eyebrow px-2.5 pb-2">Workspace</p>
        <NavLinks />
      </div>

      <div className="border-border border-t p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
          <span
            className="bg-primary/12 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            aria-hidden="true"
          >
            KE
          </span>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-medium">
              Keystone
            </p>
            <p className="text-muted-foreground truncate text-xs">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

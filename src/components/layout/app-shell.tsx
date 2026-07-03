import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

/**
 * Authenticated app shell: fixed sidebar (desktop) + sticky topbar + a scrolling
 * content column. Route groups under `(app)` render their pages into `children`.
 */
export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-dvh md:pl-60">
      <Sidebar />
      <div className="flex min-h-dvh flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

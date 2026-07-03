import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/nav";

/**
 * Marketing hero. The thesis of the product is its architecture — so the
 * signature visual is the source tree itself, presented as a blueprint, with
 * the promise that a new feature is one folder.
 */
export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <section className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="eyebrow">Next.js 16 · App Router · TypeScript</p>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            The load-bearing start for your next product.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-md text-base">
            {siteConfig.description} Typed environment, feature-sliced
            structure, a token-driven design system, and error, empty, and
            loading states designed in from the start.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open the dashboard
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#architecture">See the architecture</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge variant="neutral">Server Components</Badge>
            <Badge variant="neutral">Tailwind v4 tokens</Badge>
            <Badge variant="neutral">Zod-validated env</Badge>
            <Badge variant="neutral">Dark mode</Badge>
          </div>
        </div>

        {/* Signature: the source tree as blueprint. */}
        <div
          id="architecture"
          className="border-border bg-surface/80 scroll-mt-20 rounded-xl border shadow-md backdrop-blur-sm"
        >
          <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
            <FolderTree className="text-primary size-4" aria-hidden="true" />
            <span className="eyebrow">src/</span>
            <span className="text-muted-foreground ml-auto text-xs">
              one folder per feature
            </span>
          </div>
          <pre className="text-muted-foreground overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6">
            <code>{`app/
  (marketing)/        # public pages
  (app)/              # authenticated shell
  api/health/         # health check
features/
  auth/               # ui · hooks · actions · schema
  dashboard/
  settings/           ← add a feature here
components/ui/         # design-system primitives
lib/                  # db · logger · result · utils
config/               # typed, Zod-validated env
styles/               # tokens.css → Tailwind theme`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

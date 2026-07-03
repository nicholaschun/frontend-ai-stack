import { Suspense } from "react";
import type { Metadata } from "next";
import { Activity, ArrowUpRight, Plug, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { NewProjectDialog } from "./new-project-dialog";

export const metadata: Metadata = { title: "Dashboard" };

const stats = [
  { label: "Active projects", value: "8", delta: "+2", trend: "up" },
  { label: "Team members", value: "12", delta: "+1", trend: "up" },
  { label: "API requests (24h)", value: "48.2k", delta: "+6.4%", trend: "up" },
  { label: "Error rate", value: "0.4%", delta: "-0.1%", trend: "up" },
] as const;

type ActivityItem = { who: string; what: string; when: string };

/**
 * Simulates a slow data dependency so the page can stream: the shell and stats
 * render immediately while this section resolves behind a Suspense boundary.
 * A real feature slice would call a repository in `lib/db/`.
 */
async function RecentActivity() {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const items: ActivityItem[] = [
    { who: "Ada", what: "deployed api-gateway to production", when: "2m ago" },
    {
      who: "Grace",
      what: "invited 3 members to the workspace",
      when: "1h ago",
    },
    { who: "Alan", what: "rotated the staging database key", when: "3h ago" },
    { who: "Radia", what: "merged feat/usage-metering", when: "yesterday" },
  ];

  return (
    <ul className="divide-border divide-y">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-3 py-3 first:pt-0">
          <span
            className="bg-primary/12 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            aria-hidden="true"
          >
            {item.who.slice(0, 2)}
          </span>
          <p className="text-foreground text-sm">
            <span className="font-medium">{item.who}</span>{" "}
            <span className="text-muted-foreground">{item.what}</span>
          </p>
          <span className="text-muted-foreground ml-auto shrink-0 text-xs">
            {item.when}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="ml-auto h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            A snapshot of your workspace. Demo data — wire real sources in a
            feature slice.
          </p>
        </div>
        <NewProjectDialog />
      </div>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <Badge variant="success">
                  <TrendingUp />
                  {stat.delta}
                </Badge>
              </div>
              <p className="font-display mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-primary size-4" />
                Recent activity
              </CardTitle>
              <CardDescription>What your team has been up to.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
              <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect your tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Plug}
              title="No integrations yet"
              description="Connect a source to start pulling data into your dashboard."
              action={
                <Button variant="outline" size="sm">
                  Browse integrations
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

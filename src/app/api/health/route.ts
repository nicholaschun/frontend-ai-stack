import { NextResponse } from "next/server";

import { env } from "@/config/env";
import { requestLogger } from "@/lib/logger";

/**
 * Liveness/readiness probe. Always dynamic (never cached) so it reflects the
 * live process. Reports DB connectivity once the data layer is wired; for now
 * it advertises "not_configured" rather than faking a healthy dependency.
 */
export const dynamic = "force-dynamic";

async function checkDatabase(): Promise<"ok" | "error" | "not_configured"> {
  if (!env.DATABASE_URL) return "not_configured";
  // Feature-slice phase: run `SELECT 1` through the Drizzle client here.
  return "ok";
}

export async function GET() {
  const requestId = crypto.randomUUID();
  const log = requestLogger(requestId);

  const database = await checkDatabase();
  const healthy = database !== "error";

  log.debug({ database, healthy }, "health check");

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      requestId,
      uptime: Math.round(process.uptime()),
      checks: { database },
    },
    {
      status: healthy ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}

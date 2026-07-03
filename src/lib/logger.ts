import "server-only";

import pino from "pino";

import { env } from "@/config/env";

/**
 * Structured JSON logger. Server-only (the `server-only` import makes an
 * accidental client import a build error). In development, pipe program output
 * through `pino-pretty` for readable logs: `pnpm dev | pnpm exec pino-pretty`.
 */
export const logger = pino({
  level:
    process.env.LOG_LEVEL ?? (env.NODE_ENV === "production" ? "info" : "debug"),
  base: { service: "keystone" },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.secret",
    ],
    censor: "[redacted]",
  },
});

/** Child logger scoped to a request, so every line carries the request id. */
export function requestLogger(requestId: string) {
  return logger.child({ requestId });
}

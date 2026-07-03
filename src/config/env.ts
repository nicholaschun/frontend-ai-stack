import { z } from "zod";

/**
 * Typed, validated environment configuration.
 *
 * `process.env` is parsed once, at module load, against a Zod schema. If a
 * required variable is missing or malformed the process throws immediately with
 * a readable report — surfacing config mistakes at build/boot time instead of
 * as runtime surprises deep in a request.
 *
 * Server-only secrets live in `serverSchema` and must never be read from client
 * components. Anything the browser needs is `NEXT_PUBLIC_`-prefixed and lives in
 * `clientSchema`.
 */

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Optional during scaffolding; promoted to required when the data/auth
  // feature slices land (see .env.example).
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

/**
 * Client vars must be referenced statically so Next can inline them into the
 * browser bundle — never `process.env[key]` with a dynamic key.
 */
const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

function format(error: z.ZodError): string {
  return error.issues
    .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}

const isServer = typeof window === "undefined";

const parsedServer = isServer
  ? serverSchema.safeParse(process.env)
  : ({ success: true, data: {} } as const);

const parsedClient = clientSchema.safeParse(clientEnv);

if (!parsedServer.success) {
  throw new Error(
    `❌ Invalid server environment variables:\n${format(parsedServer.error)}`,
  );
}
if (!parsedClient.success) {
  throw new Error(
    `❌ Invalid client environment variables:\n${format(parsedClient.error)}`,
  );
}

export const env = {
  ...(parsedServer.success ? parsedServer.data : {}),
  ...parsedClient.data,
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

export type Env = typeof env;

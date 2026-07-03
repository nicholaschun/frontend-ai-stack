# Keystone

A production-grade, scalable **Next.js** starter — typed end to end,
feature-sliced, and built on a token-driven design system. The goal: adding a
feature means creating one folder under `src/features/`, wiring one route, and
touching nothing else.

> **Status:** core skeleton. Config, design system, UI primitives, the app
> shell, one route (`/dashboard`), and error/empty/loading states are in place.
> The first vertical feature slice (auth + dashboard data), the Drizzle data
> layer, tests, Docker, and CI are the next phase — see
> [Next steps](#next-steps).

## Tech stack

| Area       | Choice                                                            |
| ---------- | ----------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript 5 (strict)          |
| Styling    | Tailwind CSS v4 with a CSS-variable design-token layer            |
| Primitives | Radix UI + a customized shadcn-style component layer              |
| Validation | Zod (env, inputs, forms)                                          |
| Data       | RSC + Server Actions; TanStack Query for client server-state      |
| ORM        | Drizzle + PostgreSQL _(wired next phase)_                         |
| Auth       | Auth.js v5 behind a swappable provider abstraction _(next phase)_ |
| Logging    | pino (structured, request-scoped)                                 |
| Tooling    | ESLint (flat) · Prettier · Husky + lint-staged · commitlint       |

## Getting started

```bash
cp .env.example .env.local   # then fill in values
pnpm install
pnpm dev                     # http://localhost:3000
```

`src/config/env.ts` validates the environment with Zod at boot — a missing or
malformed variable fails fast with a readable message instead of a runtime
surprise.

### Scripts

| Script              | Does                          |
| ------------------- | ----------------------------- |
| `pnpm dev`          | Start the dev server          |
| `pnpm build`        | Production build (standalone) |
| `pnpm start`        | Serve the production build    |
| `pnpm typecheck`    | `tsc --noEmit`                |
| `pnpm lint`         | ESLint                        |
| `pnpm format`       | Prettier write                |
| `pnpm format:check` | Prettier check                |

Git hooks (pre-commit lint-staged, commit-msg commitlint) are configured but not
installed until the repo is a git repository. Once it is:

```bash
git init
pnpm exec husky init      # then move the generated hook commands into place
```

## Project structure

```
src/
  app/                  routes only — thin, delegate to features
    (marketing)/        public route group (landing)
    (app)/              authenticated route group (app shell + dashboard)
    api/health/         liveness/readiness probe
    error / not-found / global-error   boundaries
  features/             vertical slices (ui · hooks · actions · schema) — see features/README.md
  components/
    ui/                 design-system primitives (Button, Input, Dialog, …)
    layout/             app shell, sidebar, topbar, nav
  lib/                  cross-cutting: logger, result, fonts, utils (db lands next phase)
  config/               typed, Zod-validated env + nav/site config
  styles/               tokens.css → Tailwind theme mapping
  types/                shared types only
```

## Architecture decisions (brief)

- **Modular monolith, feature slices.** Features are self-contained and may not
  import one another (enforced by ESLint). Shared logic is promoted to `lib/` or
  `components/`. This keeps the blast radius of a change inside one folder.
- **Typed everything.** `strict` TypeScript plus `noUncheckedIndexedAccess` and
  `verbatimModuleSyntax`; `typedRoutes` catches broken `<Link>`s at build time;
  Zod validates all external input.
- **One result contract.** Server Actions and route handlers return an
  `ActionResponse<T>` discriminated union (`{ ok: true, data } | { ok: false, error }`)
  rather than throwing across the boundary. See `src/lib/result.ts`.
- **Drizzle over Prisma.** SQL-first, no separate codegen/generate step, a
  lighter runtime and faster cold starts — a better fit for RSC/serverless. The
  cost (less magic, hand-written queries) is acceptable for a repository-layer
  pattern.
- **Design tokens first.** All color, radius, elevation, and motion live as CSS
  variables in `styles/tokens.css` and are mapped into Tailwind's theme. No
  component hardcodes a hex value. Dark mode is a class toggle over the same
  tokens.

## Design language

Direction **Keystone**: a cool, engineered neutral base with a single confident
cobalt primary and a restrained amber accent. Type pairs **Space Grotesk**
(display) with **IBM Plex Sans** (body) and **IBM Plex Mono** (data + the
uppercase "eyebrow" labels). Structure is drawn with hairline borders and a
faint blueprint grid — the signature motif, echoed by the keystone wordmark.

## Next steps

1. **Auth + dashboard slice** — Auth.js v5 provider abstraction, protected
   `(app)` group, real dashboard data via a `lib/db` repository.
2. **Data layer** — Drizzle schema + checked-in migrations, `docker-compose` for
   local Postgres, seed script.
3. **Testing** — Vitest + React Testing Library (units), Playwright (E2E smoke).
4. **Delivery** — multi-stage `Dockerfile` (standalone output), GitHub Actions
   (typecheck → lint → test → build → E2E → Lighthouse CI).

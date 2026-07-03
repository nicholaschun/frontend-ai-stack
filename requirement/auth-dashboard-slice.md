# Requirement: Auth + Dashboard Vertical Slice

**Status:** Draft
**Owner:** Frontend
**Date:** 2026-07-03
**Type:** Product + Technical Requirements (PRD + TRD)

> The first real vertical feature slice for Keystone. It proves the
> feature-slice architecture end to end: authentication, a protected route
> group, and a dashboard backed by real data through the repository layer.

---

## 1. Product Requirements

### 1.1 Problem & goal

Keystone today ships a skeleton: design system, UI primitives, an app shell, and
a single static `/dashboard` route. There is no way to sign in and no real data.

The goal of this slice is to deliver the **first authenticated experience**: a
user can sign in, land on a protected dashboard that reflects their own data, and
sign out. Delivering it also validates that "adding a feature = one folder under
`src/features/` + one thin route" holds in practice.

### 1.2 Users & scope

- **Primary user:** a returning, registered user of the app.
- **In scope:** sign-in, session persistence, route protection, a personalized
  dashboard, sign-out.
- **Out of scope (this slice):** self-service sign-up, password reset, email
  verification, multi-tenant/org switching, role-based authorization beyond
  "authenticated vs. not."

### 1.3 User stories

1. As a visitor, I can reach a public sign-in page and authenticate.
2. As an authenticated user, I am redirected to `/dashboard` after sign-in.
3. As an authenticated user, my dashboard shows data scoped to me.
4. As an unauthenticated user, visiting any `(app)` route sends me to sign-in
   and returns me to my intended destination after login.
5. As an authenticated user, I can sign out from the topbar and land on a public
   page.

### 1.4 Acceptance criteria

- Unauthenticated access to any route under `(app)` redirects to `/sign-in` with
  the original path preserved as a callback and honored post-login.
- A successful sign-in establishes a session that survives a full page reload.
- The dashboard renders at least one data widget populated from the data layer,
  not hardcoded.
- Sign-out clears the session; the next protected request redirects to sign-in.
- All auth surfaces use existing design-system primitives and tokens — no
  hardcoded colors, no new one-off components where a primitive exists.
- Invalid credentials produce a readable inline error, not a thrown exception.

### 1.5 Success metrics

- Sign-in success rate (successful sessions / attempts).
- Time-to-interactive on `/dashboard` for an authenticated user.
- Zero unhandled exceptions crossing the server-action boundary in logs.

---

## 2. Technical Requirements

### 2.1 Architecture fit

Implemented as a self-contained feature slice, honoring the rules in
`src/features/README.md`:

```
src/features/auth/
  ui/            # SignInForm and related components
  hooks/         # client hooks (session state via TanStack Query if needed)
  actions.ts     # "use server" — signIn / signOut, each returns ActionResponse<T>
  schema.ts      # Zod: credentials input + inferred types
  queries.ts     # RSC session/user reads (delegates to lib/db)
  index.ts       # public surface — import via @/features/auth

src/features/dashboard/
  ui/            # dashboard widgets
  queries.ts     # RSC data fetching via lib/db repository
  index.ts
```

- **No cross-feature imports.** `dashboard` and `auth` must not import each other
  through `@/features/*`; anything shared is promoted to `lib/` or `components/`.
- **Thin routes.** `app/(app)/dashboard` and the new `app/(marketing)/sign-in`
  route delegate to feature UI and stay thin.
- **No raw ORM in components.** All data access goes through `lib/db`
  repositories, called from `queries.ts` / `actions.ts`.

### 2.2 Authentication

- **Auth.js v5** behind a **swappable provider abstraction** (per README) so the
  concrete provider (credentials first, OAuth later) can change without touching
  feature code.
- Start with a **credentials provider** validated against the users table.
- Session strategy: JWT or database sessions — decide during design; must
  survive reload and be readable from RSC.
- Middleware enforces protection for the `(app)` route group and implements the
  callback-URL redirect behavior.

### 2.3 Data layer

- Introduce the **Drizzle** schema for `users` (and a session table if using DB
  sessions), with a checked-in migration.
- Provide a `lib/db` repository module exposing typed functions
  (`getUserByEmail`, `getDashboardData(userId)`, …). Features call these; they
  never write SQL inline.
- Add `docker-compose` for local Postgres and a seed script creating at least
  one test user, so the slice is runnable locally end to end.

### 2.4 Contracts & validation

- Every Server Action and route handler **parses input with Zod** at the edge and
  returns the `ActionResponse<T>` discriminated union
  (`{ ok: true, data } | { ok: false, error }`) from `src/lib/result.ts` — no
  throwing across the boundary.
- Credential schema lives in `features/auth/schema.ts`; inferred types are the
  single source of truth for the form and the action.

### 2.5 UI & design

- Sign-in form built from `components/ui` primitives (Input, Button, form field
  wrappers) and the Keystone token layer.
- Error, empty, and loading states reuse the existing boundary patterns.
- Topbar gains a sign-out control wired to the `signOut` action.

### 2.6 Observability

- Auth actions log through the request-scoped **pino** logger: sign-in
  attempt/outcome (no secrets), sign-out, and any repository errors.

### 2.7 Constraints & non-functional

- Strict TypeScript throughout (`noUncheckedIndexedAccess`,
  `verbatimModuleSyntax`); `typedRoutes` must still pass — no broken `<Link>`s.
- Secrets (Auth.js secret, DB URL) added to `src/config/env.ts` Zod schema and
  `.env.example`; boot fails fast if missing.
- No secret ever reaches the client bundle or logs.

### 2.8 Testing

- **Unit (Vitest + RTL):** credential schema validation, `SignInForm` rendering
  and error state, repository functions against a test DB.
- **E2E (Playwright smoke):** unauthenticated redirect → sign-in → dashboard →
  sign-out happy path.

---

## 3. Rollout / definition of done

- [ ] `auth` and `dashboard` feature slices created per structure above.
- [ ] `/sign-in` route + `(app)` middleware protection with callback redirect.
- [ ] Drizzle `users` schema, migration, docker-compose Postgres, seed script.
- [ ] Dashboard renders real per-user data via `lib/db`.
- [ ] All actions Zod-validated and return `ActionResponse<T>`.
- [ ] Unit + E2E smoke tests passing.
- [ ] `pnpm typecheck`, `pnpm lint`, and build pass clean.
- [ ] `.env.example` and `config/env.ts` updated; README "Next steps" ticked.

## 4. Open questions

1. Session strategy: JWT vs. database sessions?
2. Credentials-only for v1, or include one OAuth provider (e.g. GitHub) up front?
3. Does the dashboard need real domain data now, or a representative placeholder
   dataset sourced through the repository until domain features land?

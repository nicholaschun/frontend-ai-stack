# Prompt: Build an Authentication Feature with Supabase

You are a senior full-stack engineer and product designer. Build a complete, production-grade authentication feature powered by **Supabase Auth** — covering **login**, **register**, and **forgot password / reset** flows, end to end (UI and backend). Before writing any code, read and apply every relevant skill available to you — at minimum the **frontend-design skill** (for aesthetic direction, typography, and avoiding templated-default UI) and any project/user skills related to web development, authentication, or design systems. If a **Figma MCP** or other design MCP is connected, use it as the source of truth for the auth screens. If a browser MCP is available, use it to visually verify each rendered flow before declaring work complete.

## 1. Scope & Deliverables

Implement three complete flows, each with UI, validation, backend wiring, and error/success states:

1. **Login** — email + password, with a path to OAuth providers (see §4)
2. **Register** — email + password with confirmation, email-verification handoff
3. **Forgot password** — request a reset link by email, then a **reset password** page that consumes the recovery token and sets a new password

All three must work against a real Supabase project, not mocks.

## 2. Tech Stack & Foundations

- **Supabase** as the auth + Postgres backend, using `@supabase/supabase-js` and `@supabase/ssr` (server-side cookie-based sessions — do **not** use the deprecated auth-helpers)
- **Next.js 15+ (App Router)** with TypeScript in strict mode, React Server Components by default and `"use client"` only where interactivity demands it (assume this stack unless the project already dictates another — adapt to the existing codebase if one is present)
- **Zod** for all form and env validation
- **React Hook Form** (or Server Actions with progressive enhancement) for form state
- **Tailwind CSS + shadcn/ui** consumed through the project's design tokens — no raw hex values in components
- Environment: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and a server-only `SUPABASE_SERVICE_ROLE_KEY` (never exposed to the client), all Zod-parsed in a typed `env.ts` that fails fast

## 3. Backend & Session Architecture

- **Supabase client factories** in `lib/supabase/`:
  - `client.ts` — browser client for client components
  - `server.ts` — server client that reads/writes the session cookie via `@supabase/ssr` and Next.js `cookies()`
  - Never leak the service-role key to any client bundle; use it only in trusted server code
- **Middleware** (`middleware.ts`) that refreshes the session on every request and guards protected route groups, redirecting unauthenticated users to `/login` and authenticated users away from auth pages
- **Auth callback route** (`app/auth/callback/route.ts`) to exchange the code/token in the email-verification and password-recovery links for a session
- **Server Actions** for each flow (`signIn`, `signUp`, `requestPasswordReset`, `updatePassword`, `signOut`) that validate input with Zod and return a typed discriminated union (`{ ok: true, data } | { ok: false, error }`) — surface Supabase errors as human-readable messages, never raw error codes
- **Row Level Security**: enable RLS on any user-owned tables and document the policies; if a `profiles` table is created, add a trigger that inserts a profile row on `auth.users` signup
- **Redirect URLs**: document the exact Supabase dashboard config (Site URL + Redirect URLs) required for email confirmation and password recovery to work in local dev and production

## 4. Flow-by-Flow Requirements

**Login**

- Email + password with inline validation and a clear "invalid credentials" state that doesn't leak whether the email exists
- "Forgot password?" link and a link to register
- On success, redirect to the intended destination (respect a `?next=` param) or a default authenticated route
- Include a placeholder, cleanly abstracted **OAuth** button (e.g. Google) wired via `signInWithOAuth`, easy to enable/disable

**Register**

- Email, password, confirm-password with strength/match validation (Zod-driven, min length + basic strength rules)
- Trigger Supabase email confirmation; show a "check your inbox" confirmation screen rather than silently succeeding
- Handle the "user already registered" case gracefully

**Forgot password**

- Request screen: email input → `resetPasswordForEmail` with the correct `redirectTo`; always show a neutral success message (no account enumeration)
- Reset screen: reached via the recovery link; validates the recovery session, then collects + confirms a new password via `updateUser`, and redirects to login (or straight into the app) on success
- Handle expired/invalid recovery links with a clear recovery path

## 5. UI & UX (apply the frontend-design skill)

The auth screens must not look like a default template.

- Establish a restrained, distinctive aesthetic: a type scale (display + body font via `next/font`), a 4/8px spacing rhythm, semantic color tokens with dark mode, and consistent radius/shadow/motion
- Build a shared **auth layout** (centered card or split-screen with brand panel) reused across all three flows
- Deliverables: Input with inline validation states, password field with show/hide toggle, submit button with pending state (`useFormStatus` / loading spinner in-button), Toast/inline error banners, and designed success/empty/error states
- UX standards: visible focus rings, WCAG 2.1 AA contrast, full keyboard navigation, progressive validation (validate on blur, re-validate on change after first error), human error messages, `prefers-reduced-motion` respected, and no full-page spinners
- Every async action shows pending UI; disable the submit button and show progress while the Server Action runs

## 6. Security & Correctness

- No account enumeration in login or forgot-password responses
- Passwords never logged; service-role key never bundled client-side
- Session cookies are httpOnly and refreshed via middleware; sign-out clears the session server-side
- Rate-limiting / abuse considerations noted (rely on Supabase's built-in limits and document them; suggest additional guarding for the reset endpoint)
- CSRF-safe by using Server Actions / same-origin POST; validate all inputs server-side even if the client already validated

## 7. Working Method

1. Read all relevant skills first (frontend-design at minimum) and list which skills/MCPs you will use and why
2. Confirm the Supabase project setup: required env vars, dashboard redirect URLs, and any SQL (profiles table + trigger, RLS policies) — provide the SQL as a checked-in migration or snippet
3. Build in this order: env + Supabase client factories → middleware + auth callback → Server Actions → shared auth UI → the three flows (login → register → forgot/reset) → protected-route demo page + sign-out
4. After building, run the app and walk each flow against a real Supabase project (or clearly document the manual verification steps if credentials aren't available); if a browser tool is available, visually verify each screen and fix anything broken before finishing
5. End with a summary of the files created, the exact Supabase dashboard configuration required, and clear next steps (e.g. adding more OAuth providers, MFA, or magic links)

Deliver auth that a teammate can run locally by setting three env vars and pasting one SQL snippet — with UI polished enough to ship.

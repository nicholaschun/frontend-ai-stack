# Features

Each feature is a **vertical slice** — everything that feature needs, colocated:

```
features/<name>/
  ui/          # components specific to this feature
  hooks/       # client hooks (TanStack Query, local state)
  actions.ts   # Server Actions ("use server"), each returning ActionResponse<T>
  schema.ts    # Zod schemas (form + input validation) and inferred types
  queries.ts   # RSC data fetching (delegates to lib/db repositories)
  index.ts     # the feature's public surface — import via @/features/<name>
```

## Rules (enforced by ESLint)

- **No cross-feature imports.** A feature must never import from another feature
  through the `@/features/*` alias. Within a feature, use relative imports
  (`./ui/...`). Anything two features need is promoted to `lib/` or
  `components/`.
- **No raw ORM calls in components.** Data access goes through repository
  functions in `lib/db/`; features call those from `queries.ts`/`actions.ts`.
- **Validate at the edge.** Every Server Action and route handler parses its
  input with Zod and returns a typed `ActionResponse` discriminated union.

## Adding a feature

1. Create `features/<name>/` with the files above.
2. Add a route under `app/(app)/<name>/` (or `(marketing)/`) that renders the
   feature's UI — the route stays thin.
3. If it needs nav, add an entry to `src/config/nav.ts`.

That's the whole checklist. Nothing else in the tree should need to change.

> Scaffolded but not yet populated. The first real slice (`auth` + `dashboard`)
> lands in the next phase, along with the Drizzle data layer and Auth.js wiring.

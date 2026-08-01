# yearn.fi monorepo

Bun-workspace monorepo. Yearn Finance vaults interface — Next.js 16 App Router + React 19 + TypeScript, TanStack Query, Tailwind CSS 4, Wagmi/Viem.

## Workspaces

| Path | Package | Role | Demo |
| --- | --- | --- | --- |
| `apps/yearn.fi` | `yearnfi` | The deployed app | — |
| `packages/components` | `@yearn/components` | Design tokens, UI primitives, wallet connection layer | `:3001` |
| `packages/vaults` | `@yearn/vaults` | Vault domain model: selectors, types, ABIs, Kong client | headless |
| `packages/deposit` | `@yearn/deposit` | Deposit/withdraw widget, transaction flows, its server routes | `:3002` |

Workspace globs are `apps/*` and `packages/*`. Dependencies hoist to the repo root — there is no
`apps/yearn.fi/node_modules`, so any path that reaches into `node_modules` must go up two levels.

Dependencies point one way only: `components` ← `vaults` ← `deposit`. `components` depends on
nothing; `vaults` may use `components`; `deposit` may use both. Never the reverse.

`components` and `deposit` are each a library plus a Next.js demo site, so the demo exercises the
package exactly the way a consuming app does. `vaults` is headless and has no demo.

### What belongs in a package

`@yearn/components` owns the **chain-connection layer** — tokens, primitives, wallet identity, the
connect button, and generic server helpers. `@yearn/vaults` owns the **domain model** — vault
selectors, types, ABIs, and the Kong client, which yearn.fi's list, detail, and portfolio pages use
directly, not only the widget. `@yearn/deposit` owns the **widget** — its UI, transaction flows, the
Enso solver, and the server routes those call.

The `vaults` split exists because the domain model has heavy use outside the widget
(`kongVaultSelectors` alone has ~30 importers beyond it); folding it into `deposit` would make every
vault page import from a package named for a single action.

Packages own no app singletons. Anything app-specific is injected as a prop with a working default:
analytics is a sink the host supplies, and `TYearnChainResolver` maps a displayed chain to the chain
transactions execute on (yearn.fi passes its Tenderly resolver; the default is identity). Contexts
that belong to the app — vault totals, notifications, app settings — are never imported by a
package; the value crosses as a prop instead (e.g. `<Yearn.ConnectButton isBusy={…} />`).

Components are exported individually and grouped under a `Yearn` namespace, so call sites read
`<Yearn.ConnectButton />`. `@yearn/deposit` re-exports that namespace with the widget merged in.

### Package conventions

Packages are consumed as **TypeScript source**, not as build artifacts — consumers list them in
`transpilePackages`. There is no build step for the library itself.

IMPORTANT: inside a package, import by the package's own name, never `@/*` or a relative path:

```ts
import { cl } from '@yearn/components/utils/cl'   // ✅ resolves for every consumer
import { cl } from '@/utils/cl'                   // ❌ `@/` belongs to the consuming app
import { cl } from '../utils/cl'                  // ❌ violates the no-relative-imports rule
```

This resolves through two mechanisms that must be kept in sync when adding a package:
- **bundlers** use the `exports` map (`"./*": "./src/*"`) via the workspace symlink
- **tsc** uses `paths` in each `tsconfig.json`, because it will not extension-probe through an
  `exports` wildcard

Every workspace that imports a package needs both a `paths` entry and a `transpilePackages` entry.
Vitest needs a matching `resolve.alias`, since it reads neither.

## Commands

Run from the repo root; root scripts delegate to workspaces via `bun run --filter`.

```bash
bun install                              # Install all workspace dependencies
bun run dev                              # Next dev server on 127.0.0.1:3000
bun run preview                          # Next production server on 127.0.0.1:3000 after a build
bun run build                            # Next production build
bun run test                             # Vitest across every workspace
bun run lint:fix                         # Biome format and fix (whole repo)
bun run tslint                           # TypeScript type check across every workspace
bun run build:all                        # Build the app and both package demos
bun run dev:components                   # @yearn/components demo on 127.0.0.1:3001
bun run dev:deposit                      # @yearn/deposit demo on 127.0.0.1:3002
```

Single test file, from inside the workspace:

```bash
cd apps/yearn.fi && bunx vitest run src/path/to/test.ts
```

## Verification

IMPORTANT: After making code changes, always verify:
1. `bun run tslint` — type check passes
2. `bun run lint:fix` — code is formatted
3. Run relevant test file if one exists

Husky runs `lint-staged` + `bun run tslint` on every commit.

## Code Style

Formatting is enforced by Biome (biome.jsonc) — do not worry about indentation, quotes, or commas.

IMPORTANT: These rules are NOT enforced by tooling — you MUST follow them:
- NEVER use `let` — always use `const`
- NEVER use `for`/`while` loops — use `.map()`, `.filter()`, `.reduce()`
- NEVER use relative imports — use path aliases (`@/*`, `@shared/*`, `@pages/*`, `@components/*`)
- Use functional style code throughout

Naming:
- Components: PascalCase (`VaultListRow.tsx`)
- Hooks: `useFoo` (`useFilteredVaults.ts`)
- Utilities: camelCase (`format.ts`)
- Types: T-prefixed (`TSortDirection`, `TVaultType`)

### useEffect — prefer alternatives

Avoid `useEffect` when a better primitive exists. Most `useEffect` usage hides derived state, duplicates event handling, or re-implements what TanStack Query already provides.

**Prefer these instead:**
- **Derived state** — compute inline or with `useMemo` instead of `useEffect(() => setX(f(y)), [y])`
- **Event handlers** — do work directly in `onClick`/`onChange` instead of setting a flag for an effect to pick up
- **TanStack Query** — use `useQuery`/`useMutation` for data fetching, never `useEffect` + `fetch` + `setState`
- **`key` prop for reset** — use `<Component key={id} />` to remount instead of `useEffect` that resets state when an ID changes
- **Conditional rendering** — render children only when preconditions are met (e.g., `{!isLoading && <Player />}`) instead of guarding inside an effect

**When `useEffect` is acceptable:**
- One-time DOM/browser API setup on mount (IntersectionObserver, event listeners, focus)
- Third-party library lifecycle (init/destroy)
- Cases where no declarative alternative exists

When writing a new `useEffect`, add a brief comment explaining why an alternative does not apply.

## Architecture

**Tech stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, TanStack Query, Wagmi/Viem/RainbowKit

**Path aliases** (defined in `apps/yearn.fi/tsconfig.json`, resolved relative to that workspace):
- `@/*` → `src/*`
- `@shared/*` → `src/components/shared/*`
- `@pages/*` → `src/components/pages/*`
- `@components/*` → `src/components/*`

**Key directories** (all relative to `apps/yearn.fi/`):
- `app/` — Next App Router pages, route handlers, metadata, redirects, and root layout
- `src/components/shared/` — shared library (contexts, hooks, utils, types, contracts)
- `src/components/pages/` — route pages (landing, portfolio, vaults)
- `src/server/` — focused API endpoint implementations and shared server-side helpers used by `app/api/**/route.ts`

**Root-level config:** `package.json` (workspaces + delegating scripts), `tsconfig.base.json` (shared
compiler options, extended by each workspace), `biome.jsonc`, `.lintstagedrc.json`, `.husky/`, `.github/`.

**Key patterns:**
- Context provider chain defined in `App.tsx` — read that file for the full order
- Next route wrappers in `app/**/page.tsx` own route-level metadata and render client page components from `src/components/pages/`
- `src/navigation/` provides small client helpers backed by Next navigation context
- `/api/*` is served by explicit Next route handlers under `app/api/**/route.ts`; there is no catch-all API dispatcher
- Vault data flows through `useYearn` context → filtered/sorted via hooks in `@shared/hooks/`

## Deployment

The Vercel project's **Root Directory must be `apps/yearn.fi`**. Vercel detects the bun workspace root
and installs from the repo root; `apps/yearn.fi/vercel.json` holds the install and build commands.

## Multi-Chain

Supported chains configured in `apps/yearn.fi/src/components/shared/utils/constants.tsx`:
Ethereum (1), Optimism (10), Polygon (137), Fantom (250), Base (8453), Arbitrum (42161), Sonic (146), Katana (747474)

# Modernization notes

Verified November 9–10, 2026 with pnpm 12.18.0 and Node 26.13.0. All direct dependency entries matched their current stable registry releases; `pnpm outdated --format json` returned `{}`. The lockfile installs with frozen resolution and strict peer checks.

| Area | Installed version | Change |
| --- | --- | --- |
| React / React DOM | 19.3.1 | Matching stable runtime versions and React 19.3 types. |
| Storybook | 10.6.6 | Already the latest stable release; documentation, accessibility, Vitest, and React/Vite packages stay aligned. |
| Motion | 14.11.1 | Updated from 12; layout projection, icon/status handoffs, and shared orbit motion verified. |
| Vite / React plugin | 8.3.7 / 6.3.0 | Current Rolldown-based build and compatible plugin. |
| Vitest / browser / coverage | 5.1.0 | Explicit Playwright provider and separate story/behavior servers. |
| TypeScript native compiler | 7.0.2 | Project-reference builds use the native compiler. |
| TypeScript API compatibility | 6.0.2 | The `typescript` name resolves to Microsoft's TS6 compatibility package for ecosystem tools. |
| ESLint / TypeScript ESLint | 10.14.0 / 8.72.2 | Updated flat configuration and current React Hooks diagnostics. |
| Tailwind | 4.3.5 | Current stable version retained. |

Other direct dependencies were updated to their stable versions in `package.json` and `pnpm-lock.yaml`. Unregistered onboarding and theme addons were removed. Global Node/pnpm installations were untouched; `package.json` records the supported Node floor rather than an exact personal-toolchain pin.

## Compatibility choices

TypeScript 7's native compiler and the TS6 JavaScript API compatibility package run side by side, following [Microsoft's migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/). This keeps the latest compiler while satisfying the supported API range of ESLint and Storybook's documentation tooling.

Vitest 5 uses `@vitest/browser-playwright` and `playwright()` rather than the older provider string. Story and behavior projects retain separate Vite servers because Storybook adds its own preview transforms. Story tests request reduced motion for settled accessibility checks; dedicated motion tests cover the normal-motion path. See [Vitest migration guidance](https://vitest.dev/guide/migration/) and [the provider API](https://vitest.dev/config/browser/playwright).

React Hooks diagnostics prompted commit-phase provider refs, a `useSyncExternalStore` viewport subscription, and a shared live-CSS subscription. One narrow lint exception remains in the Storybook-only args adapter: its external args store must synchronize host edits while local React state makes interaction tests synchronous. Production lint rules remain enabled.

pnpm 12 recorded exact-version minimum-release-age exceptions for explicitly requested new stable releases. These are version-specific entries, not a blanket bypass. Existing build-script permissions remain scoped.

## Remaining upstream findings

`pnpm audit --prod --json` reported zero advisories. The full tree reported two moderate development-tool advisories, with zero high or critical findings:

- `glob`, pulled through Storybook tooling: [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4).
- `minimatch`, pulled through ESLint/Storybook tooling: [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

Patched versions cross the current parent packages' major dependency ranges. No forced transitive overrides were added. Recheck after upstream Storybook/ESLint releases. This describes the audit result, not a general security certification.

The toolchain still prints Node's `module.register()` deprecation notice and a generated Storybook-preview chunk warning. Neither failed builds or tests.

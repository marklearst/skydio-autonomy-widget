# Skydio Autonomy Widget

A React implementation of a mission-status and control widget using Skydio’s Rivit design language. Storybook contains the live examples, behavior documentation, and interaction tests.

The widget demonstrates UI behavior and an application integration seam. The host example changes mission state and receives intent events; transport, acknowledgment, and telemetry synchronization remain application responsibilities.

## Start locally

Use pnpm with a Node.js version supported by [package.json](package.json).

```sh
pnpm install
pnpm storybook
```

Open [Storybook](http://localhost:6006/?path=/docs/overview--docs). To run the standalone widget instead, use `pnpm dev`.

## Documentation

- [Overview](src/docs/Overview.mdx): a guided walkthrough with live mission examples and the design decisions behind the layout.
- [Architecture & API](src/docs/Architecture.mdx): the state flow, typed API, and live host example.
- [Design system](src/docs/DesignSystem.mdx): semantic-token relationships and working component specimens.
- [Contribution rules](DESIGN.md): allowed token layers, component choices, and closed variants.
- [Integration](src/docs/Integration.mdx): a compiled provider example, state ownership, timer semantics, and current integration boundaries.
- [Component API](src/docs/ComponentAPI.mdx): complete props, defaults, closed variants, normalization, refs, and callback contracts.
- [Verification](src/docs/Verification.mdx): test layers, accessibility review, coverage interpretation, and publishing.
- [Modernization notes](docs/modernization.md): dependency versions and compatibility decisions.

In Storybook, start with **Overview**, then open **Architecture & API** or **Design system** beneath it for the relevant audience. **Components / AutonomyWidget / Default**, **Expanded**, and **Orbit Mode** are manual examples. Their named **Interaction** stories run automated sequences; expand the Interactions panel to follow each assertion.

## How it fits together

The typed mission catalog in `AutonomyWidget.configs.ts` selects status text, timer icons, and available actions. `createAutonomyWidgetState` normalizes caller input and derives that presentation before the widget renders. The provider stores the result locally or accepts application-controlled state.

An external-system adapter maps its data into the widget’s input shape. In controlled mode, widget interaction proposes a next state through `onStateChange`; the host decides what to retain and passes the authoritative value back. Mission actions return through `onAction`, and orbit adjustments through `onOrbitProgressChange`.

The configuration is TypeScript code compiled with the application. It is not an arbitrary runtime JSON layout engine. The host example demonstrates the adapter boundary without opening a drone connection or implementing a command queue.

## Use the widget

Import the theme once at the application entry point:

```tsx
import './styles/theme.css'
```

Wrap the widget with its provider:

```tsx
import {
  AutonomyWidget,
  AutonomyWidgetProvider,
  type AutonomyWidgetStateInput,
} from './components/AutonomyWidget'

const initialState: AutonomyWidgetStateInput = {
  action: 'waypoint-mission',
  time: 90,
  expanded: false,
  isPaused: false,
}

export function App() {
  return (
    <AutonomyWidgetProvider initialState={initialState}>
      <AutonomyWidget />
    </AutonomyWidgetProvider>
  )
}
```

These imports are relative to `src/`. A compiled example lives in [IntegrationExample.tsx](src/docs/IntegrationExample.tsx).

Inside the provider, `useAutonomyWidget()` returns `{ state, setState }`. Use `initialState` for local ownership or `state` with required `onStateChange` for application ownership. The provider derives mission names, icons, and controls synchronously; callers own the mission input rather than repeating its display fields.

`time` is a duration, not a telemetry timestamp or live remaining value. Changing its effective normalized value restarts the local countdown. Changing only the mission with the same duration preserves that countdown; a host that requires a new run must define an explicit reset or remount policy.

`onAction` emits `{ type: 'mission-action', action, id }`; `onOrbitProgressChange` observes orbit changes. The host application owns transport and acknowledgment. See the integration guide for a controlled example.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm storybook` | Start the component explorer on port 6006. |
| `pnpm dev` | Start the standalone Vite app. |
| `pnpm test` | Run Storybook and behavior tests in Chromium. |
| `pnpm test:coverage` | Write combined coverage to `coverage-all-tests/index.html`. |
| `pnpm build` | Type-check the project and build the standalone app. |
| `pnpm build-storybook` | Build the Storybook site. |
| `pnpm chromatic` | Publish Storybook for visual review. |

Install the test browser on a new machine:

```sh
pnpm exec playwright install chromium --only-shell
```

The Storybook panel runs story tests only. Its `coverage/` report does not include the behavior or application-startup tests. The combined report uses a separate directory so the panel cannot overwrite it.

## Publish Storybook

Set `CHROMATIC_PROJECT_TOKEN` in the gitignored `.env.local`, then run `pnpm chromatic`. The file must remain untracked. In CI, provide the token as an environment secret.

Publishing a build and accepting its visual baselines are separate steps. Review the rendered comparisons before accepting changes. The repository’s Vercel configuration also builds and serves Storybook.

## Code map

| Location | Responsibility |
| --- | --- |
| `src/components/AutonomyWidget/` | Typed mission catalog, state normalization, context, provider, and widget composition. |
| `src/components/Timer/` | Countdown ring, text/icon transition, and completion behavior. |
| `src/components/OrbitSlider/` | Controlled or local orbit progress and limit controls. |
| `src/components/Button/` | Native buttons, icon variants, and hover/focus help. |
| `src/hooks/` | Countdown and viewport-breakpoint behavior. |
| `src/styles/theme.css` | Shared colors, typography, and component utilities. |
| `src/docs/` | Storybook architecture and design-system guides, live specimens, and integration examples. |

## Current boundaries

- Pause/resume and expansion update the provider’s local or application-controlled state.
- Mission action clicks invoke configured callbacks and emit typed UI-intent events. Transport and acknowledgment are application work.
- Widget orbit adjustments update shared state and expose a callback. External persistence remains application work.
- Countdown timing uses a local interval and is not synchronized to telemetry.
- Automated accessibility violations fail story tests and are visible in Storybook; they are not a conformance certification.

## Ownership

Copyright © 2025 Skydio, Inc. All rights reserved. Code and deliverables are the property of Skydio, Inc. See [LICENSE](LICENSE).

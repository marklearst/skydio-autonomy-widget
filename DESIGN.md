# Autonomy Widget design system

This is a compact mission-monitoring surface. Neutral surfaces carry status and time; color distinguishes pause, resume, and orbit progress. Keep those roles stable across missions so an operator can read a new state without learning a new layout.

## Start here

| Topic | Use it for |
| --- | --- |
| [Tokens](docs/design/tokens.md) | Surface, content, border, state, motion, and geometry roles. |
| [Buttons and controls](docs/design/buttons.md) | Native action controls, names, treatments, and grouped actions. |
| [Mission widget](docs/design/mission-widget.md) | State ownership, mission composition, compact behavior, and intent events. |
| [Timing and orbit](docs/design/timing-and-orbit.md) | Countdown semantics, motion, percentage ownership, and bounds. |
| [Help and status](docs/design/help-and-status.md) | Non-interactive tooltips, live status, and alternatives. |

## Rules for every change

1. Component styles consume semantic tokens from `src/styles/theme.css`. Do not use palette primitives or raw color values in a component. Add or change the role at the token definition when the existing roles cannot express the requirement.
2. Use the variant unions in source. An unlisted variant is a bug. Do not cast a new string into an existing variant type.
3. Keep the common surface at `--color-surface` (`#1a1a1a`). Raised action controls and help surfaces use their named roles; they are deliberate exceptions, not independent themes.
4. Give every icon-only action an accessible name. A tooltip describes a control; it does not replace its name.
5. Use native buttons and native `disabled`. Exiting controls become inert and leave the accessibility tree immediately, then unmount after their short visual exit. Hidden controls cannot retain keyboard focus.
6. Keep presentation and behavior demonstrable separately. Manual stories do not run play functions; named interaction stories show the automated sequence and assertions.
7. Keep state input small. Derive status, icons, and action sets from the mission configuration; do not let callers provide conflicting display fields.
8. Treat callbacks as UI intent. The host application owns external transport, acknowledgment, failure, and telemetry reconciliation.
9. Animate continuity: an anchored header and projected backing surface connect expansion, fixed slots connect status/icon changes, and an interruptible spring connects orbit values. Semantic state and callbacks update immediately. Keyboard orbit changes and reduced motion skip animated travel. Use the shared CSS motion tokens.
10. Document observed behavior and the current API. Do not present a test count, coverage percentage, visual baseline, or accessibility claim without checking its current evidence.

## Sources of truth

- Tokens and component style rules: `src/styles/theme.css`.
- Closed button treatments and native-prop contract: `src/components/Button/Button.tsx`.
- State input, normalization, and ownership modes: `src/components/AutonomyWidget/AutonomyWidget.provider.tsx`.
- Mission mapping: `src/components/AutonomyWidget/AutonomyWidget.configs.ts`.
- Countdown and orbit behavior: `src/hooks/useTimer.ts`, `src/components/Timer/Timer.tsx`, and `src/components/OrbitSlider/OrbitSlider.tsx`.
- Examples and test steps: each component’s `*.stories.tsx`; integration example: `src/docs/IntegrationExample.tsx`.

For a visual change, inspect the manual story at desktop and compact widths, then the related interaction story. For a behavior change, assert the outcome and the relevant callback or native state; a CSS-class assertion does not establish correct behavior.

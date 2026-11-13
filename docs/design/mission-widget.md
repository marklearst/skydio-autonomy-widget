# Mission widget

## AutonomyWidget

Use `AutonomyWidget` for the mission status, countdown, pause/resume, and mission-specific actions together. Use `StatusMessage` for status alone or `Timer` for a countdown alone; assembling a second widget layout would duplicate its state and responsive rules.

There are no visual variant or size props on `AutonomyWidget`. The nearest `AutonomyWidgetProvider` supplies state. Presentation modes are collapsed and expanded at viewports of at least 600px, and compact below 600px. The breakpoint observes the browser viewport, not the container width.

The fine-pointer widget is 240 × 48px, 240 × 88px when expanded, and 88px wide when compact. Coarse pointers use 44px controls, a 60px row, a 112px expanded height, and a 112px compact width. Compact mode makes the secondary row inert and hides it from assistive technology immediately, then unmounts it after a short visual exit. It retains the timer, accessible status, and pause/resume action without clipped controls in the tab order.

```tsx
import { AutonomyWidget, AutonomyWidgetProvider } from './components/AutonomyWidget'

// Correct: the integration example owns only mission inputs.
<AutonomyWidgetProvider initialState={{ action: 'waypoint-mission', time: 90 }}>
  <AutonomyWidget />
</AutonomyWidgetProvider>

// Incorrect: the hook has no mission state to read outside a provider.
<AutonomyWidget />
```

```text
What must remain visible?
├── Mission status + controls → AutonomyWidget
├── Status without mission controls → StatusMessage
└── Countdown without mission controls → Timer
```

## AutonomyWidgetProvider

Use the provider to normalize mission input and expose a single state source. Use `initialState` for a locally owned example; use `state` with `onStateChange` when the host application drives the mission. Do not synchronize a competing local copy of a controlled state.

Ownership modes are exactly local and controlled. Local `initialState` is read once on mount; `onStateChange` may observe its updates. Controlled `state` requires `onStateChange`, which must retain the proposed state and pass it back. `state` and `initialState` cannot be combined. With neither input, the provider starts a 90-second waypoint mission.

`AutonomyWidgetStateInput` requires `action` and `time`; `expanded`, `isPaused`, and `orbitProgress` are optional. The resolver derives `actionName`, `timerIcon`, and `buttons` synchronously. Although compatibility input accepts derived fields, it overwrites them. Never independently author those fields.

The `ActionType` set is closed: `waypoint-mission`, `waypoint-single-point`, `returning-to-dock`, `returning-to-safe-point`, `landing`, `mission-paused`, `fly-to-point-paused`, `orbiting`, `orbit-paused`, `tracking-subject`, `searching-for-subject`, `manual`, and `idle`. Prefer an active action plus `isPaused` for an interactive flow. The paused keys are retained fixtures.

```tsx
// Correct: the controlled shape used by the Storybook adapter.
<AutonomyWidgetProvider
  state={state}
  onStateChange={handleStateChange}
  onAction={args.onAction}
  onOrbitProgressChange={args.onOrbitProgressChange}>
  <AutonomyWidget />
</AutonomyWidgetProvider>

// Incorrect: two competing ownership modes are rejected by the props type.
<AutonomyWidgetProvider state={state} initialState={state}>
  <AutonomyWidget />
</AutonomyWidgetProvider>
```

The provider clamps time to whole seconds from 0–3,599 and orbit to 0–100. Non-finite time becomes 0; non-finite or omitted orbit becomes 50. An unknown runtime action falls back to idle. Pause and expansion default to false.

Mission action buttons invoke a configured callback, if present, and emit `onAction({ type: 'mission-action', action, id })`. Orbit carets update shared `orbitProgress` and emit `onOrbitProgressChange(progress)`. Pause, resume, and expansion update state; they do not emit a mission-action event.

The host owns transport and the pending, acknowledged, rejected, and telemetry-reconciled states. Do not portray a UI state change as a confirmed drone command. Countdown ticks remain local to Timer; `state.time` is a duration input, not live remaining time.

```text
Who owns mission state?
├── Isolated example → initialState
├── Host supplies authoritative state → state + onStateChange
└── Child needs to update current input → useAutonomyWidget().setState
```

## Mission configuration

Edit `ACTION_CONFIGS` to add a mission’s display name, timer icon, and secondary actions; `getActionConfig(action)` resolves the entry. Use the existing `ButtonVariant` set for each action; do not cast an invented treatment. An empty button set removes the expansion control. While paused, `pausedButtons` replaces the active set rather than appending to it.

Every icon-only configuration needs a non-empty `ariaLabel`. Reserve `component: 'orbit-slider'` for the bounded orbit control. `primaryButton` and `iconRotation` are retained metadata and are not applied by the current renderer; do not promise behavior through them.

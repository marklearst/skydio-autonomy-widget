# Timing and orbit

## Timer

Use `Timer` for a local countdown with a mission icon. Use `StatusMessage` for textual mission state; use an application-owned clock when time must be authoritative across devices. Timer’s interval is a UI mechanism and does not synchronize to telemetry.

State is exactly `running | paused`, default `running`; `condensed` defaults to false. Duration is required and normalized to whole seconds from 0–3,599. The default icon is `RouteIcon`. There is no warning-color variant; the active ring uses primary content and the paused ring uses `timer-paused`.

```tsx
// Correct: the widget passes the input duration and pause state.
<Timer
  duration={time}
  state={isPaused ? 'paused' : 'running'}
  icon={TimerIcon}
  tooltip={isCompact ? config.actionTooltip : undefined}
/>

// Incorrect: casting a state does not create stopped behavior.
<Timer duration={time} state={'stopped' as 'running'} />
```

```text
What should Timer display?
├── Icon immediately, including while paused → condensed
├── Paused or complete → time text
└── Running → time text for 6 seconds, then the mission icon
```

Pause preserves remaining time. Resume starts the six-second reading phase again. Changing the effective normalized duration restarts the countdown; changing only the action does not. A host that needs a fresh timer for a different mission with the same duration must provide an explicit remount/reset policy.

`progress` overrides the ring from 0–1 without changing countdown text. Values are clamped; a non-finite override falls back to timed progress. Do not treat a progress override as a second time source.

`onComplete` fires once when a positive running countdown reaches zero, including under StrictMode. Initializing or resetting to zero does not fire it. The hook’s `reset` restarts a completed run. Time uses tabular numerals, and the SVG exposes the remaining value through an accessible name without announcing every tick in a live region.

The automatic text/icon change enters in 180ms and exits in 120ms with a 2px translation; there is no animated entrance on mount. Pause, completion, and condensed content use a static presentation. Reduced motion uses plain spans without opacity fades. Do not add an idle pulse or ring motion to imply activity.

Timer help appears on hover or keyboard focus and dismisses with Escape. Use `Button` when a timer needs an action; the help trigger is informational, not a fake action button.

## OrbitSlider

Use `OrbitSlider` for the bounded, button-operated orbit percentage. Use a native range input for drag or keyboard-slider interaction; this component is intentionally two native buttons surrounding a read-only meter. Do not add `role="slider"` to its track.

There is no visual variant union. Defaults are min 0, max 100, step 1, value 50, and enabled. The widget uses step 5. `value` with `onChange` is controlled; `defaultValue` initializes an uncontrolled instance. Legacy `progress` initializes and resynchronizes an uncontrolled instance; prefer `value` for new controlled use.

```tsx
// Correct: the widget shares progress through its provider state.
<OrbitSlider
  min={0} max={100} step={5}
  value={state.orbitProgress ?? 50}
  onChange={handleOrbitChange}
/>

// Incorrect: a controlled value cannot change if the host discards updates.
<OrbitSlider value={80} onChange={() => {}} />
```

```text
Who owns orbit progress?
├── Application or widget state → value + onChange
├── Isolated control → defaultValue + optional onChange
└── Existing compatibility caller → progress; migrate to value when controlled
```

Bounds normalize to 0–100; reversed bounds are sorted. Step must be a positive finite number or it becomes 1. Current progress is clamped to the resulting range; non-finite progress falls back to 50 within that range.

The left and right controls have the accessible names “Decrease orbit progress” and “Increase orbit progress.” Native `disabled` applies at each bound and for `disabled={true}`. An unchanged bounded value does not emit `onChange`.

The small blue marker remains fixed at 50%. The outlined marker shows current progress; the blue segment joins them. The meter exposes current, minimum, maximum, and a percentage text value.

Pointer adjustments move the indicator and connecting segment together through a 180ms zero-bounce spring. New input interrupts the travel rather than queuing another animation. State, callbacks, disabled controls, and meter values update synchronously. Native keyboard activation and reduced motion move the visual immediately. The track remains a display, not a drag surface.

Use **Orbit Mode** for a manual demonstration. **Orbit Interaction** deliberately clicks the controls, reaches 100%, then moves left four times to 80%; it can move focus while its play function runs.

## Mission transitions

Animate relationships while keeping the live header anchored. The background shell projects its size through a 240ms zero-bounce spring; the timer, status slot, and primary controls do not scale with it. Secondary actions enter from 6px above with a 180ms fade, and leave upward by 4px in 120ms.

An exiting row becomes inert, hidden from accessibility APIs, and unavailable to pointer input immediately. Its group role and control ID are removed during exit, then the row unmounts. If it held focus, focus returns to the disclosure or primary control. Never delay disabled state or callback delivery until animation finishes.

Status and changing control icons use a 180ms handoff with the shared easing curve. Their old and new visuals can overlap during the handoff; only the current status remains exposed. There is no initial entrance, idle loop, or wait mode that blocks another interaction. Reduced motion removes opacity and transform travel while retaining the same states.

Timing comes from `--duration-layout`, `--duration-feedback`, `--duration-normal`, `--duration-fast`, and `--ease-out-ui` in the shared theme. `useMotionTokens` reads them once per mounted surface and adapts CSS units for Motion. Remount or reload a specimen after changing motion tokens. Use **Design system → Replay transitions** for a finite review sequence; interacting takes control back from the sequence.

# Buttons and grouped controls

## Button

Use `Button` for an action. Use a native anchor for navigation; do not make a button imitate a link. Use `Controls` when a row of independent mission actions should share the available width.

Variants are exactly `default`, `stop`, `play`, `action`, `caret`, `stop-borderless`, `play-borderless`, and `caret-borderless`. Nothing else exists. `default` is the default; size is exactly `32 | 'auto'`, default `32`; `flex` defaults to `false`.

| Variant | Use |
| --- | --- |
| `default` | Neutral outlined action when no mission role applies. |
| `action` | Raised secondary mission action, including waypoint controls. |
| `play` / `play-borderless` | Resume action; the widget uses borderless. |
| `stop` / `stop-borderless` | Pause action; the widget uses borderless. |
| `caret` / `caret-borderless` | Disclosure or directional action; the widget disclosure uses borderless. |

```tsx
// Correct: the widget's named disclosure control.
<Button
  icon={showControls ? 'ChevronUpIcon' : 'ChevronDownIcon'}
  variant="caret-borderless"
  ariaLabel={showControls ? 'Collapse' : 'Expand'}
  aria-expanded={showControls}
  aria-controls={controlsId}
  onClick={() => setState(previous => ({ ...previous, expanded: !previous.expanded }))}
/>

// Incorrect: the former configuration mistake; this variant does not exist.
<Button icon="ChevronDownIcon" variant="secondary" />
```

```text
What action is this?
├── Resume → play; use play-borderless inside the widget
├── Pause → stop; use stop-borderless inside the widget
├── Disclosure or direction → caret; widget disclosure uses caret-borderless
├── Secondary mission action → action
└── Other neutral action → default
```

Use `size="auto"` for visible text and `32` for a square icon control. The actual square target follows `--control-size`: 32px fine pointer, 44px coarse pointer. `flex` shares the parent’s available width; it does not change the action’s semantic role.

Use visible `label` or `children`, or a non-empty `aria-label` / `ariaLabel` for an icon-only button. `children` takes precedence over `label`. The compatibility `ariaLabel` takes precedence over native `aria-label`; provide one naming mechanism to avoid conflicting names.

Use native `disabled` for unavailable actions. The component defaults to `type="button"`, forwards native props and refs, and merges `className`. Set `type="submit"` explicitly inside a form when submission is intended. Avoid color overrides in `className`; use the token role or a supported variant.

`tooltip` is optional non-interactive help shown on hover or keyboard focus. The button associates it with `aria-describedby` while visible. Escape dismisses help without activating the action; leaving and re-entering or focusing again can reopen it. The accessible name must still describe the action without the tooltip.

## Controls

Use `Controls` for a horizontal group of independent `Button` configurations. Use `OrbitSlider` for the bounded two-caret orbit adjustment, and use the widget’s configured second row when mission state decides the available actions.

There is no `Controls` variant or size union. Its `buttons` entries use `ButtonProps` except `flex`; the component applies `flex` to every entry. Omitting `buttons` renders four named waypoint actions. Native div attributes and refs pass through; default semantics are `role="group"` and `aria-label="Mission controls"`.

```tsx
// Correct: the same default waypoint configuration used by Controls.
<Controls buttons={[
  { icon: 'ChevronLeftIcon', ariaLabel: 'Previous waypoint', variant: 'action' },
  { icon: 'ChevronRightIcon', ariaLabel: 'Next waypoint', variant: 'action' },
]} />

// Incorrect: icon-only actions have no accessible names.
<Controls buttons={[{ icon: 'ChevronLeftIcon' }, { icon: 'ChevronRightIcon' }]} />
```

```text
Which composition?
├── One independent action → Button
├── A row of independent actions → Controls
└── Bounded orbit adjustment → OrbitSlider
```

Do not change `role` to `toolbar` without implementing the expected arrow-key focus behavior. This group uses each native button’s normal Tab order.

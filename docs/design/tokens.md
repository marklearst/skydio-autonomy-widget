# Token roles

Use `src/styles/theme.css` as the source of truth. Components consume semantic tokens; palette primitives and raw color values belong only in token definitions. The primitive palette remains available for compatibility, not as a component styling API.

## Surfaces and content

| Semantic token | Definition / purpose |
| --- | --- |
| `--color-surface` | `--color-gray-900` / `#1a1a1a`; widget, canvas, and resting control surface. |
| `--color-surface-raised` | `--color-gray-800` / `#333`; secondary action buttons. |
| `--color-surface-hover` | `--color-gray-700` / `#4d4d4d`; hover for action and caret treatments. |
| `--color-surface-pressed` | `--color-gray-900`; pressed control. |
| `--color-tooltip-surface` | `#111`; portaled help surface. |
| `--color-content-primary` | White; status, labels, active timer ring, and icons. |
| `--color-content-secondary` | `#b8b8b8`; supporting documentation content. |
| `--color-content-disabled` | `--color-text-tertiary` / `#808080`; unavailable controls. |
| `--color-border-subtle` | White at 10%; widget outline and help boundary. |
| `--color-border-control` | `--color-gray-700`; resting control and orbit track. |
| `--color-border-hover` | `--color-gray-600` / `#666`; fine-pointer control hover. |
| `--color-focus-ring` | `--color-content-primary`; 2px keyboard outline, 2px offset. |

```text
Which background?
├── Widget or canvas → surface
├── Secondary action → surface-raised
├── Hovering action/caret on a fine pointer → surface-hover
├── Pressed control → surface-pressed
└── Non-interactive help → tooltip-surface

Which content?
├── Available status, label, or icon → content-primary
├── Supporting documentation → content-secondary
└── Disabled control → content-disabled
```

## State color

| Semantic token | Role |
| --- | --- |
| `--color-action-resume` / `--color-action-resume-hover` | Resume/play; backed by `--color-primary-blue` and its hover value. |
| `--color-action-pause` / `--color-action-pause-hover` | Pause/stop treatment; backed by `--color-primary-red` and its hover value. |
| `--color-orbit-progress` | Orbit reference, filled segment, and progress indicator. |
| `--color-timer-track` | White at 20%; full countdown track. |
| `--color-timer-paused` | `--color-gray-600`; paused countdown ring. |

Keep pause and resume colors tied to their action roles. The `stop` treatment does not by itself implement an irreversible stop command; the callback determines the action.

```text
Which state color?
├── Resume control → action-resume
├── Pause control → action-pause
├── Orbit percentage → orbit-progress
└── Countdown ring → content-primary when active; timer-paused when paused
```

## Type, shape, motion, and geometry

| Tokens | Contract |
| --- | --- |
| `--font-sans` | Inter, then the system sans-serif stack. |
| `--text-status` / `--text-control` / `--text-tooltip` | 13px / 14px / 12px. |
| `--font-size-timer-short` / `-medium` / `-long` | 13px / 10px / 8px, selected by the formatted time length inside the 32px ring. |
| `--radius-button` / `--radius-widget` | 2px / 4px. |
| `--shadow-overlay-100` / `-200` | Shared low and high overlay elevation values; do not invent a third shadow in a component. |
| `--duration-fast` / `--duration-normal` | 120ms / 180ms. |
| `--duration-layout` / `--duration-feedback` | 240ms shell projection / 180ms state handoff and orbit travel. |
| `--ease-out-ui` | `cubic-bezier(0.32, 0.72, 0, 1)`; Timer uses the equivalent motion easing. |
| `--layer-tooltip` | 30; portals clear the widget’s clipping boundary. |
| `--tooltip-gap` | 14px between the trigger bounds and help surface. |
| `--control-size` | 32px fine pointer; 44px coarse pointer. |
| `--gap-action-button` | 8px between action content. |
| `--width-button` / `--height-button` | Compatibility aliases for `--control-size`. |
| `--widget-width` | 240px. |
| `--widget-padding` / `--widget-border-width` | 8px / 1px. Header inset subtracts the border to preserve the fixed outer height and compact width. |
| `--widget-height` / `--widget-expanded-height` | 48px / 88px; coarse pointer uses 60px / 112px. |
| `--widget-compact-width` | 88px; coarse pointer uses 112px. |

Do not enlarge the icon to enlarge a touch target. The control box expands while the 16px icon and 32px timer ring retain their reading scale. The reduced-motion media rule removes component CSS transitions; Motion components also bypass animated travel and fades.

```css
/* Correct: semantic role used by the actual widget rule. */
.autonomy-widget-base { background: var(--color-surface); }

/* Incorrect: this bypasses the surface role and permits color drift. */
.autonomy-widget-base { background: #1a1a1a; }
```

Storybook’s **Foundation / Tokens** page resolves these variables live. Inspect it after a theme change; copying a color value into a component would prevent that shared change from propagating.

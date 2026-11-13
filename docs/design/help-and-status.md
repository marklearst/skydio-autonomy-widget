# Help and status

## Tooltip

Use `Tooltip` for short, non-interactive help associated with a trigger. Use visible supporting text when information is necessary to complete the task, and a popover or dialog when the content contains focusable controls. A tooltip must never be the only accessible name of an icon button.

There are no variants. `targetRect`, `visible`, and `children` are required; `anchorRef` keeps geometry current during scroll and resize, and `onDismiss` lets a controlled trigger respond to Escape. Native div attributes, style, and refs pass through. Prefer the `tooltip` prop on `Button` or `Timer` when either is the trigger; those components own their help state and association.

```tsx
// Correct: Button's existing trigger/description association.
<Tooltip
  {...help.tooltipProps}
  id={help.tooltipId}
  anchorRef={buttonRef}
  targetRect={help.targetRect}
  visible={tooltipVisible}
  onDismiss={help.dismiss}>
  {tooltip}
</Tooltip>

// Incorrect: a tooltip does not provide a focus-management contract for controls.
<Tooltip targetRect={rect} visible={true}>
  <button onClick={openSettings}>Open settings</button>
</Tooltip>
```

```text
Where does this explanation belong?
├── Required to understand or complete the task → visible supporting text
├── Short non-interactive description → Tooltip
└── Contains controls or needs sustained interaction → popover or dialog
```

Tooltip portals to `document.body` with `role="tooltip"`. Associate its ID through the trigger’s `aria-describedby` while visible. It uses a 14px token gap, clamps horizontally to an 8px viewport edge, and flips above when there is insufficient room below. It receives pointer events to retain hover, but never takes keyboard focus. Use the shared `useTooltipInteraction` hook for custom triggers; it gives the pointer 200ms to cross the gap and retains help while either surface is hovered or the trigger is focused.

Escape dismisses until a new intentional trigger entry or focus. Hovering the dismissed help surface does not reopen it. Do not force it open every render. Provide `anchorRef` when the trigger can move; a stale copied rectangle cannot track its new position.

## StatusMessage

Use `StatusMessage` for concise mission status that may change without a direct focus move. Use a heading for section hierarchy or an ordinary paragraph for static explanation. Status is not an action and must not resemble an unlabeled button.

There are no variants. `message` is required; `className` is optional. It uses `role="status"`, a polite live region, 13px status type, and primary content color. The one-line content hides overflow without an ellipsis, so keep mission labels concise and review long text in its actual layout.

```tsx
// Correct: the widget's resolved status presentation.
<StatusMessage message={currentActionName} />

// Incorrect: inventing a visual API does not create an urgent announcement.
<StatusMessage message={currentActionName} variant="danger" />
```

Use a dedicated alert pattern for urgent, time-sensitive interruption; do not change all routine mission updates to assertive announcements. The compact widget renders an accessible status string while visually prioritizing the timer and primary control.

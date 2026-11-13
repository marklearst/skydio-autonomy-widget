import type { Dispatch, SetStateAction } from 'react'
import type { ButtonVariant } from '../Button/Button'

/** Supported configuration keys, including retained paused-state fixtures. */
export type ActionType =
  | 'waypoint-mission'
  | 'waypoint-single-point'
  | 'returning-to-dock'
  | 'returning-to-safe-point'
  | 'landing'
  | 'mission-paused'
  | 'fly-to-point-paused'
  | 'orbiting'
  | 'orbit-paused'
  | 'tracking-subject'
  | 'searching-for-subject'
  | 'manual'
  | 'idle'

/** Reserved primary-control configuration; not consumed by the current widget renderer. */
export interface PrimaryButton {
  type: 'stop' | 'play' | 'custom'
  icon?: string
  label?: string
  variant?: 'stop-borderless' | 'play-borderless' | 'caret-borderless' | 'default'
  onClick?: () => void
}

/** Mission presentation selected by `getActionConfig(action)`. */
export interface ActionConfig {
  /** Status text while the mission is active. */
  displayName: string
  /** Paused status; the renderer falls back to "Mission Paused". */
  pausedName?: string
  /** Hover help for the timer in compact mode. */
  actionTooltip: string
  /** Timer icon name; legacy aliases are supported by the widget. */
  timerIcon: string
  /** Controls available while active. An empty array removes the expand toggle. */
  buttons: ActionButton[]
  /** Controls available while paused; omitted means no additional controls. */
  pausedButtons?: ActionButton[]
  /** Reserved metadata; the current renderer uses `isPaused` for its primary control. */
  primaryButton?: PrimaryButton
}

/** A configured action or the special orbit control in the widget's second row. */
export interface ActionButton {
  /** Stable identifier emitted by the widget action event. */
  id: string
  /** Icon name from the shared library, or empty for the orbit component. */
  icon: string
  /** Visible text. Empty labels require a non-empty `ariaLabel`. */
  label: string
  /** Same supported variants as the standalone Button. */
  variant: ButtonVariant
  /** Accessible name, taking precedence over the visible label. */
  ariaLabel?: string
  tooltip?: string
  /** Reserved metadata; not applied by the current widget renderer. */
  iconRotation?: 'rotate-90' | 'rotate-180' | 'rotate-270' | ''
  /** Optional local action callback, invoked alongside the provider’s action event. */
  onClick?: () => void
  /** Renders OrbitSlider in place of a regular button. */
  component?: 'orbit-slider'
}

/**
 * Shared mission and presentation state.
 *
 * @remarks
 * Prefer an active `action` plus `isPaused` for interactive flows. The provider
 * derives display fields synchronously. Countdown ticks remain local to Timer;
 * orbit caret adjustments update the shared `orbitProgress` value.
 */
export interface AutonomyWidgetState {
  /** Mission configuration key. */
  action: ActionType
  /** Status text, derived by the provider. */
  actionName: string
  /** Duration in seconds; remaining time is held inside Timer. */
  time: number
  /** Whether to show available secondary controls at desktop widths. */
  expanded: boolean
  /** Pauses local countdown ticks and selects paused presentation. */
  isPaused: boolean
  /** Timer icon, derived by the provider. */
  timerIcon?: string
  /** Active controls, derived by the provider; paused controls come from config. */
  buttons: ActionButton[]
  /** Shared orbit percentage, from 0 to 100. Defaults to 50. */
  orbitProgress?: number
}

/** Input that callers own; presentation fields are derived from the action. */
export type AutonomyWidgetStateInput = Pick<AutonomyWidgetState, 'action' | 'time'> &
  Partial<Omit<AutonomyWidgetState, 'action' | 'time'>>

/** A UI command intent. Application code decides how to dispatch and acknowledge it. */
export interface AutonomyWidgetActionEvent {
  type: 'mission-action'
  action: ActionType
  id: string
}

/** Context value exposed by `useAutonomyWidget`. */
export type AutonomyWidgetContextType = {
  state: AutonomyWidgetState
  setState: Dispatch<SetStateAction<AutonomyWidgetState>>
  onAction?: (event: AutonomyWidgetActionEvent) => void
  onOrbitProgressChange?: (progress: number) => void
}

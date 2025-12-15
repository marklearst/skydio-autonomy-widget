// Types for AutonomyWidgetContext
import type { Dispatch, SetStateAction } from 'react'

// Define all possible action types
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

// Primary button configuration
export interface PrimaryButton {
  type: 'stop' | 'play' | 'custom'
  icon?: string // For custom buttons
  label?: string // For custom buttons
  variant?: 'stop-borderless' | 'play-borderless' | 'caret-borderless' | 'default'
  onClick?: () => void // For custom buttons
}

// Configuration for each action's UI
export interface ActionConfig {
  displayName: string // What shows in the UI (active state)
  pausedName?: string // What shows in the UI (paused state)
  actionTooltip: string // Short tooltip text for running state (e.g., "ETA to Dock")
  timerIcon: string // Icon name for timer
  buttons: ActionButton[] // Buttons specific to this action (active state)
  pausedButtons?: ActionButton[] // Buttons specific to this action (paused state)
  primaryButton?: PrimaryButton // Main button configuration (defaults to stop/play)
}

// Enhanced button config for actions
export interface ActionButton {
  id: string
  icon: string
  label: string
  variant: 'primary' | 'secondary' | 'action' | 'danger' | 'default' | 'destructive'
  ariaLabel?: string
  tooltip?: string
  iconRotation?: 'rotate-90' | 'rotate-180' | 'rotate-270' | ''
  onClick?: () => void
  // Special component types
  component?: 'orbit-slider' // For rendering special components like sliders
}

// Updated main state
export interface AutonomyWidgetState {
  action: ActionType // Current action/command
  actionName: string // Display name (derived from action config)
  time: number // Timer duration in seconds
  expanded: boolean // Whether controls are expanded
  isPaused: boolean // Whether the timer is paused
  timerIcon?: string // Current timer icon (derived from action)
  buttons: ActionButton[] // Current buttons (derived from action)
  /** Orbit progress (0-100) - how far through the current orbit */
  orbitProgress?: number
}

export type AutonomyWidgetContextType = {
  state: AutonomyWidgetState
  setState: Dispatch<SetStateAction<AutonomyWidgetState>>
}

import type {
  ActionType,
  ActionConfig,
  ActionButton,
} from './AutonomyWidget.types'

// Waypoint control buttons (for multi-point missions)
const WAYPOINT_BUTTONS = [
  {
    id: 'refresh',
    label: '',
    ariaLabel: 'Refresh waypoint',
    variant: 'action' as const,
    icon: 'ArrowTurnDownLeftIcon',
  },
  {
    id: 'prev',
    label: '',
    ariaLabel: 'Previous waypoint',
    variant: 'action' as const,
    icon: 'ChevronLeftIcon',
  },
  {
    id: 'next',
    label: '',
    ariaLabel: 'Next waypoint',
    variant: 'action' as const,
    icon: 'ChevronRightIcon',
  },
  {
    id: 'settings',
    label: '',
    ariaLabel: 'Waypoint settings',
    variant: 'action' as const,
    icon: 'CameraViewfinderIcon',
  },
]

// Exit Mission button for paused states
const EXIT_MISSION_BUTTON: ActionButton = {
  id: 'exit-mission',
  label: 'Exit Mission',
  variant: 'action' as const,
  icon: 'ArrowLeftIcon',
}

// Orbit progress control
const ORBIT_SLIDER_BUTTON: ActionButton = {
  id: 'orbit-slider',
  label: 'Orbit progress',
  variant: 'action' as const,
  icon: '', // No icon needed for slider
  component: 'orbit-slider',
}

// Simple component library configs based on Figma screenshots
export const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  // Waypoint Mission (multi-point) - HAS expand/collapse controls
  'waypoint-mission': {
    displayName: 'Flying to Point 1',
    pausedName: 'Mission Paused',
    actionTooltip: 'ETA to Point 1',
    timerIcon: 'RouteIcon',
    buttons: [...WAYPOINT_BUTTONS], // 4 buttons when active
    pausedButtons: [EXIT_MISSION_BUTTON], // Only Exit Mission when paused
  },

  // Waypoint Single Point - NO expand/collapse (empty buttons)
  'waypoint-single-point': {
    displayName: 'Flying to Point',
    pausedName: 'Fly to Point Paused',
    actionTooltip: 'ETA to Point',
    timerIcon: 'RouteIcon',
    buttons: [], // Empty = no buttons = no expand/collapse
  },
  // RTD/Land - Simple stop button only
  'returning-to-dock': {
    displayName: 'Returning to Dock',
    pausedName: 'Returning to Dock Paused',
    actionTooltip: 'ETA to Dock',
    timerIcon: 'ArrowTurnDownLeftIcon',
    buttons: [],
  },

  'returning-to-safe-point': {
    displayName: 'Returning to Safe Point',
    actionTooltip: 'ETA to Safe Point',
    timerIcon: 'ArrowTurnDownLeftIcon',
    buttons: [
      {
        id: 'stop',
        label: '',
        ariaLabel: 'Stop returning to safe point',
        variant: 'stop',
        icon: 'StopSignIcon',
      },
    ],
  },

  landing: {
    displayName: 'Landing',
    actionTooltip: 'Landing',
    pausedName: 'Landing Paused',
    timerIcon: 'ArrowDownToLineIcon',
    buttons: [],
  },
  'mission-paused': {
    displayName: 'Mission Paused',
    actionTooltip: 'Mission Paused',
    timerIcon: 'NavigationIcon',
    buttons: [
      {
        id: 'exit',
        label: 'Exit Mission',
        variant: 'action',
        icon: 'XSquareIcon',
      },
    ],
  },
  'fly-to-point-paused': {
    displayName: 'Fly to Point Paused',
    pausedName: 'Fly to Point Paused',
    actionTooltip: 'Fly to Point Paused',
    timerIcon: 'RouteIcon',
    buttons: [], // No additional buttons
  },
  // Future Actions (from Figma Image 2)
  orbiting: {
    displayName: 'Orbiting',
    pausedName: 'Orbit Paused',
    actionTooltip: 'Orbiting',
    timerIcon: 'OrbitIcon',
    buttons: [ORBIT_SLIDER_BUTTON], // Show slider when active
    pausedButtons: [ORBIT_SLIDER_BUTTON], // Show slider when paused too
  },
  'orbit-paused': {
    displayName: 'Orbit Paused',
    actionTooltip: 'Orbit Paused',
    timerIcon: 'OrbitIcon',
    buttons: [ORBIT_SLIDER_BUTTON], // Show slider when paused
  },
  'tracking-subject': {
    displayName: 'Tracking Subject',
    actionTooltip: 'Tracking Subject',
    timerIcon: 'BinocularsIcon',
    buttons: [
      {
        id: 'stop',
        label: 'Stop',
        variant: 'stop',
        icon: 'StopSignIcon',
      },
    ],
  },
  'searching-for-subject': {
    displayName: 'Searching for Subject',
    actionTooltip: 'Searching for Subject',
    timerIcon: 'BinocularsIcon',
    buttons: [
      {
        id: 'stop',
        label: 'Stop',
        variant: 'stop',
        icon: 'StopSignIcon',
      },
    ],
  },
  // Default states
  manual: {
    displayName: 'Manual Control',
    actionTooltip: 'Manual Control',
    timerIcon: 'ManualIcon',
    buttons: [
      {
        id: 'prev',
        label: '',
        ariaLabel: 'Previous waypoint',
        variant: 'action',
        icon: 'ChevronLeftIcon', // Figma left chevron
      },
      {
        id: 'next',
        label: '',
        ariaLabel: 'Next waypoint',
        variant: 'action',
        icon: 'ChevronRightIcon', // Figma right chevron
      },
    ],
  },
  idle: {
    displayName: 'Idle',
    actionTooltip: 'Idle',
    timerIcon: 'ClockIcon',
    buttons: [
      {
        id: 'completed',
        label: 'Mission Idling',
        variant: 'action',
        icon: 'BinocularsIcon', // Figma right chevron
      },
    ],
  },
}

// Helper function to get config for an action
export const getActionConfig = (action: ActionType): ActionConfig => {
  return ACTION_CONFIGS[action] || ACTION_CONFIGS['idle']
}

// Helper to get all available actions
export const getAllActions = (): ActionType[] => {
  return Object.keys(ACTION_CONFIGS) as ActionType[]
}

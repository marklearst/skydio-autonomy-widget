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
    variant: 'secondary' as const,
    icon: 'ArrowTurnDownLeftIcon',
    onClick: () => console.log('Refresh waypoint'),
  },
  {
    id: 'prev',
    label: '',
    variant: 'secondary' as const,
    icon: 'ChevronLeftIcon',
    onClick: () => console.log('Previous waypoint'),
  },
  {
    id: 'next',
    label: '',
    variant: 'secondary' as const,
    icon: 'ChevronRightIcon',
    onClick: () => console.log('Next waypoint'),
  },
  {
    id: 'settings',
    label: '',
    variant: 'secondary' as const,
    icon: 'CameraViewfinderIcon',
    onClick: () => console.log('Waypoint settings'),
  },
]

// Exit Mission button for paused states
const EXIT_MISSION_BUTTON: ActionButton = {
  id: 'exit-mission',
  label: 'Exit Mission',
  variant: 'secondary' as const,
  icon: 'ArrowLeftIcon',
  onClick: () => console.log('Exit mission'),
}

// Orbit distance slider
const ORBIT_SLIDER_BUTTON: ActionButton = {
  id: 'orbit-slider',
  label: 'Distance Control',
  variant: 'secondary' as const,
  icon: '', // No icon needed for slider
  component: 'orbit-slider',
  onClick: () => console.log('Orbit distance changed'),
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
    // Example: Custom button instead of stop/play
    // primaryButton: { type: 'custom', label: 'Mission', icon: 'NavigationIcon', variant: 'default' }
  },

  'returning-to-safe-point': {
    displayName: 'Returning to Safe Point',
    actionTooltip: 'ETA to Safe Point',
    timerIcon: 'ArrowTurnDownLeftIcon',
    buttons: [
      {
        id: 'stop',
        label: '',
        variant: 'danger',
        icon: 'StopSignIcon',
        onClick: () => console.log('Stop returning to safe point'),
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
    primaryButton: {
      type: 'play', // Will show play button to resume
    },
    buttons: [
      {
        id: 'exit',
        label: 'Exit Mission',
        variant: 'secondary',
        icon: 'XSquareIcon',
        onClick: () => console.log('Exit mission'),
      },
    ],
  },
  'fly-to-point-paused': {
    displayName: 'Fly to Point Paused',
    pausedName: 'Fly to Point Paused',
    actionTooltip: 'Fly to Point Paused',
    timerIcon: 'RouteIcon',
    primaryButton: {
      type: 'play', // Will show play button to resume
    },
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
        variant: 'destructive',
        icon: 'StopSignIcon',
        onClick: () => console.log('Stop tracking'),
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
        variant: 'destructive',
        icon: 'StopSignIcon',
        onClick: () => console.log('Stop searching'),
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
        variant: 'secondary',
        icon: 'ChevronLeftIcon', // Figma left chevron
        onClick: () => console.log('Previous waypoint'),
      },
      {
        id: 'next',
        label: '',
        variant: 'secondary',
        icon: 'ChevronRightIcon', // Figma right chevron
        onClick: () => console.log('Next waypoint'),
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
        variant: 'secondary',
        icon: 'BinocularsIcon', // Figma right chevron
        onClick: () => console.log('Mission Idling'),
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

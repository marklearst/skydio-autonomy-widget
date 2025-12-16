import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutonomyWidget } from './AutonomyWidget'
import { AutonomyWidgetContext } from './AutonomyWidget.context'
import type { AutonomyWidgetState } from './AutonomyWidget.types'
import { getAllActions, getActionConfig } from './AutonomyWidget.configs'

// Wrapper component that provides context and syncs with Storybook controls
const AutonomyWidgetWithProvider = (args: AutonomyWidgetState) => {
  const [internalState, setInternalState] = useState<AutonomyWidgetState>(args)

  // Sync internal state with Storybook args and update derived fields
  useEffect(() => {
    const config = getActionConfig(args.action)
    const updatedState = {
      ...args,
      actionName: config.displayName,
      timerIcon: config.timerIcon,
      buttons: config.buttons,
    }
    setInternalState(updatedState)
  }, [args])

  const contextValue = {
    state: internalState,
    setState: setInternalState,
  }

  return (
    <AutonomyWidgetContext.Provider value={contextValue}>
      <AutonomyWidget />
    </AutonomyWidgetContext.Provider>
  )
}

const meta: Meta<AutonomyWidgetState> = {
  title: 'Components/AutonomyWidget',
  render: AutonomyWidgetWithProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A context-driven widget displaying a timer, status, and action controls with pause/resume functionality. Must be wrapped in AutonomyWidgetProvider.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'landmark-one-main', enabled: true }] },
    },
    viewport: {
      defaultViewport: 'responsive',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  argTypes: {
    action: {
      control: 'select',
      options: getAllActions(),
      description: 'Current action/command type (drives UI dynamically)',
    },
    actionName: {
      control: 'text',
      description: 'Display name (auto-derived from action)',
    },
    time: {
      control: { type: 'number', min: 0 },
      description: 'Timer duration in seconds.',
    },
    expanded: {
      control: 'boolean',
      description: 'Whether controls are expanded.',
    },
    isPaused: {
      control: 'boolean',
      description: 'Whether the timer is paused.',
    },
    buttons: {
      control: false,
      description: 'Dynamic buttons (auto-derived from action)',
    },
    timerIcon: {
      control: false,
      description: 'Timer icon (auto-derived from action)',
    },
  },
}

export default meta
type Story = StoryObj<AutonomyWidgetState>

// Action-driven stories showcasing different command types
export const Default: Story = {
  args: {
    action: 'waypoint-mission',
    actionName: 'Flying to Point 1',
    time: 90,
    expanded: false,
    isPaused: false, // Toggle this to see dynamic button behavior!
    buttons: [],
    timerIcon: 'RouteIcon',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing dynamic button behavior. Toggle "isPaused" to see the button switch between red STOP (active) and blue PLAY (paused).',
      },
    },
  },
}

export const FlyingToPoint: Story = {
  args: {
    action: 'returning-to-dock',
    actionName: 'Returning to Dock',
    time: 240,
    expanded: false,
    isPaused: false,
    buttons: [],
    timerIcon: 'NavigationIcon',
  },
}

export const OrbitMode: Story = {
  args: {
    action: 'orbiting',
    actionName: 'Orbiting',
    time: 120,
    expanded: true, // Show expanded to see the slider
    isPaused: false,
    buttons: [],
    timerIcon: 'OrbitIcon',
    // Add progress for testing the orbit progress tracker
    orbitProgress: 80, // 65% through the orbit
  },
  argTypes: {
    orbitProgress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Orbit completion progress (0-100%)',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Orbit mode with distance slider control. The blue circle shows distance setting (controlled by chevrons), while the white handle shows orbit progress. Toggle "isPaused" to see the slider in both active and paused states. Use the "orbitProgress" control to simulate orbit completion.',
      },
    },
  },
}

export const Paused: Story = {
  args: {
    action: 'mission-paused',
    actionName: 'Mission Paused',
    time: 407,
    expanded: false,
    isPaused: true,
    buttons: [],
    timerIcon: 'NavigationIcon',
  },
}

// Add back stories that Storybook is looking for
export const Expanded: Story = {
  args: {
    action: 'waypoint-mission',
    actionName: 'Flying to Point 1',
    time: 407,
    expanded: true,
    isPaused: false,
    buttons: [],
    timerIcon: 'NavigationIcon',
  },
}

export const Tracking: Story = {
  args: {
    action: 'tracking-subject',
    actionName: 'Tracking Subject',
    time: 180,
    expanded: false,
    isPaused: false,
    buttons: [],
    timerIcon: 'UserIcon',
  },
}

// Add back remaining missing stories that Storybook is looking for
export const Landing: Story = {
  args: {
    action: 'landing',
    actionName: 'Landing',
    time: 120,
    expanded: false,
    isPaused: false,
    buttons: [],
    timerIcon: 'ArrowDownToLineIcon',
  },
}

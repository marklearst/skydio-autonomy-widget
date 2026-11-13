import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import { useEffect, useState } from 'react'
import { AutonomyWidget } from './AutonomyWidget'
import { AutonomyWidgetProvider } from './AutonomyWidget.provider'
import type {
  ActionType, AutonomyWidgetState, AutonomyWidgetStateInput, AutonomyWidgetActionEvent,
} from './AutonomyWidget.types'

type WidgetStoryArgs = AutonomyWidgetStateInput & {
  onAction: (event: AutonomyWidgetActionEvent) => void
  onOrbitProgressChange: (progress: number) => void
}

const missionLabels: Partial<Record<ActionType, string>> = {
  'waypoint-mission': 'Waypoint mission',
  'waypoint-single-point': 'Single waypoint',
  'returning-to-dock': 'Return to dock',
  'returning-to-safe-point': 'Return to safe point',
  landing: 'Land',
  orbiting: 'Orbit',
  'tracking-subject': 'Track subject',
  'searching-for-subject': 'Search for subject',
  manual: 'Manual control',
  idle: 'Idle',
}

function WidgetExample({ args, updateArgs }: {
  args: WidgetStoryArgs
  updateArgs: (args: Partial<WidgetStoryArgs>) => void
}) {
  const [state, setState] = useState<AutonomyWidgetStateInput>(args)
  useEffect(() => {
    // Storybook's external args store drives host edits; React keeps play interactions synchronous.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      action: args.action, time: args.time, expanded: args.expanded,
      isPaused: args.isPaused, orbitProgress: args.orbitProgress,
    })
  }, [args.action, args.time, args.expanded, args.isPaused, args.orbitProgress])
  const handleStateChange = (next: AutonomyWidgetState) => {
    setState(next)
    updateArgs({
      action: next.action, time: next.time, expanded: next.expanded,
      isPaused: next.isPaused, orbitProgress: next.orbitProgress,
    })
  }
  return (
    <AutonomyWidgetProvider state={state} onStateChange={handleStateChange}
      onAction={args.onAction} onOrbitProgressChange={args.onOrbitProgressChange}>
      <AutonomyWidget />
    </AutonomyWidgetProvider>
  )
}

const meta: Meta<WidgetStoryArgs> = {
  title: 'Components/AutonomyWidget',
  render: function Render() {
    const [args, updateArgs] = useArgs<WidgetStoryArgs>()
    return <WidgetExample args={args} updateArgs={updateArgs} />
  },
  tags: ['autodocs'],
  args: {
    action: 'waypoint-mission', time: 90, expanded: false, isPaused: false,
    orbitProgress: 50,
    onAction: fn().mockName('missionAction'),
    onOrbitProgressChange: fn().mockName('orbitProgressChange'),
  },
  parameters: {
    controls: { sort: 'none', include: ['Mission', 'Duration (seconds)', 'Paused', 'Expanded', 'Orbit progress (%)'] },
    docs: { description: { component: 'Mission status, countdown, and controls backed by a typed state provider. Manual examples stay still until you interact. Named interaction stories execute the test sequence. Open Actions to inspect command intent and orbit changes.' } },
  },
  argTypes: {
    action: {
      name: 'Mission',
      control: { type: 'select', labels: missionLabels },
      options: Object.keys(missionLabels),
      description: 'Choose a mission; its status, icon, and available actions update together.',
      table: { category: 'Mission', type: { summary: 'ActionType' }, defaultValue: { summary: 'waypoint-mission' } },
    },
    time: {
      name: 'Duration (seconds)', control: { type: 'number', min: 0, max: 3599, step: 1 },
      description: 'Countdown duration, not remaining time. Changing this value starts a new countdown; pausing preserves it.',
      table: { category: 'Mission', type: { summary: 'number' }, defaultValue: { summary: '90 (demo)' } },
    },
    isPaused: {
      name: 'Paused', control: 'boolean', description: 'Pause the timer and expose the mission’s paused control set. The primary button also updates this value.',
      table: { category: 'Mission', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    expanded: {
      name: 'Expanded', control: 'boolean', description: 'Show the secondary control row when this mission has additional actions. Compact mode removes it from rendering and keyboard navigation.',
      table: { category: 'Presentation', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    orbitProgress: {
      name: 'Orbit progress (%)', if: { arg: 'action', eq: 'orbiting' },
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Shared orbit percentage. Caret changes update this control and emit orbitProgressChange in Actions.',
      table: { category: 'Orbit', type: { summary: 'number' }, defaultValue: { summary: '50' } },
    },
    actionName: { table: { disable: true } }, buttons: { table: { disable: true } },
    timerIcon: { table: { disable: true } }, onAction: { table: { disable: true } },
    onOrbitProgressChange: { table: { disable: true } },
  },
}
export default meta
type Story = StoryObj<WidgetStoryArgs>

export const Default: Story = {
  parameters: { docs: { description: { story: 'The manual waypoint example. Pause, resume, and expand it yourself; no play function moves focus when you open it.' } } },
}
export const Expanded: Story = {
  args: { expanded: true, time: 407 },
  parameters: { docs: { description: { story: 'Four waypoint actions with explicit accessible names. Use Actions to inspect the emitted command intent.' } } },
}
export const FlyingToPoint: Story = { name: 'Returning to Dock', args: { action: 'returning-to-dock', time: 240 } }
export const Paused: Story = { args: { action: 'waypoint-mission', time: 407, isPaused: true } }
export const Tracking: Story = { args: { action: 'tracking-subject', time: 180 } }
export const Landing: Story = { args: { action: 'landing', time: 120 } }
export const OrbitMode: Story = {
  args: { action: 'orbiting', time: 120, expanded: true, orbitProgress: 80 },
  parameters: { docs: { description: { story: 'A fixed blue center reference and an outlined progress indicator. Each caret moves shared progress by 5%. This manual story never auto-clicks.' } } },
}
export const Compact: Story = {
  args: { expanded: false },
  globals: { viewport: { value: 'compact', isRotated: false } },
  parameters: {
    viewport: { options: { compact: { name: 'Compact · 390px', styles: { width: '390px', height: '844px' } } } },
    chromatic: { viewports: [390] },
    docs: { description: { story: 'A repeatable narrow-viewport stage. Timer and pause/resume remain available. Secondary controls unmount below 600px.' } },
  },
}

export const MissionInteraction: Story = {
  ...Default,
  parameters: { controls: { disable: true }, docs: { description: { story: 'Automated pause/resume sequence. Use the manual Default story when presenting the resting widget.' } } },
  play: async ({ canvas, userEvent, step }) => {
    await step('Pause the mission', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: /^Pause$/ }))
      await expect(await canvas.findByRole('button', { name: /^Resume$/ })).toBeVisible()
    })
    await step('Resume the mission', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^Resume$/ }))
      await expect(await canvas.findByRole('button', { name: /^Pause$/ })).toBeVisible()
    })
  },
}
export const ExpandedInteraction: Story = {
  ...Expanded,
  parameters: { controls: { disable: true }, docs: { description: { story: 'Automated expansion, pause, command dispatch, and resume assertions. The manual Expanded story has no autoplay.' } } },
  play: async ({ args, canvas, userEvent, step }) => {
    for (const name of ['Refresh waypoint', 'Previous waypoint', 'Next waypoint', 'Waypoint settings']) {
      await expect(await canvas.findByRole('button', { name })).toBeVisible()
    }
    await step('Dispatch a real action event', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Refresh waypoint' }))
      await expect(args.onAction).toHaveBeenCalledWith({ type: 'mission-action', action: 'waypoint-mission', id: 'refresh' })
    })
    await step('Collapse and restore controls', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^Collapse$/ }))
      await expect(canvas.queryByRole('button', { name: 'Refresh waypoint' })).not.toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: /^Expand$/ }))
      await expect(await canvas.findByRole('button', { name: 'Refresh waypoint' })).toBeVisible()
    })
    await step('Pause and resume the mission', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^Pause$/ }))
      await expect(await canvas.findByRole('button', { name: 'Exit Mission' })).toBeVisible()
      await userEvent.click(canvas.getByRole('button', { name: /^Resume$/ }))
      await expect(await canvas.findByRole('button', { name: 'Refresh waypoint' })).toBeVisible()
    })
  },
}
export const OrbitInteraction: Story = {
  ...OrbitMode,
  parameters: { controls: { include: ['Orbit progress (%)'] }, docs: { description: { story: 'Reach 100%, then click left four times to return to 80%. Assertions cover the disabled limit and the real orbit change callback.' } } },
  play: async ({ args, canvas, userEvent, step }) => {
    const increase = await canvas.findByRole('button', { name: 'Increase orbit progress' })
    const decrease = canvas.getByRole('button', { name: 'Decrease orbit progress' })
    await step('Reach the upper orbit limit', async () => {
      for (let i = 0; i < 20 && !increase.hasAttribute('disabled'); i++) await userEvent.click(increase)
      await expect(increase).toBeDisabled()
      await expect(decrease).toBeEnabled()
    })
    await step('Return to 80% with four left-caret clicks', async () => {
      for (let i = 0; i < 4; i++) await userEvent.click(decrease)
      await expect(increase).toBeEnabled()
      await expect(args.onOrbitProgressChange).toHaveBeenLastCalledWith(80)
      await waitFor(async () => { await expect(canvas.getByRole('meter')).toHaveAttribute('aria-valuenow', '80') })
    })
  },
}

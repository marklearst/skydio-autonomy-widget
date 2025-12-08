import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionWidget } from './ActionWidget'

const meta: Meta<typeof ActionWidget> = {
  title: 'Components/ActionWidget',
  component: ActionWidget,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A widget displaying a timer, status, and action controls with pause/resume functionality.',
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
    actionName: { control: 'text', description: 'Name of the current action.' },
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
    onPauseChange: {
      action: 'pause-changed',
      description: 'Callback for pause state changes.',
    },
    onActionNameChange: {
      action: 'action-name-changed',
      description: 'Callback for action name changes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof ActionWidget>

export const Running: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407,
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Paused: Story = {
  args: {
    actionName: 'Mission Paused',
    time: 407,
    expanded: false,
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Expanded: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407,
    expanded: true,
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Compact: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 60,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' }, // <1280px
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const ZeroDuration: Story = {
  args: {
    actionName: 'Idle',
    time: 0,
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

export const Breakpoint: Story = {
  args: {
    actionName: 'Testing Breakpoint',
    time: 300,
  },
  parameters: {
    viewport: {
      viewports: {
        small: { name: 'Small', styles: { width: '600px', height: '800px' } },
        medium: {
          name: 'Medium',
          styles: { width: '1280px', height: '800px' },
        },
        large: { name: 'Large', styles: { width: '1920px', height: '1080px' } },
      },
      defaultViewport: 'small', // Start with <1280px to test 88px
    },
    backgrounds: { default: 'dark' },
  },
  render: (args, { updateArgs }) => (
    <ActionWidget
      {...args}
      onPauseChange={(paused) => updateArgs({ isPaused: paused })}
      onActionNameChange={(name) => updateArgs({ actionName: name })}
    />
  ),
}

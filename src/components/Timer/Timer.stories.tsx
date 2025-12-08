import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timer } from './Timer'

const meta: Meta<typeof Timer> = {
  title: 'Components/Timer',
  component: Timer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A circular timer displaying remaining time with progress animation.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'aria-live-regions', enabled: true }] },
    },
  },
  argTypes: {
    duration: {
      control: { type: 'number', min: 0 },
      description: 'Timer duration in seconds.',
    },
    progress: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Progress override (0 to 1).',
    },
    condensed: { control: 'boolean', description: 'Hide time display.' },
    state: {
      control: 'select',
      options: ['running', 'paused'],
      description: 'Timer state.',
    },
    onComplete: {
      action: 'completed',
      description: 'Callback when timer completes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Timer>

export const Default: Story = {
  args: {
    duration: 60,
    state: 'running',
  },
}

export const Running: Story = {
  args: {
    duration: 600,
    state: 'running',
  },
}

export const Paused: Story = {
  args: {
    duration: 64,
    state: 'paused',
  },
}

export const Condensed: Story = {
  args: {
    duration: 60,
    condensed: true,
  },
}

export const LongDuration: Story = {
  args: {
    duration: 7200,
    state: 'running',
  },
}

export const NegativeDuration: Story = {
  args: {
    duration: -10,
    state: 'running',
  },
}

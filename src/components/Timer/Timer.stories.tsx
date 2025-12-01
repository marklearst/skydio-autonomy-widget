import type { Meta, StoryObj } from '@storybook/react-vite'
import Timer from './Timer'

const meta: Meta<typeof Timer> = {
  title: 'Components/Timer',
  component: Timer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Timer>

export const Basic: Story = {
  args: {
    duration: 0,
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

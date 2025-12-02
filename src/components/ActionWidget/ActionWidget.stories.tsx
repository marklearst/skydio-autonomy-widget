import type { Meta, StoryObj } from '@storybook/react-vite'
import ActionWidget from './ActionWidget'

const meta: Meta<typeof ActionWidget> = {
  title: 'Components/ActionWidget',
  component: ActionWidget,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActionWidget>

export const Running: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407, // 6:47 in seconds
    isPaused: false,
    expanded: false,
  },
}

export const Paused: Story = {
  args: {
    actionName: 'Mission Paused',
    time: 407, // 6:47 in seconds
    isPaused: true,
    expanded: false,
  },
}

export const Expanded: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407, // 6:47 in seconds
    isPaused: false,
    expanded: true,
  },
}

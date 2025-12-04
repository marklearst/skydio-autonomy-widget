import type { Meta, StoryObj } from '@storybook/react-vite'
import ActionWidget from './ActionWidget'

const meta: Meta<typeof ActionWidget> = {
  title: 'Components/ActionWidget',
  component: ActionWidget,
  // tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActionWidget>

export const Running: Story = {
  args: {
    actionName: 'Flying to Point 1',
    time: 407, // 6:47 in seconds,
    isPaused: false,
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
    time: 407, // 6:47 in seconds,
    isPaused: true,
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
    time: 407, // 6:47 in seconds
  },
}

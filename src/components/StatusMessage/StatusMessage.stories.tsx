import type { Meta, StoryObj } from '@storybook/react-vite'
import StatusMessage from './StatusMessage'

const meta: Meta<typeof StatusMessage> = {
  title: 'Components/StatusMessage',
  component: StatusMessage,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusMessage>

export const Default: Story = {
  args: {
    message: 'Flying to Point 1',
  },
}

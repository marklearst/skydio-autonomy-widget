import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusMessage } from 'components'

const meta: Meta<typeof StatusMessage> = {
  title: 'Components/StatusMessage',
  component: StatusMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a truncated status message for UI feedback.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'aria-live-regions', enabled: true }] },
    },
  },
  argTypes: {
    message: { control: 'text', description: 'The status message to display.' },
    className: { control: 'text', description: 'Additional Tailwind classes.' },
  },
}

export default meta
type Story = StoryObj<typeof StatusMessage>

export const Default: Story = {
  args: {
    message: 'Flying to Point 1',
  },
}

export const LongMessage: Story = {
  args: {
    message: 'Navigating to Destination Point Alpha with Extended Description',
  },
}

export const Empty: Story = {
  args: {
    message: '',
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusMessage } from 'components'

const meta: Meta<typeof StatusMessage> = {
  title: 'Components/StatusMessage',
  component: StatusMessage,
  tags: ['autodocs'],
  args: { message: 'Flying to Point 1', className: '' },
  parameters: {
    controls: { include: ['message'] },
    docs: {
      description: {
        component: 'A single-line mission status announced politely by screen readers. Text is clipped when the available width is exceeded.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'aria-live-regions', enabled: true }] },
    },
  },
  argTypes: {
    message: {
      control: 'text', description: 'Mission status text. An empty value produces an empty status region.',
      table: { category: 'Content', type: { summary: 'string' }, defaultValue: { summary: 'Required' } },
    },
    className: { table: { disable: true } },
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
    message: 'Navigating to Destination Point',
  },
}

export const Empty: Story = {
  args: {
    message: '',
  },
}

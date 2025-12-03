import type { Meta, StoryObj } from '@storybook/react-vite'
import ActionControls from './ActionControls'

const meta: Meta<typeof ActionControls> = {
  title: 'Components/ActionControls',
  component: ActionControls,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActionControls>

export const Default: Story = {
  args: {},
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controls } from 'components'

const meta: Meta<typeof Controls> = {
  title: 'Components/Controls',
  component: Controls,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A control bar with customizable action buttons for interactive UI elements.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'button-name', enabled: true }] },
    },
  },
  argTypes: {
    buttons: {
      control: 'object',
      description:
        'Array of button configurations with icon, ariaLabel, and other properties.',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind classes for styling the container.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Controls>

export const Default: Story = {
  args: {
    buttons: [
      {
        icon: 'ArrowTurnDownLeftIcon',
        ariaLabel: 'Go Left',
        variant: 'action',
      },
      {
        icon: 'ChevronLeftIcon',
        ariaLabel: 'Left',
        variant: 'action',
      },
      {
        icon: 'ChevronRightIcon',
        ariaLabel: 'Right',
        variant: 'action',
      },
      {
        icon: 'CameraViewfinderIcon',
        ariaLabel: 'Camera',
        variant: 'action',
      },
    ],
  },
}

export const Disabled: Story = {
  args: {
    buttons: [
      {
        icon: 'ChevronLeftIcon',
        ariaLabel: 'Left',
        variant: 'action',
        disabled: true,
      },
      {
        icon: 'ChevronRightIcon',
        ariaLabel: 'Right',
        variant: 'action',
        disabled: true,
      },
    ],
  },
}

export const SingleButton: Story = {
  args: {
    buttons: [
      {
        label: 'Message',
        ariaLabel: 'Close',
        variant: 'action',
      },
    ],
  },
}

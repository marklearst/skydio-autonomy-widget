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
        icon: 'ArrowLeftIcon',
        ariaLabel: 'Go Left',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
      },
      {
        icon: 'CaretIcon',
        ariaLabel: 'Left',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
        iconRotation: 'rotate-90',
      },
      {
        icon: 'CaretIcon',
        ariaLabel: 'Right',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
        iconRotation: 'rotate-270',
      },
      {
        icon: 'CameraIcon',
        ariaLabel: 'Camera',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
      },
    ],
  },
}

export const Disabled: Story = {
  args: {
    buttons: [
      {
        icon: 'ArrowLeftIcon',
        ariaLabel: 'Go Left',
        variant: 'action',
        disabled: true,
        buttonStyle: 'border border-[#4D4D4D]',
      },
      {
        icon: 'CameraIcon',
        ariaLabel: 'Camera',
        variant: 'action',
        disabled: true,
        buttonStyle: 'border border-[#4D4D4D]',
      },
    ],
  },
}

export const SingleButton: Story = {
  args: {
    buttons: [
      {
        icon: 'XIcon',
        ariaLabel: 'Close',
        variant: 'action',
        buttonStyle: 'border border-[#4D4D4D]',
      },
    ],
  },
}

export const CustomStyles: Story = {
  args: {
    className: 'bg-gray-800 p-4 rounded-md',
    buttons: [
      {
        icon: 'RouteIcon',
        ariaLabel: 'Route',
        variant: 'action',
        size: 'auto',
      },
    ],
  },
}

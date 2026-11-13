import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controls } from 'components'

const meta: Meta<typeof Controls> = {
  title: 'Components/Controls',
  component: Controls,
  tags: ['autodocs'],
  args: { className: '' },
  parameters: {
    controls: { include: ['buttons'] },
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
        'Ordered control definitions. Each button needs an accessible name; icon, label, variant, and disabled state can be set per button.',
      table: { category: 'Controls', type: { summary: 'Button configuration[]' }, defaultValue: { summary: 'Four directional and camera controls' } },
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
        ariaLabel: 'Refresh waypoint',
        variant: 'action',
      },
      {
        icon: 'ChevronLeftIcon',
        ariaLabel: 'Previous waypoint',
        variant: 'action',
      },
      {
        icon: 'ChevronRightIcon',
        ariaLabel: 'Next waypoint',
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
        ariaLabel: 'Previous waypoint',
        variant: 'action',
        disabled: true,
      },
      {
        icon: 'ChevronRightIcon',
        ariaLabel: 'Next waypoint',
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
        label: 'Exit Mission',
        ariaLabel: 'Exit Mission',
        variant: 'action',
      },
    ],
  },
}

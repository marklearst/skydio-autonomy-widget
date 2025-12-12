import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from 'components'
import type { IconName } from 'icons'

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A customizable button with an icon, supporting tooltips and various styles.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'button-name', enabled: true }] },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [
        'PlayIcon',
        'StopSignIcon',
        'CameraViewfinderIcon',
        'CaretIcon',
        'ArrowLeftIcon',
        'RouteIcon',
      ],
      description: 'Icon name.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the button.',
    },
    variant: {
      control: 'select',
      options: ['default', 'play', 'stop', 'action', 'caret'],
      description: 'Button style variant.',
    },
    size: {
      control: 'radio',
      options: [32, 50],
      description: 'Button size in pixels.',
    },
    tooltip: { control: 'text', description: 'Tooltip text on hover.' },
    flex: { control: 'boolean', description: 'Enable flex-1 styling.' },
    disabled: { control: 'boolean', description: 'Disable the button.' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const IconOnly: Story = {
  args: {
    icon: 'XSquareIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'action',
    size: 32,
  },
}

export const TextOnly: Story = {
  args: {
    label: 'Exit Mission',
    ariaLabel: 'Exit Mission',
    variant: 'action',
    size: 'auto',
  },
}

export const IconAndText: Story = {
  args: {
    icon: 'XSquareIcon' as IconName,
    label: 'Button',
    ariaLabel: 'Button',
    variant: 'action',
    size: 'auto',
  },
}

export const Play: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play-borderless',
    size: 32,
  },
}

export const Stop: Story = {
  args: {
    icon: 'StopSignIcon' as IconName,
    ariaLabel: 'Stop',
    variant: 'stop-borderless',
    size: 32,
  },
}

export const Camera: Story = {
  args: {
    icon: 'CameraViewfinderIcon' as IconName,
    ariaLabel: 'Camera',
    variant: 'action',
    size: 32,
  },
}

export const Expand: Story = {
  args: {
    icon: 'ChevronDownIcon' as IconName,
    ariaLabel: 'Expand',
    variant: 'caret-borderless',
    size: 32,
  },
}

export const Collapse: Story = {
  args: {
    icon: 'ChevronUpIcon' as IconName,
    ariaLabel: 'Collapse',
    variant: 'caret-borderless',
    size: 32,
  },
}

export const Route: Story = {
  args: {
    icon: 'RouteIcon' as IconName,
    ariaLabel: 'Route',
    variant: 'default',
    size: 'auto',
    flex: true,
  },
}

export const WithTooltip: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play-borderless',
    size: 32,
    tooltip: 'Start the action',
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'
import type { IconName } from '../../assets/icons'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
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
        'StopIcon',
        'CameraIcon',
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
    iconRotation: {
      control: 'select',
      options: ['', 'rotate-90', 'rotate-180', 'rotate-270'],
      description: 'Icon rotation.',
    },
    disabled: { control: 'boolean', description: 'Disable the button.' },
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Play: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play',
    size: 32,
  },
}

export const Stop: Story = {
  args: {
    icon: 'StopIcon' as IconName,
    ariaLabel: 'Stop',
    variant: 'stop',
    size: 32,
  },
}

export const Camera: Story = {
  args: {
    icon: 'CameraIcon' as IconName,
    ariaLabel: 'Camera',
    variant: 'action',
    size: 32,
  },
}

export const Expand: Story = {
  args: {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Expand',
    variant: 'caret',
    size: 32,
  },
}

export const Collapse: Story = {
  args: {
    icon: 'CaretIcon' as IconName,
    ariaLabel: 'Collapse',
    variant: 'caret',
    size: 32,
    iconRotation: 'rotate-180',
  },
}

export const Route: Story = {
  args: {
    icon: 'RouteIcon' as IconName,
    ariaLabel: 'Route',
    variant: 'default',
    size: 50,
    flex: true,
  },
}

export const WithTooltip: Story = {
  args: {
    icon: 'PlayIcon' as IconName,
    ariaLabel: 'Play',
    variant: 'play',
    size: 32,
    tooltip: 'Start the action',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap gap-4">
      <IconButton
        icon="PlayIcon"
        ariaLabel="Play"
        variant="play"
        size={32}
      />
      <IconButton
        icon="StopIcon"
        ariaLabel="Stop"
        variant="stop"
        size={32}
      />
      <IconButton
        icon="CameraIcon"
        ariaLabel="Camera"
        variant="action"
        size={32}
      />
      <IconButton
        icon="CaretIcon"
        ariaLabel="Expand"
        variant="caret"
        size={32}
      />
      <IconButton
        icon="CaretIcon"
        ariaLabel="Collapse"
        variant="caret"
        size={32}
        iconRotation="rotate-180"
      />
      <IconButton
        icon="RouteIcon"
        ariaLabel="Route"
        variant="action"
        size={50}
        flex
      />
    </div>
  ),
}

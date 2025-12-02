import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Play: Story = {
  args: {
    icon: 'PlayIcon',
    ariaLabel: 'Play',
    variant: 'play',
    size: 32,
  },
}

export const Stop: Story = {
  args: {
    icon: 'StopIcon',
    ariaLabel: 'Stop',
    variant: 'stop',
    size: 32,
  },
}

export const Camera: Story = {
  args: {
    icon: 'CameraIcon',
    ariaLabel: 'Camera',
    variant: 'action',
    size: 32,
  },
}

export const Expand: Story = {
  args: {
    icon: 'CaretIcon',
    ariaLabel: 'Expand',
    variant: 'default',
    size: 32,
  },
}

export const Collapse: Story = {
  args: {
    icon: 'ArrowLeftIcon',
    ariaLabel: 'Collapse',
    variant: 'action',
    size: 32,
  },
}

export const Route: Story = {
  args: {
    icon: 'RouteIcon',
    ariaLabel: 'Route',
    variant: 'default',
    size: 50,
    flex: true,
  },
}

export const AllVariants = () => (
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
      variant="default"
      size={32}
    />
    <IconButton
      icon="ArrowLeftIcon"
      ariaLabel="Collapse"
      variant="action"
      size={32}
    />
    <IconButton
      icon="RouteIcon"
      ariaLabel="Route"
      variant="action"
      size={50}
      flex
    />
    <IconButton
      icon="XIcon"
      ariaLabel="Close"
      variant="action"
      size={32}
    />
  </div>
)

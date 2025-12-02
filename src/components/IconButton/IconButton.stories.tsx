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
    icon: 'Play',
    ariaLabel: 'Play',
    variant: 'default',
    size: 32,
  },
}

export const Stop: Story = {
  args: {
    icon: 'StopSign',
    ariaLabel: 'Stop',
    variant: 'danger',
    size: 32,
  },
}

export const Camera: Story = {
  args: {
    icon: 'CameraViewfinder',
    ariaLabel: 'Camera',
    variant: 'primary',
    size: 32,
  },
}

export const Expand: Story = {
  args: {
    icon: 'Caret',
    ariaLabel: 'Expand',
    variant: 'default',
    size: 32,
  },
}

export const Collapse: Story = {
  args: {
    icon: 'ArrowTurnDownLeft',
    ariaLabel: 'Collapse',
    variant: 'default',
    size: 32,
  },
}

export const Route: Story = {
  args: {
    icon: 'Route',
    ariaLabel: 'Route',
    variant: 'primary',
    size: 50,
    flex: true,
  },
}

export const AllVariants = () => (
  <div className="flex flex-wrap gap-4">
    <IconButton
      icon="Play"
      ariaLabel="Play"
      variant="default"
      size={32}
    />
    <IconButton
      icon="StopSign"
      ariaLabel="Stop"
      variant="danger"
      size={32}
    />
    <IconButton
      icon="CameraViewfinder"
      ariaLabel="Camera"
      variant="primary"
      size={32}
    />
    <IconButton
      icon="Caret"
      ariaLabel="Expand"
      variant="default"
      size={32}
    />
    <IconButton
      icon="ArrowTurnDownLeft"
      ariaLabel="Collapse"
      variant="default"
      size={32}
    />
    <IconButton
      icon="Route"
      ariaLabel="Route"
      variant="primary"
      size={50}
      flex
    />
    <IconButton
      icon="XmarkLarge"
      ariaLabel="Close"
      variant="danger"
      size={32}
    />
  </div>
)

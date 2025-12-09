import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A floating tooltip displayed on hover of a target element.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'aria-tooltip', enabled: true }] },
    },
  },
  argTypes: {
    targetRect: {
      control: 'object',
      description: 'DOMRect of the target element.',
    },
    visible: {
      control: 'boolean',
      description: 'Whether the tooltip is visible.',
    },
    children: { control: 'text', description: 'Tooltip content.' },
    className: { control: 'text', description: 'Additional Tailwind classes.' },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
  render: () => (
    <Button
      icon="PlayIcon"
      ariaLabel="Play"
      variant="play"
      size={32}
      tooltip="Start the action"
    />
  ),
}

export const LongText: Story = {
  render: () => (
    <Button
      icon="CameraIcon"
      ariaLabel="Camera"
      variant="action"
      size={32}
      tooltip="Capture a high-resolution image with advanced settings"
    />
  ),
}

export const CustomPosition: Story = {
  render: () => {
    const [hovered, setHovered] = useState(false)
    const [rect, setRect] = useState<DOMRect | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleMouseEnter = () => {
      if (buttonRef.current) {
        const r = buttonRef.current.getBoundingClientRect()
        setRect({ ...r, left: r.left + 20 })
      }
      setHovered(true)
    }
    const handleMouseLeave = () => setHovered(false)

    return (
      <div>
        <button
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ padding: '8px 16px', fontSize: 16 }}>
          Hover me
        </button>
        <Tooltip
          targetRect={rect}
          visible={hovered}
          className="bg-blue-600">
          Custom Position
        </Tooltip>
      </div>
    )
  },
}

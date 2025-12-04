import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Tooltip from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
  render: () => {
    const [hovered, setHovered] = useState(false)
    const [rect, setRect] = useState<DOMRect | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleMouseEnter = () => {
      if (buttonRef.current) {
        setRect(buttonRef.current.getBoundingClientRect())
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
          visible={hovered}>
          Tooltip Text
        </Tooltip>
      </div>
    )
  },
}

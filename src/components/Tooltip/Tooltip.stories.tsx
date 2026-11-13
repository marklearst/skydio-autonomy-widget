import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { Tooltip } from 'components'
import { Button } from 'components'
import { useTooltipInteraction } from './useTooltipInteraction'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { children: 'Start the action' },
  parameters: {
    controls: { include: ['Content'] },
    docs: {
      description: {
        component: 'Floating help shown on hover or focus. Move onto the help to keep it open, or press Escape to dismiss it.',
      },
    },
    a11y: {
      config: { rules: [{ id: 'aria-tooltip', enabled: true }] },
    },
  },
  argTypes: {
    children: {
      name: 'Content', control: 'text',
      description: 'Help text displayed in the tooltip. Hover or focus the trigger to preview it.',
      table: { category: 'Content', type: { summary: 'ReactNode' }, defaultValue: { summary: 'Required' } },
    },
    targetRect: { table: { disable: true } },
    visible: { table: { disable: true } },
    className: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
  render: (args) => (
    <Button
      icon="PlayIcon"
      ariaLabel="Play"
      variant="play"
      size={32}
      tooltip={String(args.children)}
    />
  ),
}

export const LongText: Story = {
  args: { children: 'Capture a high-resolution image with advanced settings' },
  render: (args) => (
    <Button
      icon="CameraViewfinderIcon"
      ariaLabel="Camera"
      variant="action"
      size={32}
      tooltip={String(args.children)}
    />
  ),
}

export const CustomPosition: Story = {
  args: { children: 'Custom Position' },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Hover me' })
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.hover(button)
    const tooltip = await body.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent(String(args.children))
    const target = button.getBoundingClientRect()
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const viewportWidth = canvasElement.ownerDocument.defaultView?.innerWidth ?? window.innerWidth
    const left = Math.max(tooltipWidth / 2 + 8, Math.min(target.left + 20 + target.width / 2, viewportWidth - tooltipWidth / 2 - 8))
    await expect(tooltip).toHaveStyle({ top: `${target.bottom + 14}px` })
    await expect(Number.parseFloat(tooltip.style.left)).toBeCloseTo(left, 0)
    await userEvent.unhover(button)
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument())
  },
  render: (args) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const help = useTooltipInteraction({ triggerRef: buttonRef })
    const bounds = help.targetRect
    const rect = bounds ? new DOMRect(bounds.x + 20, bounds.y, bounds.width, bounds.height) : null

    return (
      <div>
        <Button
          {...help.triggerProps}
          ref={buttonRef}
          ariaLabel="Hover me"
          aria-describedby={help.isOpen ? help.tooltipId : undefined}
          label="Hover me"
          size="auto"
          variant="action"
        />
        <Tooltip
          {...help.tooltipProps}
          id={help.tooltipId}
          targetRect={rect}
          visible={help.isOpen}
          onDismiss={help.dismiss}>
          {args.children}
        </Tooltip>
      </div>
    )
  },
}
